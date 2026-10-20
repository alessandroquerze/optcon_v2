import type {Vec2,Mat2} from './descentMethods';
import {exactSegmentMultipliers,kktBalance} from './kktModels';
/** Cardinal angles are handled exactly; small nonzero angles remain nonzero. */
export function degreeTrig(degrees:number):Vec2{
 const c=degrees%180===90||degrees%180===-90?0:Math.cos(degrees*Math.PI/180);
 const s=degrees%180===0?0:Math.sin(degrees*Math.PI/180);
 return [c,s];
}
export const circlePoint=(theta:number):Vec2=>{const [c,s]=degreeTrig(theta);return [s,-c];};
export function circleModel(alpha:number,beta:number,theta:number,phi=0){
 const value=(x:number,y:number)=>.5*alpha*x*x+beta*y;
 const candidate:Vec2=[0,-1],probe=circlePoint(theta),[c,s]=degreeTrig(phi),direction:Vec2=[c,s];
 const delta=2*Math.sin(theta*Math.PI/360)**2;
 const change=delta*(alpha+beta-.5*alpha*delta);
 const reduced=alpha+beta,form=reduced*c*c+beta*s*s;
 const type=reduced>0?'Minimo locale stretto.':reduced<0?'Massimo locale sul vincolo.':
  beta>0?'Minimo stretto piatto: il termine di ordine quattro decide.':beta<0?'Massimo locale piatto.':'Costo costante sul vincolo.';
 return {value,candidate,probe,lambda:beta,gradient:[0,beta] as Vec2,normal:[0,-1] as Vec2,
  constraintGradientNorm:1,stationarity:0,change,direction,directionalConstraint:-s,inTest:phi%180===0,reduced,form,type,
  lagrangianHessian:[[reduced,0],[0,beta]] as Mat2};
}
export function complementaryModel(a:number,perturbed:boolean){
 const {mu1,mu2,lambda}=exactSegmentMultipliers(a),offset=perturbed?.4:0;
 return kktBalance(a,mu1+offset,mu2+offset,lambda);
}
export const normalBasis:Vec2=[Math.SQRT1_2,Math.SQRT1_2];
export const tangentBasis:Vec2=[Math.SQRT1_2,-Math.SQRT1_2];
export const qpPoint=(b:number,s:number):Vec2=>[b/2+s*Math.SQRT1_2,b/2-s*Math.SQRT1_2];
export function equalityQp(kappa:number,nu:number,sigma:number,b:number){
 const Q:Mat2=[[(nu+kappa)/2,(nu-kappa)/2],[(nu-kappa)/2,(nu+kappa)/2]];
 const q:Vec2=[sigma*Math.SQRT1_2,-sigma*Math.SQRT1_2];
 // Coordinates in the orthonormal normal/tangent basis avoid cancellation in the model.
 const value=(x:number,y:number)=>{const s=(x-y)*Math.SQRT1_2,n=(x+y)*Math.SQRT1_2;return .5*kappa*s*s+.5*nu*n*n+sigma*s;};
 const profile=(s:number)=>.5*kappa*s*s+sigma*s+nu*b*b/4;
 const status=kappa===0?(sigma===0?'affine_family':'inconsistent'):'unique_point';
 const sStar=kappa===0?(sigma===0?0:null):-sigma/kappa;
 const candidate=sStar===null?null:qpPoint(b,sStar),lambda=-nu*b/2;
 return {Q,q,value,profile,curve:(s:number)=>qpPoint(b,s),status,sStar,candidate,lambda,
  determinant:-2*kappa,reduced:kappa,
  classification:kappa>0?'Minimo globale unico sul vincolo.':kappa<0?'Stazionario massimo; costo illimitato inferiormente.':
   sigma===0?'Ogni punto della retta è minimo.':'Primo ordine incompatibile: costo illimitato inferiormente.'};
}
export function equalityQpSystem(kappa:number,sigma:number,b:number,redundant=false){
 const d=equalityQp(kappa,-1,sigma,b);
 const A=redundant?[[1,1],[2,2]]:[[1,1]],rhs=redundant?[b,2*b]:[b];
 const lambda=redundant?[d.lambda,0]:[d.lambda];
 let residual:number|null=null;
 if(d.candidate){
  const z=d.candidate;
  const g=[d.Q[0][0]*z[0]+d.Q[0][1]*z[1]+d.q[0],d.Q[1][0]*z[0]+d.Q[1][1]*z[1]+d.q[1]];
  residual=Math.hypot(g[0]+lambda.reduce((s,v,i)=>s+A[i][0]*v,0),g[1]+lambda.reduce((s,v,i)=>s+A[i][1]*v,0),...rhs.map((v,i)=>A[i][0]*z[0]+A[i][1]*z[1]-v));
 }
 return {...d,A,rhs,multipliers:lambda,residual,determinant:redundant?0:d.determinant,
  systemStatus:d.status==='inconsistent'?'incompatibile':d.status==='affine_family'||redundant?'infinite soluzioni':'soluzione unica'};
}
export function nullDirection(kappa:number,nu:number,phi:number){
 const [c,s]=degreeTrig(phi),direction:Vec2=[(c+s)*Math.SQRT1_2,(-c+s)*Math.SQRT1_2];
 return {direction,Ay:Math.SQRT2*s,form:kappa*c*c+nu*s*s,inTest:phi%180===0,reduced:kappa};
}
