import { finite, linspace } from './numerics';
import { sampleSurface } from './sampling';
import type { AxisDefinition, CurveSeries, SurfacePatch } from '../numeric-data/types';

export function discreteSequence(a:number,input:number,initial:number,count=6) {
  [a,input,initial].forEach(v=>finite(v));
  if (!Number.isInteger(count)||count<1||count>100) throw new RangeError('Numero di transizioni non valido.');
  const states=[initial];
  for(let k=0;k<count;k++) states.push(a*states[k]+input);
  return states;
}
export function discreteMapData(a:number,input:number,initial:number,axes:readonly [AxisDefinition,AxisDefinition,AxisDefinition]) {
  const states=discreteSequence(a,input,initial);
  return {states,grid:sampleSurface('Mappa di un passo',linspace(-4,4,33),linspace(-1,1,25),(x,u)=>a*x+u,axes),
    points:[{id:'first',x:initial,y:input,z:states[1]}],
    section:{id:'section',label:'Ingresso corrente',points:linspace(-4,4,41).map((x,i)=>({id:'section:'+i,x,y:input,z:a*x+input}))},
    curve:{id:'states',label:'Campioni discreti',discrete:true,points:states.map((y,x)=>({id:'step:'+x,x,y}))} satisfies CurveSeries,
  };
}
function boxFace(id:string,x:number[][],y:number[][],z:number[][]):SurfacePatch {return {id,label:'Edificio chiuso',x,y,z,opacity:.35};}
export function obstaclePaths(height:number) {
  finite(height);
  const series:CurveSeries[]=[
    {id:'direct',label:'A diretto',color:'#a72d32',points:[[-2,0],[2,0]].map(([x,y],i)=>({id:'A:'+i,x,y,z:height}))},
    {id:'detour',label:'B deviazione',color:'#176c98',points:[[-2,0],[-1,1],[1,1],[2,0]].map(([x,y],i)=>({id:'B:'+i,x,y,z:height}))},
  ];
  const span=[[-.5,.5],[-.5,.5]], flat=(v:number)=>[[v,v],[v,v]];
  const patches=[
    boxFace('bottom',span,[[-.5,-.5],[.5,.5]],flat(0)),boxFace('roof',span,[[-.5,-.5],[.5,.5]],flat(2)),
    ...[-.5,.5].map((x,i)=>boxFace('side-x'+i,flat(x),span,[[0,0],[2,2]])),
    ...[-.5,.5].map((y,i)=>boxFace('side-y'+i,span,flat(y),[[0,0],[2,2]])),
  ];
  return {series,patches,directIntersects:height>=0&&height<=2,detourIntersects:false,roofClearance:height-2,
    directLength:4,detourLength:2+2*Math.SQRT2};
}
