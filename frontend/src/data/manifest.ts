import { z } from 'zod';

export const visualizationModeSchema = z.enum([
  'NONE', '2D_ONLY', '3D_PRIMARY', '2D_PRIMARY_WITH_3D', '3D_PRIMARY_WITH_2D', '2D_AND_3D_EQUAL',
]);
export type VisualizationMode = z.infer<typeof visualizationModeSchema>;
export const archetypeSchema = z.enum([
  'EXPLANATION', 'FORMULA_EXPLORER', 'GRAPH_AND_CONTROLS', 'SIMULATION',
  'WORKED_EXAMPLE', 'CONCEPT_SUMMARY', 'COMPARISON',
]);
export type Archetype = z.infer<typeof archetypeSchema>;
const axisSchema = z.object({
  symbol: z.string(), label: z.string(), unit: z.string(), role: z.string(), domain: z.string(),
}).passthrough();
const noticeSchema = z.object({
  issue_id: z.string(), component: z.enum(['WarningBanner', 'InfoNote']),
  text: z.string(), color: z.literal('red'), adjacent_to: z.string(), visible_when: z.string(),
});
export type StudentNotice = z.infer<typeof noticeSchema>;
const parameterSchema = z.object({
  id: z.string(), label: z.string(), symbol: z.string(), component: z.literal('ParameterControl'),
  domain: z.union([
    z.object({ min: z.number(), max: z.number(), step: z.number().positive(), integer: z.boolean() }),
    z.object({ choices: z.array(z.number()).min(1) }),
  ]),
  default: z.number(), unit: z.string(),
}).passthrough();
const relationSchema = z.object({ source_page: z.number().int().positive(), role: z.string() }).nullable();
const pageSchema = z.object({
  source_page: z.number().int().positive(), source_pdf_label: z.string(), page_id: z.string(),
  companionPageCount: z.number().int().positive(), title: z.string(),
  learning_objective: z.string(), prerequisite: z.array(z.object({
    concept: z.string(), why: z.string(), origin: z.enum(['enrichment', 'source_context']),
    page_numbers: z.array(z.number().int().positive()),
  })), key_ideas: z.array(z.string()),
  intuitive_explanation: z.string(), mathematical_explanation: z.string(),
  formulas_to_show: z.array(z.object({
    id: z.string(), expression: z.string(), origin: z.string(), reference: z.string(),
    computation_input: z.literal(false),
  }).passthrough()),
  worked_example: z.object({
    required: z.boolean(), omission_reason: z.string().nullable(), student_rendering: z.string(),
    items: z.array(z.object({
      id: z.string(), origin: z.string(), purpose: z.string(), setup: z.string(),
      parameters: z.array(z.object({ symbol: z.string(), value: z.string() })),
      derivation: z.array(z.string()), expected_outcome: z.string(), limitations: z.array(z.string()),
      enrichment_id: z.string(), source_observation_ids: z.array(z.string()),
      display_label: z.string(), mathematical_status: z.string(),
    })),
  }),
  controls: z.array(parameterSchema), expected_parameter_effects: z.array(z.object({
    control_id: z.string(), effect: z.string(), changes: z.array(z.string()),
    output_context: z.array(z.string()), invariants: z.array(z.string()), edge_cases: z.array(z.string()),
  })),
  edge_cases: z.array(z.object({
    case: z.string(), expected_behavior: z.string(), origin: z.string(), source_observation_ids: z.array(z.string()),
  })), takeaway: z.string(), reusable_components: z.array(z.string()),
  layout: z.object({
    archetype: archetypeSchema, visual_block_order: z.array(z.string()),
    blocks: z.array(z.object({ id: z.string(), max_height_design_px: z.number(), content: z.string() })),
  }).passthrough(),
  source_warning: z.object({
    type: z.enum(['NO_WARNING', 'INFO_WARNING', 'CORRECTION_WARNING']),
    student_notices: z.array(noticeSchema),
  }).passthrough(),
  visualization: z.object({
    visualizationMode: visualizationModeSchema,
    visualizationSemantics: z.object({
      xAxis: axisSchema.nullable(), yAxis: axisSchema.nullable(), zAxis: axisSchema.nullable(),
      zMeaning: z.string().nullable(), derivedDimension: z.boolean(),
      coordinateSpace: z.string(), physicalStateDimensionAdded: z.literal(false),
      physicalModelChanged: z.literal(false), explanation: z.string(),
      mathematicalDefinition: z.string().nullable(),
    }).passthrough(),
    threeDRequirements: z.object({
      enabled: z.boolean(), cameraControls: z.array(z.string()),
      coordinateReadout: z.boolean(), tooltip: z.boolean(), highlightCurrentPoint: z.boolean(),
      realtimeParameters: z.array(z.string()), parameterEffects: z.record(z.string(), z.string()),
      surface: z.object({
        enabled: z.boolean(), renderModes: z.array(z.string()), formula: z.string().nullable(),
        dataPolicy: z.string(), discontinuities: z.string(), contourProjection: z.string(),
      }),
      trajectory: z.object({
        enabled: z.boolean(), definition: z.string().nullable(), kind: z.string(),
        interpolation: z.string(), currentPoint: z.string(),
      }),
      vectors: z.object({ enabled: z.boolean(), reason: z.string() }),
      planes: z.array(z.string()), projections: z.array(z.string()),
      animation: z.object({
        enabled: z.boolean(), kind: z.string(), semantics: z.string(), controls: z.array(z.string()),
        onParameterChange: z.string().nullable(),
      }),
      discontinuityHandling: z.object({
        breakpoints: z.array(z.union([z.number(), z.string()])), connectAcrossBreaks: z.boolean(),
        rightBranchIncludesBreakpoint: z.boolean(), appliesTo: z.string(),
      }),
    }).passthrough(),
    twoDRequirements: z.object({
      enabled: z.boolean(), plotType: z.string(), axes: z.array(z.string()),
      realtimeParameters: z.array(z.string()), projectionOf3D: z.boolean(),
      relationshipTo3D: z.string(), preserveF04Readout: z.boolean(),
    }).passthrough(),
    presentation: z.object({
      strategy: z.string(), defaultView: z.enum(['2D','3D']), toggle: z.array(z.string()),
      sameDataAndParameters: z.literal(true),
      camera: z.object({
        projection: z.enum(['orthographic', 'perspective']), initialAzimuthDeg: z.number(), initialElevationDeg: z.number(),
        resetOnlyCamera: z.literal(true), unitsWarning: z.string(), zeroRangePolicy: z.string(),
      }),
    }).passthrough(),
    auditControls: z.array(z.object({
      id: z.string(), symbol: z.string(), min: z.number(), max: z.number(),
      default: z.number(), unit: z.string(), integer: z.boolean(), effect: z.string(),
    }).passthrough()),
    reusableVisualizationComponents: z.array(z.string()),
  }).passthrough(),
  interaction: z.object({ enabled: z.boolean(), effective_enabled: z.boolean() }).passthrough(),
  relation_to_previous_page: relationSchema, relation_to_next_page: relationSchema,
  estimated_density: z.object({
    level: z.enum(['LOW', 'MEDIUM', 'HIGH']), rationale: z.string(), needs_typographic_validation: z.boolean(),
  }),
}).passthrough();
export const manifestSchema = z.object({
  schema_version: z.string(), document_id: z.string(), source_page_count: z.number().int().positive(),
  GRAPHICS_REQUIREMENT: z.literal('FULL_2D_AND_3D_SUPPORT'),
  '3D_VISUALIZATION_POLICY': z.string().min(30),
  source_pdf: z.object({ path: z.string(), filename: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/) }),
  pages: z.array(pageSchema),
  proposed_vertical_slice: z.array(z.object({ source_page: z.number().int() }).passthrough()),
  visual_layout_system: z.object({
    canvas_design_px: z.object({ width: z.number(), height: z.number() }),
    min_display_width_px: z.number(),
  }).passthrough(),
  warning_handling: z.object({
    correction_pages: z.array(z.number()), info_pages: z.array(z.number()),
    technical_fields_never_rendered: z.literal(true),
    never_compute_known_erroneous_expression: z.literal(true),
  }).passthrough(),
  visualization_architecture: z.object({
    canonicalVisualizationComponentCount: z.literal(9),
    canonicalComponents: z.array(z.object({ name: z.string() }).passthrough()).length(9),
  }).passthrough(),
}).passthrough().superRefine((m, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (m.pages.length !== m.source_page_count ||
      m.pages.some((p, i) => p.source_page !== i + 1) ||
      new Set(m.pages.map(p => p.page_id)).size !== m.pages.length) fail('Mapping fisico incompleto o duplicato.');
  for (const p of m.pages) {
    const is3D = p.visualization.visualizationMode.includes('3D');
    if (is3D !== p.visualization.threeDRequirements.enabled ||
        (is3D && !p.visualization.visualizationSemantics.zAxis)) fail('Semantica 3D mancante.');
    if (p.source_warning.type === 'NO_WARNING' && p.source_warning.student_notices.length) fail('NO_WARNING non può avere avvisi UI.');
  }
  for (const [kind, expected] of [
    ['CORRECTION_WARNING', m.warning_handling.correction_pages],
    ['INFO_WARNING', m.warning_handling.info_pages],
  ] as const) {
    const actual = m.pages.filter(p => p.source_warning.type === kind).map(p => p.source_page);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) fail('Warning F03 non allineati.');
  }
});
export type CompanionDefinition = z.infer<typeof pageSchema>;
export type CompanionManifest = z.infer<typeof manifestSchema>;
export interface ManifestRepository {
  manifest: CompanionManifest;
  pageCount: number;
  bySourcePage: ReadonlyMap<number, CompanionDefinition>;
  verticalSlicePages: ReadonlySet<number>;
  pdfUrl: string;
  getPage: (sourcePage: number) => CompanionDefinition;
}
export function parseManifest(value: unknown): ManifestRepository {
  const manifest = manifestSchema.parse(value);
  const bySourcePage = new Map(manifest.pages.map(p => [p.source_page, p]));
  return {
    manifest, pageCount: manifest.source_page_count, bySourcePage,
    verticalSlicePages: new Set(manifest.proposed_vertical_slice.map(p => p.source_page)),
    pdfUrl: import.meta.env.BASE_URL + 'course-assets/' + encodeURIComponent(manifest.source_pdf.filename),
    getPage(sourcePage) {
      const page = bySourcePage.get(sourcePage);
      if (!page) throw new RangeError('Pagina sorgente non presente nel manifest.');
      return page;
    },
  };
}
let pending: Promise<ManifestRepository> | undefined;
export function loadManifest(): Promise<ManifestRepository> {
  return pending ??= fetch(import.meta.env.BASE_URL + 'course-assets/manifest.json')
    .then(response => {
      if (!response.ok) throw new Error('Manifest non caricato (' + response.status + ').');
      return response.json();
    }).then(parseManifest).catch(error => { pending = undefined; throw error; });
}
/** Explicit UI projection: technical metadata cannot be spread into a banner. */
export function studentNotices(page: CompanionDefinition): StudentNotice[] {
  return page.source_warning.student_notices.map(notice => noticeSchema.parse(notice));
}
