export type * from '../../numeric-data/types';
export { axisTitle } from '../../numeric-data/types';
import type { AxisDefinition } from '../../numeric-data/types';
/** Compact labels; full units remain in the data and coordinate tooltip. */
export function compactAxisTitle(axis: AxisDefinition) {
  const units: Record<string, string> = {
    'state unit': 'u. stato', 'state unit/s': 'u. stato/s',
    'normalized cost': 'costo norm.', 'normalized residual': 'res. norm.',
  };
  const label = axis.label.replace('_next', 'ₜ₊₁');
  return label + (axis.unit ? ' [' + (units[axis.unit] ?? axis.unit) + ']' : '');
}
