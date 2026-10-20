import type {Vec2} from './descentMethods';
export const clipSegment=(a:number)=>Math.min(1,Math.max(0,a));
export const distanceCost=(a:number,b:number)=>(x:number,y:number)=>.5*((x-a)**2+(y-b)**2);
/** Exact geometry drives membership; cubing a residual must not widen the feasible set. */
export function segmentModel(a:number,b:number,z:Vec2){
 const residuals=[-z[0],z[0]-1,z[1]],minimum:Vec2=[clipSegment(a),0];
 return {residuals,minimum,value:distanceCost(a,b),cost:distanceCost(a,b)(...z),minimumCost:distanceCost(a,b)(...minimum),
  feasible:z[0]>=0&&z[0]<=1&&z[1]===0};
}
export type NamedVector={label:string;v:Vec2;color:string};
const purple='#8057a5',red='#bb3c3c',blue='#176c98';
export function rankInPlane(vectors:readonly Vec2[]){
 const nonzero=vectors.filter(v=>v[0]!==0||v[1]!==0);
 if(!nonzero.length)return 0;
 return nonzero.some(v=>nonzero[0][0]*v[1]-nonzero[0][1]*v[0]!==0)?2:1;
}
export function activeGeometry(x:number,kind:number){
 const active:number[]=[],vectors:NamedVector[]=[{label:'∇h₁',v:kind===2?[0,0]:[0,1],color:purple}];
 if(x===0){active.push(1);vectors.push({label:'∇g₁',v:kind===3?[0,0]:[-1,0],color:red});
  if(kind===1){active.push(3);vectors.push({label:'∇g₃',v:[-2,0],color:blue});}}
 if(x===1){active.push(2);vectors.push({label:'∇g₂',v:[1,0],color:red});}
 active.sort((a,b)=>a-b);
 const rank=rankInPlane(vectors.map(v=>v.v));
 return {active,vectors,rank,count:vectors.length,regular:rank===vectors.length};
}
export function lagrangianModel(mu:number,lambda:number,z:Vec2){
 const original=distanceCost(-.5,.6),value=(x:number,y:number)=>original(x,y)-mu*x+lambda*y;
 const minimum:Vec2=[-.5+mu,.6-lambda];
 return {original,value,minimum,originalCost:original(...z),inequalityTerm:-mu*z[0],equalityTerm:lambda*z[1],total:value(...z),
  minimumFeasible:minimum[0]>=0&&minimum[1]===0};
}
export function hypothesisCase(cubic:boolean){
 const normals:Vec2[]=[[cubic?0:-1,0],[0,1]];
 return {normals,rank:rankInPlane(normals),regular:!cubic,multiplierExists:!cubic,mu:cubic?null:1,lambda:cubic?null:0};
}
export function exactSegmentMultipliers(a:number){return {mu1:Math.max(0,-a),mu2:Math.max(0,a-1),lambda:.6};}
export function kktBalance(a:number,mu1:number,mu2:number,lambda:number){
 const point:Vec2=[clipSegment(a),0],g=[-point[0],point[0]-1],gradient:Vec2=[point[0]-a,-.6];
 const stationarity:Vec2=[gradient[0]-mu1+mu2,gradient[1]+lambda];
 const complementary=[mu1*g[0],mu2*g[1]],dualViolation=Math.max(0,-mu1,-mu2);
 const stationarityNorm=Math.hypot(...stationarity),complementarityNorm=Math.hypot(...complementary);
 return {point,g,gradient,stationarity,stationarityNorm,complementary,complementarityNorm,dualViolation,
  satisfies:stationarityNorm<1e-12&&complementarityNorm<1e-12&&dualViolation===0,
  active:[...(point[0]===0?[1]:[]),...(point[0]===1?[2]:[])],value:distanceCost(a,.6),
  vectors:[{label:'∇ℓ',v:gradient,color:red},{label:'μ₁∇g₁',v:[-mu1,0] as Vec2,color:purple},
   {label:'μ₂∇g₂',v:[mu2,0] as Vec2,color:blue},{label:'λ₁∇h₁',v:[0,lambda] as Vec2,color:'#cf6b24'}]};
}
export function tangentCost(kappa:number,flat=false){return (x:number,y:number)=>flat?.5*y*y:.5*kappa*x*x+.25*x**4+.5*y*y;}
export function curvatureCase(kappa:number,t:number,flat=false){
 const value=tangentCost(kappa,flat);
 return {value,change:value(t,0),curvature:flat?0:kappa,
  classification:flat?'Ogni punto ammissibile è minimo.':kappa>0?'Minimo stretto: curvatura tangente positiva.':
   kappa<0?'Massimo locale sulla retta: KKT non basta.':'Minimo stretto piatto: decide il termine quartico.',
  stationary:true,regular:true,mu:0,lambda:0};
}
