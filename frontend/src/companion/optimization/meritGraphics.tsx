import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {Vec2} from '../../math/descentMethods';
import type {PrimalDual} from '../../math/sqpModels';
import {kktResidual} from '../../math/sqpModels';
import {meritValue,meritMinima,equalityBarrier,notationCost,notationEstimate,controlNotation} from '../../math/meritModels';
import type {MeritLine,MeritSearch} from '../../math/meritModels';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {functionGrid} from '../../math/optimizationFoundations';
import {marker,descentColors as C} from './descentGraphics';
const samples=(a:number,b:number,n=101)=>Array.from({length:n},(_,i)=>a+(b-a)*i/(n-1));
const inside=(z:Vec2)=>z.every(Number.isFinite)&&z[0]>=-1.5&&z[0]<=1.5&&z[1]>=-.3&&z[1]<=1.8;
const note=(text:string,y=.9)=>({text,xref:'paper',yref:'paper',x:.99,y,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'});
function contours(x:readonly number[],y:readonly number[],z:readonly(readonly(number|null)[])[],size=.5):PlotTrace{
 return {type:'contour',x,y,z,showscale:false,colorscale:[[0,'#7ca3b6'],[1,'#7ca3b6']],autocontour:false,
  contours:{start:0,end:8,size,coloring:'lines',showlabels:true,labelfont:{size:22,color:'#3c6d81'}}};
}
const headings=(left:string,right:string)=>[
 {text:left,xref:'paper',yref:'paper',x:.21,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.cost}},
 {text:right,xref:'paper',yref:'paper',x:.805,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.cost}}];

export function MeritScene({definition,id,s,current,history,selected=0}: {
 definition:CompanionDefinition;id:string;s:number;current:Vec2;history?:readonly PrimalDual[];selected?:number;
}){
 const grid=useMemo(()=>{const b=functionGrid(id,(x,y)=>meritValue([x,y],s),-1.5,1.5,'M₁(z;s)',65),y=samples(-.3,1.8,65);
  return {...b,y,z:y.map(v=>b.x.map(x=>meritValue([x,v],s)))};},[id,s]);
 const zLimit=history?13:6,clipped=grid.z.map(row=>row.map(v=>v<=zLimit?v:null)),parabola=samples(-1.2,1.2).map(x=>[x,x*x] as Vec2);
 const two:PlotTrace[]=[contours(grid.x,grid.y,clipped)],three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:clipped,colorscale:'Viridis',cmin:0,cmax:zLimit,opacity:.52,colorbar:{title:{text:'M₁'},thickness:12}}];
 const addCurve=(zs:readonly Vec2[],name:string,color:string)=>{
  two.push({type:'scatter',mode:'lines',x:zs.map(z=>inside(z)?z[0]:null),y:zs.map(z=>inside(z)?z[1]:null),connectgaps:false,name,line:{color,width:4}});
  three.push({type:'scatter3d',mode:'lines',x:zs.map(z=>inside(z)&&meritValue(z,s)<=zLimit?z[0]:null),y:zs.map(z=>inside(z)&&meritValue(z,s)<=zLimit?z[1]:null),z:zs.map(z=>inside(z)&&meritValue(z,s)<=zLimit?meritValue(z,s):null),connectgaps:false,name,line:{color,width:6}});
 };
 addCurve(parabola,'h=0',C.minimum);
 if(history){
  const path:Vec2[]=[];for(let k=1;k<=selected;k++){const a=history[k-1].z,b=history[k].z;path.push(...samples(0,1,15).map(t=>[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])] as Vec2));}
  if(path.length)addCurve(path,'Iterati, altezza con peso corrente',C.cost);
 }else{
  const minima=meritMinima(s);if(minima.family)addCurve(samples(-Math.SQRT1_2,Math.SQRT1_2).map(x=>[x,.5] as Vec2),'Famiglia di minimi M₁',C.direction);
  for(const z of minima.points){two.push(marker(...z,'Minimo noto di M₁',C.direction,13));three.push({type:'scatter3d',mode:'markers',x:[z[0]],y:[z[1]],z:[meritValue(z,s)],name:'Minimo noto di M₁',marker:{size:7,color:C.direction}});}
 }
 if(inside(current)){two.push(marker(...current,'Selezione corrente',C.current,14));if(meritValue(current,s)<=zLimit)three.push({type:'scatter3d',mode:'markers',x:[current[0]],y:[current[1]],z:[meritValue(current,s)],name:'Selezione corrente',marker:{size:8,color:C.current}});}
 const annotations=headings('Merit e vincolo',history?'Norma del residuo KKT':'Componenti di M₁');
 if(history){const norms=history.map(p=>kktResidual(p).norm);
  two.push({type:'scatter',mode:'lines+markers',x:norms.map((_,k)=>k),y:norms.map(v=>v<=3?v:null),connectgaps:false,xaxis:'x2',yaxis:'y2',line:{color:C.cost,width:3},marker:{size:6}},
   {...marker(selected,norms[selected],'Iterazione selezionata',C.current,13),y:[norms[selected]<=3?norms[selected]:null],xaxis:'x2',yaxis:'y2'});
  if(norms.some(v=>v>3))annotations.push(note('Residui oltre la scala fissa'));
 }else two.push({type:'bar',x:['ℓ','s|h|'],y:[meritValue(current,0),s*Math.abs(current[1]-current[0]**2)],xaxis:'x2',yaxis:'y2',marker:{color:[C.cost,C.direction]}});
 const outside=!inside(current)||(history?.slice(0,selected+1).some(p=>!inside(p.z))??false),surfaceClip=grid.z.some(row=>row.some(v=>v>zLimit));
 if(outside)annotations.push(note('Punti fuori dal ritaglio',.04));
 const surfaceNotices=[...(outside?[note('Punti fuori dal ritaglio',.04)]:[]),...(surfaceClip?[note('M₁ oltre la scala fissa')]:[])];
 return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
  twoDView={<SceneViewport id={id+'-2d'} traces={two} height={335} fontSize={22} label="Merit function e vincolo"
   layout={{margin:{l:60,r:18,t:40,b:58},xaxis:{title:{text:'z₁ [1]'},range:[-1.5,1.5],domain:[0,.42],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-.3,1.8],scaleanchor:'x',constrain:'domain'},
    xaxis2:{domain:[.61,1],anchor:'y2',...(history?{title:{text:'k [iter.]'},range:[0,Math.max(1,history.length-1)],dtick:Math.max(1,Math.ceil((history.length-1)/4))}:{title:{text:'Contributo'}})},
    yaxis2:{range:history?[0,3]:[0,5],anchor:'x2'},annotations:[...annotations,...(surfaceClip?[note('M₁ oltre la scala fissa',.2)]:[])]}}/>}
  threeDView={<SceneViewport id={id+'-3d'} traces={three} is3D height={335} fontSize={22} label="Superficie della merit function"
   camera={definition.visualization.presentation.camera} axisLegend={['z₁ [1]','z₂ [1]','M₁(z;s) [merit]']}
   layout={{scene:{xaxis:{title:{text:'z₁'},range:[-1.5,1.5]},yaxis:{title:{text:'z₂'},range:[-.3,1.8]},zaxis:{title:{text:'M₁'},range:[0,zLimit]}},annotations:surfaceNotices}}/>}/>;
}
export function MeritSearchScene({id,line,search,index,c}:{id:string;line:MeritLine;search:MeritSearch;index:number;c:number}){
 const g=samples(0,1),t=search.trials[index];
 const traces:PlotTrace[]=[{type:'scatter',mode:'lines',x:g,y:g.map(line.value),name:'M₁ reale',line:{color:C.cost,width:4}},
  {type:'scatter',mode:'lines',x:g,y:g.map(v=>line.initial+c*v*line.slope),name:'Soglia Armijo',line:{color:C.gradient,width:3,dash:'dash'}},
  {type:'scatter',mode:'markers',x:search.trials.map(t=>t.gamma),y:search.trials.map(t=>t.value),name:'Tentativi',marker:{size:12,color:search.trials.map(t=>t.accepted?C.minimum:C.gradient),symbol:search.trials.map(t=>t.accepted?'circle':'x')}}];
 if(t)traces.push(marker(t.gamma,t.value,'Tentativo selezionato',C.current,17));
 return <SceneViewport id={id} traces={traces} height={335} fontSize={22} label="Armijo sulla merit function"
  layout={{xaxis:{title:{text:'γ [passo]'},range:[0,1.05]},yaxis:{title:{text:'M₁ [merit]'},range:[.3,.75]}}}/>;
}
export function EqualityBarrierScene({definition,id,epsilon,probe}:{definition:CompanionDefinition;id:string;epsilon:number;probe:Vec2}){
 const model=equalityBarrier(epsilon,probe),xs=[...samples(-5,-.5,30).map(e=>10**e),...samples(.35,2,40)],ys=samples(-.5,1.5,65),grid={...functionGrid(id,()=>0,0,2,'Fε',65),x:xs,y:ys,z:ys.map(y=>xs.map(x=>model.value(x,y)!))};
 const clipped=grid.z.map(row=>row.map(v=>v<=6?v:null)),overScale=grid.z.some(row=>row.some(v=>v>6))||(model.probeCost!==null&&model.probeCost>6);
 const notices=[...(probe[0]===0?[note('Punto fuori dominio Fε')]:[]),...(overScale?[note('Fε oltre la scala fissa',.05)]:[])];
 const two:PlotTrace[]=[contours(xs,ys,clipped,.5),{type:'scatter',mode:'lines',x:[0,0],y:[-.5,1.5],line:{color:C.gradient,width:3,dash:'dot'},name:'Bordo escluso dalla barriera'},
  {type:'scatter',mode:'lines',x:[0,2],y:[.6,.6],line:{color:C.minimum,width:5},name:'h=0'},marker(0,.6,'Minimo originale, fuori dominio Fε','#879aa3',13)];
 const three:PlotTrace[]=[{type:'surface',x:xs,y:ys,z:clipped,colorscale:'Viridis',cmin:0,cmax:6,opacity:.5,colorbar:{title:{text:'Fε'},thickness:12}},
  {type:'scatter3d',mode:'lines',x:xs,y:xs.map(()=>.6),z:xs.map(x=>{const v=model.value(x,.6)!;return v<=6?v:null;}),connectgaps:false,line:{color:C.minimum,width:7},name:'Fε sulla retta h=0'}];
 for(const p of [{z:probe,name:'Punto di prova',color:C.current},{z:model.minimum,name:'Minimo interno analitico',color:C.direction}]){
  two.push(marker(...p.z,p.name,p.color,14));const v=model.value(...p.z);if(v!==null&&v<=6)three.push({type:'scatter3d',mode:'markers',x:[p.z[0]],y:[p.z[1]],z:[v],name:p.name,marker:{size:8,color:p.color}});
 }
 for(const [name,value,color,dash] of [['Costo su h=0',(x:number)=>model.original(x,.6),'#879aa3','dash'],['Fε su h=0',(x:number)=>model.value(x,.6)!,C.cost,'solid']] as const)
  two.push({type:'scatter',mode:'lines',x:xs,y:xs.map(x=>{const v=value(x);return v<=6?v:null;}),connectgaps:false,xaxis:'x2',yaxis:'y2',name,line:{color,width:3,dash}});
 two.push({...marker(model.minimum[0],model.value(...model.minimum)!,'Minimo interno',C.direction,13),xaxis:'x2',yaxis:'y2'});
 return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
  twoDView={<SceneViewport id={id+'-2d'} traces={two} height={335} fontSize={22} label="Barriera e uguaglianza residua"
   layout={{margin:{l:60,r:18,t:40,b:58},xaxis:{title:{text:'z₁ [1]'},range:[-.1,2],domain:[0,.42],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-.5,1.5],scaleanchor:'x',constrain:'domain'},
    xaxis2:{title:{text:'z₁ su h=0'},range:[0,2],domain:[.61,1],anchor:'y2'},yaxis2:{range:[0,6],anchor:'x2'},annotations:[...headings('Dominio e uguaglianza','Profilo su h=0'),...notices]}}/>}
  threeDView={<SceneViewport id={id+'-3d'} traces={three} is3D height={335} fontSize={22} label="Costo con barriera e uguaglianza"
   camera={definition.visualization.presentation.camera} axisLegend={['z₁>0 [1]','z₂ [1]','Fε [costo con barriera]']}
   layout={{scene:{xaxis:{title:{text:'z₁'},range:[0,2]},yaxis:{title:{text:'z₂'},range:[-.5,1.5]},zaxis:{title:{text:'Fε'},range:[0,6]}},annotations:notices}}/>}/>;
}
export function NotationScene({id,k,probe}:{id:string;k:number;probe:number}){
 const x=samples(-2,2),ks=Array.from({length:7},(_,i)=>i),zs=ks.map(notationEstimate),selected=notationEstimate(k);
 return <SceneViewport id={id} height={335} fontSize={22} label="Decisione libera e stima di un algoritmo"
  traces={[{type:'scatter',mode:'lines',x,y:x.map(notationCost),line:{color:C.cost,width:3}},marker(probe,notationCost(probe),'Decisione di prova z',C.current,14),marker(selected,notationCost(selected),'Stima zᵏ',C.direction,14),
   {type:'scatter',mode:'lines+markers',x:ks,y:zs,xaxis:'x2',yaxis:'y2',line:{color:C.cost,width:3},marker:{size:7}},
   {...marker(k,selected,'Stima selezionata',C.direction,14),xaxis:'x2',yaxis:'y2'}]}
  layout={{margin:{l:70,r:18,t:40,b:58},xaxis:{title:{text:'z [decisione]'},range:[-2,2],domain:[0,.43]},yaxis:{title:{text:'ℓ(z)'},range:[0,5]},
   xaxis2:{title:{text:'k [iter.]'},range:[0,6],domain:[.63,1],anchor:'y2',dtick:2},yaxis2:{range:[-2,1.2],anchor:'x2'},annotations:headings('Costo e decisioni','Stime zᵏ')}}/>;
}
export function ControlNotationScene({id,k,t}:{id:string;k:number;t:number}){
 const rows=Array.from({length:6},(_,i)=>controlNotation(i).x),current=rows[k],time=[0,1,2,3];
 return <SceneViewport id={id} height={335} fontSize={22} label="Iterazioni e tempi del controllo ottimo"
  traces={[{type:'heatmap',x:time,y:[0,1,2,3,4,5],z:rows,zmin:0,zmax:2,showscale:false,colorscale:[[0,'#edf5f8'],[1,'#80b3c3']],texttemplate:'%{z:.3f}',textfont:{size:22,color:'#174960'},xgap:2,ygap:2,hovertemplate:'k=%{y}, t=%{x}<br>x=%{z:.6f}<extra></extra>'},
   {type:'scatter',mode:'lines+markers',x:time,y:current,xaxis:'x2',yaxis:'y2',line:{color:C.cost,width:3},marker:{size:8}},
   {...marker(t,current[t],'Componente selezionata',C.current,15),xaxis:'x2',yaxis:'y2'}]}
  layout={{margin:{l:62,r:18,t:44,b:60},xaxis:{title:{text:'t [passi]'},domain:[0,.43],range:[-.5,3.5],dtick:1},yaxis:{title:{text:'k [iter.]'},range:[5.5,-.5],dtick:1},
   xaxis2:{title:{text:'t [passi]'},domain:[.63,1],range:[0,3],dtick:1,anchor:'y2'},yaxis2:{range:[0,2.2],anchor:'x2'},annotations:headings('Celle: xₜᵏ','Traiettoria xₜᵏ'),
   shapes:[{type:'rect',xref:'x',yref:'y',x0:-.5,x1:3.5,y0:k-.5,y1:k+.5,line:{color:C.cost,width:3}},
    {type:'rect',xref:'x',yref:'y',x0:t-.5,x1:t+.5,y0:k-.5,y1:k+.5,line:{color:C.current,width:4}}]}}/>;
}
