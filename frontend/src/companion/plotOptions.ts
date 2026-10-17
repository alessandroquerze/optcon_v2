import type { CompanionDefinition } from '../data/manifest';
import type { AxisDefinition } from '../numeric-data/types';
export function semanticAxes(definition: CompanionDefinition): readonly [AxisDefinition, AxisDefinition, AxisDefinition] {
  const { xAxis, yAxis, zAxis } = definition.visualization.visualizationSemantics;
  if (!xAxis || !yAxis || !zAxis) throw new Error('Tre assi matematici espliciti richiesti.');
  return [xAxis, yAxis, zAxis];
}
export const LESSON_PLOT_HEIGHT = 280;
