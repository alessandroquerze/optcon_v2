import { GraphicViewport } from '../core/GraphicViewport';

/** Rectangular numerical matrices, including linked transpose selection. */
export function MatrixVisualizer({label,values,rowLabels,columnLabels,selected,onSelect}:{
  label:string;values:readonly(readonly number[])[];rowLabels:readonly string[];columnLabels:readonly string[];
  selected?:readonly[number,number];onSelect?:(row:number,column:number)=>void;
}){
  const width=Math.max(330,110+94*columnLabels.length),height=90+58*rowLabels.length;
  return <GraphicViewport label={label}><svg className="matrix-diagram" viewBox={'0 0 '+width+' '+height} role="group" aria-label={label}>
    {columnLabels.map((name,j)=><text key={name} x={153+94*j} y="35" textAnchor="middle" className="matrix-axis-label">{name}</text>)}
    {values.map((row,i)=><g key={i}>
      <text x="84" y={88+58*i} textAnchor="end" className="matrix-axis-label">{rowLabels[i]}</text>
      {row.map((value,j)=>{
        const active=selected?.[0]===i&&selected?.[1]===j;
        return <g key={j} role={onSelect?'button':undefined} tabIndex={onSelect?0:undefined}
          aria-label={rowLabels[i]+', '+columnLabels[j]+': '+value.toFixed(2)} aria-pressed={onSelect?active:undefined}
          className={'matrix-entry'+(active?' selected':'')} onClick={()=>onSelect?.(i,j)}
          onKeyDown={event=>{if(onSelect&&(event.key==='Enter'||event.key===' ')){event.preventDefault();onSelect(i,j);}}}>
          <rect x={111+94*j} y={55+58*i} width="84" height="48" rx="5"/>
          <text x={153+94*j} y={87+58*i} textAnchor="middle">{Math.abs(value)<.00001?'0.00':value.toFixed(2)}</text>
        </g>;
      })}
    </g>)}
  </svg></GraphicViewport>;
}
