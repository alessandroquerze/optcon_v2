/** Renderer-independent numeric data contracts shared by math and views. */
export interface AxisDefinition { label: string; unit: string; }
export interface Point { id: string; x: number; y: number; z?: number; t?: number; }
export interface CurveSeries {
  id: string; label: string; points: readonly Point[];
  color?: string; dashed?: boolean; discrete?: boolean;
}
export interface ScalarGrid {
  id: string; x: number[]; y: number[]; z: (number|null)[][];
  axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition];
}
export interface SurfaceLayer { grid: ScalarGrid; label: string; opacity?: number; colorScale?: string; }
export interface SurfacePatch {
  id: string; label: string; x: number[][]; y: number[][]; z: number[][]; opacity?: number;
}
export interface VectorSample { id: string; x: number; y: number; z?: number; u: number; v: number; w?: number; }
export const axisTitle = (axis: AxisDefinition) => axis.label + (axis.unit ? ' [' + axis.unit + ']' : '');
