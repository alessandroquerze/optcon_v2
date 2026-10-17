from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
import os
from pathlib import Path
import re
import uuid

import pymupdf
from PIL import Image, __version__ as pillow_version

from . import PIPELINE_VERSION, SCHEMA_VERSION
from .common import read_json, sha256_bytes, sha256_file, validate_schema, write_json
from .similarity import ALGORITHM_VERSION, THRESHOLDS, classify_pair, normalize, signature, text_delta, visual_delta


def decode_label(label: str) -> str | None:
    if not label:
        return None
    if re.fullmatch(r"<FEFF[0-9A-Fa-f]+>", label):
        try:
            return bytes.fromhex(label[1:-1]).decode("utf-16")
        except (ValueError, UnicodeError):
            pass
    return label


def identify(layout: dict, text: str) -> dict:
    lines = []
    for block in layout["blocks"]:
        for line in block.get("lines", []):
            spans = line["spans"]
            content = "".join(span["text"] for span in spans).strip()
            if content:
                lines.append({"text": content, "bbox": line["bbox"],
                              "size": max(span["size"] for span in spans)})
    lines.sort(key=lambda line: (round(line["bbox"][1], 1), line["bbox"][0]))
    height = layout["height"]
    candidates = [line for line in lines if line["bbox"][1] < height * .48 and len(line["text"]) >= 3]
    title_lines = []
    if candidates:
        first = candidates[0]
        title_lines = [first]
        for following in candidates[1:]:
            previous = title_lines[-1]
            if (abs(following["size"] - first["size"]) < 1
                    and 0 <= following["bbox"][1] - previous["bbox"][3] < first["size"] * .8):
                title_lines.append(following)
            else:
                break
    footer = [line for line in lines if line["bbox"][1] > height * .9]
    printed = []
    for line in footer:
        for match in re.finditer(r"(?<!\d)(\d+)\s*[|/]\s*(\d+)(?!\d)", line["text"]):
            printed.append({"number": int(match[1]), "total": int(match[2]),
                            "raw": match[0], "bbox": line["bbox"]})
    return {"title": " ".join(line["text"] for line in title_lines) or None,
            "title_method": "top_lines_font_geometry" if title_lines else "unavailable",
            "title_confidence": .8 if title_lines else 0,
            "title_bbox": ([min(line["bbox"][0] for line in title_lines), min(line["bbox"][1] for line in title_lines),
                            max(line["bbox"][2] for line in title_lines), max(line["bbox"][3] for line in title_lines)]
                           if title_lines else None),
            "printed_number_candidates": printed}


def body_text(layout: dict, repeated: set[str], title: str | None) -> str:
    body = []
    for block in layout["blocks"]:
        for line in block.get("lines", []):
            text = "".join(span["text"] for span in line["spans"]).strip()
            if (line["bbox"][1] >= layout["height"] * .12
                    and line["bbox"][3] <= layout["height"] * .91
                    and normalize(text) not in repeated and normalize(text) != normalize(title or "")):
                body.append(text)
    return "\n".join(body)


def make_groups(pages: list[dict]) -> list[dict]:
    # Candidate connected components are navigation aids, never deduplication decisions.
    by_id = {page["page_id"]: page for page in pages}
    seen, groups = set(), []
    for page in pages:
        if page["page_id"] in seen or not page["relations"]:
            continue
        component, todo = [], [page["page_id"]]
        while todo:
            current = todo.pop()
            if current in seen:
                continue
            seen.add(current)
            component.append(current)
            todo.extend(relation["page_id"] for relation in by_id[current]["relations"])
        ordered = sorted(component, key=lambda value: by_id[value]["source"]["page_index"])
        groups.append({"group_id": f"group-{len(groups) + 1:04d}", "page_ids": ordered,
                       "status": "candidate_cluster", "collapse_pages": False})
    return groups


def ingest_document(pdf: Path, source_root: Path, output: Path, dpi: int) -> dict:
    digest = sha256_file(pdf)
    document_id = f"{pdf.stem}--{digest[:12]}"
    relative_dir = Path("documents") / document_id
    final = output / relative_dir
    config = {"pipeline_version": PIPELINE_VERSION, "dpi": dpi, "renderer": "PyMuPDF",
              "pymupdf_version": pymupdf.VersionBind, "pillow_version": pillow_version,
              "relations_algorithm": ALGORITHM_VERSION, "thresholds": THRESHOLDS}
    if final.exists():
        manifest = read_json(final / "manifest.json")
        if manifest["source"]["sha256"] != digest or manifest["config"] != config:
            raise ValueError(f"Configurazione diversa per {pdf.name}: usare un'altra directory --output (nessuna analisi viene sovrascritta).")
        print(f"Riutilizzato: {pdf.name} ({manifest['page_count']} pagine)", flush=True)
        return manifest
    staging_root = output / ".staging"
    staging_root.mkdir(parents=True, exist_ok=True)
    stage = staging_root / f"{document_id}-{uuid.uuid4().hex}"
    stage.mkdir()
    # Failed runs remain in .staging with failure.json; catalog only references committed documents.
    try:
        with pymupdf.open(pdf) as document:
            if document.needs_pass:
                raise ValueError("PDF cifrato: fornire una copia autorizzata e leggibile prima dell'ingestion.")
            if not len(document):
                raise ValueError("PDF senza pagine")
            pages, raw, features = [], [], []
            for index, page in enumerate(document):
                number = index + 1
                page_id = f"{document_id}:p{number:04d}"
                page_dir = stage / "pages" / f"{number:04d}"
                page_dir.mkdir(parents=True)
                text = page.get_text("text", sort=False)
                sorted_text = page.get_text("text", sort=True)
                layout = page.get_text("dict", flags=pymupdf.TEXTFLAGS_DICT & ~pymupdf.TEXT_PRESERVE_IMAGES, sort=False)
                layout["coordinate_system"] = "unrotated_cropbox_points_top_left"
                layout["rotation_matrix"] = list(page.rotation_matrix)
                layout["image_regions"] = page.get_image_info(hashes=False, xrefs=False)
                (page_dir / "text.txt").write_text(text, encoding="utf-8", newline="\n")
                (page_dir / "text.reading-order.txt").write_text(sorted_text, encoding="utf-8", newline="\n")
                write_json(page_dir / "layout.json", layout)
                pixmap = page.get_pixmap(dpi=dpi, colorspace=pymupdf.csRGB, alpha=False, annots=True)
                pixmap.save(page_dir / "render.png")
                image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
                identity = identify(layout, text)
                raw_label = page.get_label()
                warnings = []
                if not text.strip():
                    warnings.append("no_text_layer_requires_visual_review_or_ocr")
                elif len(text.strip()) < 30:
                    warnings.append("sparse_text_requires_visual_review")
                if "\ufffd" in text:
                    warnings.append("unicode_replacement_character")
                if page.rotation:
                    warnings.append("rotated_page_use_rotation_matrix_for_evidence")
                if not identity["title"]:
                    warnings.append("title_unavailable")
                identity["extraction_warnings"] = warnings
                artifacts = {}
                for key, filename in [("text", "text.txt"), ("reading_order_text", "text.reading-order.txt"),
                                      ("layout", "layout.json"), ("render", "render.png")]:
                    artifacts[key] = {"path": (relative_dir / "pages" / f"{number:04d}" / filename).as_posix(),
                                      "sha256": sha256_file(page_dir / filename)}
                artifacts["render"].update({"width_px": image.width, "height_px": image.height,
                                            "dpi": dpi, "renderer": f"PyMuPDF {pymupdf.VersionBind}",
                                            "pixel_sha256": sha256_bytes(pixmap.samples)})
                spec = {"schema_version": SCHEMA_VERSION, "page_id": page_id, "document_id": document_id,
                        "source": {"pdf_sha256": digest, "page_index": index, "physical_page_number": number,
                                   "pdf_label_raw": raw_label or None, "pdf_label": decode_label(raw_label),
                                   "geometry": {"width_pt": page.rect.width, "height_pt": page.rect.height,
                                                "rotation": page.rotation, "cropbox": list(page.cropbox),
                                                "mediabox": list(page.mediabox)}},
                        "identity": identity, "artifacts": artifacts,
                        "context": {"previous_page_id": f"{document_id}:p{number - 1:04d}" if index else None,
                                    "next_page_id": f"{document_id}:p{number + 1:04d}" if number < len(document) else None},
                        "relations": [],
                        "companion_mapping": {"default_count": 1, "decision": "pending_analysis", "subpages": [], "split_rationale": None},
                        "analysis": {"status": "pending", "result": None}}
                pages.append(spec)
                raw.append({"text": text, "layout": layout})
                features.append({"title": identity["title"], "label": decode_label(raw_label),
                                 "aspect": image.width / image.height, "signature": signature(image),
                                 "pixel_sha256": artifacts["render"]["pixel_sha256"],
                                 "text_sha256": sha256_bytes(text.encode("utf-8"))})
            line_counts = Counter()
            for item in raw:
                line_counts.update(set(normalize(line) for line in item["text"].splitlines() if line.strip()))
            repeated = {line for line, count in line_counts.items() if count >= max(4, len(pages) * .6)}
            for feature, item in zip(features, raw):
                feature["body_text"] = body_text(item["layout"], repeated, feature["title"])
            for i, left in enumerate(features):
                for j in range(i + 1, len(features)):
                    relation = classify_pair(left, features[j], adjacent=j == i + 1)
                    if relation is None:
                        continue
                    delta = {"text": text_delta(raw[i]["text"], raw[j]["text"])}
                    with Image.open(stage / "pages" / f"{i + 1:04d}" / "render.png") as a:
                        with Image.open(stage / "pages" / f"{j + 1:04d}" / "render.png") as b:
                            delta["visual"] = visual_delta(a, b)
                    relation["delta_in_physical_order"] = delta
                    pages[i]["relations"].append({"page_id": pages[j]["page_id"], **relation})
                    pages[j]["relations"].append({"page_id": pages[i]["page_id"], **relation})
            manifest_pages = []
            for spec in pages:
                validate_schema(spec, "page-spec.schema.json")
                number = spec["source"]["physical_page_number"]
                write_json(stage / "pages" / f"{number:04d}" / "page_spec.json", spec)
                manifest_pages.append({"page_id": spec["page_id"], "physical_page_number": number,
                                       "pdf_label": spec["source"]["pdf_label"], "title": spec["identity"]["title"],
                                       "spec_path": (relative_dir / "pages" / f"{number:04d}" / "page_spec.json").as_posix()})
            manifest = {"schema_version": SCHEMA_VERSION, "document_id": document_id,
                        "source": {"path": pdf.relative_to(source_root).as_posix(), "filename": pdf.name,
                                   "sha256": digest, "size_bytes": pdf.stat().st_size},
                        "page_count": len(pages), "metadata": document.metadata,
                        "pdf_page_label_rules": document.get_page_labels(),
                        "config": config, "created_at": datetime.now(timezone.utc).isoformat(),
                        "pages": manifest_pages, "relation_groups": make_groups(pages),
                        "coverage": {"extracted_pages": len(pages), "rendered_pages": len(pages)}}
            write_json(stage / "manifest.json", manifest)
            write_json(stage / "fingerprints.json", {"algorithm": ALGORITHM_VERSION, "pages": features})
        final.parent.mkdir(parents=True, exist_ok=True)
        os.replace(stage, final)
        print(f"Estratto: {pdf.name} ({len(pages)} pagine)", flush=True)
        return manifest
    except Exception as error:
        write_json(stage / "failure.json", {"source": str(pdf), "error": str(error)})
        raise


def ingest(source_root: Path, output: Path, dpi: int = 144) -> dict:
    source_root, output = source_root.resolve(), output.resolve()
    if output == source_root or source_root.is_relative_to(output):
        raise ValueError("--output deve essere una sottocartella dedicata o una cartella separata dalle sorgenti")
    if not 72 <= dpi <= 300:
        raise ValueError("DPI consentiti: 72..300")
    # F05 publishes byte-identical frontend assets; these are never new sources.
    generated_roots = (output, source_root / "frontend" / "public" / "course-assets",
                       source_root / "frontend" / "dist")
    pdfs = sorted((path for path in source_root.rglob("*")
                   if path.is_file() and path.suffix.lower() == ".pdf"
                   and not any(path.resolve().is_relative_to(root) for root in generated_roots)
                   and not any(part in {".venv", ".git", "node_modules", ".staging"} for part in path.parts)),
                  key=lambda path: path.relative_to(source_root).as_posix().casefold())
    if not pdfs:
        raise ValueError(f"Nessun PDF in {source_root}")
    output.mkdir(parents=True, exist_ok=True)
    manifests = [ingest_document(pdf, source_root, output, dpi) for pdf in pdfs]
    ids = [manifest["document_id"] for manifest in manifests]
    if len(set(ids)) != len(ids):
        raise ValueError("Sorgenti omonime con contenuto identico in cartelle diverse: rinominare una sorgente per identificarle separatamente.")
    catalog = {"schema_version": SCHEMA_VERSION, "pipeline_version": PIPELINE_VERSION,
               "source_root": str(source_root), "artifact_root": str(output),
               "document_count": len(manifests), "page_count": sum(manifest["page_count"] for manifest in manifests),
               "documents": [{"document_id": manifest["document_id"], "source_path": manifest["source"]["path"],
                              "pdf_sha256": manifest["source"]["sha256"], "page_count": manifest["page_count"],
                              "manifest_path": f"documents/{manifest['document_id']}/manifest.json"} for manifest in manifests]}
    write_json(output / "catalog.json", catalog)
    return catalog
