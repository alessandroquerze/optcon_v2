import { useMemo } from 'react';
import { SceneViewport, type PlotTrace } from '../core/SceneViewport';
import { axisTitle, type CurveSeries, type Point, type ScalarGrid } from '../core/types';
import { useLinkedSelection } from './ProjectionLink';
/** mask is computed by the math core, not by the graphics component. */
export function ConstraintVisualizer({ residual, feasibleMask, points = [], zeroSet = [], hideMask = false, hideContour = false, id, height, fontSize }: {
  residual: ScalarGrid; feasibleMask: ScalarGrid; points?: readonly Point[]; id: string; height?: number; fontSize?: number;
  zeroSet?: readonly CurveSeries[]; hideMask?: boolean; hideContour?: boolean;
}) {
  const linked = useLinkedSelection();
  const traces = useMemo(() => [{
    type: 'heatmap', x: feasibleMask.x, y: feasibleMask.y, z: feasibleMask.z, zmin: 0, zmax: 1,
    colorscale: [[0, '#f1f3f5'], [1, '#b3ddd0']], showscale: false,
    hovertemplate: '%{x:.3f}, %{y:.3f}<br>Ammissibile: %{z}<extra></extra>',
  }, {
    type: 'contour', x: residual.x, y: residual.y, z: residual.z, showscale: false,
    contours: { start: 0, end: 0, size: 1, coloring: 'none' }, line: { color: '#25775b', width: 2 },
  }, { type: 'scatter', mode: 'markers', x: points.map(p => p.x), y: points.map(p => p.y),
    customdata: points.map(p => p.id), marker: { size: points.map(p => p.id === linked?.selectedId ? 14 : 9),
      color: points.map(p => p.id === linked?.selectedId ? '#cf6b24' : '#176c98'), line: { color: '#fff', width: 2 } },
    hovertemplate: 'z₁=%{x:.2f}, z₂=%{y:.2f}<extra>Punto</extra>',
  }], [residual, feasibleMask, points, linked?.selectedId]);
  const effectiveTraces = useMemo(() => [
    ...traces.filter((_, index) => index === 0 ? !hideMask : index === 1 ? !hideContour : false),
    ...zeroSet.map(c => ({ type: 'scatter', mode: c.discrete ? 'markers' : 'lines', x: c.points.map(p => p.x), y: c.points.map(p => p.y),
      marker: { size: 12, color: '#25775b' }, line: { width: 3, color: '#25775b' }, name: c.label })),
    traces[2],
  ] as PlotTrace[], [traces, zeroSet, hideMask, hideContour]);
  const layout = useMemo(() => ({
    xaxis: { title: { text: axisTitle(residual.axes[0]) }, range: [residual.x[0], residual.x.at(-1)], constrain: 'domain' },
    yaxis: { title: { text: axisTitle(residual.axes[1]) }, range: [residual.y[0], residual.y.at(-1)], constrain: 'domain', scaleanchor: 'x' },
  }), [residual.axes]);
  return <SceneViewport id={id} traces={effectiveTraces} layout={layout} label="Regione ammissibile 2D" height={height} fontSize={fontSize} />;
}
