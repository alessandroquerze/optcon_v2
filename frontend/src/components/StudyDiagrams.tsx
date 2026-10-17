import { useId } from 'react';
import { ModelDiagram } from './DataViews';

export function FeedbackDiagram() {
  return <ModelDiagram width={880} height={230} nodeWidth={170} fontSize={22} label="Anello di feedback con disturbo"
    nodes={[
      { id: 'reference', label: 'Riferimento', x: 85, y: 95, kind: 'label' },
      { id: 'controller', label: 'Controllore', x: 320, y: 95 },
      { id: 'system', label: 'Sistema', x: 610, y: 95 },
      { id: 'output', label: 'Uscita', x: 820, y: 95, kind: 'label' },
      { id: 'disturbance', label: 'Disturbo', x: 610, y: 20, kind: 'label' },
    ]}
    edges={[
      { from: 'reference', to: 'controller', path: 'M170,95 H235' },
      { from: 'controller', to: 'system', label: 'Ingresso', path: 'M405,95 H525' },
      { from: 'system', to: 'output', path: 'M695,95 H770' },
      { from: 'disturbance', to: 'system', path: 'M610,35 V66' },
      { from: 'output', to: 'controller', path: 'M740,95 V195 H320 V124', label: '' },
    ]}/>;
}
export function IntervalBand({ minimum, maximum, value, empty, status }: {
  minimum: number; maximum: number; value: number; empty: boolean; status: string;
}) {
  const y = (altitude: number) => 230 - 48 * altitude;
  return <svg viewBox="0 0 880 275" className="study-diagram interval-band" role="img" aria-label="Fascia di quota e centro di massa candidato">
    {!empty && <rect x="190" y={y(maximum)} width="470" height={Math.max(0, y(minimum) - y(maximum))} fill="#d8eee5"/>}
    {[0, 1, 2, 3, 4].map(tick => <g key={tick}><text x="95" y={y(tick) + 8} textAnchor="end">{tick}</text>
      <line x1="110" x2="660" y1={y(tick)} y2={y(tick)} stroke="#e1e8ec"/></g>)}
    <text x="25" y="28">p_y [m]</text>
    <line x1="110" x2="110" y1="38" y2="235" stroke="#78909e" strokeWidth="2"/>
    <line x1="160" x2="665" y1={y(minimum)} y2={y(minimum)} stroke="#a72d32" strokeWidth="3"/>
    <line x1="160" x2="665" y1={y(maximum)} y2={y(maximum)} stroke="#a72d32" strokeWidth="3"/>
    <text x="685" y={y(maximum) - 5}>max {maximum.toFixed(1)}</text>
    <text x="685" y={y(minimum) + 24}>min {minimum.toFixed(1)}</text>
    <circle cx="420" cy={y(value)} r="11" fill={status === 'non ammissibile' || empty ? '#a72d32' : '#126879'} stroke="white" strokeWidth="3"/>
    <text x="445" y={y(value) - 14}>Candidato {value.toFixed(1)} m</text>
    <text x="180" y="266">{empty ? 'Intervallo vuoto: nessuna quota ammessa' : 'Il bordo è incluso · verifica puntuale, nessun moto simulato'}</text>
  </svg>;
}
export function EquilibriumPoses({ poses }: { poses: readonly { angle: number; torque: number }[] }) {
  return <svg viewBox="0 0 880 130" className="study-diagram equilibrium-poses" role="img" aria-label="Due configurazioni planari di equilibrio">
    {poses.map((pose, i) => {
      const pivot = 135 + i * 420, x = pivot + 55 * Math.sin(pose.angle), y = 25 + 55 * Math.cos(pose.angle);
      return <g key={i}><line x1={pivot - 25} x2={pivot + 25} y1="23" y2="23" stroke="#78909e" strokeWidth="5"/>
        <line x1={pivot} x2={pivot} y1="25" y2="95" stroke="#bbc8cf" strokeDasharray="5,5"/>
        <line x1={pivot} x2={x} y1="25" y2={y} stroke={i ? '#8057a5' : '#176c98'} strokeWidth="5"/>
        <circle cx={x} cy={y} r="12" fill={i ? '#8057a5' : '#176c98'}/>
        <text x={pivot + 110} y="68">Equilibrio {i + 1}</text>
        <text x={pivot + 110} y="101">{pose.angle.toFixed(3)} rad</text>
        <text x={pivot - 70} y="123">u_e = {pose.torque.toFixed(3)} N m</text>
      </g>;
    })}
  </svg>;
}
export function UnitCircleInset() {
  const id = useId();
  return <svg viewBox="0 0 220 160" role="img" aria-labelledby={id} className="unit-circle-inset">
    <title id={id}>Uguaglianza fissa z₁²+z₂²=1: solo la circonferenza</title>
    <line x1="20" x2="200" y1="80" y2="80" stroke="#afbec7"/><line x1="80" x2="80" y1="10" y2="150" stroke="#afbec7"/>
    <circle cx="80" cy="80" r="50" fill="none" stroke="#8057a5" strokeWidth="3"/>
    {[80, 130, 180].map((x, i) => <g key={x}><circle cx={x} cy="80" r="5" fill="#cf6b24"/><text x={x} y="108">{i}</text></g>)}
    <text x="20" y="150">Q = I₂, q = 0, c = 1</text>
  </svg>;
}
