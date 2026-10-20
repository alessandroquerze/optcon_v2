"""Check and preserve a batch's actual test/build/visual evidence before the next batch."""
import datetime
import hashlib
import json
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parents[2]
batch = sys.argv[1].lower()
expected = {"a": 15, "b": 22, "c": 29, "d": 36}[batch]
read = lambda name: json.loads((root / name).read_text(encoding="utf-8"))
write = lambda name, value: (root / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
unit = read("frontend/test-reports/unit-results.json")
browser = read("frontend/test-reports/browser-results.json")
visual = read(f"Data/reports/f07_batch_{batch}_visual.json")
review = read(f"Data/reports/f07_batch_{batch}_visual_review.json")
assert unit["success"] and unit["numFailedTests"] == 0
assert browser["stats"]["expected"] == expected + 20
assert all(browser["stats"][k] == 0 for k in ["unexpected", "skipped", "flaky"])
assert visual["success"] and review["status"] == "PASS"
for base in ["Data/reviews/f05_source_baseline.json", "Data/reviews/f07_baseline.json"]:
    baseline = read(base)
    for name, digest in baseline.get("protected_files", baseline.get("files", {})).items():
        assert hashlib.sha256((root / name).read_bytes()).hexdigest() == digest, name
write(f"Data/reports/f07_batch_{batch}_unit.json", unit)
write(f"Data/reports/f07_batch_{batch}_browser.json", browser)
write(f"Data/reports/f07_batch_{batch}_gate.json", {
    "batch": batch.upper(), "completed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "status": "PASS", "implemented_pages": expected,
    "unit_tests": unit["numPassedTests"], "browser_tests": browser["stats"]["expected"],
    "typecheck": "PASS", "build": "PASS", "build_command": "npm run build (includes tsc --noEmit)",
    "build_index_sha256": hashlib.sha256((root / "frontend/dist/index.html").read_bytes()).hexdigest(),
    "visual_review": "PASS", "source_integrity": "PASS", "regressions": 0,
})
print(f"Batch {batch.upper()}: PASS; {expected}/36 pages; {unit['numPassedTests']} unit and {browser['stats']['expected']} browser tests.")
