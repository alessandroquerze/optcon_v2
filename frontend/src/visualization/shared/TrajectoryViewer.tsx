import { useMemo } from 'react';
import { SceneViewport, type CameraSpecification, type PlotTrace } from '../core/SceneViewport';
import { axisTitle, compactAxisTitle, type AxisDefinition, type CurveSeries, type SurfacePatch } from '../core/types';
import { useLinkedSelection } from './ProjectionLink';
export function TrajectoryViewer({ id, series, axes, mode, label = 'Traiettoria', height, camera, fontSize, patches = [] }: {
  id: string; series: readonly CurveSeries[]; axes: readonly AxisDefinition[];
  mode: 'xy'|'xyt'|'xyz'; label?: string; height?: number;
  camera?: CameraSpecification; fontSize?: number;
  patches?: readonly SurfacePatch[];
}) {
  const linked = useLinkedSelection();
  const is3D = mode !== 'xy';
  const traces = useMemo(() => {
    const all = series.flatMap(c => c.points);
    if (is3D && all.some(p => !Number.isFinite(mode === 'xyt' ? p.t : p.z))) throw new Error('Terza coordinata esplicita richiesta.');
    const result: PlotTrace[] = series.map(c => ({
      type: is3D ? 'scatter3d' : 'scatter', mode: c.discrete ? 'markers' : 'lines',
      name: c.label, x: c.points.map(p => p.x), y: c.points.map(p => p.y),
      ...(is3D ? { z: c.points.map(p => mode === 'xyt' ? p.t : p.z) } : {}),
      customdata: c.points.map(p => p.id), connectgaps: false,
      line: { color: c.color ?? '#126879', width: is3D ? 4 : 2, dash: c.dashed ? 'dash' : 'solid' },
      marker: { size: 5, color: c.color ?? '#126879' },
    }));
    if (is3D) for (const patch of patches) result.push({ type: 'surface', x: patch.x, y: patch.y, z: patch.z,
      opacity: patch.opacity ?? .12, colorscale: [[0, '#78909e'], [1, '#78909e']], showscale: false,
      hoverinfo: 'skip', name: patch.label });
    const selected = all.find(p => p.id === linked?.selectedId);
    if (selected) result.push({
      type: is3D ? 'scatter3d' : 'scatter', mode: 'markers', name: 'Punto corrente',
      x: [selected.x], y: [selected.y], ...(is3D ? { z: [mode === 'xyt' ? selected.t : selected.z] } : {}),
      customdata: [selected.id], connectgaps: false,
      marker: { size: is3D ? 7 : 12, color: '#cf6b24' }, line: { color: '#cf6b24', width: 2, dash: 'solid' },
    });
    return result;
  }, [series, mode, linked?.selectedId, is3D, patches]);
  const layout = useMemo(() => {
    const names = axes.map(axis => ({ title: { text: is3D ? axis.label : axisTitle(axis) } }));
    return is3D ? { scene: { xaxis: names[0], yaxis: names[1], zaxis: names[2] } } : { xaxis: names[0], yaxis: names[1] };
  }, [axes, is3D]);
  return <SceneViewport id={id} traces={traces} layout={layout} is3D={is3D} label={label} height={height} camera={camera} fontSize={fontSize}
    axisLegend={is3D ? axes.map(compactAxisTitle) : undefined}/>;
}
export const StateSpaceViewer = TrajectoryViewer;
