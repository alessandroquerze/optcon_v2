"""F04.1 regression gates: preserve F04 and reject misleading 3D semantics."""
from copy import deepcopy
import unittest

from pipeline.common import read_json
from pipeline.introduction_visualization_audit import MANIFEST,BASELINE,audit,inherited_subset


class VisualizationAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest=read_json(MANIFEST)
        cls.baseline=read_json(BASELINE)

    def test_all_f04_values_preserved_and_current_audit_ready(self):
        self.assertEqual(inherited_subset(self.baseline["manifest"],self.manifest),[])
        result=audit(self.manifest,self.baseline)
        self.assertTrue(result["ok"],result["errors"])
        self.assertEqual(result["pages_with_3d"],27)
        self.assertEqual(result["effective_interactive_pages"],29)
        self.assertEqual(result["PAGES_GAINING_INTERACTIVITY_AFTER_AUDIT"],[6,14,24,28,32])

    def test_rewriting_f04_explanation_rejected(self):
        modified=deepcopy(self.manifest)
        modified["pages"][13]["learning_objective"]="Sostituzione del design F04"
        result=audit(modified,self.baseline)
        self.assertFalse(result["checks"]["f04_preserved_additively"]["ok"])
        self.assertEqual(result["READY_FOR_F05"],"NO")

    def test_out_of_plane_drone_coordinate_rejected(self):
        modified=deepcopy(self.manifest)
        modified["pages"][25]["visualization"]["visualizationSemantics"]["zAxis"]["symbol"]="p_z"
        result=audit(modified,self.baseline)
        self.assertFalse(result["checks"]["p26_planar_model"]["ok"])

    def test_undefined_third_dimension_rejected(self):
        modified=deepcopy(self.manifest)
        modified["pages"][15]["visualization"]["visualizationSemantics"]["zAxis"]=None
        result=audit(modified,self.baseline)
        self.assertFalse(result["checks"]["p16_semantics"]["ok"])

    def test_source_warning_cannot_gain_editorial_ui_text(self):
        modified=deepcopy(self.manifest)
        modified["pages"][33]["source_warning"]["student_notices"][0]["editorial_discussion"]="Testo non previsto"
        result=audit(modified,self.baseline)
        self.assertFalse(result["checks"]["f03_warning_and_calculation_contracts_exact"]["ok"])

    def test_native_three_d_cannot_be_deferred(self):
        modified=deepcopy(self.manifest)
        modified["GRAPHICS_REQUIREMENT"]="2D_FIRST_3D_LATER"
        result=audit(modified,self.baseline)
        self.assertFalse(result["checks"]["native_graphics_requirement"]["ok"])


if __name__=="__main__":
    unittest.main()
