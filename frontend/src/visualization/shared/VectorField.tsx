import { useMemo } from 'react';
import { SceneViewport, type PlotTrace } from '../core/SceneViewport';
import { axisTitle, type AxisDefinition, type VectorSample } from '../core/types';
export function VectorField({ id, samples, axes, dimensions }: {
  id: string; samples: readonly VectorSample[]; axes: readonly AxisDefinition[]; dimensions: 2|3;
}) {
  const traces = useMemo<PlotTrace[]>(() => dimensions === 3 ? [{
    type: 'cone', x: samples.map(s => s.x), y: samples.map(s => s.y), z: samples.map(s => s.z),
    u: samples.map(s => s.u), v: samples.map(s => s.v), w: samples.map(s => s.w),
    sizemode: 'absolute', sizeref: .25, anchor: 'tail', showscale: false,
    colorscale: [[0, '#126879'], [1, '#126879']],
  }] : samples.map(s => ({
    type: 'scatter', mode: 'lines+markers', x: [s.x, s.x + s.u], y: [s.y, s.y + s.v],
    line: { color: '#126879', width: 1.5 }, marker: { size: [0, 7], symbol: 'arrow', angleref: 'previous' },
    hoverinfo: 'skip',
  })), [samples, dimensions]);
  const layout = useMemo(() => dimensions === 3 ? { scene: {
    xaxis: { title: { text: axisTitle(axes[0]) } }, yaxis: { title: { text: axisTitle(axes[1]) } }, zaxis: { title: { text: axisTitle(axes[2]) } },
  } } : { xaxis: { title: { text: axisTitle(axes[0]) } }, yaxis: { title: { text: axisTitle(axes[1]) } } }, [axes, dimensions]);
  return <SceneViewport id={id} traces={traces} layout={layout} is3D={dimensions === 3} label={'Campo vettoriale ' + dimensions + 'D'} />;
}
