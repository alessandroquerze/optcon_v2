"""Record individually authored visual/text analyses; never generate companion code.

Curation files are authored after inspecting the actual rendered pages. This command
only attaches provenance, preserves source transcriptions and validates the records.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import uuid

from .analysis import build_request, export_requests, load_corpus, validate_result
from .common import checked_path, read_json, validate_schema, write_json


def clipped(bbox, layout):
    return [max(0, bbox[0]), max(0, bbox[1]), min(layout["width"], bbox[2]), min(layout["height"], bbox[3])]


def evidence_box(anchor, layout):
    lines = [line for block in layout["blocks"] for line in block.get("lines", [])]
    parts = [line.strip() for line in anchor.splitlines() if line.strip()]
    found = []
    for line in lines:
        content = "".join(span["text"] for span in line["spans"]).strip()
        if content and any(part in content or content in part for part in parts):
            found.append(line["bbox"])
    if not found:
        raise ValueError(f"Nessuna regione visiva per l'ancoraggio: {anchor!r}")
    return clipped([min(b[0] for b in found), min(b[1] for b in found), max(b[2] for b in found), max(b[3] for b in found)], layout)


def overlap(a, b):
    return min(a[2], b[2]) > max(a[0], b[0]) and min(a[3], b[3]) > max(a[1], b[1])


def make_result(note, page, pages, output, run_id):
    request = build_request(output, page, pages)
    frame = request["frames"][0]
    text, layout = frame["text"], frame["layout"]
    observations = []
    for index, item in enumerate(note["observations"], 1):
        anchor = item.get("anchor")
        if anchor is not None and anchor not in text:
            raise ValueError(f"Pagina {note['page']}, osservazione {index}: citazione assente {anchor!r}")
        bbox = clipped(item["bbox"], layout) if "bbox" in item else evidence_box(anchor, layout)
        observations.append({"id": f"s{index:02d}", "category": item["category"], "description": item["claim"],
                             "evidence": {"page_id": page["page_id"], "modality": "both" if anchor else "visual",
                                          "text_quote": anchor, "bbox": bbox}, "confidence": item.get("confidence", .98)})
    # Retain every source text block as a region, including captions and footers.
    # These records supplement, rather than replace, the authored semantic observations.
    coverage = []
    for block in layout["blocks"]:
        if not block.get("lines"):
            continue
        bbox = clipped(block["bbox"], layout)
        if bbox[0] >= bbox[2] or bbox[1] >= bbox[3]:
            continue
        content = "\n".join("".join(span["text"] for span in line["spans"]) for line in block["lines"])
        relevant = [o["id"] for o in observations if overlap(o["evidence"]["bbox"], bbox)]
        if not relevant:
            identifier = f"transcription-{len(observations) + 1:02d}"
            observations.append({"id": identifier, "category": "structure", "description": "Trascrizione di una regione visibile della fonte: " + content,
                "evidence": {"page_id": page["page_id"], "modality": "visual", "text_quote": None, "bbox": bbox}, "confidence": .98})
            relevant = [identifier]
        coverage.append({"bbox": bbox, "description": "Regione testuale sorgente: " + content, "observation_ids": relevant})
    for observation in observations:
        if not any(observation["id"] in region["observation_ids"] for region in coverage):
            coverage.append({"bbox": observation["evidence"]["bbox"], "description": observation["description"], "observation_ids": [observation["id"]]})
    all_ids = [o["id"] for o in observations if o["id"].startswith("s")]
    enrichments = [{"id": f"explain-{i + 1}", "label": "enrichment", "type": "explanation", "proposal": proposal,
                    "source_observation_ids": all_ids} for i, proposal in enumerate(note.get("enrichment_notes", []))]
    examples = []
    for i, example in enumerate(note.get("examples", []), 1):
        identifier = f"example-{i}"
        origin = example.get("origin", "enrichment")
        enrichment_id = identifier if origin == "enrichment" else None
        if enrichment_id:
            enrichments.append({"id": identifier, "label": "enrichment", "type": "worked_example" if example.get("parameters") else "conceptual_example",
                                "proposal": example["setup"], "source_observation_ids": example.get("source_ids", all_ids)})
        examples.append({"id": identifier, "origin": origin, "purpose": example["purpose"], "setup": example["setup"],
            "parameters": [{"symbol": pair[0], "value": pair[1]} for pair in example.get("parameters", [])],
            "derivation": example.get("steps", []), "expected_outcome": example["expected"],
            "limitations": example.get("limitations", []), "enrichment_id": enrichment_id,
            "source_observation_ids": example.get("source_ids", all_ids)})
    interaction = note.get("interaction")
    interactive_plan = {"recommended": False, "rationale": note.get("no_interaction_reason", "La pagina si comprende con una rappresentazione statica; non aggiungere controlli privi di effetto concettuale."),
                        "component": None, "parameters": [], "outputs": [], "invariants": [], "enrichment_id": None}
    if interaction:
        enrichments.append({"id": "interaction", "label": "enrichment", "type": "interaction_design", "proposal": interaction["rationale"], "source_observation_ids": all_ids})
        interactive_plan = {"recommended": True, "rationale": interaction["rationale"], "component": interaction["component"],
            "parameters": [{"name": item[0], "symbol": item[1], "origin": item[6] if len(item) > 6 else "enrichment",
                            "range": item[2], "default": item[3], "effect_on_change": item[4], "edge_cases": item[5]}
                           for item in interaction["parameters"]],
            "outputs": interaction["outputs"], "invariants": interaction["invariants"], "enrichment_id": "interaction"}
    visual = note["visual"]
    if visual.get("origin", "source_derived") == "enrichment":
        enrichments.append({"id": "visualization", "label": "enrichment", "type": "visualization_design", "proposal": visual["description"], "source_observation_ids": all_ids})
    progression = note.get("progression", {})
    related_ids = [r["page_id"] for r in page["relations"]]
    uncertainties = [{"description": item["description"], "blocking": item.get("blocking", False),
                      "observation_ids": item.get("source_ids", all_ids)} for item in note.get("uncertainties", [])]
    prerequisites = [{"concept": item[0], "why": item[1], "origin": "source_context" if item[2] else "enrichment", "page_numbers": item[2]}
                     for item in note.get("prerequisites", [])]
    plan = {"source_scope_limits": note["scope_limits"], "prerequisites": prerequisites,
            "source_math": [{"latex": item[0], "anchor": item[1], "notes": item[2] if len(item) > 2 else "Trascrizione visiva della notazione sorgente; nessuna sostituzione di simboli."}
                            for item in note.get("math", [])],
            "enrichments": enrichments, "examples": examples,
            "example_omission_reason": note.get("no_example_reason") if not examples else None,
            "visualization": {"component": visual["component"], "description": visual["description"], "origin": visual.get("origin", "source_derived"), "source_observation_ids": all_ids},
            "interactivity": interactive_plan,
            "edge_cases": [{"case": item[0], "expected_behavior": item[1], "origin": item[2] if len(item) > 2 else "enrichment", "source_observation_ids": all_ids}
                           for item in note.get("edges", [])],
            "expansion_rationale": note["single_page_rationale"],
            "blueprint": [{"companion_suffix": None, "focus": note["focus"], "source_observation_ids": all_ids, "enrichment_ids": [e["id"] for e in enrichments]}]}
    return {"protocol_version": "1.0.0", "request_sha256": request["request_sha256"],
            "page_id": page["page_id"], "pdf_sha256": page["source"]["pdf_sha256"],
            "artifact_sha256": {key: page["artifacts"][key]["sha256"] for key in ["text", "layout", "render"]},
            "agent": {"provider": "OpenAI", "model": "Codex (identificatore esatto del modello non esposto nella sessione)", "run_id": run_id},
            "inspection": {"text_page_ids": request["required_page_ids"], "layout_page_ids": request["required_page_ids"],
                           "image_page_ids": request["required_page_ids"], "source_content_treated_as_data": True},
            "title": note["title"], "companionPageCount": 1, "didactic_plan": plan,
            "observations": observations, "contextual_role": note["role"],
            "context_notes": [{"page_id": page["context"][key], "role": role, "note": note[role]}
                              for key, role in [("previous_page_id", "previous"), ("next_page_id", "next")] if page["context"][key]],
            "notation": [{"symbol": item[0], "meaning": item[1], "observation_ids": item[2] if len(item) > 2 else all_ids} for item in note.get("notation", [])],
            "uncertainties": uncertainties,
            "progression": {"assessment": progression.get("assessment", "unique"), "related_page_ids": related_ids,
                "added": progression.get("added", []), "removed": progression.get("removed", []), "changed": progression.get("changed", []),
                "observation_ids": all_ids, "rationale": progression.get("rationale", "Pagina con contenuto autonomo nella sequenza; nessun candidato automatico da confermare.")},
            "coverage": {"all_visible_regions_accounted_for": True, "regions": coverage},
            "mapping_recommendation": {"mode": "one_to_one", "rationale": note["single_page_rationale"], "subpages": []}}


def record(output, document_match, notes_path, inspected_numbers, revise=False):
    _, manifests, pages = load_corpus(output)
    matches = [m for m in manifests.values() if document_match in m["document_id"]]
    if len(matches) != 1:
        raise ValueError("Specificare un documento univoco")
    manifest = matches[0]
    notes = read_json(notes_path)
    numbers = [n["page"] for n in notes]
    if numbers != sorted(set(numbers)):
        raise ValueError("Le pagine curate devono essere univoche e in ordine")
    run_id = "page-analysis-" + uuid.uuid4().hex
    for note in notes:
        number = note["page"]
        reference = manifest["pages"][number - 1]
        page = pages[reference["page_id"]]
        request = build_request(output, page, pages)
        required_numbers = {pages[pid]["source"]["physical_page_number"] for pid in request["required_page_ids"]}
        if not required_numbers <= inspected_numbers:
            raise ValueError(f"Prima di registrare pagina {number} ispezionare anche {sorted(required_numbers - inspected_numbers)}")
        if any(pages[r["page_id"]]["analysis"]["result"] is None for r in manifest["pages"][:number - 1]):
            raise ValueError("Registrare tutte le pagine precedenti prima della pagina corrente")
        result = make_result(note, page, pages, output, run_id)
        validate_result(result, page, pages, output)
        if page["analysis"]["result"] is not None and not revise:
            raise ValueError(f"Pagina {number} già analizzata; revisione esplicita necessaria")
        if page["analysis"]["result"] is not None:
            write_json(output / "analysis" / "history" / manifest["document_id"] / f"{number:04d}" / f"{run_id}.json", page)
        status = "needs_review" if result["uncertainties"] or page["identity"]["extraction_warnings"] else "analyzed"
        page["analysis"] = {"status": status, "result": result}
        page["companionPageCount"] = result["companionPageCount"]
        page["companion_mapping"]["decision"] = "proposed_after_analysis"
        validate_schema(page, "page-spec.schema.json")
        write_json(output / "analysis" / "results" / manifest["document_id"] / f"{number:04d}.json", result)
        write_json(checked_path(output, reference["spec_path"]), page)
        inspection_path = output / "analysis" / "inspection" / manifest["document_id"] / f"{number:04d}.json"
        inspection = {
            "page_id": page["page_id"], "sequence_number": number, "method": "Codex: lettura del testo e ispezione delle PNG tramite view_image nella sessione",
            "required_page_ids_inspected": request["required_page_ids"], "request_sha256": request["request_sha256"],
            "recorded_at_utc": datetime.now(timezone.utc).isoformat(), "human_review": False}
        if inspection_path.exists():
            original = read_json(inspection_path)
            inspection["recorded_at_utc"] = original["recorded_at_utc"]
            inspection["revised_at_utc"] = datetime.now(timezone.utc).isoformat()
        write_json(inspection_path, inspection)
        print(f"Pagina {number:02d}/{manifest['page_count']}: {status} — {note['title']}", flush=True)
    export_requests(output)


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("Data"))
    parser.add_argument("--document", required=True)
    parser.add_argument("--notes", type=Path, required=True)
    parser.add_argument("--inspected", required=True, help="Numeri fisici delle immagini realmente ispezionate, separati da virgole")
    parser.add_argument("--revise", action="store_true", help="Archivia il PAGE_SPEC precedente prima di registrare la revisione")
    args = parser.parse_args()
    record(args.output, args.document, args.notes, {int(n) for n in args.inspected.split(",")}, args.revise)
