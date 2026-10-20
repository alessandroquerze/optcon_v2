import type {Vec2} from './descentMethods';
export type PrimalDual={z:Vec2;lambda:number};
export const sqpCost=(x:number,y:number)=>.5*(x*x+(y-1)**2);
export const parabola=(x:number):Vec2=>[x,x*x];
export function kktResidual(p:PrimalDual){
 const [x,y]=p.z,g:Vec2=[(1-2*p.lambda)*x,y-1+p.lambda],h=y-x*x;
 return {g,h,stationarity:Math.hypot(...g),norm:Math.hypot(...g,h),cost:sqpCost(x,y)};
}
export type QpStatus='unique_minimum'|'minimum_family'|'unbounded';
export function localNewton(p:PrimalDual){
 const [x,y]=p.z,{lambda}=p,r=kktResidual(p),B=1-2*lambda,D=B+4*x*x,rhs=x*(1-2*x*x);
 const constant=-(y-1)*r.h+.5*r.h*r.h;
 const model=(s:number)=>(.5*D*s-rhs)*s+constant;
 const displacement=(s:number):Vec2=>[s,-r.h+2*x*s];
 const qpStatus:QpStatus=D>0?'unique_minimum':D===0&&rhs===0?'minimum_family':'unbounded';
 const common={p,r,B,D,rhs,model,displacement,qpStatus};
 if(D===0){
  // At x=0, the free tangent component does not enter dual stationarity.
  // A family of primal solutions can therefore have one determined multiplier.
  const lambdaQp=rhs===0&&x===0?1:null;
  return {...common,status:rhs===0?'singular_family' as const:'inconsistent' as const,
   delta:null,deltaLambda:lambdaQp===null?null:lambdaQp-lambda,lambdaQp,next:null,linearResidual:null,systemResidual:null};
 }
 const dx=rhs/D,delta=displacement(dx),lambdaQp=1-x*x-2*x*dx,deltaLambda=lambdaQp-lambda;
 const next:PrimalDual={z:[x+delta[0],y+delta[1]],lambda:lambda+deltaLambda};
 const linearResidual=r.h-2*x*delta[0]+delta[1];
 const systemResidual=Math.hypot(B*dx-2*x*deltaLambda+r.g[0],delta[1]+deltaLambda+r.g[1],linearResidual);
 if(![...delta,deltaLambda,lambdaQp,...next.z,next.lambda,kktResidual(next).norm,kktResidual(next).cost].every(Number.isFinite))
  return {...common,status:'numerical_limit' as const,delta:null,deltaLambda:null,lambdaQp:null,next:null,linearResidual:null,systemResidual:null};
 return {...common,status:'unique' as const,delta,deltaLambda,lambdaQp,next,linearResidual,systemResidual};
}
export type SqpStep=ReturnType<typeof localNewton>;
export function nonlinearStepResidual(step:SqpStep,theta:number){
 if(!step.delta)return null;
 const linear=(1-theta)*step.r.h;
 return {linear,actual:linear-(theta*step.delta[0])**2};
}
export function primalDualIterations(initial:PrimalDual,method:'newton'|'sqp',maxSteps=12){
 const states:PrimalDual[]=[initial];let status='orizzonte di osservazione raggiunto';
 for(let k=0;k<maxSteps;k++){
  const current=states.at(-1)!,r=kktResidual(current);
  if(r.norm<=1e-10){status='residuo KKT entro tolleranza';break;}
  const step=localNewton(current);
  if(step.status!=='unique'){
   status=step.status==='singular_family'?'sistema singolare: infinite direzioni':step.status==='inconsistent'?'sistema singolare incompatibile':'limite numerico raggiunto';break;
  }
  if(method==='sqp'&&step.qpStatus!=='unique_minimum'){
   status=step.qpStatus==='minimum_family'?'QP con minimi multipli: direzione non unica':'QP illimitato: nessun passo SQP';break;
  }
  states.push(method==='sqp'?{z:step.next.z,lambda:step.lambdaQp}:step.next);
 }
 if(kktResidual(states.at(-1)!).norm<=1e-10)status='residuo KKT entro tolleranza';
 return {states,residuals:states.map(p=>kktResidual(p).norm),status,
  finalType:Math.abs(states.at(-1)!.z[0])<1e-7?'La radice all’origine è un massimo locale sul vincolo.':'Una radice KKT va ancora classificata; i minimi noti sono (±1/√2,1/2).'};
}
