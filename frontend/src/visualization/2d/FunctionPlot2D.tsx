import { useMemo } from 'react';
import { SceneViewport } from '../core/SceneViewport';
import { axisTitle, type AxisDefinition, type CurveSeries } from '../core/types';
export function FunctionPlot2D({ id, curves, axes, label, height, fontSize }: {
  id: string; curves: readonly CurveSeries[]; axes: readonly [AxisDefinition, AxisDefinition]; label: string; height?: number; fontSize?: number;
}) {
  const traces = useMemo(() => curves.map(c => ({
    type: 'scatter', name: c.label, x: c.points.map(p => p.x), y: c.points.map(p => p.y),
    customdata: c.points.map(p => p.id), connectgaps: false,
    mode: c.discrete ? 'markers' : 'lines', line: { color: c.color ?? '#126879', width: 2, dash: c.dashed ? 'dash' : 'solid' },
    hovertemplate: axisTitle(axes[0]) + ': %{x:.4f}<br>' + axisTitle(axes[1]) + ': %{y:.4f}<extra>' + c.label + '</extra>',
  })), [curves, axes]);
  const layout = useMemo(() => ({ xaxis: { title: { text: axisTitle(axes[0]) } }, yaxis: { title: { text: axisTitle(axes[1]) } } }), [axes]);
  return <SceneViewport id={id} traces={traces} layout={layout} label={label} height={height} fontSize={fontSize} />;
}
export const TimeSeriesPlot = FunctionPlot2D;
