import { diagonalQuadratic,finite,horizonIndices,linspace } from './numerics';
import { sampleCurve,sampleSurface } from './sampling';
import type { AxisDefinition,CurveSeries,SurfacePatch } from '../numeric-data/types';
type Axes=readonly [AxisDefinition,AxisDefinition,AxisDefinition];
export const scalarDistance=(z:number,reference:number)=>diagonalQuadratic([finite(z)-finite(reference)],[1],.5).total;
export function finiteHorizon(T:number,n:number,m:number){
  if(!Number.isInteger(n)||!Number.isInteger(m)||n<1||m<1)throw new RangeError('Dimensioni intere positive.');
  const indices=horizonIndices(T);
  return {...indices,stateDimension:n*T,inputDimension:m*T};
}
export function equilibriumCheck(x:number,u:number){
  const prediction=.5*finite(x)+finite(u),residual=x-prediction;
  return {prediction,residual,equilibrium:Math.abs(residual)<=1e-9};
}
export function equilibriumData(x:number,u:number,axes:Axes){
  const grid=sampleSurface('Residuo di equilibrio',linspace(-3,3,33),linspace(-2,2,33),(x,u)=>equilibriumCheck(x,u).residual,axes);
  const line:CurveSeries={id:'equilibrium-line',label:'r_e=0',color:'#25775b',points:linspace(-3,3,31).map((x,i)=>({id:'eq:'+i,x,y:.5*x,z:0}))};
  return {grid,zero:sampleSurface('Zero',grid.x,grid.y,()=>0,axes),line,
    candidate:{id:'candidate',x,y:u,z:equilibriumCheck(x,u).residual},check:equilibriumCheck(x,u)};
}
export function decisionCheck(z1:number,z2:number){
  [z1,z2].forEach(v=>finite(v));const h=z1+z2-1,g=-z1,cost=.5*(z1*z1+z2*z2);
  return {h,g,cost,feasible:Math.abs(h)<=1e-9&&g<=1e-9};
}
export function decisionData(z1:number,z2:number,axes:Axes){
  const cost=sampleSurface('Costo della decisione',linspace(-2,2,33),linspace(-2,2,33),(a,b)=>decisionCheck(a,b).cost,axes);
  const feasible:CurveSeries={id:'feasible-ray',label:'Z: parte visibile',color:'#25775b',
    points:linspace(0,2,41).map((x,i)=>({id:'feasible:'+i,x,y:1-x,z:scalarDistance(x,0)+scalarDistance(1-x,0)}))};
  const plane:SurfacePatch={id:'h-plane',label:'h=0',x:[[-1,2],[-1,2]],y:[[2,-1],[2,-1]],z:[[0,0],[4,4]],opacity:.2};
  return {grid:cost,feasible,plane,check:decisionCheck(z1,z2),point:{id:'candidate',x:z1,y:z2,z:decisionCheck(z1,z2).cost}};
}
export function distanceCurve(reference:number){return sampleCurve('distance','Costo quadratico',linspace(-4,4,81),z=>scalarDistance(z,reference));}
export function constrainedDistance(reference:number,bound:number){
  const decision=Math.min(finite(reference),finite(bound));
  return {decision,cost:scalarDistance(decision,reference),active:reference>bound,freeFeasible:reference<=bound};
}
export function constrainedDistanceFamily(axes:Axes){
  return sampleSurface('Famiglia dei costi',linspace(-3,3,41),linspace(-2,2,33),scalarDistance,axes);
}
export function constrainedDistanceData(reference:number,bound:number){
  const result=constrainedDistance(reference,bound),xs=[...linspace(-3,3,81),bound].sort((a,b)=>a-b);
  const all=sampleCurve('section','Riferimento corrente',xs,z=>scalarDistance(z,reference));
  const feasible:CurveSeries={...all,id:'feasible',label:'Decisioni ammesse',color:'#176c98',points:all.points.filter(p=>p.x<=bound)};
  const excluded:CurveSeries={...all,id:'excluded',label:'Decisioni escluse',color:'#a0aeb8',dashed:true,points:all.points.filter(p=>p.x>=bound)};
  const minima:CurveSeries={id:'family-minima',label:'Minimi della famiglia',color:'#cf6b24',
    points:linspace(-2,2,41).map((r,i)=>{const s=constrainedDistance(r,bound);return{id:'minimum:'+i,x:s.decision,y:r,z:s.cost};})};
  const patch:SurfacePatch={id:'decision-bound',label:'z=b',x:[[bound,bound],[bound,bound]],y:[[-2,2],[-2,2]],z:[[0,0],[12.5,12.5]],opacity:.18};
  return {result,feasible,excluded,minima,patch,section:{...all,points:all.points.map(p=>({...p,y:reference,z:p.y}))},
    point:{id:'minimum',x:result.decision,y:reference,z:result.cost},
    boundLine:{id:'bound',label:'Limite z=b',dashed:true,color:'#a72d32',points:[{id:'b0',x:bound,y:0},{id:'b1',x:bound,y:12.5}]}};
}
export function dynamicsResiduals(x1:number,x2:number){
  [x1,x2].forEach(v=>finite(v));return {first:1-x1,second:x1-.5-x2,valid:Math.abs(1-x1)<=1e-9&&Math.abs(x1-.5-x2)<=1e-9};
}
export function dynamicsResidualData(x2:number,axes:Axes){
  const grid=sampleSurface('Secondo residuo',linspace(-1,2,33),linspace(-1,2,33),(x1,x2)=>dynamicsResiduals(x1,x2).second,axes);
  return {grid,zero:sampleSurface('r₁=0',grid.x,grid.y,()=>0,axes),check:dynamicsResiduals(1,x2),
    plane:{id:'first-update',label:'x₁=1',x:[[1,1],[1,1]],y:[[-1,2],[-1,2]],z:[[-3.5,-3.5],[2.5,2.5]],opacity:.2} satisfies SurfacePatch,
    point:{id:'current',x:1,y:x2,z:dynamicsResiduals(1,x2).second},
    curve:sampleCurve('r1-section','Secondo residuo a x₁=1',linspace(-1,2,61),v=>dynamicsResiduals(1,v).second)};
}
