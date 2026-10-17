import { useMemo } from 'react';
import { SceneViewport, type PlotTrace } from '../core/SceneViewport';
import { useLinkedSelection } from './ProjectionLink';
import type { CurveSeries } from '../core/types';
/** Separate vertical scales; never equates state and input units. */
export function AlignedTimeSeries({ id, rows, height = 330, fontSize = 22, timeLabel = 'τ' }: {
  id: string; rows: readonly { label: string; curves: readonly CurveSeries[] }[]; height?: number; fontSize?: number;
  timeLabel?: string;
}) {
  const linked = useLinkedSelection();
  const traces = useMemo(() => rows.flatMap((row, index) => {
    const suffix = index ? String(index + 1) : '';
    const data: PlotTrace[] = row.curves.map(c => ({
      type: 'scatter', mode: c.discrete ? 'markers' : 'lines', name: c.label,
      x: c.points.map(p => p.x), y: c.points.map(p => p.y), customdata: c.points.map(p => p.id),
      xaxis: 'x' + suffix, yaxis: 'y' + suffix, connectgaps: false,
      line: { color: c.color ?? '#176c98', width: 3, dash: c.dashed ? 'dash' : 'solid' },
      marker: { color: c.color ?? '#176c98', size: 7 },
      hovertemplate: timeLabel + '=%{x:.3f} s<br>%{y:.4f}<extra>' + row.label + '</extra>',
    }));
    const selected = row.curves.flatMap(c => c.points).find(p => p.id === linked?.selectedId);
    if (selected) data.push({ type: 'scatter', mode: 'markers', x: [selected.x], y: [selected.y],
      xaxis: 'x' + suffix, yaxis: 'y' + suffix, marker: { size: 12, color: '#cf6b24' },
      customdata: [selected.id], hovertemplate: '%{x:.3f}, %{y:.4f}<extra>Campione corrente</extra>' });
    return data;
  }), [rows, linked?.selectedId, timeLabel]);
  const layout = useMemo(() => {
    const axes: Record<string, unknown> = {};
    const gap = rows.length > 1 ? .24 : 0, span = (1 - gap * (rows.length - 1)) / rows.length;
    const annotations: Record<string, unknown>[] = [];
    rows.forEach((row, i) => {
      const suffix = i ? String(i + 1) : '';
      const end = 1 - i * (span + gap), start = end - span;
      axes['xaxis' + suffix] = { domain: [0, 1], anchor: 'y' + suffix, title: { text: i === rows.length - 1 ? timeLabel + ' [s]' : '' },
        matches: i ? 'x' : undefined, showticklabels: i === rows.length - 1 };
      axes['yaxis' + suffix] = { domain: [start, end], anchor: 'x' + suffix, nticks: 3 };
      annotations.push({ x: 0, y: end, xref: 'paper', yref: 'paper', xanchor: 'left', yanchor: 'bottom', text: row.label,
        showarrow: false, font: { size: fontSize, color: '#294658' } });
    });
    return { ...axes, annotations, margin: { l: 60, r: 28, t: 36, b: 60 } };
  }, [rows, fontSize, timeLabel]);
  return <SceneViewport id={id} traces={traces} layout={layout} label="Serie temporali allineate" height={height} fontSize={fontSize}/>;
}
