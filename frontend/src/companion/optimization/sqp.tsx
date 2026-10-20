import {useEffect,useMemo} from 'react';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {IterationControls} from '../IterationControls';
import {usePlayback} from '../../simulations/usePlayback';
import {kktResidual,localNewton,nonlinearStepResidual,primalDualIterations} from '../../math/sqpModels';
import type {PrimalDual} from '../../math/sqpModels';
import type {Vec2} from '../../math/descentMethods';
import {PrimalDualScene} from './sqpGraphics';
import '../../styles/optimization.css';
import '../../styles/sqp.css';
const cls='optimization-lesson sqp-lesson';
const fmt=(v:number)=>!Number.isFinite(v)?'fuori scala numerica':v!==0&&(Math.abs(v)<.0001||Math.abs(v)>=10000)?v.toExponential(3):numberText(v,4);
const res=(v:number)=>v!==0&&Math.abs(v)<1e-12?'≈0':fmt(v);
const xy=(v:Vec2)=>'('+v.map(fmt).join(', ')+')';
const model=<p className="lesson-caption">ℓ=(z₁²+(z₂−1)²)/2, h=z₂−z₁².</p>;
const qpLabel=(status:string)=>status==='unique_minimum'?'minimo unico':status==='minimum_family'?'minimi multipli':'illimitato';
function Opening({definition}:CompanionRendererProps){
 return <LessonFrame definition={definition} className={cls} visual={<><div className="opt-section-cards">
  {[
   ['01','Misurare il residuo KKT','Stazionarietà e fattibilità formano un’unica equazione nelle decisioni e nei moltiplicatori.'],
   ['02','Costruire il passo Newton','Il sistema linearizzato determina incrementi di entrambe le variabili, quando è risolvibile.'],
   ['03','Riconoscere il QP locale','Il legame con un problema di minimo dipende dalla curvatura del modello e dalla sua solvibilità.']
  ].map(([n,title,text])=><section key={n}><span className="opt-step-number">{n}</span><h2>{title}</h2><p>{text}</p></section>)}
 </div><p className="lesson-caption">Mappa aggiunta al titolo. Le pagine seguenti sviluppano Newton e SQP.</p></>}/>;
}
function Presets({set,qp=false}:{set:(x:number,y:number,lambda:number)=>void;qp?:boolean}){
 return <div className="sqp-presets">{qp&&<button onClick={()=>set(0,0,1)}>QP illimitato</button>}
  <button onClick={()=>set(0,0,.5)}>D=0: famiglia</button><button onClick={()=>set(.5,.25,1)}>D=0: incompatibile</button></div>;
}
function ResidualLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[x,y,lambda]=state.numbers,p=useMemo<PrimalDual>(()=>({z:[x,y],lambda}),[x,y,lambda]),r=kktResidual(p);
 const set=(a:number,b:number,l:number)=>{state.update('opt70-x',a);state.update('opt70-y',b);state.update('opt70-lambda',l);};
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt70-residual"/>}
  legend="Esempio aggiunto · verde: h=0 · arancio: punto corrente · barre 2D: stazionarietà e fattibilità."
  visual={<PrimalDualScene definition={definition} id="optimization-opt70-residual" current={p} mode="residual"/>}
  controls={<LessonControls definition={definition} state={state} hints={['Muove il punto','Cambia h','Cambia r, non il costo']}
   extra={<div className="sqp-presets"><button onClick={()=>set(Math.SQRT1_2,.5,.5)}>Minimo KKT</button><button onClick={()=>set(0,0,1)}>Massimo KKT</button></div>}/>}
  example={<>{model}<LiveMetrics items={[{id:'opt70-stationarity',label:'Norma di ∇₁L',value:res(r.stationarity)},
   {id:'opt70-feasibility',label:'Residuo h',value:res(r.h)},{id:'opt70-total',label:'Norma del residuo r',value:res(r.norm)}]}/>
   <FormulaContext definition={definition} formulaId="opt70-roots"><span data-testid="opt70-verdict">{r.norm<=1e-10?
    Math.abs(x)<1e-7?'r=0, ma l’origine è un massimo locale sul vincolo.':'Residuo numericamente nullo presso un minimo noto dell’esempio.':
    r.h===0?'Punto ammissibile, ma non stazionario.':'Il residuo controlla anche la violazione del vincolo.'}</span></FormulaContext>
  </>}/>;
}
function IterativeLesson({definition,sqp=false}:CompanionRendererProps&{sqp?:boolean}){
 const n=sqp?74:71,state=useLessonParameters(definition),[x,y,lambda]=state.numbers;
 const data=useMemo(()=>primalDualIterations({z:[x,y],lambda},sqp?'sqp':'newton'),[x,y,lambda,sqp]);
 const playback=usePlayback(data.states.length,700),k=Math.min(playback.index,data.states.length-1),p=data.states[k];
 useEffect(()=>{playback.restart();},[x,y,lambda]);
 const r=kktResidual(p),step=localNewton(p),hasQpMultiplier=step.qpStatus!=='unbounded'&&step.lambdaQp!==null;
 const finished=k===data.states.length-1;
 const status=finished&&r.norm<=1e-10?(Math.abs(p.z[0])<1e-7?
  'Residuo entro tolleranza; radice presso il massimo locale.':'Residuo entro tolleranza; vicino a un minimo noto.'):
  finished?data.status:'Iterazione '+k+' della sequenza.';
 return <LessonFrame definition={definition} className={cls+' sqp-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId={'opt'+n+'-update'}/>}
  legend="Esempio aggiunto · verde: h=0 · blu: iterati · arancio: campione k · λ non è l’altezza."
  visual={<PrimalDualScene definition={definition} id={'optimization-opt'+n+'-iterations'} current={p} mode="iterations" history={data.states} selected={k}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();playback.restart();}}}
   hints={['Ricalcola da k=0','Riparte da k=0','Cambia anche B⁰']}
   extra={data.states.length>1?<IterationControls playback={playback} count={data.states.length}/>:<div className="sqp-no-iterations">k=0 · nessun passo disponibile</div>}/>}
  example={<>{model}{sqp?<>
   <LiveMetrics items={[{id:'opt74-current-lambda',label:'Moltiplicatore λᵏ',value:fmt(p.lambda)},
    {id:'opt74-qp-lambda',label:'Moltiplicatore QP Δλ_QPᵏ',value:hasQpMultiplier?fmt(step.lambdaQp!):step.qpStatus==='unbounded'?'assente':'non univoco'},
    {id:'opt74-newton-delta',label:'Incremento Δλ_Newtonᵏ',value:step.deltaLambda===null?'non univoco':fmt(step.deltaLambda)}]}/>
   <p className="lesson-caption">k={k} · costo {fmt(r.cost)} · h={res(r.h)} · ‖r‖={res(r.norm)}.</p>
  </>:<><LiveMetrics items={[{id:'opt71-stationarity',label:'Norma di ∇₁L',value:res(r.stationarity)},
    {id:'opt71-h',label:'Residuo h(zᵏ)',value:res(r.h)},{id:'opt71-total',label:'Norma del residuo rᵏ',value:res(r.norm)}]}/>
   <p className="lesson-caption">k={k} · λᵏ={fmt(p.lambda)} · costo {fmt(r.cost)}.</p></>}
   <FormulaContext definition={definition} formulaId={'opt'+n+(sqp?'-two-lambdas':'-newton')}><span data-testid={'opt'+n+'-status'}>{status}</span></FormulaContext>
  </>}/>;
}
function LocalModelLesson({definition,qp=false}:CompanionRendererProps&{qp?:boolean}){
 const n=qp?73:72,state=useLessonParameters(definition),[x,y,lambda]=state.numbers,p=useMemo<PrimalDual>(()=>({z:[x,y],lambda}),[x,y,lambda]);
 const step=useMemo(()=>localNewton(p),[p]),remainder=nonlinearStepResidual(step,1);
 const set=(a:number,b:number,l:number)=>{state.update('opt'+n+'-x',a);state.update('opt'+n+'-y',b);state.update('opt'+n+'-lambda',l);};
 const diagnosis=step.status==='unique'?'Δλ_Newton='+fmt(step.deltaLambda!)+', residuo del sistema='+res(step.systemResidual!)+'.':
  step.status==='singular_family'?'Sistema compatibile: infinite direzioni, nessun passo unico.':step.status==='inconsistent'?'Sistema incompatibile: nessuna direzione.':'Arresto per limite numerico.';
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId={qp?'opt73-qp':'opt72-system'} warnings={qp}/>}
  legend={qp?undefined:'Verde: h=0 · viola: passo Newton · a destra: h reale e lineare (tratteggio).'}
  visual={<PrimalDualScene definition={definition} id={'optimization-opt'+n+'-local'} current={p} mode={qp?'qp':'linearization'} step={step}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Cambia la linearizzazione','Cambia il residuo iniziale','Modifica B, non ℓ o h']}
   extra={<Presets set={set} qp={qp}/>}/>}
  example={<>{model}<LiveMetrics items={qp?[{id:'opt73-D',label:'Curvatura ridotta D',value:fmt(step.D)},
   {id:'opt73-qp',label:'Problema QP locale',value:qpLabel(step.qpStatus)},
   {id:'opt73-lambda',label:'λ del minimo QP',value:step.qpStatus!=='unbounded'&&step.lambdaQp!==null?fmt(step.lambdaQp):step.qpStatus==='unbounded'?'nessun minimo':'non univoco'}]:
   [{id:'opt72-delta',label:'Incremento Δz',value:step.delta?xy(step.delta):'non univoco / assente'},
    {id:'opt72-linear',label:'Vincolo linearizzato finale',value:step.linearResidual===null?'non definito':res(step.linearResidual)},
    {id:'opt72-real',label:'Vincolo reale dopo il passo',value:remainder?fmt(remainder.actual):'non definito'}]}/>
   <FormulaContext definition={definition} formulaId={'opt'+n+(qp?'-validity':'-reduction')}><span data-testid={'opt'+n+'-status'}>{diagnosis}</span></FormulaContext>
  </>}/>;
}
export function SqpLesson(props:CompanionRendererProps){
 switch(props.definition.source_page){
  case 69:return <Opening {...props}/>;
  case 70:return <ResidualLesson {...props}/>;
  case 71:return <IterativeLesson {...props}/>;
  case 72:return <LocalModelLesson {...props}/>;
  case 73:return <LocalModelLesson {...props} qp/>;
  case 74:return <IterativeLesson {...props} sqp/>;
  default:throw new Error('Companion J non disponibile');
 }
}
