from __future__ import annotations

from copy import deepcopy
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

import pymupdf

from pipeline.analysis import build_request, export_requests, import_result, load_corpus, validate_result
from pipeline.common import checked_path, read_json, write_json
from pipeline.ingest import decode_label, ingest
from pipeline.validate import audit


class PipelineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = TemporaryDirectory()
        cls.source = Path(cls.temporary.name)
        cls.output = cls.source / "artifacts"
        document = pymupdf.open()
        page = document.new_page(width=400, height=225)
        page.insert_text((20, 28), "Synthetic title", fontsize=16)
        page.insert_text((20, 70), "alpha beta gamma delta epsilon zeta eta theta iota kappa", fontsize=10)
        page.insert_text((20, 90), "one two three four five six seven eight nine ten", fontsize=10)
        snapshot = pymupdf.open(stream=document.tobytes(), filetype="pdf")
        document.insert_pdf(snapshot)
        document.insert_pdf(snapshot)
        document[2].draw_rect(pymupdf.Rect(260, 120, 320, 150), color=(1, 0, 0), fill=(1, 0, 0))
        other = document.new_page(width=400, height=225)
        other.insert_text((20, 28), "Unrelated title", fontsize=16)
        other.insert_text((20, 70), "different content unrelated subject distinct vocabulary", fontsize=10)
        document.new_page(width=400, height=225)  # Scanned/blank surrogate: no text layer.
        rotated = document.new_page(width=400, height=225)
        rotated.insert_text((20, 28), "Rotated title", fontsize=16)
        rotated.insert_text((20, 70), "some content for rotated geometry verification", fontsize=10)
        rotated.set_rotation(90)
        document.set_page_labels([{"startpage": 0, "prefix": "same-slide"},
                                  {"startpage": 3, "prefix": "different-slide"},
                                  {"startpage": 4, "prefix": "blank"},
                                  {"startpage": 5, "prefix": "rotated"}])
        document.save(cls.source / "fixture.pdf")
        snapshot.close()
        document.close()
        ingest(cls.source, cls.output)
        export_requests(cls.output)
        _, _, cls.pages = load_corpus(cls.output)
        cls.ordered = list(cls.pages.values())

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    def result_for(self, number=2):
        page = self.ordered[number - 1]
        request = build_request(self.output, page, self.pages)
        return {
            "protocol_version": "1.0.0", "request_sha256": request["request_sha256"],
            "page_id": page["page_id"], "pdf_sha256": page["source"]["pdf_sha256"],
            "artifact_sha256": {key: page["artifacts"][key]["sha256"] for key in ["text", "layout", "render"]},
            "agent": {"provider": "test", "model": "synthetic-fixture", "run_id": "test-only"},
            "inspection": {"text_page_ids": request["required_page_ids"], "layout_page_ids": request["required_page_ids"],
                           "image_page_ids": request["required_page_ids"], "source_content_treated_as_data": True},
            "title": "Synthetic observation", "observations": [
                {"id": "o1", "category": "structure", "description": "Synthetic test observation",
                 "evidence": {"page_id": page["page_id"], "modality": "both", "text_quote": "Synthetic title", "bbox": [10, 10, 200, 35]},
                 "confidence": .9}],
            "contextual_role": "Synthetic context check",
            "context_notes": [{"page_id": page["context"][key], "role": role, "note": "Synthetic neighbor inspection"}
                              for key, role in [("previous_page_id", "previous"), ("next_page_id", "next")]
                              if page["context"][key]],
            "notation": [], "uncertainties": [],
            "progression": {"assessment": "progressive", "related_page_ids": [r["page_id"] for r in page["relations"]],
                            "added": [], "removed": [], "changed": ["Synthetic visual comparison"],
                            "observation_ids": ["o1"], "rationale": "Synthetic fixture only"},
            "coverage": {"all_visible_regions_accounted_for": True,
                         "regions": [{"bbox": [0, 0, 400, 225], "description": "Synthetic fixture region", "observation_ids": ["o1"]}]},
            "mapping_recommendation": {"mode": "one_to_one", "rationale": "Synthetic fixture", "subpages": []}}

    def test_full_coverage_and_no_analysis_fabricated(self):
        report = audit(self.output)
        self.assertTrue(report["ok"], report["errors"])
        self.assertEqual(report["validated_pages"], 6)
        self.assertFalse(report["companion_generation_enabled"])
        self.assertFalse(report["all_pages_individually_analyzed"])

    def test_frontend_generated_pdf_copies_are_not_source_documents(self):
        copies = [self.source / "frontend" / directory / "course-assets" / "fixture.pdf"
                  for directory in ["public", "dist"]]
        try:
            for copy in copies:
                copy.parent.mkdir(parents=True, exist_ok=True)
                copy.write_bytes((self.source / "fixture.pdf").read_bytes())
            catalog = ingest(self.source, self.output)
            self.assertEqual(catalog["document_count"], 1)
            self.assertEqual(catalog["page_count"], 6)
        finally:
            for copy in copies:
                copy.unlink(missing_ok=True)

    def test_exact_and_graphics_only_progression_are_separate(self):
        first, second, third = self.ordered[:3]
        relation = next(r for r in first["relations"] if r["page_id"] == second["page_id"])
        self.assertEqual(relation["kind"], "exact_duplicate")
        relation = next(r for r in second["relations"] if r["page_id"] == third["page_id"])
        self.assertEqual(relation["kind"], "progressive_candidate")
        self.assertEqual(relation["delta_in_physical_order"]["text"]["added_lines"], [])
        self.assertGreater(relation["delta_in_physical_order"]["visual"]["changed_pixel_fraction"], 0)
        self.assertIsNotNone(relation["delta_in_physical_order"]["visual"]["changed_bbox_px"])

    def test_unrelated_slide_not_merged(self):
        self.assertEqual(self.ordered[3]["relations"], [])

    def test_no_text_and_rotation_flagged(self):
        self.assertIn("no_text_layer_requires_visual_review_or_ocr", self.ordered[4]["identity"]["extraction_warnings"])
        rotated = self.ordered[5]
        self.assertEqual(rotated["source"]["geometry"]["rotation"], 90)
        self.assertEqual(rotated["artifacts"]["render"]["width_px"], 450)
        self.assertEqual(rotated["artifacts"]["render"]["height_px"], 800)

    def test_label_decode_and_page_boundaries(self):
        self.assertEqual(decode_label("<FEFF00330037>"), "37")
        self.assertIsNone(self.ordered[0]["context"]["previous_page_id"])
        self.assertIsNone(self.ordered[-1]["context"]["next_page_id"])

    def test_request_contains_actual_text_layout_and_image_attachments(self):
        request = build_request(self.output, self.ordered[1], self.pages)
        self.assertEqual(len(request["frames"]), 3)
        self.assertEqual(len(request["image_attachments"]), 3)
        self.assertTrue(all(frame["layout"]["blocks"] for frame in request["frames"]))
        self.assertTrue(all("Synthetic title" in frame["text"] for frame in request["frames"]))

    def test_result_rejects_missing_neighbor_and_visual_inspection(self):
        for kind in ["text_page_ids", "layout_page_ids", "image_page_ids"]:
            with self.subTest(kind=kind):
                result = self.result_for()
                result["inspection"][kind] = [result["page_id"]]
                with self.assertRaisesRegex(ValueError, "servono pagina"):
                    validate_result(result, self.ordered[1], self.pages, self.output)

    def test_result_rejects_stale_hash_and_invalid_evidence(self):
        for mutation in ["hash", "quote", "bbox", "context", "progression", "coverage", "unknown_field", "text_only"]:
            with self.subTest(mutation=mutation):
                result = self.result_for()
                if mutation == "hash":
                    result["request_sha256"] = "0" * 64
                elif mutation == "quote":
                    result["observations"][0]["evidence"]["text_quote"] = "not present in PDF"
                elif mutation == "bbox":
                    result["observations"][0]["evidence"]["bbox"] = [0, 0, 999, 999]
                elif mutation == "context":
                    result["context_notes"] = []
                elif mutation == "progression":
                    result["progression"]["related_page_ids"] = []
                elif mutation == "coverage":
                    result["coverage"]["regions"][0]["observation_ids"] = ["nonexistent"]
                elif mutation == "unknown_field":
                    result["companion_html"] = "forbidden"
                elif mutation == "text_only":
                    result["observations"][0]["evidence"]["modality"] = "text"
                with self.assertRaises(ValueError):
                    validate_result(result, self.ordered[1], self.pages, self.output)

    def test_result_rejects_artificial_subpage_mapping(self):
        result = self.result_for()
        result["mapping_recommendation"] = {"mode": "subpages", "rationale": "Synthetic overload",
                                            "subpages": [{"suffix": "b", "scope": "one"}, {"suffix": "d", "scope": "two"}]}
        with self.assertRaisesRegex(ValueError, "suffissi consecutivi"):
            validate_result(result, self.ordered[1], self.pages, self.output)

    def didactic_result(self):
        result = self.result_for()
        result["companionPageCount"] = 1
        result["didactic_plan"] = {
            "source_scope_limits": ["Synthetic scope limitation"], "prerequisites": [],
            "source_math": [{"latex": "z", "anchor": "Synthetic title", "notes": "Synthetic test only"}],
            "enrichments": [{"id": "e1", "label": "enrichment", "type": "conceptual_example",
                             "proposal": "Synthetic added example", "source_observation_ids": ["o1"]}],
            "examples": [{"id": "example", "origin": "enrichment", "purpose": "Synthetic purpose", "setup": "Synthetic setup",
                          "parameters": [], "derivation": [], "expected_outcome": "Synthetic result",
                          "limitations": ["Synthetic limitation"], "enrichment_id": "e1", "source_observation_ids": ["o1"]}],
            "example_omission_reason": None,
            "visualization": {"component": "SyntheticDiagram", "description": "Synthetic design", "origin": "source_derived", "source_observation_ids": ["o1"]},
            "interactivity": {"recommended": False, "rationale": "Static is sufficient", "component": None,
                              "parameters": [], "outputs": [], "invariants": [], "enrichment_id": None},
            "edge_cases": [{"case": "Synthetic case", "expected_behavior": "Synthetic behavior", "origin": "enrichment", "source_observation_ids": ["o1"]}],
            "expansion_rationale": "Single concept",
            "blueprint": [{"companion_suffix": None, "focus": "Synthetic focus", "source_observation_ids": ["o1"], "enrichment_ids": ["e1"]}]
        }
        return result

    def test_didactic_plan_accepts_explicit_enrichment(self):
        validate_result(self.didactic_result(), self.ordered[1], self.pages, self.output)

    def test_didactic_plan_rejects_untraceable_or_inconsistent_design(self):
        for mutation in ["missing_enrichment", "missing_math_anchor", "count", "future_prerequisite", "interaction", "blueprint"]:
            with self.subTest(mutation=mutation):
                result = self.didactic_result()
                plan = result["didactic_plan"]
                if mutation == "missing_enrichment":
                    plan["examples"][0]["enrichment_id"] = "unknown"
                elif mutation == "missing_math_anchor":
                    plan["source_math"][0]["anchor"] = "not in source"
                elif mutation == "count":
                    result["companionPageCount"] = 2
                elif mutation == "future_prerequisite":
                    plan["prerequisites"] = [{"concept": "Future", "why": "Invalid ordering", "origin": "source_context", "page_numbers": [3]}]
                elif mutation == "interaction":
                    plan["interactivity"]["recommended"] = True
                elif mutation == "blueprint":
                    plan["blueprint"][0]["enrichment_ids"] = ["unknown"]
                with self.assertRaises(ValueError):
                    validate_result(result, self.ordered[1], self.pages, self.output)

    def test_artifact_tamper_is_detected(self):
        path = checked_path(self.output, self.ordered[3]["artifacts"]["text"]["path"])
        previous = path.read_bytes()
        try:
            path.write_bytes(b"tampered")
            self.assertFalse(audit(self.output)["ok"])
        finally:
            path.write_bytes(previous)
        self.assertTrue(audit(self.output)["ok"])

    def test_paths_cannot_escape_artifact_root(self):
        with self.assertRaises(ValueError):
            checked_path(self.output, "../outside.json")

    def test_request_tamper_and_missing_task_are_detected(self):
        queue = self.output / "analysis" / "queue.jsonl"
        original_queue = queue.read_bytes()
        try:
            queue.write_bytes(original_queue.splitlines(keepends=True)[0])
            self.assertFalse(audit(self.output)["ok"])
        finally:
            queue.write_bytes(original_queue)
        row = json.loads(original_queue.splitlines()[0])
        request_path = checked_path(self.output, row["request_path"])
        original_request = request_path.read_bytes()
        try:
            packet = read_json(request_path)
            packet["image_attachments"] = []
            write_json(request_path, packet)
            self.assertFalse(audit(self.output)["ok"])
        finally:
            request_path.write_bytes(original_request)
        self.assertEqual(audit(self.output)["validated_requests"], 6)

    def test_valid_import_survives_idempotent_ingestion(self):
        result = self.result_for()
        result_path = self.source / "synthetic-result.json"
        write_json(result_path, result)
        self.assertEqual(import_result(self.output, result_path), "analyzed")
        render = checked_path(self.output, self.ordered[1]["artifacts"]["render"]["path"])
        before = render.stat().st_mtime_ns
        ingest(self.source, self.output)
        _, _, pages = load_corpus(self.output)
        self.assertEqual(pages[result["page_id"]]["analysis"]["result"], result)
        self.assertEqual(render.stat().st_mtime_ns, before)
        changed = deepcopy(result)
        changed["agent"]["run_id"] = "another-run"
        write_json(result_path, changed)
        with self.assertRaisesRegex(ValueError, "già un'analisi diversa"):
            import_result(self.output, result_path)


if __name__ == "__main__":
    unittest.main()
