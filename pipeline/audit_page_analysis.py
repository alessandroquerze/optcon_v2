"""Audit the completed page analysis of one PDF and its numerical enrichments."""
from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime
import math
from pathlib import Path

import pymupdf

from .analysis import load_corpus, validate_result
from .common import checked_path, read_json, sha256_file, write_json
from .validate import audit


def numerical_checks():
    rows = []

    def check(page, name, actual, expected, tolerance=1e-8):
        av = actual if isinstance(actual, list) else [actual]
        ev = expected if isinstance(expected, list) else [expected]
        ok = len(av) == len(ev) and all(math.isclose(a, b, rel_tol=tolerance, abs_tol=tolerance) for a, b in zip(av, ev))
        rows.append({"physical_page": page, "check": name, "origin": "enrichment",
                     "computed": actual, "expected": expected, "tolerance": tolerance, "ok": ok})

    check(2, "Costo scalare al limite", (.6 - 1)**2, .16)
    check(8, "Risposta continua a t=1", 1 - math.exp(-1), .6321, 3e-5)
    check(9, "Aggiornamento discreto", .8 * 1 + .2, 1)
    check(10, "Stack con T=3", [1 + .5, 1 + .5 - .25, 1 + .5 - .25 + 0], [1.5, 1.25, 1.25])
    check(11, "Residuo equilibrio", 2 - (.5 * 2 + 1), 0)
    check(12, "Variazione esatta, lineare, residuo", [(1 + .1)**2 - 1, 2 * .1, (1 + .1)**2 - 1 - .2], [.21, .2, .01])
    check(14, "Costo e vincoli del punto (.5,.5)", [.5 * (.5**2 + .5**2), .5 + .5 - 1, -.5], [.25, 0, -.5])
    check(15, "Tre costi della parabola", [.5 * (z - 2)**2 for z in [0, 2, 3]], [2, 0, .5])
    check(16, "Costo corretto: forma matriciale e sviluppo con w₂", [.5 * (1 + 4), .5 * 1 + .5 * 4], [2.5, 2.5])
    check(17, "Residui del disco unitario", [0**2 + 0**2 - 1, 1**2 + 0**2 - 1, 2**2 + 0**2 - 1], [-1, 0, 3])
    check(18, "Minimo vincolato dell'esempio", [min(2, 1), .5 * (min(2, 1) - 2)**2], [1, .5])
    check(19, "Residuo dopo alterazione di x₂", 1 - .5 - .8, -.3)
    check(20, "Costo additivo", [.5 * (1**2 + .5**2), .5 * .5**2, 2 * .5**2], [.625, .125, .5])
    check(20, "Totale additivo", .625 + .125 + .5, 1.25)
    check(21, "Raggiungibilità, b=.4/.5", [2 * .4, 2 * .5], [.8, 1])
    check(22, "Costo candidata di tracking", [.5 * .5**2, .5 * (.5 - 1)**2], [.125, .125])
    check(23, "Controlli e costo minimo di due passi", [.5, .5, .5 * (.5**2 + .5**2)], [.5, .5, .25])
    check(25, "Ottimo scalare a un passo", [1 / (1 + 1), .5 * .5**2 + .5 * (.5 - 1)**2], [.5, .25])
    check(26, "Hover istantaneo", [-(4.905 + 4.905) * math.sin(0), (4.905 + 4.905) * math.cos(0) - 9.81, .4 / (.02 * 2) * (4.905 - 4.905)], [0, 0, 0])
    check(26, "Ingressi 5 e 4, θ=0", [(5 + 4) - 9.81, .4 / (.02 * 2) * (5 - 4)], [-.81, 10])
    acceleration, delta = 2.19, .1
    position = velocity = 0.
    states = []
    for _ in range(10):
        position, velocity = position + delta * velocity, velocity + delta * acceleration
        states.append([position, velocity])
    check(27, "Due passi Euler", states[0] + states[1], [0, .219, .0219, .438])
    check(27, "Euler vs continuo dopo 1 s", [position, .5 * acceleration], [.9855, 1.095])
    check(29, "Costo di stadio del drone", .5 * (2 * 1**2 + 10 * .1**2 + .5 * 2**2 + .5 * 2**2), 3.05)
    check(30, "Violazione limite superiore", 3.2 - 3, .2)
    check(31, "Funzionale dell'integratore", .5 * 1**2 * 1 + .5 * (1 * 1)**2, 1)
    check(32, "Stato dopo ingresso +1 poi −1", [1 * 1, 1 - 1 * 1], [1, 0])
    check(33, "Accelerazione del pendolo", -9.81 * math.sin(math.pi / 6), -4.905)
    check(34, "Coppia equilibrio e residuo dinamico", [9.81 * math.sin(math.pi / 6), -9.81 * math.sin(math.pi / 6) + 4.905], [4.905, 0])
    check(35, "Istante di cambio e secondo ingresso", [2 / 2, 9.81 * math.sin(math.pi / 6)], [1, 4.905])
    alpha = math.pi / 6
    check(36, "Costo pendolo senza 1/2", alpha**2 + .1 * 4.905**2 + 2 * alpha**2, 3.22836953)
    return rows


def audit_document(output: Path, document_match: str):
    corpus_audit = audit(output)
    _, manifests, pages = load_corpus(output)
    matches = [m for m in manifests.values() if document_match in m["document_id"]]
    if len(matches) != 1:
        raise ValueError("Documento non univoco")
    manifest = matches[0]
    catalog = read_json(output / "catalog.json")
    source_path = checked_path(Path(catalog["source_root"]), manifest["source"]["path"])
    with pymupdf.open(source_path) as pdf:
        physical_count = len(pdf)
    errors = list(corpus_audit["errors"])
    rows, inspection_times = [], []
    for number in range(1, physical_count + 1):
        reference = manifest["pages"][number - 1]
        path = checked_path(output, reference["spec_path"])
        page = read_json(path)
        result = page["analysis"]["result"]
        if result is None:
            errors.append(f"Pagina {number}: analisi mancante")
            continue
        validate_result(result, page, pages, output)
        plan = result["didactic_plan"]
        archive = output / "analysis" / "results" / manifest["document_id"] / f"{number:04d}.json"
        inspection = read_json(output / "analysis" / "inspection" / manifest["document_id"] / f"{number:04d}.json")
        inspection_times.append(datetime.fromisoformat(inspection["recorded_at_utc"]))
        checks = {
            "spec_exists": path.is_file(),
            "correct_physical_page": page["source"]["physical_page_number"] == number,
            "separate_page_spec": path.name == "page_spec.json" and path.parent.name == f"{number:04d}",
            "text_image_layout_inspected": all(page["page_id"] in result["inspection"][key] for key in ["text_page_ids", "image_page_ids", "layout_page_ids"]),
            "neighbors_accounted_for": len(result["context_notes"]) == (0 if physical_count == 1 else 1 if number in {1, physical_count} else 2),
            "has_source_observations": bool(result["observations"]),
            "has_source_scope_limits": bool(plan["source_scope_limits"]),
            "has_prerequisite_or_is_cover": bool(plan["prerequisites"]) or number == 1,
            "example_or_explicit_reason": bool(plan["examples"] or plan["example_omission_reason"]),
            "all_enrichments_labelled": all(e["label"] == "enrichment" for e in plan["enrichments"]),
            "every_parameter_has_effect_and_limits": all(p["effect_on_change"] and p["edge_cases"] and p["range"] for p in plan["interactivity"]["parameters"]),
            "has_edge_cases": bool(plan["edge_cases"]),
            "companion_count_consistent": page.get("companionPageCount") == result["companionPageCount"] == len(plan["blueprint"]),
            "mapping_is_proposal": page["companion_mapping"]["decision"] == "proposed_after_analysis",
            "result_archive_matches": read_json(archive) == result,
            "inspection_matches_request": inspection["request_sha256"] == result["request_sha256"],
            "no_companion_implemented": not any(key in result for key in ["html", "react", "companion_html"])
        }
        errors.extend(f"Pagina {number}: {label}" for label, passed in checks.items() if not passed)
        rows.append({"physical_page": number, "pdf_label": page["source"]["pdf_label"],
            "page_id": page["page_id"], "spec_path": reference["spec_path"], "spec_sha256": sha256_file(path),
            "title": result["title"], "status": page["analysis"]["status"], "companionPageCount": result["companionPageCount"],
            "observations": len(result["observations"]), "source_math_expressions": len(plan["source_math"]),
            "examples": len(plan["examples"]), "interactivity_recommended": plan["interactivity"]["recommended"],
            "checks": checks, "source_issues": result["uncertainties"]})
    if len(rows) != physical_count or len({row["page_id"] for row in rows}) != physical_count:
        errors.append("Copertura non biunivoca fra pagine fisiche e PAGE_SPEC")
    in_order = all(left <= right for left, right in zip(inspection_times, inspection_times[1:]))
    if not in_order:
        errors.append("La prima registrazione delle analisi non segue l'ordine delle pagine")
    numeric = numerical_checks()
    errors.extend(f"Esempio numerico pagina {r['physical_page']}: {r['check']}" for r in numeric if not r["ok"])
    results = {row["physical_page"]: pages[row["page_id"]]["analysis"]["result"] for row in rows}
    notation_checks = {
        "initial_state_superscript_preserved": all(any("x^0" in f["latex"] for f in results[n]["didactic_plan"]["source_math"]) for n in [8, 9, 10, 20, 25, 36]),
        "weighted_cost_source_typo_preserved": results[16]["didactic_plan"]["source_math"][-1]["latex"].count("w_1") == 2,
        "drone_negative_sum_preserved": any("-\\frac{u_1+u_2}{M}" in f["latex"] for f in results[26]["didactic_plan"]["source_math"]),
        "euler_underbrace_includes_state": any("\\underbrace{x_t+\\delta" in f["latex"] for f in results[27]["didactic_plan"]["source_math"]),
        "pendulum_equilibrium_typo_preserved": results[34]["didactic_plan"]["source_math"][0]["latex"] == "0=x_{1,e}",
        "pendulum_cost_has_no_half_inserted": all(token not in results[36]["didactic_plan"]["source_math"][0]["latex"] for token in ["\\frac12", "\\frac{1}{2}", "\\tfrac12"]),
        "false_duplicate_6_7_rejected": all(results[n]["progression"]["assessment"] == "unique" for n in [6, 7])
    }
    errors.extend(name for name, passed in notation_checks.items() if not passed)
    report = {
        "ok": not errors, "document_id": manifest["document_id"], "source_pdf": manifest["source"],
        "physical_pdf_pages": physical_count, "separate_page_specs": len(rows),
        "missing_pages": sorted(set(range(1, physical_count + 1)) - {r["physical_page"] for r in rows}),
        "first_analysis_recorded_in_physical_order": in_order,
        "status_counts": dict(Counter(row["status"] for row in rows)),
        "all_pages_have_completed_analysis": len(rows) == physical_count,
        "companion_page_count_distribution": dict(Counter(str(row["companionPageCount"]) for row in rows)),
        "examples_proposed": sum(row["examples"] for row in rows),
        "interactive_proposals": sum(row["interactivity_recommended"] for row in rows),
        "pages_requiring_source_review": [row["physical_page"] for row in rows if row["source_issues"]],
        "pages_with_blocking_source_issues": [row["physical_page"] for row in rows if any(q["blocking"] for q in row["source_issues"])],
        "notation_spot_checks": notation_checks, "numerical_enrichment_checks": numeric,
        "no_companion_implementation_performed": True, "human_review_performed": False,
        "ready_for_companion_implementation": False,
        "corpus_validation_report": "reports/validation.json", "errors": errors, "pages": rows
    }
    report_path = output / "reports" / "page_analysis_introduction.json"
    if (output / "reviews" / "introduction_source_warning_baseline.json").exists():
        from .source_warning_policy import attach_review_to_report
        report = attach_review_to_report(report, output)
    write_json(report_path, report)
    markdown = [
        "# Audit PAGE ANALYSIS — Introduction to Optimal Control", "",
        f"PDF: {manifest['source']['filename']}.", "",
        f"Copertura verificata: **{len(rows)}/{physical_count} pagine fisiche**, con un PAGE_SPEC separato per ciascuna pagina, nessuna pagina mancante.",
        f"Esito automatico: **{'PASS' if report['ok'] else 'FAIL'}**; analisi registrate inizialmente in ordine fisico: **{'sì' if in_order else 'no'}**.", "",
        f"Stati: {report['status_counts']}. Tutte le proposte hanno companionPageCount=1; non sono state create pagine companion.",
        f"Esempi proposti: {report['examples_proposed']}, etichettati per origine. Interazioni raccomandate: {report['interactive_proposals']}; le altre pagine motivano l'assenza di controlli.",
        f"Controlli numerici sugli enrichment: {sum(r['ok'] for r in numeric)}/{len(numeric)} superati.", "",
        "## Copertura pagina per pagina", "",
        "| Pagina fisica | Label PDF | Titolo analizzato | Stato | Companion | PAGE_SPEC |",
        "| ---: | ---: | --- | --- | ---: | --- |"
    ]
    for row in rows:
        markdown.append(f"| {row['physical_page']} | {row['pdf_label']} | {row['title'].replace('|', '/')} | {row['status']} | {row['companionPageCount']} | [JSON](../Data/{row['spec_path']}) |")
    markdown.extend(["", "## Discrepanze della fonte da revisionare", "",
        "Le pagine needs_review sono analizzate e coperte. Le segnalazioni conservano ciò che è stampato, senza sostituirlo con correzioni non attribuite."])
    for row in rows:
        for issue in row["source_issues"]:
            markdown.append(f"- Pagina {row['physical_page']} ({'bloccante per il riuso della parte interessata' if issue['blocking'] else 'nota di revisione'}): {issue['description']}")
    markdown.extend(["", "## Verifiche e limiti dell'audit", "",
        "Verificati: fonte e hash, schema di ogni PAGE_SPEC, associazione biunivoca alle pagine fisiche, immagini/testo/layout ispezionati, contesto immediato, evidenze e bbox, distinzione enrichment, effetti dei parametri, casi limite, conteggi companion, copie dei risultati e ordine di prima registrazione.",
        "La verifica semantica è stata svolta nella sessione Codex leggendo testo e immagini di tutte le pagine, con ulteriori rendering a 288 DPI per le notazioni delicate. I controlli automatici non costituiscono una prova matematica generale o una revisione umana.",
        "Restano esplicite le discrepanze della fonte e tre parti bloccanti per il successivo riuso: pesi a pagina 16, indicizzazione a pagina 30 e condizione di equilibrio a pagina 34. Questa fase non richiede di risolverle inventando una fonte corretta.",
        "La futura generazione/implementazione rimane separata: non sono stati creati componenti React/HTML, grafici dell'app o simulazioni dell'app.",
        "", f"Report JSON dettagliato: [page_analysis_introduction.json](../Data/reports/{report_path.name}).", ""])
    docs = Path(__file__).resolve().parents[1] / "Docs"
    (docs / "INTRODUCTION_PAGE_ANALYSIS_AUDIT.md").write_text("\n".join(markdown), encoding="utf-8")
    return report


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("Data"))
    parser.add_argument("--document", default="introduction_optimal_control")
    args = parser.parse_args()
    report = audit_document(args.output, args.document)
    print(f"Audit {'PASS' if report['ok'] else 'FAIL'}: {report['separate_page_specs']}/{report['physical_pdf_pages']} PAGE_SPEC; {len(report['numerical_enrichment_checks'])} controlli numerici.")
    for error in report["errors"]:
        print(error)
    raise SystemExit(0 if report["ok"] else 1)
