/** Synthetic mathematical fixtures. No course page, reference or simulation is implemented here. */
import { linspace } from '../math/numerics';
import { sampleCurve, sampleSurface } from '../math/sampling';
import type { AxisDefinition, CurveSeries, Point } from '../visualization/core/types';
export const axes: [AxisDefinition,AxisDefinition,AxisDefinition] = [
  {label:'x',unit:'1'},{label:'y',unit:'1'},{label:'f(x,y)',unit:'1'},
];
export const twoAxes: [AxisDefinition,AxisDefinition] = [axes[0],axes[2]];
const domain = linspace(-Math.PI,Math.PI,33);
const plane = sampleSurface('zero-plane',domain,domain,()=>0,axes);
export function waveFixture(amplitude: number) {
  const grid = sampleSurface('demo-wave',domain,domain,(x,y)=>amplitude*Math.sin(x)*Math.cos(y),axes);
  const layers = [{grid:plane,label:'Piano f=0',opacity:.14,colorScale:'Greys'}];
  const points: Point[] = [{id:'probe',x:Math.PI/2,y:0,z:amplitude},{id:'origin',x:0,y:0,z:0}];
  const curves = [sampleCurve('section','Sezione y=0',domain,x=>amplitude*Math.sin(x))];
  const mask = {...grid,id:'feasible',z:grid.z.map(row=>row.map(z=>z===null?null:z<=0?1:0))};
  return {grid,layers,points,curves,mask};
}
export const trajectoryAxes: [AxisDefinition,AxisDefinition,AxisDefinition] = [
  {label:'x',unit:'1'},{label:'y',unit:'1'},{label:'s / 2π',unit:'1'},
];
export const helix: CurveSeries[] = [{id:'helix',label:'Curva parametrica',points:linspace(0,4*Math.PI,97).map((s,i)=>({
  id:'sample:'+i,x:Math.cos(s),y:Math.sin(s),z:s/(2*Math.PI),t:s,
}))}];
export const fieldAxes: [AxisDefinition,AxisDefinition,AxisDefinition] = [
  {label:'x',unit:'1'},{label:'y',unit:'1'},{label:'z',unit:'1'},
];
export const fieldSamples = [-1,0,1].flatMap(x=>[-1,0,1].flatMap(y=>[-1,0,1].map(z=>({
  id:[x,y,z].join(':'),x,y,z,u:-y*.25,v:x*.25,w:.15,
}))));
