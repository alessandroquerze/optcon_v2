import type {Vec2} from './descentMethods';
import {sqpCost,kktResidual,localNewton} from './sqpModels';
import type {PrimalDual,SqpStep} from './sqpModels';
import {barrierModel} from './projectionModels';

export const equalityViolation=(z:Vec2)=>z[1]-z[0]*z[0];
export const meritValue=(z:Vec2,s:number)=>sqpCost(...z)+s*Math.abs(equalityViolation(z));
export function meritMinima(s:number){
 if(!(s>=0&&Number.isFinite(s)))throw new Error('Nonnegative finite penalty required');
 const points:Vec2[]=s<.5?[[0,1-s]]:[[-Math.SQRT1_2,.5],[Math.SQRT1_2,.5]];
 return {points,family:s===.5,value:s<.5?s-.5*s*s:3/8};
}
export function meritLine(p:PrimalDual,delta:Vec2,s:number){
 const [x,y]=p.z,[dx,dy]=delta,h=equalityViolation(p.z),cost0=sqpCost(x,y),initial=meritValue(p.z,s);
 const a=x*dx+(y-1)*dy,q=dx*dx,norm2=dx*dx+dy*dy,slope=a-s*Math.abs(h);
 const constraint=(gamma:number)=>(1-gamma)*h-gamma*gamma*q;
 // Avoid subtracting nearly equal absolute residuals in the Armijo gap.
 const violationChange=(gamma:number)=>{
  const next=constraint(gamma),change=-gamma*h-gamma*gamma*q;
  return h===0?Math.abs(next):Math.sign(h)*next>=0?Math.sign(h)*change:Math.abs(next)-Math.abs(h);
 };
 const cost=(gamma:number)=>cost0+gamma*a+.5*gamma*gamma*norm2;
 return {initial,slope,cost,violation:(gamma:number)=>Math.abs(constraint(gamma)),
  point:(gamma:number):Vec2=>[x+gamma*dx,y+gamma*dy],
  value:(gamma:number)=>initial+gamma*a+.5*gamma*gamma*norm2+s*violationChange(gamma),
  gap:(gamma:number,c:number)=>(1-c)*gamma*a+.5*gamma*gamma*norm2+s*violationChange(gamma)+c*gamma*s*Math.abs(h)};
}
export type MeritLine=ReturnType<typeof meritLine>;
export function fixedMeritLine(s:number):MeritLine{
 const base=meritLine({z:[1,1],lambda:.2},[-5/23,-10/23],s);
 // Exact polynomial for the displayed example, including its analytic tie.
 return {...base,gap:(gamma,c)=>gamma*(gamma*(125+50*s)-230*(1-c))/1058};
}
export function meritBacktracking(line:MeritLine,beta:number,c:number,maxTrials=60){
 if(!(beta>0&&beta<1&&c>0&&c<1))throw new Error('Armijo parameters must be in (0,1)');
 const trials:{gamma:number;value:number;threshold:number;gap:number;accepted:boolean}[]=[];
 if(!(line.slope<0))return {trials,status:'direzione non di discesa per M₁',gamma:null};
 let gamma=1;
 for(let i=0;i<maxTrials;i++){
  const value=line.value(gamma),threshold=line.initial+c*gamma*line.slope,gap=line.gap(gamma,c);
  if(![value,threshold,gap].every(Number.isFinite)||gamma===0)break;
  const accepted=gap<0;trials.push({gamma,value,threshold,gap,accepted});
  if(accepted)return {trials,status:'passo accettato',gamma};
  const next=beta*gamma;if(next===gamma)break;gamma=next;
 }
 return {trials,status:'limite numerico del backtracking',gamma:null};
}
export type MeritSearch=ReturnType<typeof meritBacktracking>;
export function globalizedSqp(initial:PrimalDual,floor:number,maxSteps=12){
 const states:PrimalDual[]=[initial],weights=[Math.max(floor,Math.abs(initial.lambda)+.1)];
 const steps:{local:SqpStep;search:MeritSearch;line:MeritLine;weight:number}[]=[];
 let status='orizzonte di osservazione raggiunto';
 for(let k=0;k<maxSteps;k++){
  const p=states[k];if(kktResidual(p).norm<=1e-10){status='residuo KKT entro tolleranza';break;}
  const local=localNewton(p);
  if(local.status!=='unique'){
   status=local.status==='singular_family'?'sistema singolare: passo non unico':local.status==='inconsistent'?'sistema singolare incompatibile':'limite numerico del sistema';break;
  }
  if(local.qpStatus!=='unique_minimum'){status='QP illimitato: nessun passo SQP';break;}
  const weight=Math.max(floor,Math.abs(p.lambda)+.1,Math.abs(local.lambdaQp)+.1),line=meritLine(p,local.delta,weight);
  weights[k]=weight;const search=meritBacktracking(line,.5,.1);steps.push({local,search,line,weight});
  if(search.gamma===null){status=search.status;break;}
  const gamma=search.gamma,next={z:line.point(gamma),lambda:(1-gamma)*p.lambda+gamma*local.lambdaQp};
  if(![...next.z,next.lambda,kktResidual(next).norm,meritValue(next.z,weight)].every(Number.isFinite)){status='limite numerico raggiunto';break;}
  states.push(next);weights.push(Math.max(floor,Math.abs(next.lambda)+.1));
 }
 if(kktResidual(states.at(-1)!).norm<=1e-10)status='residuo KKT entro tolleranza';
 return {states,weights,steps,status,residuals:states.map(p=>kktResidual(p).norm)};
}
export function equalityBarrier(epsilon:number,probe:Vec2){
 const base=barrierModel(epsilon,probe[0]);
 const original=(x:number,y:number)=>base.original(x)+.5*(y-.6)**2;
 const value=(x:number,y:number)=>{const v=base.total(x);return v===null?null:v+.5*(y-.6)**2;};
 return {original,value,minimum:[base.minimum,.6] as Vec2,probeCost:value(...probe),g:-probe[0],h:probe[1]-.6};
}
export const notationCost=(z:number)=>.5*(z-1)**2;
export const notationEstimate=(k:number)=>1-3*2**(-k);
export function controlNotation(k:number){
 const q=-.5*(1-.2**k),u=Array.from({length:3},()=>q),x=Array.from({length:4},(_,t)=>2+t*q);
 return {x,u,cost:.5*u.reduce((sum,v)=>sum+v*v,0)+.5*x[3]**2,
  component:(t:number)=>({x:x[t],u:t<3?u[t]:null,residual:t<3?x[t+1]-x[t]-u[t]:null})};
}
