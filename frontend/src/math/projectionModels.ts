/** Explicit source/enrichment functions for Optimization 47–54. */
import type {Vec2} from './descentMethods';
import {dot,norm,trig,quadraticCost,quadraticGradient} from './descentMethods';
export type ConvexRegion=0|1; // unit disk / closed square
export const containsRegion=(z:Vec2,kind:ConvexRegion)=>kind===0?norm(z)<=1+1e-12:z.every(v=>Math.abs(v)<=1+1e-12);
export function projectRegion(z:Vec2,kind:ConvexRegion):Vec2{
  if(kind===1)return [Math.max(-1,Math.min(1,z[0])),Math.max(-1,Math.min(1,z[1]))];
  const length=norm(z);return length<=1?[...z]:[z[0]/length,z[1]/length];
}
export function boundaryPoint(degrees:number,kind:ConvexRegion):Vec2{
  const z=trig(degrees),scale=kind===0?1:Math.max(Math.abs(z[0]),Math.abs(z[1]));
  return [z[0]/scale,z[1]/scale];
}
export const regionBoundary=(kind:ConvexRegion):Vec2[]=>kind===1?[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]]:
  Array.from({length:181},(_,i)=>boundaryPoint(2*i,0));
export function firstOrderCase(kind:number,degrees:number){
  const candidate:Vec2=kind===0?[1,0]:[0,0],probe=boundaryPoint(degrees,0);
  const value=(x:number,y:number)=>kind===2?-(x*x+y*y)/2:((x-2)**2+y*y)/2;
  const gradient:Vec2=kind===2?[0,0]:[candidate[0]-2,candidate[1]];
  const direction:Vec2=[probe[0]-candidate[0],probe[1]-candidate[1]];
  return {candidate,probe,value,gradient,product:dot(gradient,direction),minimumProduct:-norm(gradient)-dot(gradient,candidate),
    costChange:value(...probe)-value(...candidate)};
}
export function projectionComparison(z:Vec2,degrees:number,kind:ConvexRegion){
  const projected=projectRegion(z,kind),competitor=boundaryPoint(degrees,kind);
  const normal:Vec2=[z[0]-projected[0],z[1]-projected[1]],delta:Vec2=[competitor[0]-projected[0],competitor[1]-projected[1]];
  const distance=norm(normal),angleProduct=dot(normal,delta);
  const gap=dot(delta,delta)-2*angleProduct;
  return {z,projected,competitor,distance,gap,angleProduct,inside:containsRegion(z,kind)};
}
export const projectedStart:Vec2=[.6,.8];
export function projectedStep(gamma:number,kind:ConvexRegion){
  const current=projectedStart,gradient=quadraticGradient(current),free:Vec2=[current[0]-gamma*gradient[0],current[1]-gamma*gradient[1]];
  const next=projectRegion(free,kind),initial=quadraticCost(...current),cost=quadraticCost(...next);
  return {current,gradient,free,next,initial,cost,change:cost-initial,freeFeasible:containsRegion(free,kind)};
}
export function feasibleStep(gamma:number,kind:ConvexRegion){
  const d=projectedStep(1,kind),tilde=d.next,direction:Vec2=[tilde[0]-d.current[0],tilde[1]-d.current[1]];
  const next:Vec2=[d.current[0]+gamma*direction[0],d.current[1]+gamma*direction[1]];
  const cost=quadraticCost(...next);
  return {...d,next,tilde,direction,cost,change:cost-d.initial,feasible:containsRegion(next,kind),slope:dot(d.gradient,direction)};
}
export function projectedQp(lambda:number,a:number,gamma:number,count=21){
  if(!(lambda>=0&&gamma>0&&Number.isFinite(lambda)&&Number.isFinite(a)&&Number.isFinite(gamma)))throw new Error('Invalid projected QP');
  const value=(x:number,y:number)=>(x*x+lambda*y*y)/2-a*x;
  const gradient=(z:Vec2):Vec2=>[z[0]-a,lambda*z[1]],states:Vec2[]=[projectedStart];
  const residual=(z:Vec2)=>{const g=gradient(z),p=projectRegion([z[0]-g[0],z[1]-g[1]],1);return Math.hypot(z[0]-p[0],z[1]-p[1]);};
  for(let k=1;k<count;k++){const z=states[k-1],g=gradient(z);states.push(projectRegion([z[0]-gamma*g[0],z[1]-gamma*g[1]],1));}
  const x=Math.max(-1,Math.min(1,a)),minima:Vec2[]=lambda===0?[[x,-1],[x,1]]:[[x,0]];
  return {value,gradient,states,minima,costs:states.map(z=>value(...z)),norms:states.map(z=>norm(gradient(z))),
    residuals:states.map(residual),stable:gamma<2/Math.max(1,lambda)};
}
export const courseQuartic=(z:number)=>z**4+2*z**3-12*z*z-2*z+6;
export const courseQuarticGradient=(z:number)=>4*z**3+6*z*z-24*z-2;
export const courseQuarticHessian=(z:number)=>12*z*z+12*z-24;
function bisectQuartic(low:number,high:number){
  let left=low,right=high,f=courseQuarticGradient(left);
  if(f*courseQuarticGradient(right)>0)throw new Error('Root is not bracketed');
  for(let i=0;i<80;i++){const mid=(left+right)/2,v=courseQuarticGradient(mid);if(v===0)return mid;
    if(f*v<=0)right=mid;else{left=mid;f=v;}}
  return (left+right)/2;
}
export const quarticCritical=[bisectQuartic(-4,-2),bisectQuartic(-.5,.5),bisectQuartic(1,3)];
export function exponentialCost(x:number,y:number){return Math.exp(x+3*y-.1)+Math.exp(x-3*y-.1)+Math.exp(-x-.1);}
export function costCatalog(kind:number,x:number,y=0){
  const dimension=kind<2?1:2;
  const value=kind===0?(x:number,_y=0)=>x*x:kind===1?(x:number,_y=0)=>courseQuartic(x):kind===2?exponentialCost:(x:number,y:number)=>(x*x+4*y*y)/2-x-y;
  let gradient:Vec2,hessianMinimum:number;
  if(kind===0){gradient=[2*x,0];hessianMinimum=2;}
  else if(kind===1){gradient=[courseQuarticGradient(x),0];hessianMinimum=courseQuarticHessian(x);}
  else if(kind===2){
    const e1=Math.exp(x+3*y-.1),e2=Math.exp(x-3*y-.1),e3=Math.exp(-x-.1);
    gradient=[e1+e2-e3,3*(e1-e2)];
    const xx=e1+e2+e3,yy=9*(e1+e2),xy=3*(e1-e2);
    hessianMinimum=(xx+yy-Math.hypot(xx-yy,2*xy))/2;
  }else{gradient=[x-1,4*y-1];hessianMinimum=1;}
  const minima:Vec2[]=kind===0?[[0,0]]:kind===1?[[quarticCritical[0],0]]:
    kind===2?[[-Math.log(2)/2,0]]:[[1,.25]];
  return {dimension,value,gradient,gradientNorm:norm(gradient),hessianMinimum,minima,cost:value(x,y),
    range:kind===2?1:kind===3?1.2:kind===1?4:2,
    zRange:kind===2?[0,52]:kind===3?[-1,8]:kind===1?[-80,35]:[-.2,16]};
}
export function barrierModel(epsilon:number,probe:number){
  if(!(epsilon>0&&Number.isFinite(epsilon)))throw new Error('Barrier weight must be positive');
  const original=(z:number)=>(z+1)**2/2;
  const barrier=(z:number)=>z>0?-epsilon*Math.log(z):null;
  const total=(z:number)=>z>0?original(z)-epsilon*Math.log(z):null;
  const minimum=2*epsilon/(1+Math.sqrt(1+4*epsilon));
  return {epsilon,probe,original,barrier,total,minimum,minimumCost:total(minimum)!,probeBarrier:barrier(probe),probeCost:total(probe),
    valid:probe>0,originalFeasible:probe>=0};
}
