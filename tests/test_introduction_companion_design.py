"""Review gates for design artifacts: source fidelity and F03/UI boundaries."""
from copy import deepcopy
import unittest

from pipeline.common import read_json
from pipeline.introduction_companion_design import TARGET, audit


class CompanionDesignReviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest=read_json(TARGET)

    def test_manifest_ready_and_originals_unchanged(self):
        result=audit(self.manifest)
        self.assertTrue(result["ok"], result["errors"])
        self.assertEqual(result["DESIGNED_PAGES"],"36/36")
        self.assertEqual(result["COMPANION_SUBPAGES"],0)
        self.assertEqual(result["INTERACTIVE_PAGES"]+result["STATIC_PAGES"],36)

    def test_matrix_and_aligned_row_separators_preserved(self):
        p16=self.manifest["pages"][15]
        matrix=next(f["expression"] for f in p16["formulas_to_show"] if f["id"]=="p16-source-math-2")
        self.assertIn(r"z_1\\z_2",matrix)
        self.assertIn(r"w_1&0\\0&w_2",matrix)
        p27=self.manifest["pages"][26]
        state=next(f["expression"] for f in p27["formulas_to_show"] if f["id"]=="p27-source-math-2")
        self.assertIn(r"p_{x,t}\\v_{x,t}\\p_{y,t}\\v_{y,t}\\\theta_t\\\omega_t",state)
        formula=self.manifest["pages"][35]["formulas_to_show"][0]["expression"]
        self.assertIn(r"\\&x(0)=x^0",formula)

    def test_known_wrong_second_weight_rejected(self):
        modified=deepcopy(self.manifest)
        formula=next(f for f in modified["pages"][15]["formulas_to_show"] if f["origin"]=="correction")
        formula["expression"]=formula["expression"].replace(r"\frac12w_2",r"\frac12w_1")
        result=audit(modified)
        self.assertFalse(result["ok"])
        self.assertFalse(result["checks"]["calculation_policy_16"]["ok"])
        self.assertFalse(result["checks"]["formula_provenance_and_corrections"]["ok"])

    def test_editorial_reason_cannot_be_added_to_student_notice(self):
        modified=deepcopy(self.manifest)
        modified["pages"][33]["source_warning"]["student_notices"][0]["correction_reason"]="Non destinato alla UI"
        result=audit(modified)
        self.assertFalse(result["checks"]["exact_f03_notice_text"]["ok"])

    def test_missing_physical_page_cannot_pass(self):
        modified=deepcopy(self.manifest)
        modified["pages"]=[p for p in modified["pages"] if p["source_page"]!=30]
        result=audit(modified)
        self.assertFalse(result["ok"])
        self.assertEqual(result["missing_pages"],[30])
        self.assertEqual(result["READY_FOR_VERTICAL_SLICE"],"NO")

    def test_control_default_outside_domain_cannot_pass(self):
        modified=deepcopy(self.manifest)
        modified["pages"][7]["controls"][0]["default"]=-1
        result=audit(modified)
        self.assertFalse(result["checks"]["p08-control-1_domain"]["ok"])


if __name__=="__main__":
    unittest.main()
