import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import {curveData,functionGrid} from '../../math/optimizationFoundations';
import type {Vec2} from '../../math/descentMethods';
import {norm} from '../../math/descentMethods';

export const descentColors={cost:'#176c98',direction:'#8057a5',gradient:'#bb3c3c',current:'#cf6b24',minimum:'#25775b'};
export const traceCurve=(fn:(x:number)=>number,low:number,high:number,name:string,color=descentColors.cost,dash='solid'):PlotTrace=>{
  const curve=curveData(name,fn,low,high);
  return {type:'scatter',mode:'lines',name,x:curve.points.map(p=>p.x),y:curve.points.map(p=>p.y),line:{color,width:3,dash},
    hovertemplate:'%{x:.4f}<br>%{y:.6f}<extra>'+name+'</extra>'};
};
export const marker=(x:number,y:number,name:string,color=descentColors.current,size=12):PlotTrace=>({
  type:'scatter',mode:'markers',name,x:[x],y:[y],marker:{size,color,line:{color:'white',width:2}},
  hovertemplate:name+'<br>%{x:.4f}, %{y:.5f}<extra></extra>'});
export function ProfileScene({id,profile,linear,initial,gamma,yRange,upper=2}:{
  id:string;profile:(gamma:number)=>number;linear:(gamma:number)=>number;initial:number;gamma:number;yRange:number[];upper?:number;
}){
  const traces=useMemo(()=>[traceCurve(profile,0,upper,'Costo esatto'),
    traceCurve(linear,0,upper,'Previsione lineare',descentColors.direction,'dash'),
    {type:'scatter',mode:'lines',x:[0,upper],y:[initial,initial],name:'Costo iniziale',line:{color:'#84929c',width:2,dash:'dot'}},
    marker(0,initial,'Partenza',descentColors.cost),marker(gamma,profile(gamma),'Passo scelto'),
    {type:'scatter',mode:'lines',x:[gamma,gamma],y:[initial,profile(gamma)],name:'Variazione esatta',line:{color:descentColors.current,width:3}},
  ],[profile,linear,initial,gamma,upper]);
  return <SceneViewport id={id} traces={traces} layout={{xaxis:{title:{text:'γ [passo]'},range:[0,upper]},
    yaxis:{title:{text:'φ(γ) [costo]'},range:yRange}}} label="Costo lungo la direzione scelta" height={335} fontSize={22}/>;
}
type Arrow={vector:Vec2;label:string;color:string};
/** Shared geometry for iterates, transformed directions and one-step method comparisons. */
export function DescentScene({definition,value,states,index,arrows=[],range=2}:{
  definition:CompanionDefinition;value:(x:number,y:number)=>number;states:readonly Vec2[];index:number;arrows?:readonly Arrow[];range?:number;
}){
  const id='optimization-opt'+definition.source_page+'-descent';
  const grid=useMemo(()=>functionGrid(id,value,-range,range,'ℓ(z)',61),[id,value,range]);
  const current=states[Math.min(index,states.length-1)],start=states[0],maxCost=definition.source_page===32?15:range===3?24:10;
  const iterative=definition.visualization.threeDRequirements.animation.enabled;
  const {two,three,annotations}=useMemo(()=>{
    const path=states.slice(0,index+1),xs=path.map(z=>z[0]),ys=path.map(z=>z[1]),zs=path.map(z=>value(...z));
    const two:PlotTrace[]=[{type:'contour',x:grid.x,y:grid.y,z:grid.z,zmin:0,zmax:maxCost,colorscale:'Viridis',autocontour:false,
      contours:{start:0,end:maxCost,size:maxCost/10,coloring:'heatmap',showlabels:true,labelfont:{size:22,color:'white'}},
      colorbar:{title:{text:'ℓ(z)'},thickness:12},hovertemplate:'z₁=%{x:.3f}<br>z₂=%{y:.3f}<br>ℓ=%{z:.5f}<extra>Costo</extra>'},
      {...marker(0,0,'Minimo noto',descentColors.minimum,19),marker:{symbol:'star',color:descentColors.minimum,size:19,line:{color:'white',width:2}}},
      {type:'scatter',mode:'lines+markers',x:xs,y:ys,name:'Aggiornamenti',line:{color:descentColors.cost,width:3},marker:{size:7,color:descentColors.cost},
        customdata:path.map((z,k)=>[iterative?'k='+k:k===0?'Partenza':'Arrivo',value(...z)]),hovertemplate:'%{customdata[0]}<br>%{x:.4f}, %{y:.4f}<br>ℓ=%{customdata[1]:.6f}<extra>Decisione</extra>'},
      marker(...start,'Punto iniziale',descentColors.cost,17),marker(...current,'Punto corrente',descentColors.current)];
    const three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',cmin:0,cmax:maxCost,
      colorbar:{title:{text:'ℓ(z)'},thickness:12},hovertemplate:'z₁=%{x:.3f}<br>z₂=%{y:.3f}<br>ℓ=%{z:.5f}<extra>Costo</extra>'},
      {type:'scatter3d',mode:'lines+markers',name:'Aggiornamenti',x:xs,y:ys,z:zs,line:{color:descentColors.cost,width:5},marker:{size:3,color:descentColors.cost},
        hovertemplate:'%{x:.4f}, %{y:.4f}<br>ℓ=%{z:.6f}<extra>Iterato</extra>'},
      {type:'scatter3d',mode:'markers',name:'Minimo noto',x:[0],y:[0],z:[0],marker:{size:9,symbol:'diamond',color:descentColors.minimum,line:{color:'white',width:2}}},
      {type:'scatter3d',mode:'markers',name:'Punto corrente',x:[current[0]],y:[current[1]],z:[value(...current)],marker:{size:7,color:descentColors.current,line:{color:'white',width:2}},
        hovertemplate:'%{x:.4f}, %{y:.4f}<br>ℓ=%{z:.6f}<extra>Punto corrente</extra>'}];
    const annotations=arrows.filter(a=>norm(a.vector)>0).map(a=>{
      const end:Vec2=[start[0]+a.vector[0],start[1]+a.vector[1]];
      two.push({...marker(...end,a.label,a.color,7),mode:'markers+text',text:[a.label],textposition:end[1]<start[1]?'bottom center':'top center',textfont:{size:22,color:a.color}});
      return {ax:start[0],ay:start[1],x:end[0],y:end[1],xref:'x',yref:'y',axref:'x',ayref:'y',text:'',showarrow:true,arrowhead:3,arrowwidth:3,arrowcolor:a.color};
    });
    return {two,three,annotations};
  },[states,index,current,start,value,grid,maxCost,arrows,iterative]);
  const twoD=<SceneViewport id={id+'-2d'} traces={two} layout={{xaxis:{title:{text:'z₁ [1]'},range:[-range,range],constrain:'domain'},
    yaxis:{title:{text:'z₂ [1]'},range:[-range,range],scaleanchor:'x',constrain:'domain'},annotations,margin:{l:75,r:80,t:18,b:58}}}
    label="Decisioni e direzioni sui livelli del costo" height={335} fontSize={22}/>;
  if(definition.visualization.visualizationMode==='2D_ONLY')return twoD;
  return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode} twoDView={twoD}
    threeDView={<SceneViewport id={id+'-3d'} traces={three} is3D layout={{scene:{
      xaxis:{title:{text:'z₁'},range:[-range,range]},yaxis:{title:{text:'z₂'},range:[-range,range]},
      zaxis:{title:{text:'ℓ(z)'},range:[0,maxCost]},aspectmode:'cube'}}}
      height={335} fontSize={22} label="Iterati e costo sulla superficie" axisLegend={['z₁ [1]','z₂ [1]','ℓ(z) [costo]']} camera={definition.visualization.presentation.camera}/>}/>;
}
