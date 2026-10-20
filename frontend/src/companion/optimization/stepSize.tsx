import {useEffect,useMemo,useState} from 'react';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {useLessonChoice,LessonChoice} from '../useLessonChoice';
import {IterationControls} from '../IterationControls';
import {ParameterControl} from '../../components/ParameterControl';
import {InlineMath} from '../../components/CompanionPage';
import {SceneViewport} from '../../visualization';
import {usePlayback} from '../../simulations/usePlayback';
import {quadraticCost} from '../../math/descentMethods';
import {armijoTrials,powerSteps,armijoIterations,scalarIterations,alternatingSequence,coercivityCase,qpIterations} from '../../math/stepSizeModels';
import {ArmijoScene,SequenceScene,QuadraticPathScene} from './stepSizeGraphics';
import {DescentScene,traceCurve,marker,descentColors as C} from './descentGraphics';
import '../../styles/optimization.css';
import '../../styles/stepSize.css';
const cls='optimization-lesson step-size-lesson';
const fmt=(v:number)=>!Number.isFinite(v)?'fuori scala numerica':v!==0&&(Math.abs(v)<.0001||Math.abs(v)>=10000)?v.toExponential(3):numberText(v,4);

function ArmijoLesson({definition}:CompanionRendererProps){
  const n=definition.source_page,key='opt'+n,state=useLessonParameters(definition),[beta,c]=state.numbers;
  const data=useMemo(()=>armijoTrials(beta,c),[beta,c]);
  const focus=()=>n===40?data.trials.length-1:Math.min(n-38,data.trials.length-1);
  const [selected,setSelected]=useState(focus);
  useEffect(()=>{setSelected(focus());},[beta,c]);
  const i=Math.min(selected,data.trials.length-1),t=data.trials[i];
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={key+'-accept'}/>}
    legend="Esempio aggiunto · blu: costo · rosso: soglia · viola: tangente · punti: tentativi i."
    visual={<ArmijoScene id={'optimization-'+key+'-armijo'} data={data} index={i}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();setSelected(n-38);}}}
      hints={['Riduce il passo a ogni rifiuto','Diminuzione lineare richiesta']}
      extra={<div className="iteration-picker"><ParameterControl label="Tentativo" displayLabel={<InlineMath latex="i"/>} value={i} onChange={setSelected}
        domain={{min:0,max:data.trials.length-1,step:1,integer:true}} unit="tent." description="i non è l’iterazione k"/>
        <div className="iteration-buttons"><button disabled={i===data.trials.length-1} onClick={()=>setSelected(i+1)}>Prossimo tentativo</button>
          <button onClick={()=>setSelected(0)}>Riparti</button></div></div>}/>}
    example={<><LessonEquation definition={definition} formulaId={key+'-profile'}/>
      <LiveMetrics items={[{id:key+'-gamma',label:'Candidato γ̄ⁱ',value:fmt(t.gamma)},{id:key+'-cost',label:'Costo reale',value:fmt(t.cost)},{id:key+'-threshold',label:'Soglia Armijo',value:fmt(t.threshold)}]}/>
      <FormulaContext definition={definition} formulaId={key+'-example'}><span data-testid={key+'-verdict'}>{
        t.accepted?'Accettato: costo sotto la soglia. Nuovo punto z = '+fmt(1-2*t.gamma)+'.':
          t.gap===0?'Pareggio: il while della fonte rifiuta anche l’uguaglianza.':'Rifiutato: costo non sotto la soglia; riduci ancora il passo.'}</span></FormulaContext>
    </>}/>;
}
function DiminishingSteps({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[alpha,count]=state.numbers,choice=useLessonChoice(definition,'series');
  const data=useMemo(()=>powerSteps(alpha,count),[alpha,count]);
  const labels=['γᵏ [passo]','Somma parziale Sₖ','Somma dei quadrati Tₖ'],values=[data.steps,data.sums,data.squares][choice.value];
  const traces=useMemo(()=>[{type:'scatter',mode:'lines+markers',x:values.map((_,k)=>k),y:values,name:labels[choice.value],
    line:{color:C.cost,width:3},marker:{size:5,color:C.cost},hovertemplate:'k=%{x}<br>%{y:.6f}<extra></extra>'}], [values,choice.value]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt41-conditions" primaryLatex="\gamma^k\to0,\qquad\sum_{k=0}^{\infty}\gamma^k=\infty" warnings/>}
    legend="Esempio aggiunto · campioni finiti · i verdetti sulle serie derivano dal criterio delle serie p."
    visual={<SequenceScene id="optimization-opt41-series" traces={traces} label="Passi decrescenti e somme parziali" yLabel={labels[choice.value]}
      yRange={choice.value===0?[0,1.1]:choice.value===1?[0,45]:[0,20]} maxK={99}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
      hints={['Cambia la famiglia di passi','Solo la finestra finita']}
      extra={<LessonChoice label="Quantità mostrata" options={['Passi','Somma parziale','Somma dei quadrati']} state={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt41-shift"/>
      <LiveMetrics items={[{id:'opt41-last',label:'Ultimo passo mostrato',value:fmt(data.steps.at(-1)!)},{id:'opt41-sum',label:'Serie Σγᵏ',value:data.sumDiverges?'diverge':'converge'},
        {id:'opt41-squares',label:'Serie Σ(γᵏ)²',value:data.squaresConverge?'converge':'diverge'}]}/>
      <FormulaContext definition={definition} formulaId="opt41-squares"><span data-testid="opt41-verdict">{
        alpha>.5&&alpha<=1?'Scelta tipica soddisfatta: 1/2 < α ≤ 1.':alpha>1?'Passi a zero, ma somma finita: persistenza assente.':'La somma dei passi diverge; quella dei quadrati diverge ancora.'}</span></FormulaContext>
    </>}/>;
}
function ArmijoConvergence({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),beta=state.numbers[0],data=useMemo(()=>armijoIterations(beta),[beta]);
  const playback=usePlayback(data.states.length,650),k=Math.min(playback.index,data.states.length-1);
  useEffect(()=>{playback.restart();},[beta]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt42-limit"/>}
    legend="Esempio aggiunto · blu: iterati · arancio: selezione · verde: minimo · k non è tempo."
    visual={<DescentScene definition={definition} value={quadraticCost} states={data.states} index={k}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();playback.restart();}}} hints={['Ricalcola da z⁰; c=0.5 fisso']}
      extra={<IterationControls playback={playback} count={data.states.length}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt42-example"/>
      <LiveMetrics items={[{id:'opt42-cost',label:'Costo corrente',value:fmt(data.costs[k])},{id:'opt42-norm',label:'Norma del gradiente',value:fmt(data.gradients[k])},
        {id:'opt42-step',label:'Passo che ha portato qui',value:k===0?'—':fmt(data.steps[k-1])}]}/>
      <FormulaContext definition={definition} formulaId="opt42-bounds"><span data-testid="opt42-verdict">{
        data.stopped&&k===data.states.length-1?'Arresto numerico: gradiente sotto 10⁻¹⁰.':'Qui Dᵏ=I verifica d₁=d₂=1. Il percorso finito illustra il risultato.'}</span></FormulaContext>
    </>}/>;
}
function ConstantConvergence({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[gamma,alpha]=state.numbers;
  const kind=useLessonChoice(definition,'cost'),rule=useLessonChoice(definition,'step');
  const data=useMemo(()=>scalarIterations(kind.value===1,rule.value===1,gamma,alpha),[kind.value,rule.value,gamma,alpha]);
  const playback=usePlayback(data.states.length,650),k=Math.min(playback.index,data.states.length-1);
  useEffect(()=>{playback.restart();},[kind.value,rule.value,gamma,alpha]);
  const active={...definition,controls:[definition.controls[rule.value===0?0:1]]},linear=kind.value===1;
  const traces=useMemo(()=>[
    ...(!linear?[{type:'scatter',mode:'lines',x:[0,20],y:[0,0],name:'Minimo noto',line:{color:C.minimum,width:2,dash:'dot'}}]:[]),
    {type:'scatter',mode:'lines+markers',x:data.states.slice(0,k+1).map((_,i)=>i),y:data.states.slice(0,k+1),name:'Decisione zᵏ',line:{color:C.cost,width:3},marker:{size:7,color:C.cost}},
    marker(k,data.states[k],'Campione corrente',C.current,14)], [data,k,linear]);
  const out=!linear&&Math.abs(data.states[k])>3;
  return <LessonFrame definition={definition} className={cls+' step-size-four-controls'} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt43-limit"/>}
    legend={linear?'Esempio aggiunto · ℓ(z)=z, gradiente 1 · nessun minimo su R.':'Esempio aggiunto · ℓ(z)=z²/2, L=1 · verde: minimo noto.'}
    visual={<SequenceScene id="optimization-opt43-sequence" traces={traces} label="Iterati con passo costante o decrescente" maxK={20}
      yLabel="zᵏ [decisione]" yRange={linear?[-45,2]:[-3,3]} annotation={out?'Iterato fuori dal ritaglio':undefined}/>}
    controls={<LessonControls definition={active} state={{...state,reset:()=>{state.reset();kind.reset();rule.reset();playback.restart();}}}
      hints={[rule.value===0?(linear?'Lineare: ogni γ>0':'Quadratico: discesa con 0<γ<2'):'γᵏ=1/(k+1)ᵅ']}
      extra={<><LessonChoice label="Costo" options={['Quadratico','Lineare']} state={kind}/><LessonChoice label="Regola del passo" options={['Costante','Decrescente']} state={rule}/>
        <IterationControls playback={playback} count={data.states.length}/></>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt43-example"/>
      <LiveMetrics items={[{id:'opt43-z',label:'Decisione corrente',value:fmt(data.states[k])},{id:'opt43-norm',label:'Norma del gradiente',value:fmt(data.gradients[k])},
        {id:'opt43-cost',label:'Costo corrente',value:fmt(data.costs[k])}]}/>
      <FormulaContext definition={definition} formulaId="opt43-regimes"><span data-testid="opt43-verdict">{linear?'Ipotesi valide, ma zᵏ→−∞: nessun punto limite finito.':
        rule.value===0&&gamma>=2?'γ≥2: fuori dalla garanzia di discesa di questa quadratica.':'Per questo costo i passi scelti portano al minimo zero.'}</span></FormulaContext>
    </>}/>;
}
function Subsequences({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),count=state.numbers[0],choice=useLessonChoice(definition,'subsequence');
  const data=useMemo(()=>alternatingSequence(count),[count]),traces=useMemo(()=>[0,1].filter(parity=>choice.value===0||parity===choice.value-1).map(parity=>{
    const selected=data.filter(p=>p.k%2===parity);
    return {type:'scatter',mode:'markers',x:selected.map(p=>p.k),y:selected.map(p=>p.z),name:parity===0?'Pari: +1':'Dispari: −1',
      marker:{size:13,color:parity===0?C.gradient:C.cost,symbol:parity===0?'square':'circle'},hovertemplate:'k=%{x}<br>valore=%{y}<extra></extra>'};
  }),[data,choice.value]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt44-subsequence" warnings/>}
    legend="Sequenza illustrativa della fonte · rosso: pari · blu: dispari · non è un gradient method."
    visual={<SequenceScene id="optimization-opt44-subsequence" traces={traces} maxK={40} yRange={[-1.5,1.5]} yLabel="Valore (−1)ᵏ" label="Sequenza alternante e sottosuccessioni"/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Estende la finestra finita']}
      extra={<LessonChoice label="Campioni mostrati" options={['Tutti','Pari','Dispari']} state={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt44-example"/>
      <LiveMetrics items={[{id:'opt44-full',label:'Sequenza completa',value:'non converge'},{id:'opt44-even',label:'Limite dei pari',value:'+1'},
        {id:'opt44-odd',label:'Limite dei dispari',value:'−1'}]}/>
      <FormulaContext definition={definition} formulaId="opt44-coercive"><span data-testid="opt44-verdict">Coercività e continuità rendono compatti i sottolivelli.</span></FormulaContext>
    </>}/>;
}
function ConvexLimits({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),a=state.numbers[0],choice=useLessonChoice(definition,'cost'),kind=choice.value;
  const d=useMemo(()=>coercivityCase(kind,a),[kind,a]);
  const traces=useMemo(()=>[traceCurve(d.value,-1.8,1.8,'Costo'),
    ...d.minima.map(z=>({...marker(z,d.value(z),'Minimo globale',C.minimum,18),marker:{size:18,color:C.minimum,symbol:'star',line:{color:'white',width:2}}})),
    ...(kind===1?[{...marker(0,d.value(0),'Massimo locale',C.gradient,14),marker:{size:14,color:C.gradient,symbol:'diamond'}}]:[]),
    marker(a,d.cost,'Punto esaminato',C.current,13)], [d,kind,a]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt45-convex" warnings/>}
    legend="Esempi aggiunti · arancio: punto esaminato · verde: minimi globali · rosso: massimo locale."
    visual={<SceneViewport id="optimization-opt45-coercivity" traces={traces} height={335} fontSize={22} label="Convessità, coercività e punti stazionari"
      layout={{xaxis:{title:{text:'z [1]'},range:[-1.8,1.8]},yaxis:{title:{text:'ℓ(z) [costo]'},range:d.yRange}}}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Valuta il punto, senza iterazioni']}
      extra={<LessonChoice label="Costo" options={['Quadratico','Doppia valle','Esponenziale']} state={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt45-example"
      latex={['\\ell(z)=z^2/2','\\ell(z)=(z^2-1)^2/4','\\ell(z)=e^{-z}'][kind]}/>
      <LiveMetrics items={[{id:'opt45-coercive',label:'Coerciva',value:d.coercive?'sì':'no'},{id:'opt45-convex',label:'Convessa',value:d.convex?'sì':'no'},
        {id:'opt45-gradient',label:'Gradiente in a',value:fmt(d.derivative)}]}/>
      <FormulaContext definition={definition} formulaId="opt45-subsequence"><span data-testid="opt45-verdict">{
        kind===2?'Infimo zero non raggiunto: nessun minimo né stazionario finito.':d.atMaximum?'Gradiente zero, ma massimo locale: la convessità manca.':
          d.stationary?'Punto stazionario che qui è anche minimo globale.':'Il punto non è stazionario; i minimi verdi sono noti analiticamente.'}</span></FormulaContext>
    </>}/>;
}
function QuadraticIterations({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[lambda,b,gamma]=state.numbers;
  const data=useMemo(()=>qpIterations(lambda,b,gamma),[lambda,b,gamma]),playback=usePlayback(data.states.length,650);
  const k=Math.min(playback.index,data.states.length-1),current=data.states[k];
  useEffect(()=>{playback.restart();},[lambda,b,gamma]);
  return <LessonFrame definition={definition} className={cls+' step-size-four-controls'} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt46-update"/>}
    legend="Esempio aggiunto · blu: iterati · arancio: corrente · verde: minimi · k non è tempo."
    visual={<QuadraticPathScene definition={definition} data={data} index={k}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();playback.restart();}}}
      hints={['Curvatura λ≥0','Componente q₂=b','Cambia il percorso']}
      extra={<IterationControls playback={playback} count={data.states.length}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt46-example"/>
      <LiveMetrics items={[{id:'opt46-point',label:'Decisione corrente',value:'('+fmt(current[0])+', '+fmt(current[1])+')'},
        {id:'opt46-cost',label:'Costo corrente',value:fmt(data.costs[k])},{id:'opt46-norm',label:'Norma del gradiente',value:fmt(data.gradients[k])}]}/>
      <FormulaContext definition={definition} formulaId="opt46-qp"><span data-testid="opt46-verdict">{
        data.kind==='none'?'λ=0, b≠0: costo illimitato inferiormente, nessun minimo.':data.kind==='line'?'λ=b=0: retta di minimi z₁=0; z₂ resta al valore iniziale.':
          !data.minimizerFinite?'Minimo unico, ma fuori scala numerica: nessuna coordinata inventata.':
            !data.stable?'Passo al bordo o oltre 2/max(1,λ): nessuna convergenza garantita.':
              'Minimo (0, '+fmt(data.minimizer![1])+'); passo entro la soglia spettrale.'}</span></FormulaContext>
    </>}/>;
}
export function StepSizeLesson(props:CompanionRendererProps){
  const n=props.definition.source_page;
  if(n>=38&&n<=40)return <ArmijoLesson {...props}/>;
  switch(n){
    case 41:return <DiminishingSteps {...props}/>;
    case 42:return <ArmijoConvergence {...props}/>;
    case 43:return <ConstantConvergence {...props}/>;
    case 44:return <Subsequences {...props}/>;
    case 45:return <ConvexLimits {...props}/>;
    case 46:return <QuadraticIterations {...props}/>;
    default:throw new Error('Companion F non disponibile');
  }
}
