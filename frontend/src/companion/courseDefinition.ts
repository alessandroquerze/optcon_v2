import type { CompanionDefinition } from '../data/manifest';
/** F04.1 audit controls supersede the earlier F04 static interaction decision. */
export function interactiveDefinition(definition: CompanionDefinition): CompanionDefinition {
  const existing = new Set(definition.controls.map(c => c.id));
  const extra = definition.visualization.auditControls.filter(c => !existing.has(c.id)).map(c => ({
    id:c.id, label:c.symbol, symbol:c.symbol, component:'ParameterControl' as const,
    domain:{min:c.min,max:c.max,step:c.integer?1:.05,integer:c.integer}, default:c.default,unit:c.unit,
  }));
  if (!extra.length) return definition;
  const order = [...definition.layout.visual_block_order];
  if (!order.includes('CONTROLS')) order.splice(order.indexOf('WORKED_EXAMPLE') >= 0 ? order.indexOf('WORKED_EXAMPLE') : order.length-1,0,'CONTROLS');
  return {...definition,controls:[...definition.controls,...extra],layout:{...definition.layout,visual_block_order:order}};
}
