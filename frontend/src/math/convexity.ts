import type {CurveSeries,Point} from '../numeric-data/types';
import {functionGrid} from './optimizationFoundations';

export type XY=readonly[number,number];
const dot=(a:XY,b:XY)=>a[0]*b[0]+a[1]*b[1];
export const circle=(id:string,cx:number,cy:number,rx:number,ry=rx):CurveSeries=>({
  id,label:id,points:Array.from({length:181},(_,i)=>{const t=2*Math.PI*i/180;return{id:id+i,x:cx+rx*Math.cos(t),y:cy+ry*Math.sin(t)};}),
});
export function segmentSet(kind:number,theta:number){
  const a:XY=kind===0?[-1.4,-.15]:[-1.2,0],b:XY=kind===0?[1.2,.45]:[1.2,0];
  const contains=(p:XY)=>kind===0?(p[0]/1.8)**2+(p[1]/1.2)**2<=1+1e-12:
    p[0]**2+p[1]**2>=.65**2-1e-12&&p[0]**2+p[1]**2<=1.5**2+1e-12;
  const point:XY=[theta*a[0]+(1-theta)*b[0],theta*a[1]+(1-theta)*b[1]];
  return{a,b,point,inside:contains(point),contains,convex:kind===0};
}
export const jensenNames=['Quadratica convessa','Affine: convessa, non stretta','Quadratica concava'] as const;
export function jensen(kind:number,theta:number){
  const coefficient=[1,0,-1][kind],fn=(z:number)=>coefficient*z*z+(kind===1?z:0);
  const a=-1,b=1,z=theta*a+(1-theta)*b,value=fn(z),chord=theta*fn(a)+(1-theta)*fn(b);
  return {fn,a,b,z,value,chord,gap:chord-value,strict:kind===0,convex:kind!==2};
}
export const inequalityNames=['Ellisse','Semipiano','Controesempio al “solo se”'] as const;
export const equalityNames=['Affine: retta','Non lineare: stessa retta','Quadratico: circonferenza'] as const;
export function constraintLevel(equality:boolean,kind:number,c:number,probeX:number){
  const fn=equality?(kind===0?(x:number,y:number)=>x+y-c:kind===1?(x:number,y:number)=>(x+y-c)**3:
    (x:number,y:number)=>x*x+y*y-c):
    kind===0?(x:number,y:number)=>x*x+2*y*y-c:kind===1?(x:number,y:number)=>x+y-c:
      (x:number,_y:number)=>x*x*(x*x-1)-c;
  const id='optimization-'+(equality?'equality':'inequality');
  const grid=functionGrid(id,fn,-2,2,equality?'h(z)':'g(z)',61);
  // Test geometry rather than an arbitrary residual tolerance: cubing h must not thicken its zero set.
  const contains=(x:number,y:number)=>equality?
    kind<2?Math.abs(x+y-c)<=1e-12:c===0?x===0&&y===0:Math.abs(x*x+y*y-c)<=1e-12:
    kind===0?(c===0?x===0&&y===0:x*x+2*y*y<=c+1e-12):kind===1?x+y<=c+1e-12:
      Math.abs(x)<=Math.sqrt((1+Math.sqrt(1+4*c))/2)+1e-12;
  const mask={...grid,id:id+'-mask',z:grid.y.map(y=>grid.x.map(x=>contains(x,y)?1:0))};
  const plane={...grid,id:id+'-zero',z:grid.z.map(row=>row.map(()=>0))};
  let boundary:CurveSeries[];
  if((!equality&&kind===0)||(equality&&kind===2)){
    boundary=[c===0?{id:id+'-singleton',label:'Unico punto ammissibile',discrete:true,points:[{id:'zero',x:0,y:0}]}:
      circle(id+'-boundary',0,0,Math.sqrt(c),Math.sqrt(c/(equality?1:2)))];
  }else if(!equality&&kind===2){
    const r=Math.sqrt((1+Math.sqrt(1+4*c))/2);
    boundary=[-r,r].map((x,i)=>({id:id+i,label:'Bordo della striscia',points:[{id:'a',x,y:-2},{id:'b',x,y:2}]}));
  }else boundary=[{id:id+'-line',label:'Retta di livello zero',points:[{id:'a',x:-2,y:c+2},{id:'b',x:2,y:c-2}]}];
  const value=fn(probeX,0),feasible=contains(probeX,0);
  const point:Point={id:id+'-probe',x:probeX,y:0,z:value};
  return {fn,grid,mask,plane,boundary,point,value,feasible,
    convex:!equality||kind!==2||c===0,
    kind:!equality?(kind===0?(c===0?'singleton':'ellisse piena'):kind===1?'semipiano':'striscia convessa'):
      kind!==2?(c===0?'sottospazio lineare':'retta affine'):c===0?'singleton convesso':'circonferenza non convessa'};
}
export const quartic=(z:number,mu=0)=>z**4/4+mu*z*z/2;
export const quarticGradient=(z:number,mu=0)=>z**3+mu*z;
export function firstOrder(a:number,b:number,mu=1){
  const gradientA=quarticGradient(a,mu),gradientB=quarticGradient(b,mu);
  const valueA=quartic(a,mu),valueB=quartic(b,mu),tangentB=valueA+gradientA*(b-a);
  const distanceSquared=(a-b)**2,monotonicity=(gradientA-gradientB)*(a-b);
  return {a,b,gradientA,gradientB,valueA,valueB,tangentB,gap:valueB-tangentB,distanceSquared,monotonicity,
    lower:mu*distanceSquared,ratio:distanceSquared>0?monotonicity/distanceSquared:null};
}
/** Bounds are admissible, not necessarily the best constants. All dimensions are numerical and dimensionless. */
export function smoothQuadratic(mu:number,L:number,angle:number,refined=false){
  if(!(mu>0&&L>=mu))throw new RangeError('Occorre 0 < µ ≤ L.');
  const lambda=refined?(mu+L)/2:L;
  const delta:XY=[Math.cos(angle),Math.sin(angle)],gradient:XY=[mu*delta[0],lambda*delta[1]];
  const normSquared=dot(gradient,gradient),M=dot(gradient,delta);
  const gamma1=mu*L/(mu+L),gamma2=1/(mu+L),rhs=refined?gamma1+gamma2*normSquared:normSquared/L;
  const normalized:XY=[gradient[0]/L,gradient[1]/L];
  const center:XY=refined?[(mu+L)*delta[0]/2,(mu+L)*delta[1]/2]:[delta[0]/2,delta[1]/2];
  const radius=refined?(L-mu)/2:.5;
  const plotted=refined?gradient:normalized;
  return {L,delta,gradient,norm:Math.sqrt(normSquared),normSquared,M,gamma1,gamma2,rhs,margin:M-rhs,
    center,radius,plotted,lambda,value:(x:number,y:number)=>.5*(mu*x*x+lambda*y*y)};
}
