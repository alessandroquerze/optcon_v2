import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {Vec2} from '../../math/descentMethods';
import type {NamedVector} from '../../math/kktModels';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import {functionGrid} from '../../math/optimizationFoundations';
import {marker,descentColors as C} from './descentGraphics';
import type {GeometryPoint} from './projectionGraphics';
export {descentColors as C} from './descentGraphics';
const arrows=(origin:Vec2,vectors:readonly NamedVector[])=>vectors.filter(({v})=>v[0]!==0||v[1]!==0).map(({v,color})=>({
 ax:origin[0],ay:origin[1],x:origin[0]+v[0],y:origin[1]+v[1],xref:'x',yref:'y',axref:'x',ayref:'y',
 text:'',showarrow:true,arrowhead:3,arrowwidth:4,arrowcolor:color}));
const curve=(low:number,high:number)=>Array.from({length:161},(_,i)=>low+(high-low)*i/160);
/** Equality sets are drawn as curves, never as filled regions. Every height is value(x,y). */
export function ConstraintScene({definition,id,value,points,low=0,high=1,symbol='ℓ(z)',zRange=[0,5],profileRange=zRange,vectors=[],origin=[0,0],minima=[]}:{
 definition:CompanionDefinition;id:string;value:(x:number,y:number)=>number;points:GeometryPoint[];
 low?:number;high?:number;symbol?:string;zRange?:number[];profileRange?:number[];vectors?:readonly NamedVector[];origin?:Vec2;minima?:readonly Vec2[];
}){
 const grid=useMemo(()=>functionGrid(id,value,-1.7,1.7,symbol,65),[id,value,symbol]);
 const bounds=[-1.7,1.7];
 const visible=(p:Vec2)=>p.every(v=>Number.isFinite(v)&&v>=bounds[0]&&v<=bounds[1])&&value(...p)>=zRange[0]&&value(...p)<=zRange[1];
 const traces=useMemo(()=>{
  const edge=curve(low,high),feasible={type:'scatter',mode:'lines',x:edge,y:edge.map(()=>0),name:'Insieme ammissibile',line:{color:C.minimum,width:7}};
  const two:PlotTrace[]=[{type:'contour',x:grid.x,y:grid.y,z:grid.z,colorscale:[[0,'#5a91aa'],[1,'#5a91aa']],showscale:false,
   autocontour:false,contours:{start:zRange[0],end:zRange[1],size:(zRange[1]-zRange[0])/10,coloring:'lines',showlabels:true,labelfont:{size:22,color:'#3c6d81'}},hovertemplate:'z₁=%{x:.3f}, z₂=%{y:.3f}<br>'+symbol+'=%{z:.4f}<extra></extra>'},feasible];
  const three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',cmin:zRange[0],cmax:zRange[1],opacity:.38,
    colorbar:{title:{text:symbol},thickness:12},hovertemplate:'z₁=%{x:.3f}, z₂=%{y:.3f}<br>'+symbol+'=%{z:.4f}<extra></extra>'},
   {type:'scatter3d',mode:'lines',x:edge,y:edge.map(()=>0),z:edge.map(x=>value(x,0)),name:'Costo sui punti ammissibili',line:{color:C.minimum,width:9}}];
  two.push({type:'scatter',mode:'lines',x:edge,y:edge.map(x=>value(x,0)),xaxis:'x2',yaxis:'y2',name:'Funzione sui punti ammissibili',line:{color:C.minimum,width:4}});
  const all=[...minima.map(z=>({z,label:'Minimo vincolato',color:C.minimum,symbol:'star'})),...points];
  for(const p of all){
   const star=p.symbol==='star';
   two.push({...marker(...p.z,p.label,p.color,star?18:13),marker:{size:star?18:13,color:p.color,symbol:p.symbol??'circle',line:{color:'white',width:2}}});
   if(p.z[1]===0&&p.z[0]>=low&&p.z[0]<=high)two.push({...marker(p.z[0],value(...p.z),p.label,p.color,star?17:12),xaxis:'x2',yaxis:'y2'});
   if(visible(p.z))three.push({type:'scatter3d',mode:'markers',x:[p.z[0]],y:[p.z[1]],z:[value(...p.z)],name:p.label,
    marker:{size:star?9:7,color:p.color,symbol:star?'diamond':'circle',line:{color:'white',width:2}},hovertemplate:p.label+'<br>%{x:.3f}, %{y:.3f}<br>'+symbol+'=%{z:.5f}<extra></extra>'});
  }
  return {two,three};
 },[grid,value,low,high,points,minima,zRange,symbol]);
 const offscreen=points.some(p=>!visible(p.z));
 const notice=offscreen?[{text:'Un punto è fuori dal ritaglio',xref:'paper',yref:'paper',x:.99,y:.98,xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'}]:[];
 return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
  twoDView={<SceneViewport id={id+'-2d'} traces={traces.two} height={335} fontSize={22} label="Funzione e insieme ammissibile nel piano"
   layout={{margin:{l:60,r:18,t:40,b:58},xaxis:{title:{text:'z₁ [1]'},range:bounds,domain:[0,.42],constrain:'domain'},
    yaxis:{title:{text:'z₂ [1]'},range:bounds,scaleanchor:'x',constrain:'domain'},
    xaxis2:{title:{text:'z₁ [1]'},range:[low,high],domain:[.61,1],anchor:'y2'},yaxis2:{range:profileRange,anchor:'x2'},
    annotations:[{text:'Decisioni e livelli',xref:'paper',yref:'paper',x:.21,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.cost}},
     {text:symbol+' su z₂=0',xref:'paper',yref:'paper',x:.805,y:1.1,xanchor:'center',showarrow:false,font:{size:22,color:C.minimum}},...notice,...arrows(origin,vectors)]}}/>}
  threeDView={<SceneViewport id={id+'-3d'} traces={traces.three} is3D height={335} fontSize={22} label="Funzione e vincoli sulla superficie"
   camera={definition.visualization.presentation.camera} axisLegend={['z₁ [1]','z₂ [1]',symbol+' [costo]']}
   layout={{scene:{xaxis:{title:{text:'z₁'},range:bounds},yaxis:{title:{text:'z₂'},range:bounds},zaxis:{title:{text:symbol},range:zRange}},annotations:notice}}/>}/>;
}
export function NormalScene({id,origin,vectors,low=0,high=1}:{id:string;origin:Vec2;vectors:readonly NamedVector[];low?:number;high?:number}){
 return <SceneViewport id={id} height={335} fontSize={22} label="Vincoli e gradienti pertinenti alla regolarità"
  traces={[{type:'scatter',mode:'lines',x:[low,high],y:[0,0],name:'Insieme ammissibile',line:{color:C.minimum,width:7}},marker(...origin,'Punto ammissibile',C.current,14)]}
  layout={{xaxis:{title:{text:'z₁ [1]'},range:[-2.2,2.2],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-.5,1.3],scaleanchor:'x',constrain:'domain'},
   annotations:arrows(origin,vectors)}}/>;
}
