import {useMemo,useState} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {CompanionRendererProps} from '../registry';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import {functionGrid} from '../../math/optimizationFoundations';
import {quadraticCost} from '../../math/descentMethods';
import {rootNewton,cubicNewton,cubicCost,metricModel} from '../../math/newtonModels';
import {traceCurve,marker,descentColors as C} from './descentGraphics';
import '../../styles/optimization.css';
import '../../styles/newton.css';

const cls='optimization-lesson newton-lesson';
const fmt=(x:number)=>!Number.isFinite(x)?'fuori scala numerica':x!==0&&(Math.abs(x)<.0001||Math.abs(x)>=10000)?x.toExponential(3):numberText(x,4);
const remembered=new Map<string,number>();
function useFunctionChoice(definition:CompanionDefinition){
  const [value,setValue]=useState(()=>remembered.get(definition.page_id)??0);
  const update=(next:number)=>{remembered.set(definition.page_id,next);setValue(next);};
  return {value,update,reset:()=>update(0)};
}
const note=(text:string)=>({text,x:.99,y:.98,xref:'paper',yref:'paper',xanchor:'right',showarrow:false,font:{size:22,color:'#a23b24'},bgcolor:'#ffffffed',borderpad:4});

/** The same residual is reused as a gradient in p35; axis labels and root meanings stay explicit. */
function RootScene({id,d,optimization=false}:{id:string;d:ReturnType<typeof rootNewton>;optimization?:boolean}){
  const traces=useMemo(()=>{
    const result:PlotTrace[]=[traceCurve(d.fn,-2.5,2.5,optimization?'Gradiente del costo':'Residuo originale'),
      traceCurve(d.linear,-2.5,2.5,'Modello affine',C.direction,'dash'),
      marker(d.c,d.residual,'Punto corrente',C.cost,13)];
    const root=Math.sqrt(d.alpha);
    for(const r of root===0?[0]:[-root,root]){
      result.push({...marker(r,0,optimization?(r>0?'Minimo locale del costo':'Massimo locale del costo'):'Radice del residuo',
        optimization&&r<0?C.gradient:C.minimum,16),marker:{size:16,symbol:'diamond',color:optimization&&r<0?C.gradient:C.minimum,line:{color:'white',width:2}}});
    }
    if(d.inside&&d.next!==null){
      result.push(marker(d.next,0,'Zero del modello affine',C.current,12),
        {type:'scatter',mode:'lines',name:'Residuo non lineare al nuovo punto',x:[d.next,d.next],y:[0,d.nextResidual],line:{color:C.current,width:2,dash:'dot'}},
        {...marker(d.next,d.nextResidual!,'Valore non lineare dopo il passo',C.cost,10),marker:{size:10,symbol:'circle-open',color:C.cost,line:{width:2}}});
    }
    return result;
  },[d,optimization]);
  const outside=d.next!==null&&!d.inside;
  return <SceneViewport id={id} traces={traces} layout={{xaxis:{title:{text:'z [1]'},range:[-2.5,2.5]},
    yaxis:{title:{text:optimization?'∇ℓ(z) [gradiente]':'r(z) [residuo]'},range:[-2.25,5.5]},
    annotations:outside?[note('Nuovo punto fuori dal ritaglio')]:d.status==='singular'?[note('Derivata zero: nessun passo')]:[]}}
    height={335} fontSize={22} label={optimization?'Newton sul gradiente e sua linearizzazione':'Residuo e modello affine di Newton'}/>;
}
function RootFinding({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[c,alpha]=state.numbers,d=useMemo(()=>rootNewton(c,alpha),[c,alpha]);
  const canAdvance=d.status==='step'&&d.next!==null&&Math.abs(d.next)<=2;
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt34-update"/>}
    legend="Esempio aggiunto · blu: residuo · viola: modello affine · arancio: zero del modello."
    visual={<RootScene id="optimization-opt34-root" d={d}/>}
    controls={<><LessonControls definition={definition} state={state} hints={['Ricostruisce il modello in c','Cambia residuo e radici']}/>
      <div className="newton-advance"><button disabled={!canAdvance} onClick={()=>{if(canAdvance)state.update('opt34-c',d.next!);}}>Esegui un passo</button><span>Il nuovo punto diventa il punto corrente.</span></div></>}
    example={<><LessonEquation definition={definition} formulaId="opt34-example"/>
      <LiveMetrics items={[{id:'opt34-residual',label:'Residuo corrente',value:fmt(d.residual)},{id:'opt34-next',label:'Zero del modello',value:d.next===null?'—':fmt(d.next)},
        {id:'opt34-new-residual',label:'Residuo dopo il passo',value:d.nextResidual===null?'—':fmt(d.nextResidual)}]}/>
      <FormulaContext definition={definition} formulaId="opt34-linear"><span data-testid="opt34-verdict">{
        d.status==='root'?'Radice già raggiunta: nessun aggiornamento necessario.':d.status==='numerical_root'?'Residuo entro 10⁻¹²: arresto numerico, senza dichiarare uno zero esatto.':
          d.status==='singular'?'Tangente costante non nulla: il modello non ha zero.':
            d.status==='numerical_limit'?'Il passo supera la scala numerica: non viene simulato.':
              !canAdvance?'Nuovo punto fuori dall’intervallo del controllo: valore dichiarato, senza clamp.':
                'Il modello è zero nel punto nuovo; il residuo originale va rivalutato.'}</span></FormulaContext>
    </>}/>;
}
function StationaryNewton({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),a=state.numbers[0],d=useMemo(()=>cubicNewton(a),[a]),root=useMemo(()=>rootNewton(a,1),[a]);
  const canAdvance=root.status==='step'&&d.next!==null&&Math.abs(d.next)<=1.8;
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt35-newton"/>}
    legend="Esempio aggiunto · grafico del gradiente · verde: minimo locale · rosso: massimo locale."
    visual={<RootScene id="optimization-opt35-gradient" d={root} optimization/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia punto, gradiente e Hessiana']}
      extra={<div className="newton-action"><button disabled={!canAdvance} onClick={()=>{if(canAdvance)state.update('opt35-a',d.next!);}}>Esegui un passo</button><span>Si cerca uno zero del gradiente.</span></div>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt35-example"/>
      <LiveMetrics items={[{id:'opt35-hessian',label:'Hessiana nel punto',value:fmt(d.hessian)},{id:'opt35-step',label:'Spostamento Δz',value:d.increment===null?'non definito':fmt(d.increment)},
        {id:'opt35-cost-change',label:'Variazione del costo',value:d.nextCost===null?'—':fmt(d.nextCost-d.cost)}]}/>
      <FormulaContext definition={definition} formulaId="opt35-system"><span data-testid="opt35-verdict">{root.status==='numerical_root'?'Gradiente entro 10⁻¹²: arresto numerico vicino a uno stazionario.':d.hessian===0?'Hessiana nulla: il sistema non dà un passo Newton.':
        d.stationary?(a>0?'Stazionario raggiunto: minimo locale del cubico.':'Stazionario raggiunto: massimo locale, non minimo.'):
          d.hessian<0?'Hessiana negativa: Newton può avvicinare un massimo e aumentare il costo.':
            !canAdvance?'Passo fuori dall’intervallo del controllo; nessun clamp.':
              d.nextCost!==null&&d.nextCost>d.cost?'Hessiana positiva, ma il passo pieno aumenta il costo.':'Questo passo riduce il costo del cubico.'}</span></FormulaContext>
    </>}/>;
}
function QuadraticStepScene({d}:{d:ReturnType<typeof cubicNewton>}){
  const q=useMemo(()=>(s:number)=>d.gradient*s+d.hessian*s*s/2,[d]);
  const actual=useMemo(()=>(s:number)=>cubicCost(d.a+s)-d.cost,[d]);
  const delta=d.increment,inside=delta!==null&&Math.abs(delta)<=2.5;
  const traces=useMemo(()=>[
    traceCurve(actual,-2.5,2.5,'Variazione reale'),
    traceCurve(q,-2.5,2.5,'QP del passo',C.direction),
    marker(0,0,'Spostamento nullo',C.cost,13),
    ...(inside?[marker(delta!,q(delta!),d.hessian>0?'Minimo del modello':'Massimo del modello',C.current),
      {type:'scatter',mode:'lines',x:[delta,delta],y:[q(delta!),actual(delta!)],name:'Differenza dal modello',line:{color:C.current,width:2,dash:'dot'}}]:[])
  ],[actual,q,delta,inside,d.hessian]);
  return <SceneViewport id="optimization-opt36-step" traces={traces} layout={{xaxis:{title:{text:'Δz [spostamento]'},range:[-2.5,2.5]},
    yaxis:{title:{text:'Variazione di costo'},range:[-3.5,3.5]},
    annotations:delta!==null&&!inside?[note('Stazionario fuori dal ritaglio')]:d.hessian<=0?[note('Il QP non ha minimo')]:[]}}
    label="QP dello spostamento e variazione reale" height={335} fontSize={22}/>;
}
function NewtonQuadratic({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),a=state.numbers[0],d=useMemo(()=>cubicNewton(a),[a]);
  const canAdvance=d.hessian>0&&!d.stationary&&d.next!==null&&Math.abs(d.next)<=1.8;
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt36-corrected" warnings/>}
    legend={<FormulaContext definition={definition} formulaId="opt36-qp">Esempio aggiunto · blu: variazione reale · viola: QP del passo Δz.</FormulaContext>}
    visual={<QuadraticStepScene d={d}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Ricostruisce modello e curvatura']}
      extra={<div className="newton-action"><button disabled={!canAdvance} onClick={()=>{if(canAdvance)state.update('opt36-a',d.next!);}}>Esegui un passo</button><span>Si somma lo spostamento del QP.</span></div>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt36-example"
      latex="q_a(\Delta z)=(a^2-1)\Delta z+a(\Delta z)^2,\quad\ell(z)=z^3/3-z"/>
      <LiveMetrics items={[{id:'opt36-type',label:'Stazionario del QP',value:d.hessian>0?'minimo unico':d.hessian<0?'massimo':'nessuno'},
        {id:'opt36-step',label:'Passo del minimo',value:d.modelMinimum===null?'nessun minimo':fmt(d.increment!)},
        {id:'opt36-next',label:'Nuovo punto a+Δz',value:d.modelMinimum===null?'—':fmt(d.next!)}]}/>
      <FormulaContext definition={definition} formulaId="opt36-system"><span data-testid="opt36-verdict">{d.hessian===0?'A curvatura zero il modello è lineare e non ha minimo.':d.hessian<0?'Curvatura negativa: lo stazionario è un massimo, non il minimo del QP.':
        d.stationary?'Il minimo del modello è nel punto corrente: passo zero.':
          d.nextCost!==null&&d.nextCost>d.cost?'Il QP è minimo, ma il passo pieno aumenta il costo reale.':'Il valore del QP non è la variazione reale del costo.'}</span></FormulaContext>
    </>}/>;
}

/** Each function selection uses the same D, point and minimizing displacement in both dimensions. */
function MetricScene({definition,d,real}:{definition:CompanionDefinition;d:ReturnType<typeof metricModel>;real:boolean}){
  const id='optimization-opt37-metric',fn=real?quadraticCost:d.model,label=real?'ℓ(z)':'ℓᵏ(z)';
  const grid=useMemo(()=>functionGrid(id,fn,-2.5,2.5,label,61),[id,fn,label]);
  const traces=useMemo(()=>{
    const point3=(z:readonly[number,number],name:string,color:string,size:number)=>({type:'scatter3d',mode:'markers',name,
      x:[z[0]],y:[z[1]],z:[fn(...z)],marker:{size,color,line:{color:'white',width:2}},hovertemplate:name+'<br>%{x:.4f}, %{y:.4f}<br>%{z:.5f}<extra></extra>'});
    const two:PlotTrace[]=[{type:'contour',x:grid.x,y:grid.y,z:grid.z,zmin:-2,zmax:15,colorscale:'Viridis',autocontour:false,
      contours:{start:-2,end:15,size:1,coloring:'heatmap',showlabels:true,labelfont:{size:22,color:'white'}},
      colorbar:{title:{text:label},thickness:12},hovertemplate:'%{x:.3f}, %{y:.3f}<br>'+label+'=%{z:.5f}<extra></extra>'},
      {type:'scatter',mode:'lines',x:[d.current[0],d.next[0]],y:[d.current[1],d.next[1]],line:{color:C.cost,width:3},hoverinfo:'skip'},
      marker(...d.current,'Punto corrente',C.cost,15),marker(...d.next,'Minimizzatore del modello',C.current,13)];
    const three:PlotTrace[]=[{type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',cmin:-2,cmax:15,colorbar:{title:{text:label},thickness:12},
      hovertemplate:'%{x:.3f}, %{y:.3f}<br>'+label+'=%{z:.5f}<extra></extra>'},
      {type:'scatter3d',mode:'lines',x:[d.current[0],d.next[0]],y:[d.current[1],d.next[1]],z:[fn(...d.current),fn(...d.next)],line:{color:C.cost,width:5},hoverinfo:'skip'},
      point3(d.current,'Punto corrente',C.cost,7),point3(d.next,'Minimizzatore del modello',C.current,8)];
    if(real){two.splice(1,0,{...marker(0,0,'Minimo reale',C.minimum,18),marker:{size:18,symbol:'star',color:C.minimum,line:{color:'white',width:2}}});
      three.push(point3([0,0],'Minimo reale',C.minimum,9));}
    return {two,three};
  },[grid,fn,label,d,real]);
  const twoD=<SceneViewport id={id+'-2d'} traces={traces.two} layout={{xaxis:{title:{text:'z₁ [1]'},range:[-2.5,2.5],constrain:'domain'},
    yaxis:{title:{text:'z₂ [1]'},range:[-2.5,2.5],scaleanchor:'x',constrain:'domain'},margin:{l:75,r:80,t:15,b:58}}}
    label={real?'Livelli del costo reale':'Livelli del modello quadratico'} height={335} fontSize={22}/>;
  return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode} twoDView={twoD}
    threeDView={<SceneViewport id={id+'-3d'} traces={traces.three} is3D layout={{scene:{xaxis:{title:{text:'z₁'},range:[-2.5,2.5]},
      yaxis:{title:{text:'z₂'},range:[-2.5,2.5]},zaxis:{title:{text:label},range:[-2,15]}}}}
      label={real?'Superficie del costo reale':'Superficie del modello quadratico'} height={335} fontSize={22}
      axisLegend={['z₁ [1]','z₂ [1]',label+' [valore]']} camera={definition.visualization.presentation.camera}/>}/>;
}
function MetricQuadratic({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[d1,d2]=state.numbers,choice=useFunctionChoice(definition);
  const d=useMemo(()=>metricModel(d1,d2),[d1,d2]);
  const numericalTie=Math.abs(d.change)<=16*Number.EPSILON*Math.max(1,Math.abs(d.actual),Math.abs(d.initial));
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt37-model" warnings/>}
    legend={choice.value===0?'Esempio aggiunto · modello ℓᵏ · arancio: minimo del modello · blu: punto corrente.':
      'Esempio aggiunto · costo reale ℓ · arancio: minimo del modello · verde: minimo reale.'}
    visual={<MetricScene definition={definition} d={d} real={choice.value===1}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
      hints={['Curvatura del modello: 1/D₁₁','Curvatura del modello: 1/D₂₂']}
      extra={<label className="opt-choice"><span>Funzione mostrata</span><select aria-label="Funzione mostrata" value={choice.value} onChange={e=>choice.update(Number(e.target.value))}>
        <option value={0}>Modello quadratico</option><option value={1}>Costo reale</option></select></label>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt37-example" latex="\ell(z)=\frac12(z_1^2+4z_2^2),\quad z^k=(1,0.5)^T"/>
      <LiveMetrics items={[{id:'opt37-model-minimum',label:'Minimo del modello',value:fmt(d.minimum)},{id:'opt37-real-cost',label:'Costo reale dopo il passo',value:fmt(d.actual)},{id:'opt37-change',label:'Variazione reale',value:fmt(d.change)}]}/>
      <FormulaContext definition={definition} formulaId="opt37-update"><span data-testid="opt37-verdict">{numericalTie?'Pareggio entro la precisione numerica: nessuna discesa stretta.':d.change>0?'Il modello è minimo; il costo reale sale dal valore iniziale 1.':
        d1===1&&d2===.25?'Modello e costo coincidono; il nuovo punto è il minimo reale.':'Il passo riduce il costo di questo esempio.'}</span></FormulaContext>
    </>}/>;
}
export function NewtonLesson(props:CompanionRendererProps){
  switch(props.definition.source_page){
    case 34:return <RootFinding {...props}/>;
    case 35:return <StationaryNewton {...props}/>;
    case 36:return <NewtonQuadratic {...props}/>;
    case 37:return <MetricQuadratic {...props}/>;
    default:throw new Error('Companion E non disponibile');
  }
}
