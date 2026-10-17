import type { AxisDefinition, CurveSeries, Point, ScalarGrid } from '../numeric-data/types';
export function sampleCurve(id: string, label: string, x: readonly number[], f: (x: number) => number): CurveSeries {
  return { id, label, points: x.map((value, i) => ({ id: id + ':' + i, x: value, y: f(value) })) };
}
export function sampleSurface(id: string, x: number[], y: number[], f: (x: number, y: number) => number,
  axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition]): ScalarGrid {
  return { id, x, y, axes, z: y.map(yy => x.map(xx => {
    const value = f(xx, yy); return Number.isFinite(value) ? value : null;
  })) };
}
export function projectPoints(points: readonly Point[], projection: (point: Point) => { x: number; y: number }): Point[] {
  return points.map(p => ({ id: p.id, ...projection(p) }));
}
