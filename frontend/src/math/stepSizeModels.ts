/** Explicit enrichment models for Optimization 38–46. No evaluation of source strings. */
import type {Vec2} from './descentMethods';
import {quadraticCost,quadraticGradient} from './descentMethods';

export function armijoTrials(beta:number,c:number,initial=1,a=1){
  if(!(beta>0&&beta<1&&c>0&&c<1&&initial>0))throw new Error('Invalid Armijo parameters');
  const profile=(gamma:number)=>a*a*(1-2*gamma)**2;
  const threshold=(gamma:number)=>a*a*(1-4*c*gamma);
  const tangent=(gamma:number)=>a*a*(1-4*gamma);
  const trials:{gamma:number;cost:number;threshold:number;gap:number;accepted:boolean}[]=[];
  if(a===0)return {trials,profile,threshold,tangent,status:'stationary' as const};
  let gamma=initial;
  for(let i=0;i<512;i++){
    // Exact algebra of this example avoids cancellation at the strict equality boundary.
    const gap=4*a*a*gamma*(gamma-(1-c)),accepted=gamma<1-c;
    trials.push({gamma,cost:profile(gamma),threshold:threshold(gamma),gap,accepted});
    if(accepted)return {trials,profile,threshold,tangent,status:'accepted' as const};
    gamma*=beta;
    if(gamma===0)break;
  }
  return {trials,profile,threshold,tangent,status:'numerical_limit' as const};
}
export function powerSteps(alpha:number,count:number){
  const steps=Array.from({length:count},(_,k)=>1/(k+1)**alpha);
  let s=0,t=0;
  const sums=steps.map(v=>s+=v),squares=steps.map(v=>t+=v*v);
  return {steps,sums,squares,sumDiverges:alpha<=1,squaresConverge:alpha>.5};
}
export function armijoIterations(beta:number,count=25){
  if(!(beta>0&&beta<1))throw new Error('Invalid reduction factor');
  const states:Vec2[]=[[1.5,1]],steps:number[]=[],rejections:number[]=[];
  let stopped=false;
  for(let k=1;k<count;k++){
    const z=states[k-1],g=quadraticGradient(z),normSquared=g[0]**2+g[1]**2;
    if(Math.sqrt(normSquared)<1e-10){stopped=true;break;}
    const curvature=g[0]**2+4*g[1]**2,boundary=normSquared/curvature; // c=1/2
    let gamma=1,i=0;
    while(gamma>=boundary&&i<512){gamma*=beta;i++;}
    if(!(gamma>0&&gamma<boundary)){stopped=true;break;}
    states.push([z[0]-gamma*g[0],z[1]-gamma*g[1]]);
    steps.push(gamma);rejections.push(i);
  }
  return {states,steps,rejections,costs:states.map(z=>quadraticCost(...z)),
    gradients:states.map(z=>Math.hypot(...quadraticGradient(z))),stopped};
}
export function scalarIterations(linear:boolean,diminishing:boolean,gamma:number,alpha:number,count=21){
  const states=[1],steps:number[]=[];
  const cost=(z:number)=>linear?z:z*z/2,gradient=(z:number)=>linear?1:z;
  for(let k=0;k<count-1;k++){
    const step=diminishing?1/(k+1)**alpha:gamma;
    states.push(states[k]-step*gradient(states[k]));steps.push(step);
  }
  return {states,steps,costs:states.map(cost),gradients:states.map(z=>Math.abs(gradient(z)))};
}
export function alternatingSequence(count:number){
  return Array.from({length:count},(_,k)=>({k,z:k%2===0?1:-1}));
}
export function coercivityCase(kind:number,a:number){
  const value=(z:number)=>kind===0?z*z/2:kind===1?(z*z-1)**2/4:Math.exp(-z);
  const gradient=(z:number)=>kind===0?z:kind===1?z*(z*z-1):-Math.exp(-z);
  const minima=kind===0?[0]:kind===1?[-1,1]:[];
  const stationary=kind===0?a===0:kind===1?(a===0||Math.abs(a)===1):false;
  const atMaximum=kind===1&&a===0;
  return {value,gradient,cost:value(a),derivative:gradient(a),minima,coercive:kind!==2,convex:kind!==1,stationary,atMaximum,
    yRange:kind===0?[-.2,2]:kind===1?[-.1,1.4]:[-.2,6.5]};
}
export function qpIterations(lambda:number,b:number,gamma:number,count=21){
  if(!(lambda>=0&&gamma>0&&Number.isFinite(lambda)&&Number.isFinite(b)&&Number.isFinite(gamma)))throw new Error('Invalid QP model');
  const value=(x:number,y:number)=>(x*x+lambda*y*y)/2+b*y;
  const gradient=(z:Vec2):Vec2=>[z[0],lambda*z[1]+b];
  const states:Vec2[]=[[1.5,1]];
  for(let k=1;k<count;k++){
    const z=states[k-1],g=gradient(z);
    states.push([z[0]-gamma*g[0],z[1]-gamma*g[1]]);
  }
  const minimizer:Vec2|null=lambda>0?[0,-b/lambda]:null;
  const kind=lambda>0?'unique':b===0?'line':'none';
  const bound=2/Math.max(1,lambda);
  return {lambda,b,gamma,value,gradient,states,costs:states.map(z=>value(...z)),
    gradients:states.map(z=>Math.hypot(...gradient(z))),minimizer,kind,bound,stable:gamma<bound,
    minimizerFinite:minimizer!==null&&minimizer.every(Number.isFinite)};
}
