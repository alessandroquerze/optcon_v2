import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {Vec2} from '../../math/descentMethods';
import type {NamedVector} from '../../math/kktModels';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import {functionGrid} from '../../math/optimizationFoundations';
import {marker,descentColors as C} from './descentGraphics';
export {descentColors as C} from './descentGraphics';
export type CurvePoint={z:Vec2;parameter:number;label:string;color:string;symbol?:string};
const sample=(low:number,high:number)=>Array.from({length:181},(_,i)=>low+(high-low)*i/180);
const arrows=(base:Vec2,vectors:readonly NamedVector[])=>vectors.filter(({v})=>v[0]!==0||v[1]!==0).map(({v,color})=>({
 ax:base[0],ay:base[1],x:base[0]+v[0],y:base[1]+v[1],xref:'x',yref:'y',axref:'x',ayref:'y',text:'',
 showarrow:true,arrowhead:3,arrowwidth:4,arrowcolor:color}));
/** Shared equality geometry; the profile and the 3D curve always evaluate the same value(). */
export function FeasibleCurveScene({definition,id,value,curve,interval,parameterLabel,points,vectors=[],base=[0,0],circle=false}:{
 definition:CompanionDefinition;id:string;value:(x:number,y:number)=>number;curve:(s:number)=>Vec2;interval:readonly[number,number];
 parameterLabel:string;points:readonly CurvePoint[];vectors?:readonly NamedVector[];base?:Vec2;circle?:boolean;
}){
 const zRange=circle?[-5,5]:[-4.5,4.5],profileRange=circle?[-2,2]:[-4,5];
 const xRange=[-1.7,1.7],yRange=circle?[-2.2,1.2]:[-1.7,1.7];
 const grid=useMemo(()=>functionGrid(id,value,-1.7,1.7,'ℓ(z)',65),[id,value]);
 const parameters=sample(...interval),vertices=parameters.map(curve);
 const costs=vertices.map(z=>value(...z));
 const visible=(p:Vec2)=>p.every(v=>Number.isFinite(v)&&Math.abs(v)<=1.7)&&Number.isFinite(value(...p))&&value(...p)>=zRange[0]&&value(...p)<=zRange[1];
 const offscreen=points.some(p=>!visible(p.z));
 const croppedSurface=grid.z.some(row=>row.some(z=>z!==null&&(z<zRange[0]||z>zRange[1])));
 const traces=useMemo(()=>{
  const two:PlotTrace[]=[{type:'contour',x:grid.x,y:grid.y,z:grid.z,showscale:false,colorscale:[[0,'#5a91aa'],[1,'#5a91aa']],autocontour:false,
   contours:{start:zRange[0],end:zRange[1],size:circle?1:1.5,coloring:'lines',showlabels:true,labelfont:{size:22,color:'#3c6d81'}},
   hovertemplate:'z₁=%{x:.3f}, z₂=%{y:.3f}<br>ℓ=%{z:.4f}<extra></extra>'},
   {type:'scatter',mode:'lines',x:vertices.map(z=>z[0]),y:vertices.map(z=>z[1]),name:'Vincolo di uguaglianza',line:{color:C.minimum,width:6}},
   {type:'scatter',mode:'lines',x:parameters,y:costs,xaxis:'x2',yaxis:'y2',name:'Costo sui punti ammissibili',line:{color:C.minimum,width:4}}];
  const three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',opacity:.38,cmin:zRange[0],cmax:zRange[1],
   colorbar:{title:{text:'ℓ(z)'},thickness:12}},
   {type:'scatter3d',mode:'lines',x:vertices.map(z=>z[0]),y:vertices.map(z=>z[1]),z:costs,name:'Costo sul vincolo',line:{color:C.minimum,width:8}}];
  for(const p of points){
   if(visible(p.z)){
    two.push({...marker(...p.z,p.label,p.color,14),marker:{size:14,color:p.color,symbol:p.symbol??'circle',line:{color:'white',width:2}}});
    three.push({type:'scatter3d',mode:'markers',x:[p.z[0]],y:[p.z[1]],z:[value(...p.z)],name:p.label,
     marker:{size:8,color:p.color,symbol:p.symbol==='diamond'?'diamond':'circle'},hovertemplate:p.label+'<br>%{x:.4f}, %{y:.4f}<br>ℓ=%{z:.4f}<extra></extra>'});
   }
   if(Number.isFinite(p.parameter)&&p.parameter>=interval[0]&&p.parameter<=interval[1])two.push({
    ...marker(p.parameter,value(...p.z),p.label,p.color,12),xaxis:'x2',yaxis:'y2'});
  }
  return {two,three};
 },[grid,value,curve,interval,points,circle]);
 const notice=offscreen?[{text:'Candidato fuori dal ritaglio',xref:'paper',yref:'paper',x:.99,y:.98,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'}]:[];
 return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
  twoDView={<SceneViewport id={id+'-2d'} traces={traces.two} height={335} fontSize={22} label="Geometria e costo sul vincolo"
   layout={{margin:{l:60,r:18,t:40,b:58},xaxis:{title:{text:'z₁ [1]'},range:xRange,domain:[0,.42],constrain:'domain'},
    yaxis:{title:{text:'z₂ [1]'},range:yRange,scaleanchor:'x',constrain:'domain'},
    xaxis2:{title:{text:parameterLabel},range:interval,domain:[.61,1],anchor:'y2'},yaxis2:{range:profileRange,anchor:'x2'},
    annotations:[{text:'Decisioni e livelli',xref:'paper',yref:'paper',x:.21,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.cost}},
     {text:'Costo sul vincolo',xref:'paper',yref:'paper',x:.805,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.minimum}},...notice,...arrows(base,vectors)]}}/>}
  threeDView={<SceneViewport id={id+'-3d'} traces={traces.three} is3D height={335} fontSize={22} label="Costo e uguaglianza sulla superficie"
   camera={definition.visualization.presentation.camera} axisLegend={['z₁ [1]','z₂ [1]','ℓ(z) [costo]']}
   layout={{scene:{xaxis:{title:{text:'z₁'},range:xRange},yaxis:{title:{text:'z₂'},range:xRange},zaxis:{title:{text:'ℓ(z)'},range:zRange}},
    annotations:[...notice,...(croppedSurface?[{text:'Superficie ritagliata: scala fissa',xref:'paper',yref:'paper',x:.99,y:.05,xanchor:'right',showarrow:false,font:{size:22,color:C.cost},bgcolor:'#ffffffde'}]:[])]}}/>}/>;
}
export function GradientPolygon({id,vectors}:{id:string;vectors:readonly NamedVector[]}){
 let tail:Vec2=[0,0];const annotations:Record<string,unknown>[]=[],traces:PlotTrace[]=[marker(0,0,'Origine',C.cost,10)];
 vectors.forEach(({v,label,color},i)=>{
  const next:Vec2=[tail[0]+v[0],tail[1]+v[1]];
  if(v[0]!==0||v[1]!==0){
   annotations.push(...arrows(tail,[{v,label,color}]),{x:(tail[0]+next[0])/2,y:(tail[1]+next[1])/2,xref:'x',yref:'y',
    text:label,showarrow:false,yshift:i===1?-24:22,font:{size:22,color},bgcolor:'#ffffffde'});
  }
  tail=next;
 });
 traces.push({...marker(...tail,'Risultante finale',C.current,17),marker:{size:17,symbol:'circle-open',color:C.current,line:{width:3}}});
 return <SceneViewport id={id} height={335} fontSize={22} label="Somma dei gradienti testa coda"
  traces={traces} layout={{xaxis:{title:{text:'Componente 1 del gradiente'},range:[-1,1],constrain:'domain'},
   yaxis:{title:{text:'Componente 2'},range:[-.85,.4],scaleanchor:'x',constrain:'domain'},annotations}}/>;
}
