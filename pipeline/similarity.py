from __future__ import annotations

from collections import Counter
from difflib import SequenceMatcher
import math
import re
import unicodedata

from PIL import Image, ImageChops

ALGORITHM_VERSION = "text-visual-v1"
THRESHOLDS = {
    "min_body_tokens": 8,
    "near_text_jaccard": 0.88,
    "near_visual_difference": 0.075,
    "progressive_containment": 0.80,
    "progressive_visual_difference": 0.14,
}


def normalize(text: str) -> str:
    # Preserve mathematical signs: casefold/whitespace normalization is for similarity only.
    return " ".join(unicodedata.normalize("NFKC", text).casefold().split())


def tokens(text: str) -> Counter:
    return Counter(re.findall(r"\w+|[^\w\s]", normalize(text)))


def signature(image: Image.Image) -> dict:
    # Remove common title/footer areas only from the approximate signature.
    # The exact hash is computed separately on the entire original raster.
    width, height = image.size
    body = image.convert("L").crop((0, int(height * .14), width, int(height * .91)))
    small = body.resize((64, 36), Image.Resampling.LANCZOS)
    dhash_image = body.resize((9, 8), Image.Resampling.LANCZOS)
    values = list(dhash_image.tobytes())
    bits = [values[y * 9 + x] > values[y * 9 + x + 1] for y in range(8) for x in range(8)]
    dhash = sum(int(bit) << index for index, bit in enumerate(bits))
    return {"gray_grid": list(small.tobytes()), "dhash": f"{dhash:016x}"}


def pair_metrics(left: dict, right: dict) -> dict:
    a, b = tokens(left["body_text"]), tokens(right["body_text"])
    intersection = sum((a & b).values())
    union = sum((a | b).values())
    gray_a = left["signature"]["gray_grid"]
    gray_b = right["signature"]["gray_grid"]
    mean_difference = sum(abs(x - y) for x, y in zip(gray_a, gray_b)) / (255 * len(gray_a))
    # An ink mask prevents large white backgrounds from being the only visual evidence.
    ink_union = sum(x < 230 or y < 230 for x, y in zip(gray_a, gray_b))
    ink_intersection = sum(x < 230 and y < 230 for x, y in zip(gray_a, gray_b))
    return {
        "text_jaccard": round(intersection / max(union, 1), 6),
        "text_containment": round(intersection / max(min(sum(a.values()), sum(b.values())), 1), 6),
        "left_tokens": sum(a.values()), "right_tokens": sum(b.values()),
        "visual_difference": round(mean_difference, 6),
        "ink_overlap": round(ink_intersection / max(ink_union, 1), 6),
        "dhash_distance": (int(left["signature"]["dhash"], 16) ^ int(right["signature"]["dhash"], 16)).bit_count(),
    }


def classify_pair(left: dict, right: dict, adjacent: bool) -> dict | None:
    if not math.isclose(left["aspect"], right["aspect"], rel_tol=.01):
        return None
    metrics = pair_metrics(left, right)
    same_label = bool(left["label"] is not None and left["label"] == right["label"])
    same_title = bool(left["title"] and right["title"] and normalize(left["title"]) == normalize(right["title"]))
    if left["pixel_sha256"] == right["pixel_sha256"] and left["text_sha256"] == right["text_sha256"]:
        return {"kind": "exact_duplicate", "confidence": 1.0, "review_status": "verified_exact",
                "reason": "Identici pixel RGB completi e testo estratto; entrambe le pagine sono conservate.", "metrics": metrics}
    enough_text = min(metrics["left_tokens"], metrics["right_tokens"]) >= THRESHOLDS["min_body_tokens"]
    if not (same_title or same_label):
        return None
    if adjacent and same_label and metrics["visual_difference"] <= THRESHOLDS["progressive_visual_difference"]:
        return {"kind": "progressive_candidate", "confidence": .9, "review_status": "candidate",
                "reason": "Etichetta PDF ripetuta su pagine adiacenti con raster differenti: possibile overlay, da verificare anche a testo identico.", "metrics": metrics}
    if (enough_text and metrics["text_jaccard"] >= THRESHOLDS["near_text_jaccard"]
            and metrics["visual_difference"] <= THRESHOLDS["near_visual_difference"]
            and metrics["ink_overlap"] >= .5):
        return {"kind": "near_duplicate", "confidence": .85, "review_status": "candidate",
                "reason": "Stesso titolo/label, testo e struttura visiva molto simili; verificare formule, colori e grafici.", "metrics": metrics}
    if (adjacent and metrics["visual_difference"] <= THRESHOLDS["progressive_visual_difference"]
            and ((enough_text and metrics["text_containment"] >= THRESHOLDS["progressive_containment"])
                 or same_label)):
        return {"kind": "progressive_candidate", "confidence": .8 if same_label else .7,
                "review_status": "candidate",
                "reason": "Pagine adiacenti con titolo/label condiviso e contenuto compatibile con un overlay; direzione da confermare visivamente.", "metrics": metrics}
    return None


def text_delta(before: str, after: str) -> dict:
    # Preserve order, repetitions, signs and case in the evidence sent to the analyst.
    left, right = before.splitlines(), after.splitlines()
    added, removed = [], []
    for op, i, j, k, l in SequenceMatcher(a=left, b=right, autojunk=False).get_opcodes():
        if op in {"replace", "insert"}:
            added.extend(right[k:l])
        if op in {"replace", "delete"}:
            removed.extend(left[i:j])
    return {"added_lines": added, "removed_lines": removed, "semantic_interpretation": "pending_visual_analysis"}


def visual_delta(before: Image.Image, after: Image.Image) -> dict:
    if before.size != after.size:
        return {"changed_bbox_px": None, "note": "Dimensioni diverse: nessun confronto pixel diretto."}
    difference = ImageChops.difference(before.convert("RGB"), after.convert("RGB"))
    channels = difference.split()
    maximum = ImageChops.lighter(ImageChops.lighter(channels[0], channels[1]), channels[2])
    mask = maximum.point(lambda value: 255 if value > 16 else 0)
    return {"changed_bbox_px": mask.getbbox(), "pixel_threshold": 16,
            "changed_pixel_fraction": round(mask.histogram()[255] / (mask.width * mask.height), 6)}

