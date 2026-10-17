from __future__ import annotations

from collections import Counter
import json
from pathlib import Path

import pymupdf
from PIL import Image

from .analysis import build_request, load_corpus, validate_result
from .common import checked_path, read_json, sha256_bytes, sha256_file, validate_schema, write_json


def audit(output: Path, include_requests: bool = True) -> dict:
    catalog, manifests, pages = load_corpus(output)
    validate_schema(catalog, "catalog.schema.json")
    errors, warnings = [], []
    source_root = Path(catalog["source_root"])
    counts = Counter()
    relations = Counter()
    if catalog["document_count"] != len(manifests) or catalog["page_count"] != len(pages):
        errors.append("Conteggi catalogo non coerenti")
    for entry in catalog["documents"]:
        manifest = manifests[entry["document_id"]]
        try:
            validate_schema(manifest, "document-manifest.schema.json")
            if manifest["document_id"] != entry["document_id"] or manifest["page_count"] != entry["page_count"]:
                raise ValueError("Identità/conteggio del manifest non coerente con il catalogo")
            if manifest["source"]["sha256"] != entry["pdf_sha256"] or manifest["source"]["path"] != entry["source_path"]:
                raise ValueError("Sorgente del manifest non coerente con il catalogo")
            pdf = checked_path(source_root, manifest["source"]["path"])
            if sha256_file(pdf) != manifest["source"]["sha256"]:
                raise ValueError("PDF sorgente modificato")
            with pymupdf.open(pdf) as document:
                if len(document) != manifest["page_count"]:
                    raise ValueError("Numero di pagine del PDF diverso dal manifest")
            if len(manifest["pages"]) != manifest["page_count"]:
                raise ValueError("Copertura manifest incompleta")
            if manifest["coverage"] != {"extracted_pages": manifest["page_count"], "rendered_pages": manifest["page_count"]}:
                raise ValueError("Contatori di estrazione/rendering incompleti")
            ordered_ids = [reference["page_id"] for reference in manifest["pages"]]
            for index, reference in enumerate(manifest["pages"]):
                page = pages[reference["page_id"]]
                validate_schema(page, "page-spec.schema.json")
                expected_id = f"{manifest['document_id']}:p{index + 1:04d}"
                if page["document_id"] != manifest["document_id"] or page["page_id"] != expected_id:
                    raise ValueError(f"Page ID non coerente: {page['page_id']}")
                if page["source"]["page_index"] != index or page["source"]["physical_page_number"] != index + 1:
                    raise ValueError(f"Indice fisico non coerente: {page['page_id']}")
                if (reference["physical_page_number"] != index + 1 or reference["title"] != page["identity"]["title"]
                        or reference["pdf_label"] != page["source"]["pdf_label"]):
                    raise ValueError(f"Riferimento manifest non coerente: {page['page_id']}")
                if page["source"]["pdf_sha256"] != manifest["source"]["sha256"]:
                    raise ValueError(f"Revisione della pagina non coerente: {page['page_id']}")
                if page["context"] != {"previous_page_id": ordered_ids[index - 1] if index else None,
                                       "next_page_id": ordered_ids[index + 1] if index + 1 < len(ordered_ids) else None}:
                    raise ValueError(f"Contesto non coerente: {page['page_id']}")
                for artifact in page["artifacts"].values():
                    path = checked_path(output, artifact["path"])
                    if sha256_file(path) != artifact["sha256"]:
                        raise ValueError(f"Artefatto alterato: {artifact['path']}")
                render = page["artifacts"]["render"]
                with Image.open(checked_path(output, render["path"])) as image:
                    image.load()
                    if image.size != (render["width_px"], render["height_px"]):
                        raise ValueError(f"Dimensioni PNG non coerenti: {page['page_id']}")
                    if sha256_bytes(image.convert("RGB").tobytes()) != render["pixel_sha256"]:
                        raise ValueError(f"Pixel PNG alterati: {page['page_id']}")
                for relation in page["relations"]:
                    other = pages.get(relation["page_id"])
                    if other is None or other["document_id"] != page["document_id"] or other["page_id"] == page["page_id"]:
                        raise ValueError(f"Relazione non valida: {page['page_id']}")
                    reverse = [r for r in other["relations"] if r["page_id"] == page["page_id"]]
                    if len(reverse) != 1 or {k: v for k, v in reverse[0].items() if k != "page_id"} != {k: v for k, v in relation.items() if k != "page_id"}:
                        raise ValueError(f"Relazione non simmetrica: {page['page_id']}")
                    if relation["kind"] == "exact_duplicate" and (
                            render["pixel_sha256"] != other["artifacts"]["render"]["pixel_sha256"] or
                            page["artifacts"]["text"]["sha256"] != other["artifacts"]["text"]["sha256"]):
                        raise ValueError(f"Falsa duplicazione esatta: {page['page_id']}")
                    if page["source"]["page_index"] < other["source"]["page_index"]:
                        relations[relation["kind"]] += 1
                if page["analysis"]["result"] is not None:
                    validate_result(page["analysis"]["result"], page, pages, output)
                if "source_warning" in page:
                    from .source_warning_policy import validate_warning
                    validate_warning(page)
                counts[page["analysis"]["status"]] += 1
                for warning in page["identity"]["extraction_warnings"]:
                    warnings.append({"page_id": page["page_id"], "warning": warning})
        except (ValueError, OSError, KeyError, TypeError) as error:
            errors.append(f"{manifest['document_id']}: {error}")
    # New or removed PDFs must not silently leave an apparently complete corpus.
    expected_sources = {entry["source_path"] for entry in catalog["documents"]}
    found_sources = {path.relative_to(source_root).as_posix() for path in source_root.rglob("*")
                     if path.is_file() and path.suffix.lower() == ".pdf" and not path.resolve().is_relative_to(output.resolve())
                     and not any(part in {".venv", ".git", "node_modules", ".staging"} for part in path.parts)}
    if expected_sources != found_sources:
        errors.append(f"Inventario PDF cambiato: nuovi={sorted(found_sources - expected_sources)}, rimossi={sorted(expected_sources - found_sources)}")
    validated_requests = 0
    if include_requests and not errors:
        try:
            queue_path = output / "analysis" / "queue.jsonl"
            queue = [json.loads(line) for line in queue_path.read_text(encoding="utf-8").splitlines() if line.strip()]
            queue_ids = [item["page_id"] for item in queue]
            if set(queue_ids) != set(pages) or len(queue_ids) != len(pages):
                raise ValueError("La coda deve contenere esattamente una richiesta per ogni pagina fisica")
            for item in queue:
                page = pages[item["page_id"]]
                stored = read_json(checked_path(output, item["request_path"]))
                expected = build_request(output, page, pages)
                if stored != expected or item["request_sha256"] != expected["request_sha256"]:
                    raise ValueError(f"Pacchetto AI alterato o obsoleto: {item['page_id']}")
                if item["analysis_status"] != page["analysis"]["status"] or item["required_image_count"] != len(expected["image_attachments"]):
                    raise ValueError(f"Stato/allegati della coda non coerenti: {item['page_id']}")
                validated_requests += 1
            coverage = read_json(output / "analysis" / "coverage.json")
            expected_counts = {status: counts[status] for status in ["pending", "analyzed", "needs_review"]}
            if (coverage["physical_pages"] != len(pages) or coverage["requests"] != len(pages)
                    or coverage["status_counts"] != expected_counts or coverage["ai_execution_performed_by_export"]
                    or coverage["companion_generation_enabled"]):
                raise ValueError("Report di copertura delle richieste AI non coerente")
        except (ValueError, OSError, KeyError, TypeError) as error:
            errors.append(f"Richieste AI: {error}")
    report = {"ok": not errors, "document_count": len(manifests), "page_count": len(pages),
              "validated_pages": sum(counts.values()), "analysis_status_counts": dict(counts),
              "requests_checked": include_requests, "validated_requests": validated_requests,
              "relation_pair_counts": dict(relations), "extraction_warnings": warnings, "errors": errors,
              "companion_generation_enabled": False,
              "all_pages_individually_analyzed": len(pages) > 0 and counts["analyzed"] == len(pages),
              "all_pages_have_analysis": len(pages) > 0 and counts["pending"] == 0 and sum(counts.values()) == len(pages),
              "human_review_performed": False}
    write_json(output / "reports" / "validation.json", report)
    return report
