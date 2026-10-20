import {useEffect,useMemo,useState} from 'react';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {IterationControls} from '../IterationControls';
import {ParameterControl} from '../../components/ParameterControl';
import {InlineMath} from '../../components/CompanionPage';
import {usePlayback} from '../../simulations/usePlayback';
import {kktResidual,sqpCost} from '../../math/sqpModels';
import {meritValue,meritMinima,fixedMeritLine,meritBacktracking,globalizedSqp,equalityBarrier,notationCost,notationEstimate,controlNotation} from '../../math/meritModels';
import {MeritScene,MeritSearchScene,EqualityBarrierScene,NotationScene,ControlNotationScene} from './meritGraphics';
import '../../styles/optimization.css';
import '../../styles/merit.css';
const cls='optimization-lesson merit-lesson';
const fmt=(v:number)=>!Number.isFinite(v)?'fuori scala numerica':v!==0&&(Math.abs(v)<.0001||Math.abs(v)>=10000)?v.toExponential(3):numberText(v,4);
const residual=(v:number)=>v!==0&&Math.abs(v)<1e-12?'≈0':fmt(v);
const model=<p className="lesson-caption">ℓ=(z₁²+(z₂−1)²)/2, h=z₂−z₁².</p>;
function MeritLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[s,x,y]=state.numbers,minima=meritMinima(s),h=y-x*x;
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt75-merit" warnings/>}
  legend="Altezza M₁ · verde h=0 · viola minimi di M₁ · arancio punto di prova."
  visual={<MeritScene definition={definition} id="optimization-opt75-merit" s={s} current={[x,y]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Cambia il compromesso','Muove il punto','Modifica la violazione']}
   extra={<div className="merit-presets"><button onClick={()=>state.update('opt75-s',.5)}>Soglia s=1/2</button></div>}/>}
  example={<>{model}<LiveMetrics items={[{id:'opt75-cost',label:'Costo ℓ',value:fmt(sqpCost(x,y))},{id:'opt75-penalty',label:'Penalità s|h|',value:fmt(s*Math.abs(h))},
   {id:'opt75-merit',label:'Merit function M₁',value:fmt(meritValue([x,y],s))}]}/>
   <FormulaContext definition={definition} formulaId="opt75-minima"><span data-testid="opt75-status">{minima.family?'Alla soglia: minimi multipli, anche non ammissibili.':s<.5?'Minimo di M₁ non ammissibile: (0, '+fmt(1-s)+').':'I due minimi di M₁ sono i minimi vincolati noti.'}</span></FormulaContext></>}/>;
}
function SearchLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[s,beta,c]=state.numbers;
 const line=useMemo(()=>fixedMeritLine(s),[s]),search=useMemo(()=>meritBacktracking(line,beta,c),[line,beta,c]);
 const [selected,setSelected]=useState(0),i=Math.min(selected,search.trials.length-1),trial=search.trials[i];
 useEffect(()=>{setSelected(0);},[s,beta,c]);
 return <LessonFrame definition={definition} className={cls+' merit-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt76-accept"/>}
  legend="Blu M₁ reale · tratteggio rosso soglia · arancio tentativo selezionato."
  visual={<MeritSearchScene id="optimization-opt76-search" line={line} search={search} index={i} c={c}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();setSelected(0);}}} hints={['Cambia M₁','Riduce i candidati','Cambia la soglia']}
   extra={<><div className="merit-attempt"><ParameterControl label="Tentativo" displayLabel={<InlineMath latex="i"/>} unit="tent." domain={{min:0,max:search.trials.length-1,step:1,integer:true}}
    value={i} onChange={setSelected} description="i non è k"/><div className="merit-buttons"><button disabled={i===search.trials.length-1} onClick={()=>setSelected(i+1)}>Prossimo</button><button onClick={()=>setSelected(0)}>Riparti</button></div></div>
    <div className="merit-presets"><button onClick={()=>{state.update('opt76-s',.95);state.update('opt76-c',.25);setSelected(0);}}>Pareggio Armijo</button></div></>}/>}
  example={<><p className="lesson-caption">z=(1,1), λ=.2, d=(−5/23,−10/23), γ̄⁰=1.</p>
   <LiveMetrics items={[{id:'opt76-gamma',label:'Candidato γ̄ⁱ',value:fmt(trial.gamma)},{id:'opt76-gap',label:'M₁ meno soglia',value:fmt(trial.gap)},
    {id:'opt76-violation',label:'Violazione reale |h|',value:fmt(line.violation(trial.gamma))}]}/>
   <FormulaContext definition={definition} formulaId="opt76-gap"><span data-testid="opt76-status">{trial.accepted?'Accettato: M₁ sotto la soglia.':trial.gap===0?'Pareggio rifiutato: la fonte usa ≥ nel while.':'Rifiutato: riduci ancora il passo.'}</span></FormulaContext></>}/>;
}
function GlobalSqpLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[x,y,floor]=state.numbers,data=useMemo(()=>globalizedSqp({z:[x,y],lambda:.2},floor),[x,y,floor]);
 const playback=usePlayback(data.states.length,750),k=Math.min(playback.index,data.states.length-1),p=data.states[k],r=kktResidual(p),step=data.steps[k];
 useEffect(()=>{playback.restart();},[x,y,floor]);
 const finished=k===data.states.length-1,costIncreased=k>0&&sqpCost(...p.z)>sqpCost(...data.states[k-1].z);
 const status=finished?(r.norm<=1e-10?(Math.abs(p.z[0])<1e-7?'Residuo entro tolleranza; radice presso il massimo locale.':'Residuo entro tolleranza; vicino a un minimo noto.'):data.status):
  costIncreased?'M₁ diminuita; il costo è aumentato nell’ultimo passo.':'Iterazione '+k+': peso fisso nella singola ricerca.';
 return <LessonFrame definition={definition} className={cls+' merit-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt77-update"/>}
  legend="M₁ con sᵏ corrente · verde h=0 · blu iterati · arancio campione k."
  visual={<MeritScene definition={definition} id="optimization-opt77-global-sqp" s={data.weights[k]} current={p.z} history={data.states} selected={k}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();playback.restart();}}} hints={['Riparte da k=0','Cambia fattibilità','Modifica sᵏ']}
   extra={data.states.length>1?<IterationControls playback={playback} count={data.states.length}/>:<div className="merit-no-step">k=0 · nessun passo disponibile</div>}/>}
  example={<>{model}<LiveMetrics items={[{id:'opt77-gamma',label:'Passo uscente γᵏ',value:step?.search.gamma!=null?fmt(step.search.gamma):'—'},
   {id:'opt77-weight',label:'Peso corrente sᵏ',value:fmt(data.weights[k])},{id:'opt77-next-lambda',label:'Nuovo λᵏ⁺¹',value:data.states[k+1]?fmt(data.states[k+1].lambda):'—'}]}/>
   <p className="lesson-caption">k={k} · λᵏ={fmt(p.lambda)} · h={residual(r.h)} · ‖r‖={residual(r.norm)}.</p>
   <FormulaContext definition={definition} formulaId="opt77-penalty"><span data-testid="opt77-status">{status}</span></FormulaContext></>}/>;
}
function BarrierLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[epsilon,x,y]=state.numbers,b=equalityBarrier(epsilon,[x,y]);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt78-barrier" warnings/>}
  legend="Verde h=0 · viola minimo interno · blu Fε su h=0 · grigio costo originale."
  visual={<EqualityBarrierScene definition={definition} id="optimization-opt78-barrier-equality" epsilon={epsilon} probe={[x,y]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Muove il minimo interno','Zero è fuori dominio','Può violare h=0']}
   extra={<div className="merit-presets"><button disabled={epsilon<=.01} onClick={()=>state.update('opt78-epsilon',Math.max(.01,epsilon/2))}>Dimezza ε</button></div>}/>}
  example={<><p className="lesson-caption">ℓ=((z₁+1)²+(z₂−.6)²)/2, g=−z₁, h=z₂−.6.</p>
   <LiveMetrics items={[{id:'opt78-g',label:'Disuguaglianza g',value:fmt(b.g)},{id:'opt78-h',label:'Uguaglianza h',value:fmt(b.h)},{id:'opt78-cost',label:'Costo trasformato Fε',value:b.probeCost===null?'fuori dominio':fmt(b.probeCost)}]}/>
   <FormulaContext definition={definition} formulaId="opt78-minimum"><span data-testid="opt78-status">Minimo interno: ({fmt(b.minimum[0])}, .6). {x===0?'Punto di prova fuori dominio.':Math.abs(b.h)>1e-12?'Il punto di prova viola h=0.':'Il punto di prova rispetta h=0.'}</span></FormulaContext></>}/>;
}
function NotationOpening({definition}:CompanionRendererProps){
 return <LessonFrame definition={definition} className={cls} visual={<><div className="opt-section-cards">{[
  ['01','La decisione','Una variabile descrive ciò che si può scegliere.'],['02','L’iterazione dell’algoritmo','Una stima viene aggiornata: il suo indice conta gli aggiornamenti.'],
  ['03','Il tempo del sistema','Nel controllo ottimo una sola stima contiene stati e ingressi a tempi diversi.']
 ].map(([n,title,text])=><section key={n}><span className="opt-step-number">{n}</span><h2>{title}</h2><p>{text}</p></section>)}</div>
  <p className="lesson-caption">Mappa aggiunta al titolo; le due pagine successive fissano la notazione.</p></>}/>;
}
function EstimateLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[k,z]=state.numbers,estimate=notationEstimate(k);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt80-notation"/>}
  legend="Esempio scalare aggiunto · arancio decisione di prova · viola stima selezionata."
  visual={<NotationScene id="optimization-opt80-estimate" k={k} probe={z}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Seleziona una stima','Non cambia la sequenza']}/>}
  example={<><p className="lesson-caption">ℓ(z)=(z−1)²/2; gradiente a passo 1/2 da z⁰=−2.</p>
   <LiveMetrics items={[{id:'opt80-probe',label:'Decisione generica z',value:fmt(z)},{id:'opt80-estimate',label:'Stima zᵏ',value:fmt(estimate)},{id:'opt80-cost',label:'Costo della stima',value:fmt(notationCost(estimate))}]}/>
   <FormulaContext definition={definition} formulaId="opt80-sequence"><span data-testid="opt80-status">{k===0?'k=0 seleziona la stima iniziale z⁰=−2.':'k='+k+' seleziona una stima dell’algoritmo.'} Qui non compare tempo fisico.</span></FormulaContext></>}/>;
}
function ControlIndexLesson({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[k,t]=state.numbers,iterate=controlNotation(k),cell=iterate.component(t);
 const vector=(v:readonly number[])=>'('+v.map(x=>numberText(x,2)).join(', ')+')';
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt81-index"/>}
  legend="Esempio aggiunto · righe k, colonne t · arancio componente · a destra il tempo."
  visual={<ControlNotationScene id="optimization-opt81-control-indices" k={k} t={t}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Cambia tutta la traiettoria','Sceglie una componente']}/>}
  example={<><p className="lesson-caption">Integratore xₜ₊₁=xₜ+uₜ, x₀=2, T=3. Algoritmo aggiunto: gradiente sugli ingressi, passo .2.</p>
   <p className="lesson-caption">xᵏ={vector(iterate.x)}; uᵏ={vector(iterate.u)}.</p>
   <LiveMetrics items={[{id:'opt81-state',label:'Stato xₜᵏ',value:fmt(cell.x)},{id:'opt81-input',label:'Ingresso uₜᵏ',value:cell.u===null?'non presente':fmt(cell.u)},
    {id:'opt81-residual',label:'Residuo della dinamica',value:cell.residual===null?'fine orizzonte':residual(cell.residual)}]}/>
   <FormulaContext definition={definition} formulaId="opt81-iterates"><span data-testid="opt81-status">{t===3?'t=T: stato terminale definito; nessun ingresso u₃.':'Stima k='+k+', componente al tempo t='+t+'.'} k non è il tempo del sistema.</span></FormulaContext></>}/>;
}
export function MeritLessonPage(props:CompanionRendererProps){
 switch(props.definition.source_page){
  case 75:return <MeritLesson {...props}/>;case 76:return <SearchLesson {...props}/>;case 77:return <GlobalSqpLesson {...props}/>;
  case 78:return <BarrierLesson {...props}/>;case 79:return <NotationOpening {...props}/>;case 80:return <EstimateLesson {...props}/>;case 81:return <ControlIndexLesson {...props}/>;
  default:throw new Error('Companion K non disponibile');
 }
}
