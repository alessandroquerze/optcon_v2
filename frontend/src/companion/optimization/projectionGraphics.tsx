import {useMemo} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import {functionGrid} from '../../math/optimizationFoundations';
import type {Vec2} from '../../math/descentMethods';
import type {ConvexRegion} from '../../math/projectionModels';
import {containsRegion,regionBoundary} from '../../math/projectionModels';
import {marker,descentColors as C} from './descentGraphics';
export {descentColors as C} from './descentGraphics';
export type GeometryPoint={z:Vec2;label:string;color:string;symbol?:string};
export type GeometrySegment={from:Vec2;to:Vec2;color:string;label:string;dash?:string};
export const regionTrace=(kind:ConvexRegion):PlotTrace=>{
  const curve=regionBoundary(kind);
  return {type:'scatter',mode:'lines',x:curve.map(p=>p[0]),y:curve.map(p=>p[1]),name:'Insieme ammissibile Z',
    fill:'toself',fillcolor:'#b3ddd03d',line:{color:C.minimum,width:3},hoverinfo:'skip'};
};
export const segmentTrace=(s:GeometrySegment):PlotTrace=>({type:'scatter',mode:'lines',x:[s.from[0],s.to[0]],y:[s.from[1],s.to[1]],
  name:s.label,line:{color:s.color,width:3,dash:s.dash??'solid'},hoverinfo:'skip'});
export function ProjectionGeometry({id,kind,points,segments}:{id:string;kind:ConvexRegion;points:GeometryPoint[];segments:GeometrySegment[]}){
  const traces=useMemo(()=>[regionTrace(kind),...segments.map(segmentTrace),...points.map(p=>marker(...p.z,p.label,p.color,14))],[kind,points,segments]);
  return <SceneViewport id={id} traces={traces} label="Punto, proiezione e concorrente ammissibile" height={335} fontSize={22}
    layout={{xaxis:{title:{text:'z₁ [1]'},range:[-2.2,2.2],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-2.2,2.2],scaleanchor:'x',constrain:'domain'}}}/>;
}
/** One mathematical function, one region and the same selections in both views. */
export function CostGeometryScene({definition,id,value,region,points,segments=[],vectors=[],path=[],minima=[],range=1.6,zRange,annotation}:{
  definition:CompanionDefinition;id:string;value:(x:number,y:number)=>number;region?:ConvexRegion;
  points:GeometryPoint[];segments?:GeometrySegment[];vectors?:GeometrySegment[];path?:readonly Vec2[];minima?:readonly Vec2[];range?:number;zRange:number[];annotation?:string;
}){
  const grid=useMemo(()=>functionGrid(id,value,-range,range,'ℓ(z)',65),[id,value,range]);
  const visible=(z:Vec2)=>z.every(v=>Number.isFinite(v)&&Math.abs(v)<=range)&&value(...z)>=zRange[0]&&value(...z)<=zRange[1];
  const offscreen=points.some(p=>!visible(p.z));
  const traces=useMemo(()=>{
    const colorscale='Viridis';
    const two:PlotTrace[]=[...(region===undefined?[]:[regionTrace(region)]),
      {type:'contour',x:grid.x,y:grid.y,z:grid.z,colorscale:region===undefined?colorscale:[[0,'#5a91aa'],[1,'#5a91aa']],
        zmin:zRange[0],zmax:zRange[1],autocontour:false,showscale:region===undefined,
        contours:{start:zRange[0],end:zRange[1],size:(zRange[1]-zRange[0])/10,coloring:region===undefined?'heatmap':'lines',showlabels:true,labelfont:{size:22,color:region===undefined?'white':'#3c6d81'}},
        colorbar:{title:{text:'ℓ(z)'},thickness:12},hovertemplate:'%{x:.3f}, %{y:.3f}<br>ℓ=%{z:.5f}<extra></extra>'}];
    const surface={type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale,cmin:zRange[0],cmax:zRange[1],colorbar:{title:{text:'ℓ(z)'},thickness:12}};
    const three:PlotTrace[]=region===undefined?[surface]:[
      {...surface,colorscale:'Greys',opacity:.14,showscale:false,hoverinfo:'skip'},
      {...surface,z:grid.y.map((y,i)=>grid.x.map((x,j)=>containsRegion([x,y],region)?grid.z[i][j]:null)),opacity:.95}];
    if(region!==undefined){
      const edge=regionBoundary(region);
      three.push({type:'scatter3d',mode:'lines',x:edge.map(z=>z[0]),y:edge.map(z=>z[1]),z:edge.map(z=>value(...z)),
        name:'Bordo ammissibile',line:{color:C.minimum,width:5}});
    }
    if(path.length){
      two.push({type:'scatter',mode:'lines+markers',x:path.map(z=>z[0]),y:path.map(z=>z[1]),name:'Iterati',line:{color:C.cost,width:3},marker:{size:6,color:C.cost}});
      const inBox=path.map(z=>visible(z)?z:null);
      three.push({type:'scatter3d',mode:'lines+markers',x:inBox.map(z=>z?.[0]??null),y:inBox.map(z=>z?.[1]??null),z:inBox.map(z=>z?value(...z):null),
        connectgaps:false,name:'Iterati nel ritaglio',line:{color:C.cost,width:5},marker:{size:3,color:C.cost}});
    }
    for(const s of segments){
      two.push(segmentTrace(s));
      // A sampled segment follows the actual cost, not a fictitious linear height.
      const samples=Array.from({length:41},(_,i)=>[s.from[0]+i*(s.to[0]-s.from[0])/40,s.from[1]+i*(s.to[1]-s.from[1])/40] as Vec2);
      three.push({type:'scatter3d',mode:'lines',x:samples.map(z=>visible(z)?z[0]:null),y:samples.map(z=>visible(z)?z[1]:null),
        z:samples.map(z=>visible(z)?value(...z):null),connectgaps:false,name:s.label,line:{color:s.color,width:5,dash:s.dash??'solid'}});
    }
    if(minima.length===2){
      two.push(segmentTrace({from:minima[0],to:minima[1],label:'Segmento di minimi',color:C.minimum}));
      three.push({type:'scatter3d',mode:'lines',x:minima.map(z=>z[0]),y:minima.map(z=>z[1]),z:minima.map(z=>value(...z)),
        name:'Segmento di minimi',line:{color:C.minimum,width:7}});
    }else if(minima.length===1){
      two.push({...marker(...minima[0],'Minimo globale noto',C.minimum,18),marker:{size:18,symbol:'star',color:C.minimum,line:{color:'white',width:2}}});
      three.push({type:'scatter3d',mode:'markers',x:[minima[0][0]],y:[minima[0][1]],z:[value(...minima[0])],
        name:'Minimo globale noto',marker:{size:9,symbol:'diamond',color:C.minimum}});
    }
    for(const p of points){
      two.push({...marker(...p.z,p.label,p.color,14),marker:{size:14,color:p.color,symbol:p.symbol??'circle',line:{color:'white',width:2}}});
      if(visible(p.z))three.push({type:'scatter3d',mode:'markers',x:[p.z[0]],y:[p.z[1]],z:[value(...p.z)],
        name:p.label,marker:{size:8,color:p.color,line:{color:'white',width:2}},hovertemplate:p.label+'<br>%{x:.4f}, %{y:.4f}<br>ℓ=%{z:.5f}<extra></extra>'});
    }
    return {two,three};
  },[value,grid,region,points,segments,path,minima,range,zRange]);
  const text=annotation??(offscreen?'Un punto è fuori dal ritaglio':undefined);
  const annotations=text?[{text,x:.98,y:.97,xref:'paper',yref:'paper',xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'}]:[];
  const arrows=vectors.flatMap(v=>[{ax:v.from[0],ay:v.from[1],x:v.to[0],y:v.to[1],xref:'x',yref:'y',axref:'x',ayref:'y',
    text:'',showarrow:true,arrowhead:3,arrowwidth:3,arrowcolor:v.color},
    {x:(v.from[0]+v.to[0])/2,y:(v.from[1]+v.to[1])/2,xref:'x',yref:'y',text:v.label,yshift:-24,showarrow:false,font:{size:22,color:v.color},bgcolor:'#ffffffdf'}]);
  return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
    twoDView={<SceneViewport id={id+'-2d'} traces={traces.two} label="Costo, regione e punti nel piano" height={335} fontSize={22}
      layout={{xaxis:{title:{text:'z₁ [1]'},range:[-range,range],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-range,range],scaleanchor:'x',constrain:'domain'},
        annotations:[...annotations,...arrows],margin:{l:75,r:80,t:15,b:58}}}/>}
    threeDView={<SceneViewport id={id+'-3d'} traces={traces.three} is3D label="Costo e punti sulla superficie" height={335} fontSize={22}
      layout={{scene:{xaxis:{title:{text:'z₁'},range:[-range,range]},yaxis:{title:{text:'z₂'},range:[-range,range]},zaxis:{title:{text:'ℓ(z)'},range:zRange}},annotations}}
      axisLegend={['z₁ [1]','z₂ [1]','ℓ(z) [costo]']} camera={definition.visualization.presentation.camera}/>}/>;
}
