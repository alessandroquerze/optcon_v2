import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {Vec2} from '../../math/descentMethods';
import type {PrimalDual,SqpStep} from '../../math/sqpModels';
import {sqpCost,parabola,kktResidual,nonlinearStepResidual} from '../../math/sqpModels';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {functionGrid} from '../../math/optimizationFoundations';
import {marker,descentColors as C} from './descentGraphics';
export {descentColors as C} from './descentGraphics';
export type PrimalDualView='residual'|'iterations'|'linearization'|'qp';
const sequence=(low:number,high:number,count=121)=>Array.from({length:count},(_,i)=>low+(high-low)*i/(count-1));
const inside=(z:Vec2)=>z[0]>=-1.5&&z[0]<=1.5&&z[1]>=-.3&&z[1]<=1.8&&z.every(Number.isFinite);
export function PrimalDualScene({definition,id,current,mode,step,history=[],selected=0}:{
 definition:CompanionDefinition;id:string;current:PrimalDual;mode:PrimalDualView;step?:SqpStep;history?:readonly PrimalDual[];selected?:number;
}){
 const grid=useMemo(()=>{
  const base=functionGrid(id,sqpCost,-1.5,1.5,'ℓ(z)',65),y=sequence(-.3,1.8,65);
  return {...base,y,z:y.map(v=>base.x.map(x=>sqpCost(x,v)))};
 },[id]);
 const r=kktResidual(current),next=mode==='iterations'?undefined:step?.next;
 const path=history.slice(0,selected+1).map(p=>p.z),offscreen=!inside(current.z)||(next&&!inside(next.z))||path.some(z=>!inside(z));
 const sourceX=sequence(-1.2,1.2),constraint=sourceX.map(parabola);
 const points=[{z:current.z,label:mode==='iterations'?'Iterato corrente':'Punto corrente',color:C.current},
  ...(next?[{z:next.z,label:'Punto dopo Newton',color:C.direction}]:[])];
 const rightTitle=mode==='residual'?'Residuo congiunto':mode==='iterations'?'Norma del residuo':mode==='linearization'?'Vincolo reale / lineare':'Modello del QP';
 const traces=useMemo(()=>{
  const two:PlotTrace[]=[{type:'contour',x:grid.x,y:grid.y,z:grid.z,showscale:false,colorscale:[[0,'#5a91aa'],[1,'#5a91aa']],autocontour:false,
   contours:{start:0,end:3,size:.2,coloring:'lines',showlabels:true,labelfont:{size:22,color:'#3c6d81'}}},
   {type:'scatter',mode:'lines',x:constraint.map(z=>z[0]),y:constraint.map(z=>z[1]),name:'Vincolo reale h=0',line:{color:C.minimum,width:5}}];
  const three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',cmin:0,cmax:3,opacity:.42,colorbar:{title:{text:'ℓ(z)'},thickness:12}},
   {type:'scatter3d',mode:'lines',x:constraint.map(z=>z[0]),y:constraint.map(z=>z[1]),z:constraint.map(z=>sqpCost(...z)),name:'Costo sul vincolo h=0',line:{color:C.minimum,width:7}}];
  const addCurve=(zs:readonly Vec2[],name:string,color:string,dash='solid')=>{
   two.push({type:'scatter',mode:'lines',x:zs.map(z=>inside(z)?z[0]:null),y:zs.map(z=>inside(z)?z[1]:null),connectgaps:false,name,line:{color,width:3,dash}});
   three.push({type:'scatter3d',mode:'lines',x:zs.map(z=>inside(z)?z[0]:null),y:zs.map(z=>inside(z)?z[1]:null),z:zs.map(z=>inside(z)?sqpCost(...z):null),connectgaps:false,name,line:{color,width:5,dash}});
  };
  if(mode==='iterations'&&path.length)addCurve(path,'Iterati k',C.cost);
  if((mode==='linearization'||mode==='qp')&&step){
   const tangent=sequence(-1.5,1.5).map(x=>[x,2*current.z[0]*x-current.z[0]**2] as Vec2);
   addCurve(tangent,'Vincolo linearizzato',C.gradient,'dash');
   if(next)addCurve(sequence(0,1,61).map(t=>[current.z[0]+t*(next.z[0]-current.z[0]),current.z[1]+t*(next.z[1]-current.z[1])] as Vec2),'Passo Newton',C.direction);
  }
  for(const p of points){if(!inside(p.z))continue;
   two.push(marker(...p.z,p.label,p.color,14));three.push({type:'scatter3d',mode:'markers',x:[p.z[0]],y:[p.z[1]],z:[sqpCost(...p.z)],name:p.label,marker:{size:8,color:p.color}});
  }
  if(mode==='residual')two.push({type:'bar',x:['r₁','r₂','h'],y:[...r.g,r.h],xaxis:'x2',yaxis:'y2',marker:{color:[C.gradient,C.direction,C.cost]},name:'Componenti del residuo'});
  if(mode==='iterations'){
   const norms=history.map(p=>kktResidual(p).norm);
   two.push({type:'scatter',mode:'lines+markers',x:norms.map((_,i)=>i),y:norms.map(v=>v<=2.5?v:null),connectgaps:false,xaxis:'x2',yaxis:'y2',name:'‖rᵏ‖',line:{color:C.cost,width:3},marker:{size:7,color:C.cost}},
    {...marker(selected,r.norm,'Campione corrente',C.current,13),y:[r.norm<=2.5?r.norm:null],xaxis:'x2',yaxis:'y2'});
  }
  if(mode==='linearization'&&step?.delta){
   const theta=sequence(0,1),linear=theta.map(t=>nonlinearStepResidual(step,t)!.linear),actual=theta.map(t=>nonlinearStepResidual(step,t)!.actual);
   for(const [values,name,color,dash] of [[linear,'Modello lineare',C.gradient,'dash'],[actual,'Vincolo reale',C.direction,'solid']] as const)
    two.push({type:'scatter',mode:'lines',x:theta,y:values.map(v=>Math.abs(v)<=.15?v:null),connectgaps:false,xaxis:'x2',yaxis:'y2',name,line:{color,width:3,dash}});
  }
  if(mode==='qp'&&step){
   const s=sequence(-.8,.8);two.push({type:'scatter',mode:'lines',x:s,y:s.map(s=>{const v=step.model(s);return v>=-3&&v<=4?v:null;}),connectgaps:false,xaxis:'x2',yaxis:'y2',name:'m(Δz(s))',line:{color:C.cost,width:3}});
   if(step.delta&&Math.abs(step.delta[0])<=.8)two.push({...marker(step.delta[0],step.model(step.delta[0]),step.qpStatus==='unique_minimum'?'Minimo del QP':'Stazionario del QP',C.direction,13),xaxis:'x2',yaxis:'y2'});
  }
  return {two,three};
 },[grid,current,step,mode,history,selected]);
 const notices:Record<string,unknown>[]=[];
 if(offscreen)notices.push({text:'Punti fuori dal ritaglio',xref:'paper',yref:'paper',x:.99,y:.04,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'});
 if(mode==='residual'&&[...r.g,r.h].some(v=>Math.abs(v)>2))notices.push({text:'Componenti oltre la scala fissa',xref:'paper',yref:'paper',x:.99,y:.9,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'});
 if(mode==='qp'&&step&&sequence(-.8,.8).some(s=>step.model(s)<-3||step.model(s)>4))notices.push({text:'Modello oltre la scala fissa',xref:'paper',yref:'paper',x:.99,y:.9,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'});
 if(mode==='iterations'&&history.some(p=>kktResidual(p).norm>2.5))notices.push({text:'Residui oltre la scala fissa',xref:'paper',yref:'paper',x:.99,y:.9,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'});
 if(mode==='linearization'&&step){
  const text=step.delta?(Math.abs(r.h)>.15||Math.abs(nonlinearStepResidual(step,1)!.actual)>.15?'Residui oltre la scala fissa':null):'Nessun passo unico';
  if(text)notices.push({text,xref:'paper',yref:'paper',x:.99,y:.9,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'});
 }
 const x2=mode==='residual'?{title:{text:'Componente'}}:mode==='iterations'?{title:{text:'k [iter.]'},range:[0,Math.max(1,history.length-1)],dtick:Math.max(1,Math.ceil((history.length-1)/4))}:
  mode==='linearization'?{title:{text:'θ [1]'},range:[0,1]}:{title:{text:'Δz₁ [1]'},range:[-.8,.8]};
 const y2=mode==='residual'?[-2,2]:mode==='iterations'?[0,2.5]:mode==='linearization'?[-.15,.15]:[-3,4];
 return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
  twoDView={<SceneViewport id={id+'-2d'} traces={traces.two} height={335} fontSize={22} label="Decisioni e residuo o modello locale"
   layout={{margin:{l:60,r:18,t:40,b:58},xaxis:{title:{text:'z₁ [1]'},range:[-1.5,1.5],domain:[0,.42],constrain:'domain'},
    yaxis:{title:{text:'z₂ [1]'},range:[-.3,1.8],scaleanchor:'x',constrain:'domain'},
    xaxis2:{...x2,domain:[.61,1],anchor:'y2'},yaxis2:{range:y2,anchor:'x2'},annotations:[
     {text:'Costo e vincoli',xref:'paper',yref:'paper',x:.21,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.cost}},
     {text:rightTitle,xref:'paper',yref:'paper',x:.805,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.cost}},...notices]}}/>}
  threeDView={<SceneViewport id={id+'-3d'} traces={traces.three} is3D height={335} fontSize={22} label="Costo vincolo e passi primal duali"
   camera={definition.visualization.presentation.camera} axisLegend={['z₁ [1]','z₂ [1]','ℓ(z) [costo]']}
   layout={{scene:{xaxis:{title:{text:'z₁'},range:[-1.5,1.5]},yaxis:{title:{text:'z₂'},range:[-.3,1.8]},zaxis:{title:{text:'ℓ(z)'},range:[0,3]}},annotations:offscreen?notices.slice(0,1):[]}}/>}/>;
}
