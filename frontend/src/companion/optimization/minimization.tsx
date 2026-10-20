import {useMemo,useState} from 'react';
import type {CompanionDefinition} from '../../data/manifest';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,LessonEquation,LessonControls,LiveMetrics,FormulaContext,numberText,useLessonParameters} from '../LessonFrame';
import {SceneViewport,FunctionExplorer} from '../../visualization';
import type {PlotTrace} from '../../visualization/core/SceneViewport';
import {curveData,functionGrid} from '../../math/optimizationFoundations';
import {lowerSupport,upperSupport,proofSegment,convexStationarity,stationaryNames,quadraticModel,quadraticCase,quadraticCases,positiveCases} from '../../math/convexMinimization';
import '../../styles/optimization.css';
import '../../styles/minimization.css';

const colors={cost:'#176c98',bound:'#c43d35',tangent:'#8057a5',probe:'#cf6b24',minimum:'#25775b'};
const cls='optimization-lesson minimization-lesson';
const fmt=(x:number)=>x!==0&&Math.abs(x)<.0001?x.toExponential(3):numberText(x,4);
const latexNumber=(x:number)=>{
  if(x===0)return '0';
  if(Math.abs(x)<.005){
    const [mantissa,exponent]=x.toExponential(2).split('e');
    return mantissa+'\\cdot10^{'+Number(exponent)+'}';
  }
  return numberText(x,3);
};
const line=(fn:(x:number)=>number,lo:number,hi:number,name:string,color=colors.cost,dash='solid')=>{
  const data=curveData(name,fn,lo,hi);
  return {type:'scatter',mode:'lines',name,x:data.points.map(p=>p.x),y:data.points.map(p=>p.y),line:{color,width:3,dash},
    hovertemplate:'z=%{x:.3f}<br>valore=%{y:.5f}<extra>'+name+'</extra>'};
};
const point=(x:number,y:number,name:string,color=colors.probe)=>({type:'scatter',mode:'markers',name,x:[x],y:[y],marker:{size:12,color,line:{color:'white',width:2}},hovertemplate:name+'<br>%{x:.4f}, %{y:.5f}<extra></extra>'});
const segment=(x:number,low:number,high:number)=>({type:'scatter',mode:'lines',name:'Margine in B',x:[x,x],y:[low,high],line:{width:4,color:colors.probe}});
const curveLayout=(x:number[],y:number[])=>({xaxis:{title:{text:'z [1]'},range:x},yaxis:{title:{text:'ℓ(z) [valore]'},range:y}});

const remembered=new Map<string,number>();
function useChoice(definition:CompanionDefinition){
  const [value,setValue]=useState(()=>remembered.get(definition.page_id)??0);
  const update=(next:number)=>{remembered.set(definition.page_id,next);setValue(next);};
  return {value,update,reset:()=>update(0)};
}
function Choice({label,options,state}:{label:string;options:readonly string[];state:ReturnType<typeof useChoice>}){
  return <label className="opt-choice"><span>{label}</span><select aria-label={label} value={state.value} onChange={e=>state.update(Number(e.target.value))}>
    {options.map((name,i)=><option value={i} key={name}>{name}</option>)}</select></label>;
}

/** The lower and upper models deliberately share plotting semantics, but not assumptions. */
function SupportLesson({definition}:CompanionRendererProps){
  const lower=definition.source_page===19,prefix=lower?'opt19':'opt20';
  const state=useLessonParameters(definition),[a,b]=state.numbers;
  const d=useMemo(()=>lower?lowerSupport(a,b):upperSupport(a,b),[a,b,lower]);
  const traces=useMemo(()=>[
    line(d.value,-1.5,1.5,'Costo'),
    line(d.affine,-1.5,1.5,'Tangente',colors.tangent,'dash'),
    line(d.bound,-1.5,1.5,lower?'Limite inferiore':'Limite superiore',colors.bound),
    segment(b,d.cost,d.estimate),point(a,d.value(a),'Punto A',colors.cost),
    ...(a===b?[]:[point(b,d.cost,'Costo in B')]),
  ],[d,a,b,lower]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={prefix+(lower?'-lower':'-upper')}
      primaryLatex={lower?String.raw`\begin{gathered}\ell(z_B)\ge\ell(z_A)+\nabla\ell(z_A)^\top(z_B-z_A)\\+\frac{\mu}{2}\|z_B-z_A\|^2\end{gathered}`:
        String.raw`\begin{gathered}\ell(z_B)\le\ell(z_A)+\nabla\ell(z_A)^\top(z_B-z_A)\\+\frac L2\|z_B-z_A\|^2\end{gathered}`}/>}
    legend={'Esempio aggiunto · blu: costo · rosso: '+(lower?'limite inferiore':'limite superiore')+' · viola: tangente.'}
    visual={<SceneViewport id={'optimization-'+prefix+'-support'} traces={traces} layout={curveLayout([-1.5,1.5],lower?[-2,3.2]:[-2.5,4.5])}
      label={lower?'Supporto quadratico inferiore':'Maggiorante quadratico'} height={340} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Ricostruisce i due supporti','Muove solo il punto B']}/>}
    example={<><LessonEquation definition={definition} formulaId={prefix+'-example'}/>
      <LiveMetrics items={[{id:prefix+'-cost',label:'Costo in B',value:fmt(d.cost)},{id:prefix+'-bound',label:lower?'Limite inferiore':'Limite superiore',value:fmt(d.estimate)},{id:prefix+'-margin',label:lower?'Costo − limite':'Limite − costo',value:fmt(d.margin)}]}/>
    </>}/>;
}

function LocalGlobal({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),theta=state.numbers[0],d=useMemo(()=>proofSegment(theta),[theta]);
  const traces=useMemo(()=>[
    line(d.value,-.2,1.2,'Costo z²'),
    line(z=>z,0,1,'Corda',colors.tangent,'dash'),
    {type:'scatter',mode:'lines',name:'Costo del candidato',x:[-.2,1.2],y:[1,1],line:{color:'#81919a',width:2,dash:'dot'}},
    point(0,0,'Punto migliore',colors.minimum),point(1,1,'Candidato: non minimo',colors.cost),
    point(d.z,d.cost,'Punto interpolato'),segment(d.z,d.cost,1),
  ],[d]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt21-better" primaryLatex="\exists\bar z\in\mathbb Z:\ \ell(\bar z)<\ell(z^\star)" warnings/>}
    legend="Esempio aggiunto · candidato 1 · punto migliore 0 · punto interpolato arancio."
    visual={<SceneViewport id="optimization-opt21-proof" traces={traces} layout={curveLayout([-.2,1.2],[-.12,1.5])} label="Contraddizione del minimo soltanto locale" height={325} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['θ=1 è escluso dalla disuguaglianza stretta']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt21-example" latex="\ell(z)=z^2,\quad z^\star=1,\quad\bar z=0,\quad\tilde z=\theta"/>
      <LiveMetrics items={[{id:'opt21-distance',label:'Distanza dal candidato',value:fmt(d.distance)},{id:'opt21-cost',label:'Costo interpolato',value:fmt(d.cost)},{id:'opt21-improvement',label:'Miglioramento',value:fmt(d.improvement)}]}/>
      <FormulaContext definition={definition} formulaId="opt21-proof">{theta===1?'A θ=1 non c’è miglioramento. La prova usa θ<1, vicino a uno.':'θ²≤θ<1: punti migliori arbitrariamente vicini confutano il minimo locale.'}</FormulaContext>
    </>}/>;
}

function Stationarity({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),choice=useChoice(definition),z=state.numbers[0];
  const d=useMemo(()=>convexStationarity(choice.value,z),[choice.value,z]);
  const traces=useMemo(()=>[line(d.value,-1.5,1.5,'Costo'),
    line(x=>d.cost+d.gradient*(x-z),-1.5,1.5,'Tangente',colors.tangent,'dash'),
    ...(choice.value===2?[{type:'scatter',mode:'lines',name:'Tutti i punti minimi',x:[-1.5,1.5],y:[0,0],line:{color:colors.minimum,width:6}}]:[point(0,0,'Minimo globale unico',colors.minimum)]),
    point(z,d.cost,'Candidato')],[d,z,choice.value]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt22-iff" warnings/>}
    legend="Esempio aggiunto · blu: costo · viola: tangente · verde: minimi · arancio: candidato."
    visual={<SceneViewport id="optimization-opt22-stationary" traces={traces} layout={curveLayout([-1.5,1.5],[-1,2])} label="Gradiente nullo e minimo globale" height={320} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Cambia il candidato, non il costo']}
      extra={<Choice label="Costo" options={stationaryNames} state={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId={'opt22-case-'+choice.value}/>
      <LiveMetrics items={[{id:'opt22-gradient',label:'Gradiente',value:fmt(d.gradient)},{id:'opt22-hessian',label:'Derivata seconda',value:fmt(d.hessian)},{id:'opt22-minimum',label:'Candidato minimo?',value:d.stationary?'sì, globale':'no'}]}/>
      <FormulaContext definition={definition} formulaId="opt22-support">{choice.value===1?'Minimo unico con Hessiana nulla: la curvatura positiva non è necessaria.':choice.value===2?'Costo costante: ogni punto è minimo; il gradiente nullo non dà unicità.':'Se il gradiente è nullo, il supporto costante certifica il minimo.'}</FormulaContext>
    </>}/>;
}

type Quadratic=ReturnType<typeof quadraticModel>;
/** Same grid, points, solution set and fixed axes in 2D and 3D for all three QP pages. */
function QuadraticGraphics({definition,d,showSolutions}:{definition:CompanionDefinition;d:Quadratic;showSolutions:boolean}){
  const id='optimization-opt'+definition.source_page+'-quadratic';
  const grid=useMemo(()=>functionGrid(id,d.value,-2.25,2.25,'ℓ(z)',61),[id,d]);
  const data=useMemo(()=>{
    const level={type:'contour',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',zmin:-5,zmax:12,autocontour:false,
      contours:{start:-5,end:12,size:1,coloring:'heatmap',showlabels:true,labelfont:{size:22,color:'white'}},
      colorbar:{title:{text:'ℓ(z)'},thickness:12},hovertemplate:'z₁=%{x:.3f}<br>z₂=%{y:.3f}<br>ℓ=%{z:.4f}<extra>Costo</extra>'};
    const surface={type:'surface',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',cmin:-5,cmax:12,
      colorbar:{title:{text:'ℓ(z)'},thickness:12},hovertemplate:'z₁=%{x:.3f}<br>z₂=%{y:.3f}<br>ℓ=%{z:.4f}<extra>Costo</extra>'};
    const probe2={...point(...d.probe,'Sonda'),text:['Sonda'],mode:'markers+text',textposition:'top left',textfont:{size:22,color:colors.probe}};
    const probe3={type:'scatter3d',mode:'markers',name:'Sonda',x:[d.probe[0]],y:[d.probe[1]],z:[d.cost],marker:{size:6,color:colors.probe,line:{color:'white',width:1}},
      hovertemplate:'Sonda<br>%{x:.3f}, %{y:.3f}<br>ℓ=%{z:.4f}<extra></extra>'};
    const two:PlotTrace[]=[level],three:PlotTrace[]=[surface];
    if(showSolutions&&d.minimizer){
      if(d.pd){
        two.push({...point(...d.minimizer,'Minimo globale',colors.minimum),marker:{size:18,symbol:'diamond',color:colors.minimum,line:{color:'white',width:2}}});
        three.push({type:'scatter3d',mode:'markers',name:'Minimo globale',x:[d.minimizer[0]],y:[d.minimizer[1]],z:[d.minimum],marker:{color:colors.minimum,size:8,symbol:'diamond'},hovertemplate:'Minimo globale<br>%{x:.3f}, %{y:.3f}<br>ℓ=%{z:.4f}<extra></extra>'});
      }else{
        two.push({type:'scatter',mode:'lines',x:[.5,.5],y:[-2.25,2.25],line:{color:'white',width:10},hoverinfo:'skip'},
          {type:'scatter',mode:'lines',name:'Retta dei minimi',x:[.5,.5],y:[-2.25,2.25],line:{color:colors.minimum,width:6},hovertemplate:'z₁=0.5, ogni z₂<br>ℓ=−0.25<extra>Retta dei minimi</extra>'});
        three.push({type:'scatter3d',mode:'lines',name:'Retta dei minimi',x:[.5,.5],y:[-2.25,2.25],z:[-.25,-.25],line:{color:colors.minimum,width:8},hovertemplate:'z₁=0.5, ogni z₂<br>ℓ=−0.25<extra>Retta dei minimi</extra>'});
      }
    }else if(showSolutions&&d.stationary){
      two.push({...point(...d.stationary,'Stazionario: sella',colors.tangent),marker:{size:22,symbol:'diamond',color:colors.tangent,line:{color:'white',width:2}}});
      three.push({type:'scatter3d',mode:'markers',name:'Sella',x:[d.stationary[0]],y:[d.stationary[1]],z:[d.value(...d.stationary)],marker:{color:colors.tangent,size:8}});
    }
    two.push(probe2);three.push(probe3);
    return {two,three};
  },[grid,d,showSolutions]);
  const axes={xaxis:{title:{text:'z₁ [1]'},range:[-2.25,2.25],constrain:'domain'},
    yaxis:{title:{text:'z₂ [1]'},range:[-2.25,2.25],scaleanchor:'x',constrain:'domain'},margin:{l:75,r:85,t:12,b:58}};
  const scene={xaxis:{title:{text:'z₁'},range:[-2.25,2.25]},yaxis:{title:{text:'z₂'},range:[-2.25,2.25]},zaxis:{title:{text:'ℓ(z)'},range:[-6,12]},aspectmode:'cube'};
  return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode}
    twoDView={<SceneViewport id={id+'-2d'} traces={data.two} layout={axes} label="Livelli della quadratica" height={335} fontSize={22}/>}
    threeDView={<SceneViewport id={id+'-3d'} traces={data.three} layout={{scene}} is3D camera={definition.visualization.presentation.camera}
      axisLegend={['z₁ [1]','z₂ [1]','ℓ(z) [valore]']} label="Superficie della quadratica" height={335} fontSize={22}/>}/>;
}

function QuadraticLesson({definition}:CompanionRendererProps){
  const n=definition.source_page,prefix='opt'+n,state=useLessonParameters(definition),choice=useChoice(definition);
  const d=useMemo(()=>n===23?quadraticModel(state.numbers[0],state.numbers[1]):n===24?quadraticCase(choice.value,state.numbers[0]):
    quadraticModel([2,.5,0][choice.value],state.numbers[0]),[n,state.numbers,choice.value]);
  const primary=n===23?'opt23-problem':n===24?'opt24-joint':'opt25-unique';
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={primary} warnings={n===25}/>}
    legend={n===23?'Esempio aggiunto · colore / altezza: stesso costo · sonda arancio fissa (0.5,0.5).':
      n===24?'Esempio aggiunto · verde: minimo o retta dei minimi · viola: sella · arancio: sonda.':
        'Esempio aggiunto · verde: minimo o retta dei minimi · arancio: sonda.'}
    visual={<QuadraticGraphics definition={definition} d={d} showSolutions={n!==23}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
      hints={n===23?['Deforma il costo; q fisso','Inclina il costo; Q fissa']:n===24?['Sposta la sonda (0.5,t)']:['Muove il minimo o crea una deriva']}
      extra={n===23?undefined:<Choice label={n===24?'Scenario':'Curvatura di Q'} options={n===24?quadraticCases:positiveCases} state={choice}/>}/>}
    example={<>
      <LessonEquation definition={definition} formulaId={prefix+'-example'}
        latex={String.raw`Q=\begin{bmatrix}2&0\\0&${latexNumber(d.lambda)}\end{bmatrix},\quad q=\begin{bmatrix}-1\\${latexNumber(d.b)}\end{bmatrix}`}/>
      <LiveMetrics items={n===23?[
        {id:prefix+'-curvature',label:'Autovalori di Q',value:'2; '+fmt(d.lambda)},
        {id:prefix+'-cost',label:'Costo alla sonda',value:fmt(d.cost)},
        {id:prefix+'-convex',label:'Costo convesso?',value:d.psd?'sì':'no'},
      ]:n===24?[
        {id:prefix+'-residual',label:'Norma di Qz+q',value:fmt(d.residual)},
        {id:prefix+'-psd',label:'Q≥0?',value:d.psd?'sì':'no'},
        {id:prefix+'-candidate',label:'Sonda minimo?',value:d.psd&&d.residual===0?'sì, globale':'no'},
      ]:[
        {id:prefix+'-inverse',label:'Inversa utilizzabile?',value:d.pd?'sì':'no: Q singolare'},
        {id:prefix+'-solution',label:d.pd?'Minimo z⋆':'Insieme dei minimi',value:d.minimizer?(d.pd?'(0.5, '+numberText(d.minimizer[1],3)+')':'(0.5, t), t∈R'):'nessuno'},
        {id:prefix+'-minimum',label:'Valore minimo',value:d.minimum===null?'non esiste':fmt(d.minimum)},
      ]}/>
      {n===23?<p className="lesson-caption" data-testid="opt23-verdict">{d.lambda<0?'Curvatura negativa: una direzione fa scendere il costo senza limite.':d.lambda===0?'Curvatura nulla: il termine b decide fra valle piatta e deriva lineare.':'Due curvature positive: il costo forma una valle convessa.'}</p>:
        <FormulaContext definition={definition} formulaId={n===24?'opt24-first':'opt25-complete'}>
          <span data-testid={prefix+'-verdict'}>{d.pd?'Minimo globale unico. Q>0 garantisce esistenza e invertibilità.':
            d.minimizer?'Q singolare ma compatibile: tutti i punti della retta z₁=0.5 sono minimi.':
              d.psd?'Nessun minimo: b≠0 nella direzione piatta dà una deriva verso −∞.':
                'Gradiente nullo alla sella, ma Q non è semidefinita positiva: nessun minimo.'}</span>
        </FormulaContext>}
    </>}/>;
}

export function MinimizationLesson(props:CompanionRendererProps){
  switch(props.definition.source_page){
    case 19:case 20:return <SupportLesson {...props}/>;
    case 21:return <LocalGlobal {...props}/>;
    case 22:return <Stationarity {...props}/>;
    case 23:case 24:case 25:return <QuadraticLesson {...props}/>;
    default:throw new Error('Companion C non disponibile');
  }
}
