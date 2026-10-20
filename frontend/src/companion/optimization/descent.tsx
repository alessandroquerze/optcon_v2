import {useEffect,useMemo,useState} from 'react';
import type {CompanionRendererProps} from '../registry';
import type {CompanionDefinition} from '../../data/manifest';
import {ParameterControl} from '../../components/ParameterControl';
import {InlineMath} from '../../components/CompanionPage';
import {LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {SceneViewport} from '../../visualization';
import {usePlayback} from '../../simulations/usePlayback';
import {quadraticCost,quadraticGradient,nonlinearCost,gradientIterations,rotatedDescent,scalarGradientStep,spdDirection,directionMethod,directionMethodNames,normalizedDirection,norm,addStep} from '../../math/descentMethods';
import type {Vec2} from '../../math/descentMethods';
import {DescentScene,ProfileScene,descentColors as C,traceCurve,marker} from './descentGraphics';
import '../../styles/optimization.css';
import '../../styles/descent.css';

const cls='optimization-lesson descent-lesson';
const fmt=(x:number)=>x!==0&&Math.abs(x)<.0001?x.toExponential(3):numberText(x,4);
const unit=(v:Vec2):Vec2=>norm(v)===0?[0,0]:[v[0]/norm(v),v[1]/norm(v)];
const memory=new Map<string,number>();
function useChoice(definition:CompanionDefinition){
  const [value,setValue]=useState(()=>memory.get(definition.page_id)??0);
  const update=(next:number)=>{memory.set(definition.page_id,next);setValue(next);};
  return {value,update,reset:()=>update(0)};
}
function Choice({label,options,state}:{label:string;options:readonly string[];state:ReturnType<typeof useChoice>}){
  return <label className="opt-choice"><span>{label}</span><select aria-label={label} value={state.value} onChange={e=>state.update(Number(e.target.value))}>
    {options.map((name,i)=><option key={name} value={i}>{name}</option>)}</select></label>;
}
function Section({definition}:CompanionRendererProps){
  return <LessonFrame definition={definition} className={cls}
    visual={<><div className="opt-section-cards">
      <section><span className="opt-step-number">01</span><h2>Direzione</h2><p>In quale verso il costo può diminuire vicino alla decisione corrente?</p></section>
      <section><span className="opt-step-number">02</span><h2>Passo</h2><p>Quanto muoversi lungo quella direzione? Un passo troppo grande può annullare il vantaggio.</p></section>
      <section><span className="opt-step-number">03</span><h2>Iterazione</h2><p>Valutare la nuova decisione e ripetere. Un aggiornamento favorevole non è ancora una prova di convergenza.</p></section>
    </div><p className="lesson-caption">Mappa aggiunta al titolo della sezione. Nelle prossime pagine, k indica l’iterazione dell’algoritmo.</p></>}/>;
}
function IterativeDescent({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),gamma=state.numbers[0];
  const data=useMemo(()=>gradientIterations(gamma),[gamma]),playback=usePlayback(data.states.length,650);
  useEffect(()=>{playback.restart();},[gamma]);
  const k=Math.min(playback.index,data.states.length-1);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt27-descent"/>}
    legend="Esempio aggiunto · blu: iterati · arancio: selezione · verde: minimo noto · k non è tempo."
    visual={<DescentScene definition={definition} value={quadraticCost} states={data.states} index={k}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();playback.restart();}}}
      hints={['Ricalcola dal medesimo z⁰; pausa a k=0']}
      extra={<div className="iteration-picker"><ParameterControl label="Iterazione" displayLabel={<InlineMath latex="k"/>} unit="iter."
        domain={{min:0,max:data.states.length-1,step:1,integer:true}} value={k} onChange={playback.seek}/>
        <div className="iteration-buttons"><button onClick={playback.toggle} aria-pressed={playback.playing}>{playback.playing?'Pausa':'Play'}</button>
          <button onClick={()=>playback.seek(k+1)} disabled={k===data.states.length-1}>Passo</button><button onClick={playback.restart}>Riparti</button></div></div>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt27-example"/>
      <LiveMetrics items={[{id:'opt27-k',label:'Iterazione',value:k},{id:'opt27-cost',label:'Costo corrente',value:fmt(data.costs[k])},
        {id:'opt27-drop',label:'Diminuzione precedente',value:k===0?'—':fmt(data.costs[k-1]-data.costs[k])}]}/>
      <p className="lesson-caption">Si parte da z⁰; k seleziona l’iterato, γ ricostruisce il percorso.</p></>}/>;
}
function TwoStep({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[angle,gamma]=state.numbers,d=useMemo(()=>rotatedDescent(angle),[angle]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt28-update"/>}
    legend="Esempio aggiunto · blu: costo lungo γ · viola: tangente · grigio: costo iniziale."
    visual={<ProfileScene id="optimization-opt28-profile" profile={d.profile} linear={g=>1+d.slope*g} initial={1} gamma={gamma} yRange={[-3.6,9.5]}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia la curva; punto iniziale fisso','Percorre la curva, senza cambiarla']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt28-example"/>
      <LiveMetrics items={[{id:'opt28-slope',label:'Pendenza iniziale',value:fmt(d.slope)},{id:'opt28-cost',label:'Costo nuovo',value:fmt(d.profile(gamma))},{id:'opt28-change',label:'Variazione di costo',value:fmt(d.change(gamma))}]}/>
      <FormulaContext definition={definition} formulaId="opt28-profile"><span data-testid="opt28-verdict">{gamma===0?'γ=0: nessun aggiornamento.':d.change(gamma)<0?'Questo passo riduce il costo.':d.slope<0?'Direzione favorevole, ma questo passo non riduce il costo.':'Pendenza iniziale nulla: questa direzione non dà discesa stretta.'}</span></FormulaContext>
    </>}/>;
}
function TaylorDescent({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[a,gamma]=state.numbers,d=useMemo(()=>scalarGradientStep(a,gamma),[a,gamma]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt29-update"/>}
    legend="Esempio aggiunto · blu: costo esatto · viola: solo primo ordine · grigio: costo iniziale."
    visual={<ProfileScene id="optimization-opt29-taylor" profile={d.profile} linear={d.tangent} initial={d.initial} gamma={gamma} upper={2.5} yRange={[-4.6,3]}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia gradiente e scala della curva','Muove il punto del passo scelto']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt29-example"/>
      <LiveMetrics items={[{id:'opt29-linear',label:'Contributo lineare',value:fmt(d.linearChange)},{id:'opt29-rest',label:'Resto esatto',value:fmt(d.remainder)},{id:'opt29-change',label:'Variazione esatta',value:fmt(d.change)}]}/>
      <FormulaContext definition={definition} formulaId="opt29-taylor"><span data-testid="opt29-verdict">{a===0?'Gradiente nullo: punto fermo, nessuna discesa stretta.':gamma===0?'Passo zero: nessun aggiornamento.':d.change<0?'Il contributo negativo prevale sul resto: il costo diminuisce.':d.change===0?'A γ=2 il resto cancella il contributo negativo: il costo pareggia.':'Il resto supera il contributo negativo: il costo aumenta.'}</span></FormulaContext>
    </>}/>;
}
function DescentDirections({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[angle,gamma]=state.numbers,d=useMemo(()=>rotatedDescent(angle),[angle]);
  const next=useMemo(()=>addStep(d.current,d.direction,gamma),[d,gamma]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt30-direction"/>}
    legend="Esempio aggiunto · g=∇ℓ(zᵏ) · rosso: g/‖g‖ · viola: d · passo: γd."
    visual={<DescentScene definition={definition} value={quadraticCost} states={[d.current,next]} index={1} range={3}
      arrows={[{vector:unit(d.g),label:'g/‖g‖',color:C.gradient},{vector:d.direction,label:'d',color:C.direction}]}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia d e il suo prodotto con g','Scala γd; non cambia la pendenza']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt30-example"/>
      <LiveMetrics items={[{id:'opt30-slope',label:'Prodotto gᵀd',value:fmt(d.slope)},{id:'opt30-direction',label:'Direzione',value:d.slope<0?'discesa':d.slope>0?'salita':'ortogonale'},{id:'opt30-change',label:'Variazione del costo',value:fmt(d.change(gamma))}]}/>
      <FormulaContext definition={definition} formulaId="opt30-update"><span data-testid="opt30-verdict">{gamma===0?'Punto fermo: il passo zero non cambia la direzione scelta.':d.slope<0&&d.change(gamma)>=0?'Direzione di discesa, ma passo eccessivo: il costo non diminuisce.':'Il prodotto descrive la pendenza iniziale; la variazione misura il passo effettivo.'}</span></FormulaContext>
    </>}/>;
}
function MatrixDirection({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[scale,beta]=state.numbers,choice=useChoice(definition);
  const d=useMemo(()=>spdDirection(scale,beta,choice.value===1),[scale,beta,choice.value]);
  const gradientUnit=unit(d.gradient),directionUnit=unit(d.direction);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt31-descent"/>}
    legend="Esempio aggiunto · g=∇ℓ(zᵏ) · vettori unitari rosso/viola · passo: 0.2d."
    visual={<DescentScene definition={definition} value={quadraticCost} states={[d.current,d.next]} index={1}
      arrows={[{vector:gradientUnit,label:'g/‖g‖',color:C.gradient},{vector:directionUnit,label:'d/‖d‖',color:C.direction}]}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
      hints={['Cambia anisotropia; rotazione fissa','Ruota gli assi; autovalori fissi']}
      extra={<Choice label="Punto corrente" options={['(1,0.5)','Origine: gradiente nullo']} state={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt31-example"
      latex={String.raw`D^k=\begin{bmatrix}${numberText(d.matrix[0][0],3)}&${numberText(d.matrix[0][1],3)}\\${numberText(d.matrix[1][0],3)}&${numberText(d.matrix[1][1],3)}\end{bmatrix}`}/>
      <LiveMetrics items={[{id:'opt31-product',label:'Prodotto gᵀd',value:fmt(d.slope)},{id:'opt31-eigenvalue',label:'Autovalore minimo D',value:fmt(d.minimumEigenvalue)},{id:'opt31-cost',label:'Costo dopo 0.2d',value:fmt(d.cost)}]}/>
      <FormulaContext definition={definition} formulaId="opt31-update"><span data-testid="opt31-verdict">{choice.value===1?'g=0: prodotto zero e punto fermo; la stretta negatività non si applica.':'D cambia la direzione; il passo 0.2 è fissato per questo esempio.'}</span></FormulaContext>
    </>}/>;
}
function DirectionMethods({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[gamma,h]=state.numbers,choice=useChoice(definition);
  const d=useMemo(()=>directionMethod(choice.value,h,gamma),[choice.value,h,gamma]);
  const ids=['opt32-identity','opt32-newton','opt32-finite'];
  const activeDefinition=choice.value===2?definition:{...definition,controls:definition.controls.slice(0,1)};
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={ids[choice.value]}/>}
    legend="Esempio aggiunto · g=∇ℓ(zᵏ) · blu: partenza · arancio: arrivo · verde: minimo."
    visual={<DescentScene definition={definition} value={nonlinearCost} states={[d.current,d.next]} index={1}/>}
    controls={<LessonControls definition={activeDefinition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
      hints={['Stesso passo per il confronto','h cambia H, non γ']}
      extra={<Choice label="Metodo" options={directionMethodNames} state={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt32-example"/>
      <LiveMetrics items={[{id:'opt32-slope',label:'Prodotto gᵀd',value:fmt(d.slope)},{id:'opt32-cost',label:'Costo dopo il passo',value:fmt(d.cost)},
        {id:'opt32-change',label:'Variazione di costo',value:fmt(d.cost-d.initial)}]}/>
      <FormulaContext definition={definition} formulaId={choice.value===2?'opt32-fd-model':ids[choice.value]}><span data-testid="opt32-verdict">{
        choice.value===2?'Hₕ è stimata dal costo ed è positiva definita in questo esempio.':
          choice.value===1?'Hessiana esatta positiva definita; γ=1 identifica Newton puro.':
            d.cost>=d.initial?'La direzione è di discesa, ma il passo scelto aumenta il costo.':'Il passo scelto riduce il costo di questo esempio.'}</span></FormulaContext>
    </>}/>;
}
function SteepestUnit({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[radius,angle]=state.numbers,d=useMemo(()=>normalizedDirection(radius,angle),[radius,angle]);
  const traces=useMemo(()=>{
    const theta=Array.from({length:181},(_,i)=>i*2*Math.PI/180);
    return [{type:'scatter',mode:'lines',name:'Norma uno',x:theta.map(Math.cos),y:theta.map(Math.sin),line:{color:'#8ea1aa',width:2}},
      {type:'scatter',mode:'lines',name:'Direzione di prova',x:[0,d.direction[0]],y:[0,d.direction[1]],line:{color:C.direction,width:4}},
      ...(radius===0?[]:[{type:'scatter',mode:'lines',name:'Direzione migliore',x:[0,-1],y:[0,0],line:{color:C.minimum,width:4}},
        {...marker(-1,0,'Pendenza minima',C.minimum,18),marker:{symbol:'diamond',size:18,color:C.minimum,line:{color:'white',width:2}}},
        {type:'scatter',mode:'lines',name:'Gradiente normalizzato',x:[0,1],y:[0,0],line:{color:C.gradient,width:3,dash:'dash'}}]),
      marker(...d.direction,'Direzione di prova',C.direction)];
  },[d,radius]);
  return <LessonFrame definition={definition} className={cls} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt33-normalized"/>}
    legend="Esempio aggiunto · viola: prova unitaria · verde: migliore · rosso: gradiente normalizzato."
    visual={<SceneViewport id="optimization-opt33-unit" traces={traces} layout={{xaxis:{title:{text:'d₁ [1]'},range:[-1.3,1.3],constrain:'domain'},
      yaxis:{title:{text:'d₂ [1]'},range:[-1.3,1.3],scaleanchor:'x',constrain:'domain'},margin:{l:75,r:35,t:15,b:58}}}
      label="Pendenze a confronto sul cerchio unitario" height={335} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia g; costo e cerchio fissi','Ruota la direzione, norma sempre uno']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt33-example"/>
      <LiveMetrics items={[{id:'opt33-slope',label:'Pendenza di prova',value:fmt(d.slope)},{id:'opt33-best',label:'Pendenza minima',value:fmt(d.bestSlope)},{id:'opt33-gap',label:'Scarto dal minimo',value:fmt(d.gap)}]}/>
      <FormulaContext definition={definition} formulaId="opt33-minimum"><span data-testid="opt33-verdict">{radius===0?'g=0: tutte le pendenze sono zero; la direzione normalizzata non è definita.':d.gap===0?'La prova raggiunge la pendenza minima.':'Fra direzioni unitarie, la minima pendenza è −‖g‖.'}</span></FormulaContext>
    </>}/>;
}
export function DescentLesson(props:CompanionRendererProps){
  switch(props.definition.source_page){
    case 26:return <Section {...props}/>;
    case 27:return <IterativeDescent {...props}/>;
    case 28:return <TwoStep {...props}/>;
    case 29:return <TaylorDescent {...props}/>;
    case 30:return <DescentDirections {...props}/>;
    case 31:return <MatrixDirection {...props}/>;
    case 32:return <DirectionMethods {...props}/>;
    case 33:return <SteepestUnit {...props}/>;
    default:throw new Error('Companion D non disponibile');
  }
}
