import type {Vec2} from './descentMethods';
import {quadraticCost} from './descentMethods';

export type RootStatus='step'|'root'|'numerical_root'|'singular'|'numerical_limit';
/** A scalar system illustrating the course Jacobian convention; no inverse is formed. */
export function rootNewton(c:number,alpha:number){
  const residual=c*c-alpha,derivative=2*c;
  let status:RootStatus='step',increment:number|null=null,next:number|null=null;
  if(residual===0)status='root';
  else if(Math.abs(residual)<=1e-12)status='numerical_root';
  else if(derivative===0)status='singular';
  else{
    increment=-residual/derivative;next=c+increment;
    if(!Number.isFinite(increment)||!Number.isFinite(next)){status='numerical_limit';increment=null;next=null;}
  }
  const fn=(z:number)=>z*z-alpha,linear=(z:number)=>residual+derivative*(z-c);
  return {c,alpha,residual,derivative,status,increment,next,fn,linear,
    inside:next!==null&&Math.abs(next)<=2.5,
    nextResidual:next!==null&&Number.isFinite(fn(next))?fn(next):null};
}
export const cubicCost=(z:number)=>z**3/3-z;
export function cubicNewton(a:number){
  const gradient=a*a-1,hessian=2*a,cost=cubicCost(a);
  const increment=hessian===0?null:-gradient/hessian;
  const next=increment===null||!Number.isFinite(increment)?null:a+increment;
  const point=next!==null&&Number.isFinite(next)?next:null;
  const model=(z:number)=>cost+gradient*(z-a)+hessian*(z-a)**2/2;
  const modelMinimum=hessian>0&&point!==null?point:null;
  return {a,gradient,hessian,cost,increment:point===null?null:increment,next:point,model,modelMinimum,
    inside:point!==null&&Math.abs(point)<=2.5,
    modelValue:point!==null&&Number.isFinite(model(point))?model(point):null,
    nextCost:point!==null&&Number.isFinite(cubicCost(point))?cubicCost(point):null,
    modelKind:hessian>0?'minimo unico':hessian<0?'massimo, nessun minimo':'lineare, nessun minimo',
    stationary:gradient===0};
}
/** The true cost and the surrogate share their value/gradient at the anchor, but not generally curvature. */
export function metricModel(d1:number,d2:number){
  const current:Vec2=[1,.5],gradient:Vec2=[1,2],initial=quadraticCost(...current);
  if(!(d1>0&&d2>0))throw new Error('D must be positive definite');
  const increment:Vec2=[-d1,-2*d2],next:Vec2=[current[0]+increment[0],current[1]+increment[1]];
  const model=(x:number,y:number)=>{
    const dx=x-current[0],dy=y-current[1];
    return initial+gradient[0]*dx+gradient[1]*dy+(dx*dx/d1+dy*dy/d2)/2;
  };
  const minimum=initial-(d1+4*d2)/2,actual=quadraticCost(...next);
  return {d1,d2,current,gradient,increment,next,initial,model,minimum,actual,change:actual-initial,
    inverseDiagonal:[1/d1,1/d2] as Vec2};
}
