from copy import deepcopy
import unittest

from pipeline.common import ROOT, read_json
from pipeline.source_warning_policy import DOCUMENT, corrected_math_checks, effective_companion_plan, object_hash, review_summary, validate_warning


class SourceWarningPolicyTests(unittest.TestCase):
    def page(self, number):
        return read_json(ROOT / "Data" / "documents" / DOCUMENT / "pages" / f"{number:04d}" / "page_spec.json")

    def test_all_original_issues_resolved_with_immutable_source_and_analysis(self):
        summary = review_summary(ROOT / "Data")
        self.assertEqual(summary["errors"], [])
        self.assertEqual(summary["reviewed_issue_count"], 13)
        self.assertEqual(summary["untouched_page_specs_byte_identical"], 126)
        self.assertEqual(summary["UNRESOLVED_ISSUES"], 0)
        self.assertEqual(summary["READY_FOR_COMPANION_DESIGN"], "YES")
        self.assertEqual(summary["PAGES_WITH_CORRECTION_WARNING"], [16, 30, 34])
        self.assertEqual(summary["PAGES_WITH_INFO_WARNING"], [14, 17, 19, 22, 26])
        self.assertEqual(summary["PAGES_WITH_NO_WARNING_AFTER_REVIEW"], [31, 33, 36])

    def test_each_correction_uses_corrected_formula_for_both_purposes(self):
        for number in [16, 30, 34]:
            page = self.page(number)
            validate_warning(page)
            corrections = [i for i in page["source_warning"]["issues"] if i["type"] == "CORRECTION_WARNING"]
            self.assertEqual(len(corrections), 1)
            correction = corrections[0]
            self.assertTrue(correction["use_corrected_value_for_examples"])
            self.assertTrue(correction["use_corrected_value_for_simulation"])
            self.assertLessEqual(len(correction["short_warning"].split()), 20)
        self.assertIn(r"\frac12w_2(z_2", self.page(16)["source_warning"]["issues"][0]["corrected_expression"])
        self.assertIn(r"t=0,\ldots,T-1", self.page(30)["source_warning"]["issues"][0]["corrected_expression"])
        self.assertEqual(self.page(34)["source_warning"]["issues"][0]["corrected_expression"], "0=x_{2,e}")

    def test_effective_design_retires_wrong_computations_without_mutating_analysis(self):
        for number in [16, 34]:
            page = self.page(number)
            before = object_hash(page)
            effective = effective_companion_plan(page)
            self.assertEqual(object_hash(page), before)
            self.assertEqual(effective["source_math"], page["analysis"]["result"]["didactic_plan"]["source_math"])
            self.assertNotEqual(effective["examples"][0]["derivation"], page["analysis"]["result"]["didactic_plan"]["examples"][0]["derivation"])
        weighted = effective_companion_plan(self.page(16))
        self.assertFalse(any("riga letterale" in item.lower() for item in weighted["interactivity"]["outputs"]))
        equilibrium = effective_companion_plan(self.page(34))
        self.assertNotIn("residuo della riga letterale", equilibrium["interactivity"]["parameters"][0]["effect_on_change"])

    def test_purely_typographical_issues_do_not_generate_student_warnings(self):
        for number in [31, 33, 36]:
            warning = self.page(number)["source_warning"]
            self.assertEqual(warning["type"], "NO_WARNING")
            for issue in warning["issues"]:
                self.assertFalse(issue["ui"]["show"])
                self.assertIsNone(issue["short_warning"])
                self.assertIsNone(issue["corrected_expression"])

    def test_rejects_bad_provenance_missing_issue_or_unsafe_policy(self):
        for mutation in ["analysis", "missing_issue", "wrong_flag", "long_warning", "source_override", "bad_reference"]:
            with self.subTest(mutation=mutation):
                page = deepcopy(self.page(34))
                warning = page["source_warning"]
                if mutation == "analysis":
                    page["analysis"]["result"]["title"] = "modified"
                elif mutation == "missing_issue":
                    warning["issues"] = warning["issues"][:1]
                elif mutation == "wrong_flag":
                    warning["issues"][0]["use_corrected_value_for_examples"] = False
                elif mutation == "long_warning":
                    warning["issues"][0]["short_warning"] = " ".join(["word"] * 21)
                elif mutation == "source_override":
                    warning["companion_overrides"].append({"path": "/source_math/0/latex", "value": "changed"})
                elif mutation == "bad_reference":
                    warning["issues"][0]["source_references"] = ["/analysis/result/not_a_field"]
                with self.assertRaises(ValueError):
                    validate_warning(page)

    def test_corrected_math_checks_cover_boundary_horizon_and_nonzero_equilibria(self):
        rows = corrected_math_checks()
        self.assertTrue(all(row["ok"] for row in rows))
        self.assertEqual({row["page"] for row in rows}, {16, 30, 34})
        self.assertTrue(any(row["page"] == 30 and row["input_indices"] == [0] and row["state_indices"] == [1] for row in rows))
        self.assertTrue(any(row["page"] == 34 and row["angle"] != 0 for row in rows))


if __name__ == "__main__":
    unittest.main()
