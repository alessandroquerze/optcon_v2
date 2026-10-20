import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import {functionGrid} from '../../math/optimizationFoundations';
import {armijoTrials,qpIterations} from '../../math/stepSizeModels';
import {traceCurve,marker,descentColors as C} from './descentGraphics';

export function ArmijoScene({id,data,index}:{id:string;data:ReturnType<typeof armijoTrials>;index:number}){
  const traces=useMemo(()=>{
    const list:PlotTrace[]=[traceCurve(data.profile,0,1.05,'Costo reale φ(γ)'),
      traceCurve(data.threshold,0,1.05,'Soglia Armijo',C.gradient,'dash'),
      traceCurve(data.tangent,0,1.05,'Tangente',C.direction,'dot'),
      {type:'scatter',mode:'lines',name:'Costo iniziale',x:[0,1.05],y:[1,1],line:{color:'#8ea1aa',width:1,dash:'dot'}}];
    for(const [i,t] of data.trials.slice(0,index+1).entries()){
      const color=t.accepted?C.minimum:C.current;
      list.push({...marker(t.gamma,t.cost,'Tentativo i='+i,color,i===index?16:10),mode:'markers+text',
        text:['i='+i],textposition:i===0?'top left':'top right',textfont:{size:22,color}});
      if(i===index)list.push({type:'scatter',mode:'lines',x:[t.gamma,t.gamma],y:[t.cost,t.threshold],
        name:'Confronto con la soglia',line:{color,width:3,dash:'dot'}});
    }
    return list;
  },[data,index]);
  return <SceneViewport id={id} traces={traces} height={335} fontSize={22} label="Costo, soglia Armijo e tentativi del passo"
    layout={{xaxis:{title:{text:'γ [passo]'},range:[0,1.05]},yaxis:{title:{text:'Costo lungo la direzione'},range:[-3.5,1.6]}}}/>;
}
export function SequenceScene({id,traces,label,yLabel,yRange,maxK,annotation}:{id:string;traces:PlotTrace[];label:string;yLabel:string;yRange:number[];maxK:number;annotation?:string}){
  return <SceneViewport id={id} traces={traces} height={335} fontSize={22} label={label}
    layout={{xaxis:{title:{text:'k [iterazione]'},range:[0,maxK],dtick:maxK<=40?5:20},yaxis:{title:{text:yLabel},range:yRange},
      annotations:annotation?[{text:annotation,x:.99,y:.97,xref:'paper',yref:'paper',xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'}]:[]}}/>;
}
/** Same QP and samples in both views, including an entire line of minima and off-screen iterates. */
export function QuadraticPathScene({definition,data,index}:{definition:CompanionDefinition;data:ReturnType<typeof qpIterations>;index:number}){
  const id='optimization-opt46-qp',current=data.states[index];
  const grid=useMemo(()=>functionGrid(id,data.value,-2,2,'ℓ(z)',61),[data.value]);
  const inside=(z:readonly number[])=>z.every(v=>Math.abs(v)<=2);
  const out=!inside(current),minimumOut=data.kind==='unique'&&(!data.minimizerFinite||!inside(data.minimizer!));
  const {two,three}=useMemo(()=>{
    const path=data.states.slice(0,index+1),x=path.map(z=>z[0]),y=path.map(z=>z[1]),z=path.map(p=>data.value(...p));
    // GPU buffers have less precision than the numerical model. Exclude out-of-box
    // samples from the 3D drawing instead of letting enormous iterates flatten the
    // visible surface. The exact values remain in the model and student readouts.
    const visible=path.map((p,i)=>inside(p)&&z[i]>=-2&&z[i]<=16?p:null);
    const two:PlotTrace[]=[{type:'contour',x:grid.x,y:grid.y,z:grid.z,zmin:-2,zmax:16,colorscale:'Viridis',autocontour:false,
      contours:{start:-2,end:16,size:1,coloring:'heatmap',showlabels:true,labelfont:{size:22,color:'white'}},colorbar:{title:{text:'ℓ(z)'},thickness:12}},
      {type:'scatter',mode:'lines+markers',x,y,name:'Iterati',line:{color:C.cost,width:3},marker:{size:7,color:C.cost},hovertemplate:'%{x:.4g}, %{y:.4g}<extra>Iterato</extra>'},
      marker(...data.states[0],'Punto iniziale',C.cost,15),marker(...current,'Punto corrente',C.current,14)];
    const three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',cmin:-2,cmax:16,colorbar:{title:{text:'ℓ(z)'},thickness:12}},
      {type:'scatter3d',mode:'lines+markers',x:visible.map(p=>p?.[0]??null),y:visible.map(p=>p?.[1]??null),z:visible.map(p=>p?data.value(...p):null),
        connectgaps:false,name:'Iterati nel ritaglio',line:{color:C.cost,width:5},marker:{size:3,color:C.cost}},
      ...(inside(current)?[{type:'scatter3d',mode:'markers',x:[current[0]],y:[current[1]],z:[data.value(...current)],name:'Punto corrente',
        marker:{size:8,color:C.current,line:{color:'white',width:2}}}]:[])];
    if(data.kind==='unique'&&data.minimizerFinite&&!minimumOut){
      const m=data.minimizer!;
      two.push({...marker(...m,'Minimo globale',C.minimum,18),marker:{size:18,symbol:'star',color:C.minimum,line:{color:'white',width:2}}});
      three.push({type:'scatter3d',mode:'markers',x:[m[0]],y:[m[1]],z:[data.value(...m)],name:'Minimo globale',marker:{size:9,color:C.minimum,symbol:'diamond'}});
    }
    if(data.kind==='line'){
      two.push({type:'scatter',mode:'lines',x:[0,0],y:[-2,2],name:'Retta di minimi',line:{color:C.minimum,width:6}});
      three.push({type:'scatter3d',mode:'lines',x:[0,0],y:[-2,2],z:[0,0],name:'Retta di minimi',line:{color:C.minimum,width:7}});
    }
    return {two,three};
  },[data,index,grid,current,minimumOut]);
  const annotation=out?'Iterato fuori dal ritaglio':minimumOut?'Minimo fuori dal ritaglio':data.kind==='none'?'Nessun minimo finito':undefined;
  const annotations=annotation?[{text:annotation,x:.98,y:.97,xref:'paper',yref:'paper',xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'}]:[];
  return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
    twoDView={<SceneViewport id={id+'-2d'} traces={two} label="QP, iterati e insieme dei minimi" height={335} fontSize={22}
      layout={{xaxis:{title:{text:'z₁ [1]'},range:[-2,2],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-2,2],scaleanchor:'x',constrain:'domain'},annotations,margin:{l:75,r:80,t:15,b:58}}}/>}
    threeDView={<SceneViewport id={id+'-3d'} traces={three} is3D label="Costo del QP e iterati sulla superficie" height={335} fontSize={22}
      layout={{scene:{xaxis:{title:{text:'z₁'},range:[-2,2]},yaxis:{title:{text:'z₂'},range:[-2,2]},zaxis:{title:{text:'ℓ(z)'},range:[-2,16]}},annotations}}
      axisLegend={['z₁ [1]','z₂ [1]','ℓ(z) [costo]']} camera={definition.visualization.presentation.camera}/>}/>;
}
