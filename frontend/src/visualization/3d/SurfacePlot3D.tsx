import { useMemo } from 'react';
import { SceneViewport, type CameraSpecification, type PlotTrace } from '../core/SceneViewport';
import { axisTitle, compactAxisTitle, type CurveSeries, type Point, type ScalarGrid, type SurfaceLayer, type SurfacePatch } from '../core/types';
import { useLinkedSelection } from '../shared/ProjectionLink';
export function SurfacePlot3D({ grid, layers = [], points = [], curves = [], patches = [], id, height, camera, fontSize, representation = 'surface', contourProjection = false }: {
  grid: ScalarGrid; layers?: readonly SurfaceLayer[]; points?: readonly Point[]; id: string; height?: number;
  curves?: readonly CurveSeries[]; patches?: readonly SurfacePatch[]; camera?: CameraSpecification; fontSize?: number;
  representation?: 'surface'|'wireframe'|'mesh'; contourProjection?: boolean;
}) {
  const linked = useLinkedSelection();
  const traces = useMemo(() => {
    const surfaces: PlotTrace[] = [{ grid, label: grid.id, opacity: 1 }, ...layers].map(layer => {
      const g = layer.grid;
      if (representation === 'mesh' && layer.opacity === 1) {
        const vertices = g.z.flatMap((row, yi) => row.map((z, xi) => ({ x: g.x[xi], y: g.y[yi], z })));
        const i: number[] = [], j: number[] = [], k: number[] = [];
        for (let y = 0; y < g.y.length - 1; y++) for (let x = 0; x < g.x.length - 1; x++) {
          const a = y * g.x.length + x, b = a + 1, c = a + g.x.length, d = c + 1;
          if ([a,b,c,d].some(v => vertices[v].z === null)) continue;
          i.push(a,b); j.push(b,d); k.push(c,c);
        }
        return { type: 'mesh3d', x: vertices.map(v => v.x), y: vertices.map(v => v.y), z: vertices.map(v => v.z),
          i,j,k, intensity: vertices.map(v => v.z), colorscale: 'Viridis', opacity: layer.opacity, name: layer.label };
      }
      return {
        type: 'surface', x: g.x, y: g.y, z: g.z, name: layer.label, opacity: layer.opacity ?? 1,
        colorscale: layer.colorScale ?? 'Viridis', showscale: layer.grid === grid,
        connectgaps: false, hidesurface: representation === 'wireframe' && layer.grid === grid,
        colorbar: { title: { text: grid.axes[2].label.replace('_next', 'ₜ₊₁') }, thickness: 12 },
        contours: { x: { show: representation === 'wireframe' }, y: { show: representation === 'wireframe' },
          z: { show: contourProjection, usecolormap: true, project: { z: contourProjection } } },
        hovertemplate: axisTitle(g.axes[0]) + ': %{x:.3f}<br>' + axisTitle(g.axes[1]) + ': %{y:.3f}<br>' + axisTitle(g.axes[2]) + ': %{z:.4f}<extra>' + layer.label + '</extra>',
      };
    });
    for (const patch of patches) surfaces.push({
      type: 'surface', x: patch.x, y: patch.y, z: patch.z, opacity: patch.opacity ?? .15,
      name: patch.label, showscale: false, colorscale: [[0, '#758798'], [1, '#758798']], hoverinfo: 'skip',
    });
    for (const curve of curves) surfaces.push({
      type: 'scatter3d', mode: curve.discrete ? 'markers' : 'lines', name: curve.label,
      x: curve.points.map(p => p.x), y: curve.points.map(p => p.y), z: curve.points.map(p => p.z),
      customdata: curve.points.map(p => p.id), connectgaps: false,
      line: { color: curve.color ?? '#176c98', width: 5, dash: curve.dashed ? 'dash' : 'solid' },
      marker: { size: 5, color: curve.color ?? '#176c98' },
      hovertemplate: '%{x:.3f}, %{y:.3f}, %{z:.4f}<extra>' + curve.label + '</extra>',
    });
    if (points.length) surfaces.push({
      type: 'scatter3d', mode: 'markers', x: points.map(p => p.x), y: points.map(p => p.y), z: points.map(p => p.z),
      customdata: points.map(p => p.id), marker: { size: points.map(p => p.id === linked?.selectedId ? 7 : 5), color: '#cf6b24', line: { color: '#fff', width: 1 } },
      hovertemplate: '%{x:.3f}, %{y:.3f}, %{z:.4f}<extra>Punto corrente</extra>',
    });
    return surfaces;
  }, [grid, layers, points, curves, patches, representation, contourProjection, linked?.selectedId]);
  const layout = useMemo(() => ({ scene: {
    xaxis: { title: { text: grid.axes[0].label } }, yaxis: { title: { text: grid.axes[1].label } },
    zaxis: { title: { text: grid.axes[2].label.replace('_next', 'ₜ₊₁') } },
  } }), [grid.axes]);
  return <SceneViewport id={id} traces={traces} layout={layout} is3D label="Superficie 3D" height={height} camera={camera} fontSize={fontSize}
    axisLegend={grid.axes.map(compactAxisTitle)}/>;
}
