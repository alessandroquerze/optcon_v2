import type { ScalarGrid,CurveSeries } from '../numeric-data/types';

export const wellCost=(z:number,tilt:number)=>(z*z-1)**2+tilt*z;
const wellDerivative=(z:number,tilt:number)=>4*z*(z*z-1)+tilt;
function rootBetween(fn:(x:number)=>number,lower:number,upper:number){
  let left=lower,right=upper,sign=fn(left);
  for(let i=0;i<60;i++){
    const middle=(left+right)/2,value=fn(middle);
    if(Math.abs(value)<1e-14)return middle;
    if(sign*value<=0)right=middle;else {left=middle;sign=value;}
  }
  return (left+right)/2;
}
/** |tilt|<=.5: the derivative has three simple roots, bracketed by its extrema. */
export function doubleWell(tilt:number,choice:number,radius:number){
  if(Math.abs(tilt)>.5||radius<=0)throw new RangeError('Parametri fuori dalla famiglia dichiarata.');
  const turning=1/Math.sqrt(3),fn=(z:number)=>wellDerivative(z,tilt);
  const critical=[rootBetween(fn,-2,-turning),rootBetween(fn,-turning,turning),rootBetween(fn,turning,2)];
  const candidate=critical[[0,2,1][choice]??0],cost=wellCost(candidate,tilt);
  const minima=[critical[0],critical[2]],best=Math.min(...minima.map(z=>wellCost(z,tilt)));
  const global=Math.abs(cost-best)<1e-9,local=12*candidate*candidate-4>0;
  const low=candidate-radius,high=candidate+radius;
  const intervalCost=Math.min(...[low,high,...critical.filter(z=>z>low&&z<high)].map(z=>wellCost(z,tilt)));
  return {critical,candidate,cost,leftCost:wellCost(critical[0],tilt),rightCost:wellCost(critical[2],tilt),
    local,global,strictGlobal:global&&tilt!==0,neighborhoodValid:intervalCost>=cost-1e-9};
}
const smoothstep=(t:number)=>3*t*t-2*t*t*t;
/** C1 illustrative profile, not a digitization of the source figure. */
export function plateauCost(z:number){
  if(z<-2)return (z+2)**2;
  if(z<0)return 3*smoothstep((z+2)/2);
  if(z<2)return 3-2*smoothstep(z/2);
  if(z<=3)return 1;
  return 1+(z-3)**2;
}
export function scalarQuadratic(z:number,a:number,c:number){return (z-a)**2+c;}
export function coupledQuadratic(x:number,y:number,rho:number){
  return {value:.5*(x*x+2*rho*x*y+2*y*y),gradient:[x+rho*y,rho*x+2*y] as const,hessian:[[1,rho],[rho,2]] as const};
}
export function vectorFunction(x:number,y:number){
  const gradient=[[2*x,y,0],[1,x,2]];
  return {value:[x*x+y,x*y,2*y],gradient,jacobian:gradient[0].map((_,j)=>gradient.map(row=>row[j]))};
}
export const stationaryNames=['Minimo quadratico','Sella','Massimo quadratico','Minimo quartico piatto','Massimo quartico piatto'] as const;
export function stationaryExample(preset:number){
  const functions=[(x:number,y:number)=>x*x+y*y,(x:number,y:number)=>x*x-y*y,
    (x:number,y:number)=>-x*x-y*y,(x:number,y:number)=>x**4+y**4,(x:number,y:number)=>-(x**4)-y**4];
  if(!functions[preset])throw new RangeError('Caso stazionario inesistente.');
  const eigenvalues=[[2,2],[2,-2],[-2,-2],[0,0],[0,0]][preset];
  return {fn:functions[preset],eigenvalues,semidefinite:eigenvalues.every(v=>v>=0),minimum:preset===0||preset===3,
    classification:['minimo globale stretto','punto di sella','massimo globale stretto','minimo globale stretto','massimo globale stretto'][preset]};
}
export function localSufficiency(alpha:number,beta:number){
  const fn=(x:number,y:number)=>.5*(x*x+alpha*y*y)+beta*y**4;
  const positiveDefinite=alpha>0;
  const classification=alpha<0||(alpha===0&&beta<0)?'sella':alpha===0&&beta===0?'minimo non stretto':'minimo stretto';
  const global=alpha>=0&&beta>=0;
  return {fn,positiveDefinite,classification,global,unbounded:beta<0||(beta===0&&alpha<0),comparison:fn(0,1)};
}
export function curveData(id:string,fn:(x:number)=>number,low:number,high:number,count=241):CurveSeries {
  return {id,label:id,points:Array.from({length:count},(_,i)=>{const x=low+(high-low)*i/(count-1);return{id:id+':'+i,x,y:fn(x)};})};
}
export function functionGrid(id:string,fn:(x:number,y:number)=>number,low:number,high:number,label='ℓ(z)',count=41):ScalarGrid {
  const axis=Array.from({length:count},(_,i)=>low+(high-low)*i/(count-1));
  return {id,x:axis,y:[...axis],z:axis.map(y=>axis.map(x=>fn(x,y))),axes:[{label:'z₁',unit:'1'},{label:'z₂',unit:'1'},{label,unit:'valore'}]};
}
