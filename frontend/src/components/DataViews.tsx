import { useId, type ReactNode } from 'react';
import { EquationCard } from './CompanionPage';
import { GraphicViewport } from '../visualization/core/GraphicViewport';
export interface DiagramNode { id: string; label: string; x: number; y: number; kind?: 'block'|'label'; }
export function ModelDiagram({ nodes, edges, label, width = 640, height = 160, nodeWidth = 110, fontSize = 15 }: {
  nodes: readonly DiagramNode[]; edges: readonly { from: string; to: string; label?: string; path?: string }[]; label: string;
  width?: number; height?: number; nodeWidth?: number; fontSize?: number;
}) {
  const marker = useId().replaceAll(':', '');
  return <GraphicViewport label={label}><svg className="model-diagram" viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label={label} style={{fontSize}}>
    <defs><marker id={marker} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#43677e"/></marker></defs>
    {edges.map((edge, i) => {
      const a = nodes.find(n => n.id === edge.from), b = nodes.find(n => n.id === edge.to);
      if (!a || !b) return null;
      return <g key={i}><path d={edge.path ?? 'M' + (a.x + nodeWidth / 2) + ',' + a.y + ' L' + (b.x - nodeWidth / 2) + ',' + b.y}
        markerEnd={'url(#' + marker + ')'} stroke="#43677e" strokeWidth="2" fill="none"/>
        <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 10} textAnchor="middle">{edge.label}</text></g>;
    })}
    {nodes.map(n => <g key={n.id}>{n.kind !== 'label' && <rect x={n.x - nodeWidth / 2} y={n.y - 29} width={nodeWidth} height="58" rx="6" fill="#edf4f6" stroke="#b9cbd4"/>}
      <text x={n.x} y={n.y + 5} textAnchor="middle">{n.label}</text></g>)}
  </svg></GraphicViewport>;
}
export function VectorVisualizer({ label, entries }: { label: string; entries: readonly { symbol: string; value?: string|number }[] }) {
  return <GraphicViewport label={label}><div className="vector-visualizer" aria-label={label}><span>{label}</span>
    <ol>{entries.map((e, i) => <li key={i}><EquationCard latex={e.symbol} />{e.value !== undefined && <span>{e.value}</span>}</li>)}</ol>
  </div></GraphicViewport>;
}
export interface CostModel { parts: readonly { id: string; label: string; value: number; kind: 'stage'|'terminal' }[]; total: number; }
export function CostBreakdown({ model, label = 'Contributi al costo' }: { model: CostModel; label?: string }) {
  const maximum = Math.max(1, ...model.parts.map(p => Math.abs(p.value)));
  return <GraphicViewport label={label} className="graphic-bars"><section className="cost-breakdown" aria-label={label}>
    {model.parts.map(p => <div key={p.id} className={'cost-row ' + p.kind}><span>{p.label}</span>
      <span className="cost-track"><span style={{ width: Math.abs(p.value) / maximum * 100 + '%' }}/></span>
      <output>{p.value.toFixed(4)}</output></div>)}
    <div className="cost-total">Totale <output>{model.total.toFixed(4)}</output></div>
  </section></GraphicViewport>;
}
export function StateInputTimeline({ states, inputs }: { states: readonly string[]; inputs: readonly string[] }) {
  if (states.length !== inputs.length + 1) throw new Error('T ingressi richiedono T+1 stati.');
  return <GraphicViewport label="Timeline stato ingresso"><ol className="state-timeline" aria-label="Timeline stato ingresso">{states.map((s, i) => <li key={i}>
    <span className={i === 0 ? 'initial-state' : ''}>{s}</span>
    {i < inputs.length && <span className="input-edge">{inputs[i]} →</span>}
  </li>)}</ol></GraphicViewport>;
}
export function ComparisonTable({ label, columns, rows }: {
  label: string; columns: readonly string[]; rows: readonly { id: string; cells: readonly ReactNode[] }[];
}) {
  return <div className="table-scroll"><table><caption>{label}</caption><thead><tr>{columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
    <tbody>{rows.map(r => <tr key={r.id}>{r.cells.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
