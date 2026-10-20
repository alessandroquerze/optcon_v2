import { finite,linspace } from './numerics';
import { sampleSurface,sampleCurve } from './sampling';
import { introductionFixtures,planarDroneDynamics } from './introduction';
import type { AxisDefinition,CurveSeries,SurfacePatch } from '../numeric-data/types';
type Axes=readonly [AxisDefinition,AxisDefinition,AxisDefinition];
function nonnegative(...values:number[]){values.forEach(v=>{if(finite(v)<0)throw new RangeError('Peso o limite non negativo.');});}
export function stageCosts(alpha:number,beta:number,gamma:number){
  nonnegative(alpha,beta,gamma);
  const parts=[{id:'stage0',label:'Stadio 0',value:.5*alpha+.125*beta,kind:'stage' as const},
    {id:'stage1',label:'Stadio 1',value:.125*alpha,kind:'stage' as const},
    {id:'terminal',label:'Terminale 2',value:.125*gamma,kind:'terminal' as const}];
  return {parts,total:parts.reduce((s,p)=>s+p.value,0)};
}
export function stageCostData(alpha:number,beta:number,gamma:number,axes:Axes){
  return {model:stageCosts(alpha,beta,gamma),
    grid:sampleSurface('Costo della candidata fissa',linspace(0,4,25),linspace(0,4,25),(a,b)=>stageCosts(a,b,gamma).total,axes),
    point:{id:'weights',x:alpha,y:beta,z:stageCosts(alpha,beta,gamma).total}};
}
export function reachability(bound:number){
  nonnegative(bound);const feasible=2*bound>=1-1e-10;
  return {min:-2*bound,max:2*bound,feasible,probe:feasible?.5:bound,residual:feasible?0:2*bound-1};
}
export function reachabilityData(bound:number,axes:Axes){
  const result=reachability(bound),coordinates=bound===0?[0,0]:linspace(-bound,bound,25);
  const grid=sampleSurface('Residuo terminale nel box',coordinates,coordinates,(a,b)=>a+b-1,axes);
  const lo=Math.max(-bound,1-bound),hi=Math.min(bound,1+bound);
  const intersection:CurveSeries={id:'endpoint',label:'Endpoint compatibile nel box',color:'#25775b',
    points:lo<=hi?linspace(lo,hi,25).map((x,i)=>({id:'end:'+i,x,y:1-x,z:0})):[]};
  return {grid,result,intersection,zero:sampleSurface('Residuo nullo',coordinates,coordinates,()=>0,axes),
    point:{id:'probe',x:result.probe,y:result.probe,z:result.residual}};
}
export function trackingCost(R:number,QT:number,target:number,u:number,x:number){
  if(!(finite(R)>0))throw new RangeError('R strettamente positivo.');nonnegative(QT);[target,u,x].forEach(v=>finite(v));
  const parts=[{id:'effort',label:'Ingresso',kind:'stage' as const,value:.5*R*u*u},
    {id:'tracking',label:'Terminale',kind:'terminal' as const,value:.5*QT*(x-target)**2}];
  return {parts,total:parts.reduce((s,p)=>s+p.value,0)};
}
export function trackingChoice(R:number,QT:number,target:number){
  trackingCost(R,QT,target,0,0);const u=QT*target/(R+QT);
  return {u,x:u,model:trackingCost(R,QT,target,u,u)};
}
export function trackingData(R:number,QT:number,target:number,candidate:number,axes:Axes){
  const grid=sampleSurface('Costo prima di imporre la dinamica',linspace(-2,2,33),linspace(-2,2,33),(u,x)=>trackingCost(R,QT,target,u,x).total,axes);
  const line:CurveSeries={id:'dynamics',label:'Dinamica x₁=u₀',color:'#25775b',
    points:linspace(-2,2,65).map((u,i)=>({id:'dyn:'+i,x:u,y:u,z:trackingCost(R,QT,target,u,u).total}))};
  const max=Math.max(...grid.z.flat().filter((x):x is number=>x!==null));
  const plane:SurfacePatch={id:'dynamics-plane',label:'x₁=u₀',x:[[-2,2],[-2,2]],y:[[-2,2],[-2,2]],z:[[0,0],[max,max]],opacity:.15};
  return {grid,line,plane,model:trackingCost(R,QT,target,candidate,candidate),point:{id:'candidate',x:candidate,y:candidate,z:trackingCost(R,QT,target,candidate,candidate).total},
    reduced:sampleCurve('reduced','Costo lungo la dinamica',linspace(-2,2,81),u=>trackingCost(R,QT,target,u,u).total)};
}
export function twoStepOptimum(target:number,bound:number){
  finite(target);nonnegative(bound);const feasible=Math.abs(target)<=2*bound+1e-10;
  return {feasible,u:feasible?target/2:null,cost:feasible?target*target/4:null};
}
export function twoStepData(target:number,bound:number,axes:Axes){
  const optimum=twoStepOptimum(target,bound),cost=(a:number,b:number)=>.5*(a*a+b*b);
  const grid=sampleSurface('Costo dei due comandi',linspace(-1,1,33),linspace(-1,1,33),cost,axes);
  const lo=Math.max(-1,target-1),hi=Math.min(1,target+1);
  const line:CurveSeries={id:'endpoint',label:'Endpoint richiesto',color:'#25775b',
    points:linspace(lo,hi,51).map((x,i)=>({id:'endpoint:'+i,x,y:target-x,z:cost(x,target-x)}))};
  const edge=linspace(-bound,bound,25);
  const corners=[...edge.map(x=>[x,-bound]),...edge.map(y=>[bound,y]),
    ...[...edge].reverse().map(x=>[x,bound]),...[...edge].reverse().map(y=>[-bound,y])];
  const box:CurveSeries={id:'bounds',label:'Limiti sugli ingressi',color:'#a72d32',dashed:true,
    points:corners.map(([x,y],i)=>({id:'box:'+i,x,y,z:cost(x,y)}))};
  const plane:SurfacePatch={id:'endpoint-plane',label:'u₀+u₁=target',x:[[lo,hi],[lo,hi]],y:[[target-lo,target-hi],[target-lo,target-hi]],z:[[0,0],[1,1]],opacity:.18};
  return {optimum,grid,line,box,plane,points:optimum.feasible?[{id:'optimal',x:optimum.u!,y:optimum.u!,z:optimum.cost!}]:[]};
}
export function outputData(c:number){
  if(finite(c)<0||c>1)throw new RangeError('c in [0,1].');
  const desired=[0,2,2],actual=[0,c,2*c];
  const actualCurve:CurveSeries={id:'actual',label:'Uscita candidata',discrete:true,color:'#176c98',
    points:actual.map((y,t)=>({id:'sample:'+t,x:t,y,z:y-desired[t],t}))};
  const desiredCurve:CurveSeries={id:'desired',label:'Uscita desiderata',discrete:true,color:'#a72d32',
    points:desired.map((y,t)=>({id:'sample:'+t,x:t,y,z:0,t}))};
  return {actual,desired,error:actual.map((y,t)=>y-desired[t]),actualCurve,desiredCurve};
}
export function droneAcceleration(u1:number,u2:number,theta:number){
  const result=planarDroneDynamics([0,0,0,0,theta,0],[u1,u2],introductionFixtures.drone);
  return {x:result[1],y:result[3],angular:result[5]};
}
export function droneAccelerationData(u1:number,u2:number,theta:number,axes:Axes){
  const result=droneAcceleration(u1,u2,theta),coords=linspace(0,10,33);
  return {result,grid:sampleSurface('Accelerazione verticale',coords,coords,(a,b)=>droneAcceleration(a,b,theta).y,axes),
    zero:sampleSurface('Accelerazione verticale nulla',coords,coords,()=>0,axes),
    point:{id:'thrust',x:u1,y:u2,z:result.y}};
}
