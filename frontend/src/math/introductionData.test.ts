import { expect, it } from 'vitest';
import { continuousFamily, continuousSection, eulerData, equilibriumLocus, linearizationFamily,
  pathConstraintFamily, quadraticSetData, weightedCostData } from './introductionData';
import type { AxisDefinition } from '../numeric-data/types';
import { quadraticPointClass } from './introduction';
const axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition] = [
  { label: 'first', unit: '1' }, { label: 'second', unit: '1' }, { label: 'value', unit: '1' },
];
it('p8: la sezione e la famiglia usano la stessa soluzione analitica', () => {
  const family = continuousFamily(1, 0, axes), section = continuousSection(1, 1, 0);
  expect(family.z.at(-1)!.at(-1)).toBeCloseTo(1 - Math.exp(-5), 12);
  expect(section.state.points.at(-1)!.y).toBeCloseTo(family.z.at(-1)!.at(-1)!, 12);
});
it('p12: superficie e piano contengono esattamente l’oracolo nella griglia', () => {
  const family = linearizationFamily(axes);
  const x = family.exact.x.findIndex(v => Math.abs(v - .1) < 1e-10), y = family.exact.y.indexOf(0);
  expect(family.exact.z[y][x]).toBeCloseTo(.21, 12); expect(family.tangent.z[y][x]).toBeCloseTo(.2, 12);
});
it('p16: contour e surface ricevono la stessa griglia corretta al punto candidato', () => {
  const data = weightedCostData(1, 4, axes), x = data.grid.x.indexOf(1), y = data.grid.y.indexOf(1);
  expect(data.grid.z[y][x]).toBe(2.5); expect(data.points[0].z).toBe(data.cost.total);
});
it('p17: maschera = segno del residuo, anche nei casi degeneri', () => {
  for (const [a, b, c] of [[1, 1, 1], [1, -1, 1], [1, 1, 0], [0, 0, 0], [0, 0, -1]]) {
    const data = quadraticSetData(a, b, c, axes);
    data.grid.z.forEach((row, y) => row.forEach((value, x) => expect(data.mask.z[y][x]).toBe(value! <= 1e-9 ? 1 : 0)));
  }
  expect(quadraticPointClass(0, 'tutto il piano')).toBe('ammissibile (g=0)');
  const empty = quadraticSetData(0, 0, -1e-12, axes);
  expect(empty.mask.z.every(row => row.every(value => value === 0))).toBe(true);
  expect(quadraticPointClass(1e-12, empty.kind)).toBe('non ammissibile');
});
it('p27: ID temporali condivisi, terza coordinata è la velocità esistente', () => {
  const data = eulerData(.1);
  for (const point of data.series[0].points) {
    const analytic = data.series[1].points.find(p => p.id === point.id)!;
    expect(analytic).toBeDefined(); expect(point.z).toBeCloseTo(analytic.z!, 12);
  }
  expect(data.series[0].points.at(-1)!.y).toBeCloseTo(.9855, 12);
});
it('p30: la famiglia dei limiti restituisce .2 a quota 3.2, min=1, max=3', () => {
  const family = pathConstraintFamily(3, axes), x = family.grid.x.findIndex(v => Math.abs(v - 3.2) < 1e-10);
  expect(family.grid.z[family.grid.y.indexOf(1)][x]).toBeCloseTo(.2, 12);
});
it('p34: tutto il luogo di equilibrio ha velocità esattamente zero', () => {
  const locus = equilibriumLocus();
  expect(locus.points.every(p => p.y === 0)).toBe(true);
  expect(locus.points[0].z).toBeCloseTo(-9.81, 12); expect(locus.points.at(-1)!.z).toBeCloseTo(9.81, 12);
});
