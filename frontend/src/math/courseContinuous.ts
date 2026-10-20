import { finite,linspace,diagonalQuadratic } from './numerics';
import { sampleSurface,sampleCurve } from './sampling';
import { pendulumDynamics,pendulumEquilibrium,introductionFixtures } from './introduction';
import { eulerData,timeId } from './introductionData';
import type { AxisDefinition,CurveSeries,ScalarGrid } from '../numeric-data/types';
type Axes=readonly [AxisDefinition,AxisDefinition,AxisDefinition];
function nonnegative(...values:number[]){values.forEach(v=>{if(finite(v)<0)throw new RangeError('Pesi non negativi.');});}
export function droneTaskData(){return eulerData(.1);}
export function inspectDroneSample(data:ReturnType<typeof droneTaskData>,k:number){
  if(!Number.isInteger(k)||k<1||k>10)throw new RangeError('Campione da 1 a 10.');
  const time=data.simulation.times[k],state=data.simulation.states[k],desired=data.simulation.analytical(time);
  return {time,state,desired,errorPosition:state[2]-desired.altitude,errorVelocity:state[3]-desired.velocity,id:timeId(time)};
}
export function droneStageCost(q1:number,q5:number,r1:number,r2:number,error=1,angle=.1){
  nonnegative(q1,q5,r1,r2);[error,angle].forEach(v=>finite(v));
  const cost=diagonalQuadratic([error,0,0,0,angle,0,2,2],[q1,1,1,1,q5,1,r1,r2],.5);
  const labels=['p_x','v_x','p_y','v_y','θ','ω','u₁','u₂'];
  return {parts:cost.contributions.map((value,i)=>({id:'part:'+i,label:labels[i],value,kind:'stage' as const})),total:cost.total};
}
export function droneCostData(q1:number,q5:number,r1:number,r2:number,axes:Axes){
  return {model:droneStageCost(q1,q5,r1,r2),grid:sampleSurface('Costo di stadio',linspace(-2,2,33),linspace(-.4,.4,25),
    (e,angle)=>droneStageCost(q1,q5,r1,r2,e,angle).total,axes),point:{id:'snapshot',x:1,y:.1,z:droneStageCost(q1,q5,r1,r2).total}};
}
export function continuousCost(c:number,T:number){
  finite(c);if(!(finite(T)>0))throw new RangeError('Tempo positivo.');
  const parts=[{id:'integral',label:'Integrale',kind:'stage' as const,value:.5*c*c*T},
    {id:'terminal',label:'Terminale',kind:'terminal' as const,value:.5*c*c*T*T}];
  return {parts,total:parts.reduce((s,p)=>s+p.value,0)};
}
export function continuousFamily(c:number,T:number,axes:Axes){
  const model=continuousCost(c,T),ts=linspace(0,T,51);
  const line:CurveSeries={id:'selected',label:'Funzione selezionata',color:'#cf6b24',points:ts.map(t=>({id:'t:'+t,x:t,y:c,z:c*t}))};
  return {model,grid:sampleSurface('Famiglia x(t;c)',ts,linspace(-2,2,25),(t,c)=>c*t,axes),line,point:{id:'terminal',x:T,y:c,z:c*T},
    state:sampleCurve('state','x(t)',ts,t=>c*t),density:sampleCurve('density','Densità di costo ½c²',ts,()=>.5*c*c)};
}
export function piecewiseState(t:number,c1:number,c2:number){
  [t,c1,c2].forEach(v=>finite(v));if(t<0||t>2)throw new RangeError('Tempo in [0,2].');
  return t<=1?c1*t:c1+c2*(t-1);
}
export function piecewiseFamily(c1:number,c2:number,axes:Axes){
  const ts=linspace(0,2,81),curve:CurveSeries={id:'selected',label:'Stato della coppia scelta',color:'#cf6b24',
    points:ts.map(t=>({id:'t:'+t,x:t,y:c2,z:piecewiseState(t,c1,c2)}))};
  const input:CurveSeries[]=[{id:'u-first',label:'u=c₁ su [0,1)',points:[{id:'u0',x:0,y:c1},{id:'u1-left',x:1-Number.EPSILON,y:c1}]},
    {id:'u-second',label:'u=c₂ su [1,2]',points:[{id:'u1',x:1,y:c2},{id:'u2',x:2,y:c2}]}];
  return {grid:sampleSurface('Sezione della famiglia K=2',ts,linspace(-1,1,25),(t,c2)=>piecewiseState(t,c1,c2),axes),curve,input,
    endpoint:piecewiseState(2,c1,c2),point:{id:'endpoint',x:2,y:c2,z:piecewiseState(2,c1,c2)},
    state:{...curve,id:'state-2d',points:curve.points.map(p=>({...p,y:p.z!}))}};
}
export function pendulumSnapshot(angle:number,torque:number){
  const derivative=pendulumDynamics(angle,0,torque,introductionFixtures.pendulum),support=pendulumEquilibrium(angle).torque;
  return {velocity:derivative[0],acceleration:derivative[1],support};
}
export function pendulumAccelerationData(angle:number,torque:number,axes:Axes){
  const ts=linspace(-Math.PI,Math.PI,65),snapshot=pendulumSnapshot(angle,torque);
  const grid=sampleSurface('Accelerazione angolare',ts,linspace(-12,12,33),(a,u)=>pendulumSnapshot(a,u).acceleration,axes);
  return {grid,snapshot,zero:sampleSurface('Accelerazione zero',grid.x,grid.y,()=>0,axes),point:{id:'instant',x:angle,y:torque,z:snapshot.acceleration},
    section:sampleCurve('torque-section','Coppia corrente',ts,a=>pendulumSnapshot(a,torque).acceleration)};
}
export function desiredPendulum(t:number,T:number,first:number,second:number){
  [t,T,first,second].forEach(v=>finite(v));if(!(T>0)||t<0||t>T)throw new RangeError('t in [0,T], T positivo.');
  const angle=t<T/2?first:second;
  return {angle,velocity:0,torque:pendulumEquilibrium(angle).torque};
}
export function desiredPendulumData(first:number,second:number,T:number){
  desiredPendulum(0,T,first,second);const half=T/2;
  const before=half-Number.EPSILON*Math.max(1,half);
  const segments:CurveSeries[]=[[0,before,first],[half,T,second]].map(([start,end,a],index)=>({
    id:'reference:'+index,label:index?'Secondo ramo (T/2 incluso)':'Primo ramo (T/2 escluso)',color:index?'#8057a5':'#176c98',
    points:[start,end].map((t,i)=>({id:'reference:'+index+':'+i,x:t,y:a,z:desiredPendulum(t,T,first,second).torque}))}));
  return {segments,torques:segments.map(c=>({...c,points:c.points.map(p=>({...p,y:p.z!}))})),
    atSwitch:desiredPendulum(half,T,first,second),firstTorque:pendulumEquilibrium(first).torque,
    constant:Math.abs(first-second)<1e-12};
}
export function fixedPendulumCost(q1:number,r:number,qT1:number){
  nonnegative(q1,r,qT1);const angle=Math.PI/6,torque=pendulumEquilibrium(angle).torque;
  const parts=[{id:'angle-running',label:'Integrale angolo',kind:'stage' as const,value:q1*angle*angle},
    {id:'input-running',label:'Integrale ingresso',kind:'stage' as const,value:r*torque*torque},
    {id:'angle-terminal',label:'Terminale angolo',kind:'terminal' as const,value:qT1*angle*angle}];
  return {parts,total:parts.reduce((s,p)=>s+p.value,0),angle,torque};
}
export function fixedPendulumData(q1:number,r:number,qT1:number,axes:Axes){
  const model=fixedPendulumCost(q1,r,qT1),left=linspace(0,1,26).slice(0,-1),right=linspace(1,2,26);
  const xs=[...left,1,...right],seam=left.length;
  const grid:ScalarGrid={id:'Costo corrente, candidata ferma',x:xs,y:linspace(-1,1,33),axes,
    z:linspace(-1,1,33).map(e=>xs.map((t,i)=>i===seam?null:q1*e*e+(t>=1?r*model.torque**2:0)))};
  const first:CurveSeries={id:'candidate-first',label:'Candidata, primo intervallo',color:'#cf6b24',points:left.map(t=>({id:'candidate:'+t,x:t,y:0,z:0}))};
  const second:CurveSeries={id:'candidate-second',label:'Candidata, secondo intervallo',color:'#cf6b24',
    points:right.map(t=>({id:'candidate:'+t,x:t,y:-model.angle,z:model.parts[0].value+model.parts[1].value}))};
  return {model,grid,curves:[first,second],point:{id:'candidate:2',x:2,y:-model.angle,z:second.points[0].z}};
}
