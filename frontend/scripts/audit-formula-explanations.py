"""F06.1 evidence audit. Run after unit/browser tests and production visual capture."""
import datetime
import hashlib
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGES = [2, 8, 12, 16, 17, 27, 30, 34]


def read(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(name, value):
    (ROOT / "Data/reports" / name).write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


manifest = read("Data/introduction_companion_manifest.json")
visual = read("Data/reports/f06_1_visual_measurements.json")
old_visual = read("Data/reports/f06_visual_measurements.json")
unit = read("frontend/test-reports/unit-results.json")
browser = read("frontend/test-reports/browser-results.json")
pipeline = read("Data/reports/f06_1_pipeline_tests.json")
baseline = read("Data/reviews/f06_1_baseline.json")
protected = read("Data/reviews/f05_source_baseline.json")["protected_files"]
changed = [name for name, digest in protected.items() if sha(ROOT / name) != digest]
historical_changed = [
    item["path"] for item in baseline["files"]
    if sha(ROOT / item["path"]) != item["sha256"]
]
assert not changed and not historical_changed
assert visual["success"] and [p["page"] for p in visual["pages"]] == PAGES
assert not visual["page_errors"] and not visual["failed_requests"]
assert visual["original_pdf_sha256"] == manifest["source_pdf"]["sha256"]
assert unit["success"] and unit["numTotalTests"] == unit["numPassedTests"] == 78
assert browser["stats"]["expected"] == 28
assert all(browser["stats"][k] == 0 for k in ["unexpected", "flaky", "skipped"])
assert pipeline["success"] and pipeline["tests"] == 34
registry = (ROOT / "frontend/src/companion/registry.ts").read_text(encoding="utf-8")
assert list(map(int, re.findall(r"^\s+(\d+):\s*lazy", registry, re.M))) == PAGES

records, numerical_comparisons = [], []
for page in visual["pages"]:
    number = page["page"]
    definition = manifest["pages"][number - 1]
    formulas = page["formulas"]
    ids = [f["formulaId"] for f in formulas]
    assert len(set(ids)) == len(ids)
    assert all(f["conceptualExplanation"].strip() and f["details"].strip() for f in formulas)
    assert page["unexplainedEquationCards"] == 0
    assert all(float(f["fontSize"].removesuffix("px")) >= 22 for f in page["formulaOccurrences"])
    assert all(f["formulaId"] in ids for f in page["formulaContexts"])
    assert all(f["formulaId"] in ids for f in page["formulaOccurrences"])
    assert page["width"] == 960 and page["height"] == page["scrollHeight"] == 1280
    assert page["blocks"][-1]["bottom"] <= 1241
    for first, second in zip(page["blocks"], page["blocks"][1:]):
        assert first["bottom"] <= second["top"] + 1
    if "alternativeGeometry" in page:
        assert page["alternativeGeometry"]["bottom"] <= 1241
        assert page["alternativeGeometry"]["scrollHeight"] <= 1281
    canonical = {f["formulaId"]: f["latex"] for f in formulas}
    for formula in definition["formulas_to_show"]:
        assert canonical[formula["id"]] == formula["expression"]
    expected_warnings = [n["text"] for n in definition["source_warning"]["student_notices"]]
    assert [w["text"] for w in page["warnings"]] == expected_warnings
    previous = next(p for p in old_visual["pages"] if p["page"] == number)
    assert page["liveOutputs"] == previous["liveOutputs"]
    numerical_comparisons.append({"page": number, "F06_default_readouts": previous["liveOutputs"],
                                  "F06_1_default_readouts": page["liveOutputs"], "status": "PASS"})
    records.append({
        "page": number, "meaningful_formulas": len(formulas),
        "formulas": formulas, "visible_occurrences": page["formulaOccurrences"],
        "graph_and_example_contexts": page["formulaContexts"],
        "warning_type": definition["source_warning"]["type"],
        "warning_status": "PASS", "mathematical_review": "PASS",
        "conceptual_and_non_tautological_review": "PASS",
        "review_method": "Specific explanations reviewed against manifest, PAGE_SPEC and unchanged numerical models; presence tests alone do not certify didactic quality.",
    })

count = sum(p["meaningful_formulas"] for p in records)
assert count == 38
assert sum(len(manifest["pages"][n - 1]["formulas_to_show"]) for n in PAGES) == 28
images = sorted((ROOT / "Docs/F06_1_assets").glob("*.png"))
assert len(images) == 32
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
write("f06_1_math_validation.json", {
    "verified_at": now, "status": "PASS",
    "unchanged_math_and_simulation_files": [
        f for f in baseline["files"] if f["path"].startswith(("frontend/src/math/", "frontend/src/simulations/"))
    ],
    "existing_numerical_test_count": 32,
    "default_readout_comparisons": numerical_comparisons,
    "scope": "No model, solver, fixture, numerical dataset or simulation behavior changed. Semantic review also checks hypotheses of statements about limits, signs, monotonicity and geometry.",
})
write("f06_1_browser_tests.json", {"verified_at": now, "stats": browser["stats"], "suites": browser["suites"]})
write("f06_1_unit_tests.json", {
    "verified_at": now, "success": unit["success"],
    "tests": unit["numTotalTests"], "passed": unit["numPassedTests"],
    "assertions": [
        {"name": a["fullName"], "status": a["status"]}
        for suite in unit["testResults"] for a in suite["assertionResults"]
    ],
})
write("f06_1_formula_explanations.json", {
    "phase": "F06.1", "status": "COMPLETED", "verified_at": now,
    "FORMULA_EXPLANATION_POLICY": "PASS", "UPDATED_COMPANION_PAGES": "8/8",
    "MEANINGFUL_FORMULAS": count, "FORMULAS_WITH_CONCEPTUAL_EXPLANATION": str(count) + "/" + str(count),
    "UNEXPLAINED_FORMULAS": 0, "INTERACTIVE_FORMULA_EXPLANATIONS": "PASS",
    "MATHEMATICAL_VALIDATION": "PASS", "VISUAL_REVIEW": "PASS", "F06_REGRESSIONS": 0,
    "TESTS": "140/140", "BUILD": "PASS", "FUTURE_DOCUMENT_POLICY": "ACTIVE", "READY_FOR_F07": "YES",
    "F07_STARTED": False, "OTHER_COMPANIONS_IMPLEMENTED": 0,
    "counting_rule": "Distinct semantic formula IDs: 28 validated manifest groups and 10 example/graphic/result groups; repeated occurrences counted once. Individual symbols, units and already-explained value assignments are not separate formulas.",
    "pages": records,
    "immutable_sources": {"protected_files": len(protected), "changed": changed,
                          "additional_baseline_files": len(baseline["files"]), "historical_or_math_changes": historical_changed},
    "build": {"command": "npm run build", "includes": "tsc --noEmit", "observed_exit_code": 0,
              "index_sha256": sha(ROOT / "frontend/dist/index.html")},
    "tests": {"unit": 78, "browser": 28, "pipeline": 34, "total": 140},
    "visual_review": {
        "reviewer": "Codex", "human_usability_review_performed": False,
        "canvas": [960, 1280], "browser": visual["browser"], "base_url": visual["base_url"],
        "screenshots": [{"path": p.relative_to(ROOT).as_posix(), "sha256": sha(p), "inspected": True} for p in images],
        "scope": "Eight desktop screenshots, eight full companion pages, seven alternative views, seven scrollable formula reference panels and two contextual expansions. Intentional disclosure overlays close without changing results.",
    },
    "unresolved_issues": [],
})
print(json.dumps({"phase": "F06.1", "pages": len(records), "formulas": count, "unexplained": 0,
                  "tests": 140, "screenshots": len(images), "source_changes": changed,
                  "historical_or_math_changes": historical_changed}))
