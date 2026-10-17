from __future__ import annotations

import json
from pathlib import Path

from .common import ROOT, checked_path, read_json, sha256_bytes, sha256_file, validate_schema, write_json

PROTOCOL_VERSION = "1.0.0"


def load_corpus(output: Path) -> tuple[dict, dict, dict]:
    catalog = read_json(output / "catalog.json")
    manifests, pages = {}, {}
    for entry in catalog["documents"]:
        manifest = read_json(checked_path(output, entry["manifest_path"]))
        manifests[entry["document_id"]] = manifest
        for reference in manifest["pages"]:
            spec = read_json(checked_path(output, reference["spec_path"]))
            if spec["page_id"] in pages:
                raise ValueError(f"Page ID ripetuto: {spec['page_id']}")
            pages[spec["page_id"]] = spec
    return catalog, manifests, pages


def build_request(output: Path, page: dict, pages: dict) -> dict:
    roles = {page["page_id"]: "target"}
    for key, role in [("previous_page_id", "previous"), ("next_page_id", "next")]:
        if page["context"][key]:
            roles[page["context"][key]] = role
    for relation in page["relations"]:
        roles.setdefault(relation["page_id"], "related_candidate")
    frames = []
    for page_id, role in roles.items():
        spec = pages[page_id]
        frames.append({"page_id": page_id, "role": role,
                       "physical_page_number": spec["source"]["physical_page_number"],
                       "pdf_label": spec["source"]["pdf_label"], "identity_candidates": spec["identity"],
                       "text": checked_path(output, spec["artifacts"]["text"]["path"]).read_text(encoding="utf-8"),
                       "layout": read_json(checked_path(output, spec["artifacts"]["layout"]["path"])),
                       "artifacts": spec["artifacts"]})
    schema_file = ROOT / "schemas" / "analysis-result.schema.json"
    request = {"protocol_version": PROTOCOL_VERSION, "target_page_id": page["page_id"],
               "pdf_sha256": page["source"]["pdf_sha256"],
               "instructions": (ROOT / "prompts" / "analyze_page.md").read_text(encoding="utf-8"),
               "response_schema": read_json(schema_file), "response_schema_sha256": sha256_file(schema_file),
               "required_page_ids": list(roles), "frames": frames,
               "relations_to_assess": page["relations"],
               "image_attachments": [{"page_id": frame["page_id"], "role": frame["role"],
                                      "path": frame["artifacts"]["render"]["path"],
                                      "sha256": frame["artifacts"]["render"]["sha256"],
                                      "mime_type": "image/png"} for frame in frames]}
    canonical = json.dumps(request, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")
    request["request_sha256"] = sha256_bytes(canonical)
    return request


def export_requests(output: Path) -> int:
    _, _, pages = load_corpus(output)
    queue = []
    for page in pages.values():
        # Always retain one task per physical page, including exact duplicates.
        request = build_request(output, page, pages)
        number = page["source"]["physical_page_number"]
        path = f"analysis/requests/{page['document_id']}/{number:04d}.json"
        write_json(checked_path(output, path), request)
        queue.append({"page_id": page["page_id"], "request_path": path,
                      "request_sha256": request["request_sha256"], "analysis_status": page["analysis"]["status"],
                      "required_image_count": len(request["image_attachments"])})
    directory = output / "analysis"
    lines = "".join(json.dumps(item, ensure_ascii=False) + "\n" for item in queue)
    temporary = directory / "queue.jsonl.tmp"
    temporary.write_text(lines, encoding="utf-8", newline="\n")
    temporary.replace(directory / "queue.jsonl")
    write_json(directory / "coverage.json", {"physical_pages": len(pages), "requests": len(queue),
        "status_counts": {status: sum(page["analysis"]["status"] == status for page in pages.values())
                          for status in ["pending", "analyzed", "needs_review"]},
        "ai_execution_performed_by_export": False, "companion_generation_enabled": False})
    return len(queue)


def validate_result(result: dict, page: dict, pages: dict, output: Path) -> None:
    validate_schema(result, "analysis-result.schema.json")
    request = build_request(output, page, pages)
    if result["page_id"] != page["page_id"] or result["pdf_sha256"] != page["source"]["pdf_sha256"]:
        raise ValueError("Il risultato si riferisce a un'altra pagina o revisione del PDF")
    if result["request_sha256"] != request["request_sha256"]:
        raise ValueError("Il pacchetto analizzato è obsoleto o diverso da quello attuale")
    for key in ["text", "layout", "render"]:
        if result["artifact_sha256"][key] != page["artifacts"][key]["sha256"]:
            raise ValueError(f"Hash sorgente diverso: {key}")
    expected = set(request["required_page_ids"])
    for kind in ["text_page_ids", "layout_page_ids", "image_page_ids"]:
        if set(result["inspection"][kind]) != expected:
            raise ValueError(f"{kind}: servono pagina, entrambe le vicine disponibili e tutte le pagine correlate")
    target_frame = request["frames"][0]
    layout = target_frame["layout"]

    def validate_bbox(bbox):
        if bbox is not None:
            x0, y0, x1, y1 = bbox
            if not (0 <= x0 < x1 <= layout["width"] + .1 and 0 <= y0 < y1 <= layout["height"] + .1):
                raise ValueError(f"BBox fuori dalla pagina non ruotata o vuoto: {bbox}")

    observations = result["observations"]
    ids = [item["id"] for item in observations]
    if len(set(ids)) != len(ids):
        raise ValueError("Gli observation ID devono essere univoci")
    for observation in observations:
        evidence = observation["evidence"]
        if evidence["page_id"] != page["page_id"]:
            raise ValueError("Le osservazioni della pagina devono avere evidenze sulla pagina target; usare context_notes per le vicine")
        quote = evidence["text_quote"]
        if quote is not None and quote not in target_frame["text"]:
            raise ValueError(f"Citazione non presente nel testo originale: {observation['id']}")
        validate_bbox(evidence["bbox"])
    if not any(item["evidence"]["modality"] in {"visual", "both"} for item in observations):
        raise ValueError("Serve almeno un'osservazione con evidenza visiva")
    expected_notes = {(page["context"][key], role) for key, role in [("previous_page_id", "previous"), ("next_page_id", "next")]
                      if page["context"][key]}
    actual_notes = [(item["page_id"], item["role"]) for item in result["context_notes"]]
    if set(actual_notes) != expected_notes or len(actual_notes) != len(expected_notes):
        raise ValueError("context_notes deve interpretare ciascuna pagina immediatamente precedente/successiva disponibile")
    progression = result["progression"]
    related = set(progression["related_page_ids"])
    if not related <= (expected - {page["page_id"]}):
        raise ValueError("Valutazione progressiva riferita a pagine non incluse nel pacchetto")
    candidate_ids = {item["page_id"] for item in page["relations"]}
    if not candidate_ids <= related:
        raise ValueError("Ogni relazione candidata deve essere valutata, anche se viene respinta come unique")
    if progression["assessment"] in {"duplicate", "progressive"} and not related:
        raise ValueError("Duplicazione/progressione richiede pagine correlate")
    for container in [result["notation"], result["uncertainties"], result["coverage"]["regions"], [progression]]:
        for item in container:
            if not set(item["observation_ids"]) <= set(ids):
                raise ValueError("Riferimento a observation ID inesistente")
    covered = set()
    for region in result["coverage"]["regions"]:
        validate_bbox(region["bbox"])
        covered.update(region["observation_ids"])
    if set(ids) - covered:
        raise ValueError("La mappa di copertura deve includere tutte le osservazioni")
    mapping = result["mapping_recommendation"]
    suffixes = [item["suffix"] for item in mapping["subpages"]]
    if len(set(suffixes)) != len(suffixes) or suffixes != [chr(97 + i) for i in range(len(suffixes))]:
        raise ValueError("Le sub-page devono avere suffissi consecutivi a, b, ...")
    if "didactic_plan" in result or "companionPageCount" in result:
        validate_didactic_plan(result, page, pages, target_frame["text"])


def validate_didactic_plan(result: dict, page: dict, pages: dict, text: str) -> None:
    if "didactic_plan" not in result or "companionPageCount" not in result:
        raise ValueError("Il progetto didattico richiede didactic_plan e companionPageCount")
    plan = result["didactic_plan"]
    count = result["companionPageCount"]
    expected_count = 1 if result["mapping_recommendation"]["mode"] == "one_to_one" else len(result["mapping_recommendation"]["subpages"])
    if count != expected_count or len(plan["blueprint"]) != count:
        raise ValueError("companionPageCount, blueprint e mapping non coerenti")
    observation_ids = {observation["id"] for observation in result["observations"]}
    enrichments = {item["id"]: item for item in plan["enrichments"]}
    if len(enrichments) != len(plan["enrichments"]):
        raise ValueError("Enrichment ID duplicati")
    for container in [plan["enrichments"], plan["examples"], plan["edge_cases"], plan["blueprint"], [plan["visualization"]]]:
        for item in container:
            if not set(item["source_observation_ids"]) <= observation_ids:
                raise ValueError("Progetto didattico con observation ID inesistenti")
    for formula in plan["source_math"]:
        if formula["anchor"] not in text:
            raise ValueError("Formula senza ancoraggio testuale nella fonte")
    if not plan["examples"] and not plan["example_omission_reason"]:
        raise ValueError("Motivare l'assenza di un esempio")
    for example in plan["examples"]:
        if example["origin"] == "enrichment" and example["enrichment_id"] not in enrichments:
            raise ValueError("Esempio aggiunto senza etichetta enrichment")
        if example["origin"] == "source" and not example["source_observation_ids"]:
            raise ValueError("Esempio sorgente senza evidenze")
    interaction = plan["interactivity"]
    if interaction["recommended"]:
        if not interaction["component"] or not interaction["parameters"] or interaction["enrichment_id"] not in enrichments:
            raise ValueError("Interazione priva di componente, parametri o etichetta enrichment")
    elif interaction["parameters"] or interaction["component"] is not None:
        raise ValueError("Interazione non raccomandata con controlli configurati")
    valid_numbers = {spec["source"]["physical_page_number"] for spec in pages.values() if spec["document_id"] == page["document_id"]}
    for prerequisite in plan["prerequisites"]:
        if not set(prerequisite["page_numbers"]) <= valid_numbers:
            raise ValueError("Prerequisito con pagina sorgente inesistente")
        if prerequisite["origin"] == "source_context" and any(number >= page["source"]["physical_page_number"] for number in prerequisite["page_numbers"]):
            raise ValueError("Una pagina futura non può essere presentata come prerequisito già introdotto")
    for blueprint in plan["blueprint"]:
        if not set(blueprint["enrichment_ids"]) <= set(enrichments):
            raise ValueError("Blueprint riferito a enrichment inesistente")


def import_result(output: Path, result_path: Path) -> str:
    _, manifests, pages = load_corpus(output)
    result = read_json(result_path)
    page_id = result.get("page_id")
    if page_id not in pages:
        raise ValueError(f"Pagina sconosciuta: {page_id}")
    page = pages[page_id]
    validate_result(result, page, pages, output)
    previous = page["analysis"]
    if previous["result"] is not None and previous["result"] != result:
        raise ValueError("Esiste già un'analisi diversa: conservarla e revisionarla prima di sostituirla (nessuna sovrascrittura implicita)")
    needs_review = bool(result["uncertainties"] or page["identity"]["extraction_warnings"]
                        or result["progression"]["assessment"] == "uncertain"
                        or result["mapping_recommendation"]["mode"] == "subpages")
    page["analysis"] = {"status": "needs_review" if needs_review else "analyzed", "result": result}
    if "didactic_plan" in result:
        page["companionPageCount"] = result["companionPageCount"]
        page["companion_mapping"]["decision"] = "proposed_after_analysis"
    validate_schema(page, "page-spec.schema.json")
    reference = next(item for item in manifests[page["document_id"]]["pages"] if item["page_id"] == page_id)
    write_json(checked_path(output, reference["spec_path"]), page)
    export_requests(output)
    return page["analysis"]["status"]
