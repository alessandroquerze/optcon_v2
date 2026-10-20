/** Explicit enrichment models; source formula strings are never evaluated. */
export function lowerSupport(a:number,b:number){
  const mu=.5,value=(z:number)=>mu*z*z/2+z**4/4,gradient=(z:number)=>mu*z+z**3;
  const affine=(z:number)=>value(a)+gradient(a)*(z-a);
  const bound=(z:number)=>affine(z)+mu/2*(z-a)**2;
  return {mu,value,affine,bound,cost:value(b),estimate:bound(b),margin:value(b)-bound(b)};
}
export function upperSupport(a:number,b:number){
  // Hessian cos(z) is bounded in absolute value by one globally. Convexity is unnecessary.
  const L=1,value=(z:number)=>1-Math.cos(z),gradient=(z:number)=>Math.sin(z);
  const affine=(z:number)=>value(a)+gradient(a)*(z-a);
  const bound=(z:number)=>affine(z)+L/2*(z-a)**2;
  return {L,value,affine,bound,cost:value(b),estimate:bound(b),margin:bound(b)-value(b)};
}
export function proofSegment(theta:number){
  const candidate=1,better=0,value=(z:number)=>z*z;
  const z=theta*candidate+(1-theta)*better,chord=theta*value(candidate)+(1-theta)*value(better);
  return {value,z,chord,cost:value(z),distance:1-theta,improvement:1-value(z)};
}
export const stationaryNames=['Quadratica: minimo unico','Quartica: Hessiana nulla al minimo','Costante: ogni punto è minimo'] as const;
export function convexStationarity(which:number,z:number){
  const value=(x:number)=>which===0?x*x/2:which===1?x**4/4:0;
  const gradient=(x:number)=>which===0?x:which===1?x**3:0;
  const hessian=which===0?1:which===1?3*z*z:0;
  return {value,gradient:gradient(z),hessian,cost:value(z),stationary:which===2||z===0,unique:which!==2};
}
export const quadraticCases=['Q positiva definita','Q singolare, q compatibile','Q singolare, deriva lineare','Q indefinita: sella'] as const;
export const positiveCases=['Curvatura 2: isotropa','Curvatura 0.5: valle allungata','Curvatura 0: matrice singolare'] as const;
export function quadraticModel(lambda:number,b:number,t=.5){
  const value=(x:number,y:number)=>x*x+lambda*y*y/2-x+b*y;
  const gradient=(x:number,y:number):[number,number]=>[2*x-1,lambda*y+b];
  const psd=lambda>=0,pd=lambda>0,compatible=lambda!==0||b===0;
  const kind=!psd?'illimitato inferiormente':!compatible?'illimitato inferiormente':pd?'minimo globale unico':'infiniti minimi globali';
  const minimizer:readonly[number,number]|null=psd&&compatible?[.5,pd?-b/lambda:0]:null;
  const stationary:readonly[number,number]|null=compatible?[.5,lambda!==0?-b/lambda:0]:null;
  const probe:readonly[number,number]=[.5,t],g=gradient(...probe);
  return {lambda,b,value,gradient,psd,pd,compatible,kind,minimizer,stationary,probe,
    residual:Math.hypot(...g),cost:value(...probe),minimum:minimizer?value(...minimizer):null,
    // Descent witnesses exist on the full real line, beyond the plot window.
    descentY:(s:number)=>lambda<0?s:b===0?0:-Math.sign(b)*s};
}
export function quadraticCase(which:number,t:number){
  return quadraticModel(which===0?1:which===3?-1:0,which===0?-.5:which===2?.5:0,t);
}
