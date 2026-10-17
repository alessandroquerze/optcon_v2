import { useMemo } from 'react';
import { SceneViewport } from '../core/SceneViewport';
import { axisTitle, type Point, type ScalarGrid } from '../core/types';
import { useLinkedSelection } from '../shared/ProjectionLink';
export function ContourPlot2D({ grid, points = [], kind = 'contour', levels, id, height, fontSize }: {
  grid: ScalarGrid; points?: readonly Point[]; kind?: 'contour'|'heatmap'; id: string; height?: number; fontSize?: number; levels?: readonly number[];
}) {
  const linked = useLinkedSelection();
  const traces = useMemo(() => [{
    type: kind, x: grid.x, y: grid.y, z: grid.z, colorscale: 'Viridis', connectgaps: false,
    colorbar: { title: { text: axisTitle(grid.axes[2]) }, thickness: 12 },
    contours: { coloring: 'heatmap', showlabels: true },
    hovertemplate: '%{x:.3f}, %{y:.3f}<br>' + axisTitle(grid.axes[2]) + ': %{z:.4f}<extra></extra>',
  }, {
    type: 'scatter', mode: 'markers', x: points.map(p => p.x), y: points.map(p => p.y),
    customdata: points.map(p => p.id), marker: { color: '#cf6b24', size: points.map(p => p.id === linked?.selectedId ? 14 : 9), line: { color: '#fff', width: 2 } },
  }], [grid, points, kind, linked?.selectedId]);
  const effectiveTraces = useMemo(() => levels ? [
    ...levels.map(level => ({ ...traces[0], showscale: false,
      contours: { start: level, end: level, size: 1, coloring: 'none', showlabels: true },
      line: { color: '#176c98', width: 2 }, name: 'Livello ' + level })),
    traces[1],
  ] : traces, [levels, traces]);
  const layout = useMemo(() => ({
    xaxis: { title: { text: axisTitle(grid.axes[0]) }, range: [grid.x[0], grid.x.at(-1)], constrain: 'domain' },
    yaxis: { title: { text: axisTitle(grid.axes[1]) }, range: [grid.y[0], grid.y.at(-1)], constrain: 'domain', scaleanchor: 'x' },
  }), [grid.axes]);
  return <SceneViewport id={id} traces={effectiveTraces} layout={layout} label={kind === 'heatmap' ? 'Heatmap 2D' : 'Contorno 2D'} height={height} fontSize={fontSize} />;
}
