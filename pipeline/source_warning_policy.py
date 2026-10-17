"""Add and audit companion-only warning decisions without changing source or analysis."""
from __future__ import annotations

import argparse
from copy import deepcopy
import json
import math
from pathlib import Path

from .common import ROOT, checked_path, read_json, sha256_bytes, sha256_file, validate_schema, write_json

DOCUMENT = "OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc"
BASELINE = "reviews/introduction_source_warning_baseline.json"
DECISIONS = ROOT / "Analysis" / "introduction" / "source_warning_decisions.json"
REPORT = "reports/page_analysis_introduction.json"
PRIORITY = {"NO_WARNING": 0, "INFO_WARNING": 1, "CORRECTION_WARNING": 2}


def object_hash(value):
    return sha256_bytes(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8"))


def capture_baseline(output):
    output = output.resolve()
    target = output / BASELINE
    if target.exists():
        return read_json(target)
    report = read_json(output / REPORT)
    specs = list((output / "documents").glob("*/pages/*/page_spec.json"))
    if any("source_warning" in read_json(p) for p in specs):
        raise ValueError("Impossibile acquisire una baseline precedente alla review: policy già presente.")
    immutable = {}
    for pdf in ROOT.glob("*.pdf"):
        immutable[str(pdf.relative_to(ROOT)).replace("\\", "/")] = sha256_file(pdf)
    for parent in [output / "documents", output / "analysis", ROOT / "Analysis" / "introduction"]:
        for path in parent.rglob("*"):
            if path.is_file() and path.name != "page_spec.json" and "__pycache__" not in path.parts and path != DECISIONS:
                immutable[path.relative_to(ROOT).as_posix()] = sha256_file(path)
    historical_doc = ROOT / "Docs" / "INTRODUCTION_PAGE_ANALYSIS_AUDIT.md"
    immutable[historical_doc.relative_to(ROOT).as_posix()] = sha256_file(historical_doc)
    baseline = {"document_id": DOCUMENT, "source_pdf_sha256": report["source_pdf"]["sha256"],
        "immutable_files": immutable,
        "page_specs": {p.relative_to(output).as_posix(): {"file_sha256": sha256_file(p), "original_object_sha256": object_hash(read_json(p)), "analysis_sha256": object_hash(read_json(p)["analysis"])} for p in specs},
        "report_before": report}
    write_json(target, baseline)
    return baseline


def effective_companion_plan(page):
    """Return design metadata only; the stored analysis and source_math remain untouched."""
    result = page["analysis"]["result"]
    plan = deepcopy(result["didactic_plan"])
    warning = page.get("source_warning")
    if warning:
        for override in warning["companion_overrides"]:
            tokens = override["path"].lstrip("/").split("/")
            current = plan
            for token in tokens[:-1]:
                current = current[int(token)] if isinstance(current, list) else current[token]
            last = int(tokens[-1]) if isinstance(current, list) else tokens[-1]
            current[last] = deepcopy(override["value"])
    return plan


def validate_warning(page):
    warning = page["source_warning"]
    validate_schema(warning, "source-warning.schema.json")
    if object_hash(page["analysis"]) != warning["original_analysis_sha256"]:
        raise ValueError("Analisi originale modificata durante la source warning review.")
    original_issues = page["analysis"]["result"]["uncertainties"]
    indexes = [issue["source_issue_index"] for issue in warning["issues"]]
    if sorted(indexes) != list(range(len(original_issues))):
        raise ValueError("Occorre esattamente una decisione per ogni source_issue originale.")
    highest = max((issue["type"] for issue in warning["issues"]), key=PRIORITY.get)
    if warning["type"] != highest:
        raise ValueError("Tipo di pagina diverso dalla massima severità delle issue.")
    for issue in warning["issues"]:
        for pointer in issue["source_references"]:
            if not pointer.startswith("/analysis/result/"):
                raise ValueError("Riferimento sorgente esterno all'analisi originale.")
            current = page
            try:
                for token in pointer.lstrip("/").split("/"):
                    current = current[int(token)] if isinstance(current, list) else current[token]
            except (KeyError, IndexError, TypeError, ValueError) as error:
                raise ValueError(f"Riferimento sorgente inesistente: {pointer}") from error
        if issue["short_warning"] and len(issue["short_warning"].split()) > 20:
            raise ValueError(f"Warning oltre 20 parole: {issue['issue_id']}")
        visible = issue["type"] != "NO_WARNING"
        if issue["ui"]["show"] != visible or (visible and issue["ui"]["color"] != "red"):
            raise ValueError("Policy visuale non coerente con il tipo di issue.")
        if visible and (not issue["ui"]["placement"] or not issue["ui"]["when"]):
            raise ValueError("Specificare dove e quando mostrare il breve warning.")
        if issue["type"] != "CORRECTION_WARNING" and (issue["use_corrected_value_for_examples"] or issue["use_corrected_value_for_simulation"]):
            raise ValueError("Una semplice nota o variante tipografica non è una correzione di formula.")
        if issue["type"] == "CORRECTION_WARNING":
            if not issue["short_warning"].startswith("⚠ Warning: possibile errore nella slide originale."):
                raise ValueError("Prefisso di correzione mancante.")
            if issue["corrected_expression"] == issue["source_expression"]:
                raise ValueError("Correzione uguale al source literal.")
    derived = effective_companion_plan(page)
    if derived["source_math"] != page["analysis"]["result"]["didactic_plan"]["source_math"]:
        raise ValueError("Una policy non può riscrivere source_math.")
    validate_schema(derived, "didactic-plan.schema.json")


def corrected_math_checks():
    """Only corrected formulas; never evaluate the known erroneous source formulas."""
    checks = []
    for w1, w2, e1, e2 in [(1, 4, 1, 1), (2, 7, -2, .5), (0, 4, 3, 2)]:
        matrix = sum(e * w * e for e, w in zip([e1, e2], [w1, w2])) / 2
        expanded = .5 * w1 * e1**2 + .5 * w2 * e2**2
        checks.append({"page": 16, "check": "Espansione corretta uguale al prodotto matriciale", "computed": expanded, "reference": matrix,
                       "ok": math.isclose(matrix, expanded, abs_tol=1e-12)})
    checks.append({"page": 16, "check": "Esempio corretto W=diag(1,4), z=(1,1), zbar=0", "computed": .5 * 1 + .5 * 4,
                   "reference": 2.5, "ok": .5 * 1 + .5 * 4 == 2.5})
    for horizon in [1, 2, 5]:
        inputs = list(range(horizon))
        states = list(range(1, horizon + 1))
        checks.append({"page": 30, "check": f"T={horizon}: ingressi 0…T−1 e quote 1…T", "input_indices": inputs, "state_indices": states,
            "ok": len(inputs) == len(states) == horizon and inputs[0] == 0 and inputs[-1] == horizon - 1 and horizon not in inputs and states[-1] == horizon})
    for angle in [0, math.pi / 6, -math.pi / 4]:
        mass, length, gravity = 1., 1., 9.81
        velocity = 0.
        torque = mass * gravity * length * math.sin(angle)
        residuals = [velocity, -gravity / length * math.sin(angle) + torque / (mass * length**2)]
        checks.append({"page": 34, "check": "Equilibrio con x₂,e=0 e ue=mgℓ sinθe", "angle": angle, "torque": torque,
            "dynamics_residuals": residuals, "ok": all(abs(r) < 1e-12 for r in residuals)})
    return checks


def review_summary(output):
    output = output.resolve()
    baseline = read_json(output / BASELINE)
    rows, errors, page_types = [], [], {}
    for row in baseline["report_before"]["pages"]:
        if row["status"] != "needs_review":
            continue
        page = read_json(output / row["spec_path"])
        if "source_warning" not in page:
            errors.append(f"Pagina {row['physical_page']}: policy mancante")
            continue
        validate_warning(page)
        page_types[row["physical_page"]] = page["source_warning"]["type"]
        for issue in page["source_warning"]["issues"]:
            rows.append({"page": row["physical_page"], **deepcopy(issue)})
    changed_immutable = [relative for relative, digest in baseline["immutable_files"].items()
                         if not checked_path(ROOT, relative).is_file() or sha256_file(checked_path(ROOT, relative)) != digest]
    if changed_immutable:
        errors.append(f"File immutabili alterati: {changed_immutable}")
    changed_original_specs = []
    untouched_specs = 0
    reviewed_paths = {row["spec_path"] for row in baseline["report_before"]["pages"] if row["status"] == "needs_review"}
    for relative, before in baseline["page_specs"].items():
        page = read_json(output / relative)
        if relative not in reviewed_paths:
            if "source_warning" in page or sha256_file(output / relative) != before["file_sha256"]:
                errors.append(f"PAGE_SPEC fuori dallo scope modificato: {relative}")
            else:
                untouched_specs += 1
        page.pop("source_warning", None)
        if object_hash(page) != before["original_object_sha256"]:
            changed_original_specs.append(relative)
    if changed_original_specs:
        errors.append(f"Campi PAGE_SPEC preesistenti alterati: {changed_original_specs}")
    checks = corrected_math_checks()
    errors.extend(c["check"] for c in checks if not c["ok"])
    classifications = {
        "PAGES_WITH_CORRECTION_WARNING": sorted(n for n, t in page_types.items() if t == "CORRECTION_WARNING"),
        "PAGES_WITH_INFO_WARNING": sorted(n for n, t in page_types.items() if t == "INFO_WARNING"),
        "PAGES_WITH_NO_WARNING_AFTER_REVIEW": sorted(n for n, t in page_types.items() if t == "NO_WARNING")
    }
    expected_issues = sum(len(r["source_issues"]) for r in baseline["report_before"]["pages"] if r["status"] == "needs_review")
    unresolved = expected_issues - sum(issue["resolved"] for issue in rows)
    ready = not errors and unresolved == 0 and len(page_types) == 11
    return {"phase": "F03 — SOURCE WARNING POLICY", "policy_version": "1.0.0", "scope": "companion_only",
        "source_pdf_immutable": not changed_immutable, "original_analysis_immutable": not changed_original_specs,
        "immutable_file_count": len(baseline["immutable_files"]), "original_page_specs_checked": len(baseline["page_specs"]),
        "untouched_page_specs_byte_identical": untouched_specs,
        "reviewed_pages": sorted(page_types), "reviewed_issue_count": len(rows),
        "page_classification_rule": "Massima severità per pagina; le tre liste sono disgiunte.",
        **classifications, "UNRESOLVED_ISSUES": unresolved, "READY_FOR_COMPANION_DESIGN": "YES" if ready else "NO",
        "corrected_formula_checks": checks, "issues": rows, "errors": errors,
        "historical_analysis_baseline": BASELINE,
        "design_input_rule": "Usare effective_companion_plan e le espressioni companion della policy. Il PDF e analysis.result restano sorgenti/analisi storiche immutabili.",
        "legacy_numeric_checks_retired": [{"page": 16, "check": "Costo matriciale e riga letterale con refuso",
            "reason": "Non ricalcolare valori dal refuso. Il dato precedente resta soltanto nell'archivio della prima analisi."}]}


def attach_review_to_report(report, output):
    summary = review_summary(output)
    report["source_warning_review"] = summary
    for key in ["PAGES_WITH_CORRECTION_WARNING", "PAGES_WITH_INFO_WARNING", "PAGES_WITH_NO_WARNING_AFTER_REVIEW", "UNRESOLVED_ISSUES", "READY_FOR_COMPANION_DESIGN"]:
        report[key] = summary[key]
    report["ready_for_companion_design"] = summary["READY_FOR_COMPANION_DESIGN"] == "YES"
    report["unresolved_source_issues_after_warning_review"] = summary["UNRESOLVED_ISSUES"]
    report["original_source_review_flags_are_historical"] = True
    baseline_rows = {r["physical_page"]: r for r in read_json(output / BASELINE)["report_before"]["pages"]}
    for row in report["pages"]:
        number = row["physical_page"]
        page = read_json(output / row["spec_path"])
        if "source_warning" in page:
            row["spec_sha256_before_source_warning_review"] = baseline_rows[number]["spec_sha256"]
            row["spec_sha256"] = sha256_file(output / row["spec_path"])
            row["source_warning"] = deepcopy(page["source_warning"])
    # Archive retained in baseline; current report contains corrected numerical checks only.
    corrected_cost = .5 * 1 * 1**2 + .5 * 4 * 1**2
    matrix_cost = sum(e * w * e for e, w in zip([1, 1], [1, 4])) / 2
    for index, check in enumerate(report["numerical_enrichment_checks"]):
        if check["physical_page"] == 16:
            report["numerical_enrichment_checks"][index] = {"physical_page": 16,
                "check": "Costo corretto: forma matriciale e sviluppo con w₂", "origin": "enrichment",
                "computed": [matrix_cost, corrected_cost], "expected": [2.5, 2.5], "tolerance": 1e-8,
                "ok": all(math.isclose(value, 2.5, abs_tol=1e-8) for value in [matrix_cost, corrected_cost])}
    report["ok"] = bool(report["ok"] and not summary["errors"])
    return report


def render_review_doc(summary):
    lines = [
        "# F03 — Source warning policy: Introduction to Optimal Control", "",
        "Revisione delle 13 issue presenti nelle 11 pagine needs_review. Il PDF originale, le immagini, il testo estratto, le formule e tutta l'analisi precedente rimangono immutabili.",
        "Le decisioni sono aggiunte in source_warning. La companion futura usa le espressioni e le proposte effettive della policy; il lettore PDF mostra sempre la fonte originale.", "",
        "Le liste finali classificano ogni pagina secondo la massima severità delle sue issue e sono disgiunte. Le singole issue NO_WARNING delle pagine 17 e 34 restano visibili nella tabella, senza eliminare gli altri avvisi di quelle pagine.", "",
        "## Policy per lo studente", "",
        "- CORRECTION_WARNING: piccolo avviso rosso vicino alla sola espressione interessata, con il testo short_warning.",
        "- INFO_WARNING: nota rossa breve solo nel punto in cui chiarisce la notazione o il grafico.",
        "- NO_WARNING: nessun avviso; i dettagli tipografici restano nei metadata.",
        "- Le motivazioni tecniche non vengono mostrate nella UI. Niente lunghi pannelli editoriali.",
        "- source_math è esclusivamente una trascrizione della fonte: non è l'input automatico dei calcoli. In caso di correzione, corrected_expression e calculation_policy sono vincolanti per tutti i risultati della companion.",
        "- Esempi, grafici e simulazioni usano sempre la formula corretta. Sono escluse le vecchie proposte di calcolo/confronto numerico del refuso di pagina 16 e del residuo errato di pagina 34.", "",
        "## Verifica matematica dei tre casi principali", "",
        "**Pagina 16.** Per e=z−z̄ e W=diag(w₁,w₂), eᵀWe=w₁e₁²+w₂e₂². Il secondo coefficiente stampato w₁ è quindi un refuso. La companion usa ½w₁e₁²+½w₂e₂². Con W=diag(1,4), e=(1,1), il costo corretto è 2.5. Non si calcola né si visualizza il valore della riga errata.", "",
        "**Pagina 30.** Lo stack definito a pagina 10 contiene u₀,…,u_{T−1}, e T transizioni richiedono esattamente questi T ingressi. Si impongono le saturazioni per t=0,…,T−1. I limiti di quota del caso illustrato restano su t=1,…,T: x_T ha un limite di stato esplicito, mentre u_T non viene creato. La condizione iniziale è un dato separato; non si estende implicitamente il dominio dei vincoli. Il caso T=1 usa u₀ e lo stato previsto x₁.", "",
        "**Pagina 34.** Dalla dinamica di pagina 33, ẋ₁=x₂, la prima condizione di equilibrio è x₂,e=0. La seconda dà u_e=mgℓ sinθ_e interpretando l e ℓ come la stessa lunghezza fisica. Non serve imporre θ_e=0: gli equilibri possono avere angolo generico e coppia non nulla. Questa verifica concorda con lo stato (θ_e,0) già mostrato nella fonte.", "",
        "## Altre decisioni", "",
        "d/n a pagina 14 sono letti come una sola dimensione; a pagina 19 ogni transizione usa la propria f_t; a pagina 22 viene dichiarato x₀^{des}=x⁰ come default degli esempi. Sono chiarimenti informativi, non nuove affermazioni attribuite alla fonte.",
        "La figura di pagina 17 è qualitativa: i grafici numerici seguono la disequazione, con ellisse centrata nell'origine e assi coordinati solo nel caso a,b,c>0. La pagina 26 usa il modello planare effettivamente scritto; il riferimento al 3D non autorizza una terza coordinata.",
        "X/Z, parentesi ridondanti e varianti l/ℓ, m/M non richiedono allarmi allo studente. Per il pendolo si usa un unico parametro di lunghezza e uno di massa, conservando i glifi della fonte nelle trascrizioni. La scelta è tecnica e locale al pendolo, non un'uguaglianza globale fra simboli dell'intero corso.", "",
        "## Integrità e tracciabilità", "",
        f"Verificati {summary['immutable_file_count']} file immutabili e i campi preesistenti di {summary['original_page_specs_checked']} PAGE_SPEC. Ogni issue rimanda al proprio indice nelle incertezze originali e ai riferimenti sorgente. I risultati della prima analisi non sono riscritti.",
        f"Controlli delle formule corrette: {sum(c['ok'] for c in summary['corrected_formula_checks'])}/{len(summary['corrected_formula_checks'])}. Nessun controllo valuta consapevolmente la formula errata.",
        "Le priorità della policy sostituiscono solo gli input della progettazione futura. I vecchi flag needs_review e blocking restano come storia dell'analisi; le issue sono risolte per il design mediante le decisioni qui registrate. READY_FOR_COMPANION_DESIGN non autorizza o dichiara completata l'implementazione.", "",
        "## Tabella finale", "",
        "| PAGE | ISSUE | WARNING TYPE | SOURCE | COMPANION USES | SHORT WARNING |",
        "| ---: | --- | --- | --- | --- | --- |"
    ]
    def cell(value):
        return str(value or "—").replace(r"\|", "∥").replace("|", "\\|").replace("\n", " ")
    for issue in summary["issues"]:
        lines.append("| " + " | ".join(cell(value) for value in [issue["page"], issue["issue"], issue["type"], issue["source_expression"], issue["companion_uses"], issue["short_warning"]]) + " |")
    lines.append("")
    for key in ["PAGES_WITH_CORRECTION_WARNING", "PAGES_WITH_INFO_WARNING", "PAGES_WITH_NO_WARNING_AFTER_REVIEW", "UNRESOLVED_ISSUES", "READY_FOR_COMPANION_DESIGN"]:
        lines.append(f"{key} = {summary[key]}")
        lines.append("")
    return "\n".join(lines)


def apply_review(output):
    output = output.resolve()
    baseline = capture_baseline(output)
    decisions = read_json(DECISIONS)
    before_rows = {r["physical_page"]: r for r in baseline["report_before"]["pages"]}
    expected = {r["physical_page"] for r in before_rows.values() if r["status"] == "needs_review"}
    if {entry["page"] for entry in decisions} != expected:
        raise ValueError("Le decisioni non coprono esattamente le pagine needs_review.")
    prepared = []
    for entry in decisions:
        relative = before_rows[entry["page"]]["spec_path"]
        page = read_json(output / relative)
        warning = {key: deepcopy(value) for key, value in entry.items() if key != "page"}
        warning["original_analysis_sha256"] = baseline["page_specs"][relative]["analysis_sha256"]
        page["source_warning"] = warning
        validate_schema(page, "page-spec.schema.json")
        validate_warning(page)
        prepared.append((output / relative, page))
    for path, page in prepared:
        write_json(path, page)
    report = attach_review_to_report(read_json(output / REPORT), output)
    if report["source_warning_review"]["errors"]:
        raise ValueError("; ".join(report["source_warning_review"]["errors"]))
    write_json(output / REPORT, report)
    (ROOT / "Docs" / "INTRODUCTION_SOURCE_WARNING_REVIEW.md").write_text(render_review_doc(report["source_warning_review"]), encoding="utf-8")
    return report["source_warning_review"]


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["snapshot", "apply", "audit"])
    parser.add_argument("--output", type=Path, default=Path("Data"))
    args = parser.parse_args()
    if args.command == "snapshot":
        result = capture_baseline(args.output)
        print(f"Baseline: {len(result['immutable_files'])} file, {len(result['page_specs'])} PAGE_SPEC.")
    else:
        summary = apply_review(args.output) if args.command == "apply" else review_summary(args.output)
        print(json.dumps({key: summary[key] for key in ["PAGES_WITH_CORRECTION_WARNING", "PAGES_WITH_INFO_WARNING", "PAGES_WITH_NO_WARNING_AFTER_REVIEW", "UNRESOLVED_ISSUES", "READY_FOR_COMPANION_DESIGN", "errors"]}, ensure_ascii=False, indent=2))
        raise SystemExit(1 if summary["errors"] else 0)
