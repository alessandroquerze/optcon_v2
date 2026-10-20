/** Analytic enrichment models for Optimization 26–33. No formula-string evaluation. */
export type Vec2=readonly[number,number];
export type Mat2=readonly[Vec2,Vec2];
export const dot=(a:Vec2,b:Vec2)=>a[0]*b[0]+a[1]*b[1];
export const norm=(a:Vec2)=>Math.hypot(...a);
export const quadraticCost=(x:number,y:number)=>(x*x+4*y*y)/2;
export const quadraticGradient=(z:Vec2):Vec2=>[z[0],4*z[1]];
export const addStep=(z:Vec2,d:Vec2,gamma:number):Vec2=>[z[0]+gamma*d[0],z[1]+gamma*d[1]];
const clean=(x:number)=>Math.abs(x)<1e-14?0:x;
export const trig=(degrees:number):Vec2=>[clean(Math.cos(degrees*Math.PI/180)),clean(Math.sin(degrees*Math.PI/180))];
export function rotatedDescent(angle:number){
  const current:Vec2=[1,.5],g=quadraticGradient(current),length=norm(g),[c,s]=trig(angle);
  const u:Vec2=[-g[0]/length,-g[1]/length];
  const direction:Vec2=[c*u[0]-s*u[1],s*u[0]+c*u[1]];
  // The analytic product avoids classifying a right angle from floating-point roundoff.
  const slope=c===0?0:-length*c,curvature=direction[0]**2+4*direction[1]**2;
  const change=(gamma:number)=>gamma*slope+gamma*gamma*curvature/2;
  const profile=(gamma:number)=>quadraticCost(...current)+change(gamma);
  return {current,g,direction,slope,curvature,change,profile,
    crossing:slope<0?-2*slope/curvature:null,bestStep:slope<0?-slope/curvature:0};
}
export function scalarGradientStep(a:number,gamma:number){
  const value=(z:number)=>z*z/2,current=a,next=a*(1-gamma),linearChange=-gamma*a*a;
  const remainder=gamma*gamma*a*a/2,change=linearChange+remainder;
  return {value,current,next,gradient:a,cost:value(next),initial:value(a),linearChange,remainder,change,
    profile:(g:number)=>value(a)*(1-g)**2,tangent:(g:number)=>value(a)-g*a*a};
}
export function gradientIterations(gamma:number,count=13){
  const states:Vec2[]=[[1.5,1]];
  for(let k=1;k<count;k++){
    const previous=states[k-1];
    states.push([(1-gamma)*previous[0],(1-4*gamma)*previous[1]]);
  }
  return {states,costs:states.map(p=>quadraticCost(...p))};
}
export function spdDirection(scale:number,angle:number,atOrigin=false){
  const [c,s]=trig(angle),current:Vec2=atOrigin?[0,0]:[1,.5];
  const matrix:Mat2=[[c*c+scale*s*s,(1-scale)*c*s],[(1-scale)*c*s,s*s+scale*c*c]];
  const gradient=quadraticGradient(current);
  const direction:Vec2=atOrigin?[0,0]:[-dot(matrix[0],gradient),-dot(matrix[1],gradient)];
  const next=addStep(current,direction,.2);
  return {matrix,current,gradient,direction,next,slope:dot(gradient,direction),minimumEigenvalue:Math.min(1,scale),
    cost:quadraticCost(...next)};
}
export const nonlinearCost=(x:number,y:number)=>quadraticCost(x,y)+x**4/4;
export const nonlinearGradient=(z:Vec2):Vec2=>[z[0]+z[0]**3,4*z[1]];
export const nonlinearHessian=(z:Vec2):Mat2=>[[1+3*z[0]**2,0],[0,4]];
export function finiteDifferenceHessian(fn:(x:number,y:number)=>number,z:Vec2,h:number):Mat2{
  if(!(h>0))throw new Error('h must be strictly positive');
  const [x,y]=z,center=fn(x,y);
  const xx=(fn(x+h,y)-2*center+fn(x-h,y))/(h*h);
  const yy=(fn(x,y+h)-2*center+fn(x,y-h))/(h*h);
  const xy=(fn(x+h,y+h)-fn(x+h,y-h)-fn(x-h,y+h)+fn(x-h,y-h))/(4*h*h);
  return [[xx,xy],[xy,yy]];
}
function solveSPD(matrix:Mat2,rhs:Vec2):Vec2{
  const det=matrix[0][0]*matrix[1][1]-matrix[0][1]*matrix[1][0];
  if(!(matrix[0][0]>0&&det>0))throw new Error('A positive definite Hessian is required');
  return [(matrix[1][1]*rhs[0]-matrix[0][1]*rhs[1])/det,(-matrix[1][0]*rhs[0]+matrix[0][0]*rhs[1])/det];
}
export const directionMethodNames=['Steepest descent','Newton: Hessiana esatta','Newton discretizzato'] as const;
export function directionMethod(method:number,h:number,gamma:number){
  const current:Vec2=[.8,.6],gradient=nonlinearGradient(current),exact=nonlinearHessian(current);
  const approximation=finiteDifferenceHessian(nonlinearCost,current,h);
  const positive=method===0?gradient:solveSPD(method===1?exact:approximation,gradient);
  const direction:Vec2=[-positive[0],-positive[1]],next=addStep(current,direction,gamma);
  return {current,gradient,direction,next,exact,approximation,slope:dot(gradient,direction),
    initial:nonlinearCost(...current),cost:nonlinearCost(...next),hessianError:Math.abs(approximation[0][0]-exact[0][0])};
}
export function normalizedDirection(radius:number,angle:number){
  const direction=trig(angle),gradient:Vec2=[radius,0];
  return {direction,gradient,slope:radius*direction[0],bestSlope:-radius,
    gap:radius*(1+direction[0]),bestDirection:radius===0?null:[-1,0] as Vec2};
}
