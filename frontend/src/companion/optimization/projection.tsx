import {useEffect,useMemo} from 'react';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {useLessonChoice,LessonChoice} from '../useLessonChoice';
import {IterationControls} from '../IterationControls';
import {usePlayback} from '../../simulations/usePlayback';
import {SceneViewport} from '../../visualization';
import {quadraticCost,norm} from '../../math/descentMethods';
import type {Vec2} from '../../math/descentMethods';
import type {ConvexRegion} from '../../math/projectionModels';
import {firstOrderCase,projectionComparison,projectedStep,feasibleStep,projectedQp,costCatalog,quarticCritical,
  courseQuartic,courseQuarticHessian,barrierModel} from '../../math/projectionModels';
import {CostGeometryScene,ProjectionGeometry,C} from './projectionGraphics';
import {traceCurve,marker} from './descentGraphics';
import '../../styles/optimization.css';
import '../../styles/projection.css';
const cls='optimization-lesson projection-lesson';
const fmt=(v:number)=>!Number.isFinite(v)?'fuori scala numerica':v!==0&&(Math.abs(v)<.0001||Math.abs(v)>=10000)?v.toExponential(3):numberText(v,4);
const xy=(z:Vec2)=>'('+fmt(z[0])+', '+fmt(z[1])+')';
const regionOptions=['Disco unitario','Quadrato [−1,1]²'];
function Opening({definition}:CompanionRendererProps){
 return <LessonFrame definition={definition} className={cls} visual={<><div className="opt-section-cards">
  {[
   ['01','Riconoscere una soluzione','Al bordo, il gradiente può essere non nullo. Conta il confronto con le direzioni ammissibili.'],
   ['02','Proiettare un punto','Dal tentativo libero al punto ammissibile più vicino: due punti con ruoli diversi.'],
   ['03','Costruire gli aggiornamenti','Proiezione, direzione ammissibile e barriera: modi diversi di rispettare il dominio.']
  ].map(([n,title,text])=><section key={n}><span className="opt-step-number">{n}</span><h2>{title}</h2><p>{text}</p></section>)}
 </div><p className="lesson-caption">Mappa aggiunta al titolo della sezione. Risultati e algoritmi vengono sviluppati nelle pagine successive.</p></>}/>;
}
function Optimality({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),theta=state.numbers[0],choice=useLessonChoice(definition,'candidate');
 const d=useMemo(()=>firstOrderCase(choice.value,theta),[choice.value,theta]),length=norm(d.gradient);
 const end:Vec2=length===0?d.candidate:[d.candidate[0]+d.gradient[0]/length,d.candidate[1]+d.gradient[1]/length];
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt48-condition"/>}
  legend="Esempio aggiunto · verde: Z · curve: ℓ · blu: v · arancio: z̄ · freccia 2D: g/‖g‖."
  visual={<CostGeometryScene definition={definition} id="optimization-opt48-optimality" value={d.value} region={0}
   points={[{z:d.candidate,label:'Candidato v',color:C.cost},{z:d.probe,label:'Punto ammissibile z̄',color:C.current}]}
   segments={[{from:d.candidate,to:d.probe,color:C.direction,label:'Direzione ammissibile',dash:'dot'}]}
   vectors={length===0?[]:[{from:d.candidate,to:end,label:'g/‖g‖',color:C.gradient}]}
   minima={choice.value<2?[[1,0]]:[]} range={1.4} zRange={choice.value===2?[-.6,.2]:[0,5]}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Muove z̄ sul bordo del disco']}
   extra={<LessonChoice label="Caso" options={['Minimo al bordo','Candidato da confutare','Massimo stazionario']} state={choice}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt48-example"
    latex={choice.value===2?'\\ell(z)=-\\frac12\\|z\\|^2,\\quad v=(0,0)':'\\ell(z)=\\frac12((z_1-2)^2+z_2^2)'}/>
   <LiveMetrics items={[{id:'opt48-product',label:'Prodotto alla sonda',value:fmt(d.product)},{id:'opt48-universal',label:'Minimo del prodotto su Z',value:fmt(d.minimumProduct)},
    {id:'opt48-change',label:'Costo della sonda − costo v',value:fmt(d.costChange)}]}/>
   <FormulaContext definition={definition} formulaId="opt48-test"><span data-testid="opt48-verdict">{choice.value===0?'Minimo al bordo con g=(−1,0): il gradiente non deve annullarsi.':
    choice.value===1?'Minimo del prodotto negativo: il candidato non soddisfa la condizione.':'Prodotti tutti nulli, ma v è un massimo: la condizione non basta.'}</span></FormulaContext>
  </>}/>;
}
function Projection({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[x,y,theta]=state.numbers,choice=useLessonChoice(definition,'region'),kind=choice.value as ConvexRegion;
 const d=useMemo(()=>projectionComparison([x,y],theta,kind),[x,y,theta,kind]);
 return <LessonFrame definition={definition} className={cls+' projection-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt49-projection"/>}
  legend="Esempio aggiunto · rosso: z · arancio: proiezione p · viola: candidato ammissibile y."
  visual={<ProjectionGeometry id="optimization-opt49-projection" kind={kind}
   points={[{z:d.z,label:'Punto z',color:C.gradient},{z:d.projected,label:'Proiezione p',color:C.current},{z:d.competitor,label:'Candidato y',color:C.direction}]}
   segments={[{from:d.z,to:d.projected,color:C.current,label:'Distanza minima'},{from:d.z,to:d.competitor,color:C.direction,label:'Distanza concorrente',dash:'dot'}]}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Muove z, non l’insieme','Ricalcola la proiezione','Muove y, non la proiezione']}
   extra={<LessonChoice label="Insieme" options={regionOptions} state={choice}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt49-example"/>
   <LiveMetrics items={[{id:'opt49-p',label:'Proiezione p',value:xy(d.projected)},{id:'opt49-distance',label:'Distanza minima',value:fmt(d.distance)},
    {id:'opt49-gap',label:'Scarto distanze²',value:Math.abs(d.gap)<1e-13?'≈0':fmt(d.gap)}]}/>
   <FormulaContext definition={definition} formulaId="opt49-characterization"><span data-testid="opt49-verdict">{d.inside?'Punto già ammissibile: p=z e distanza zero.':'Chiusura: esistenza. Convessità di Z: proiezione unica.'}</span></FormulaContext>
  </>}/>;
}
function ProjectedOneStep({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),gamma=state.numbers[0],choice=useLessonChoice(definition,'region'),kind=choice.value as ConvexRegion;
 const d=useMemo(()=>projectedStep(gamma,kind),[gamma,kind]);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt50-update"/>}
  legend="Esempio aggiunto · blu: corrente · rosso: passo libero · arancio: proiezione · verde: Z."
  visual={<CostGeometryScene definition={definition} id="optimization-opt50-projected" value={quadraticCost} region={kind} zRange={[0,3]}
   points={[{z:d.current,label:'Punto corrente',color:C.cost},{z:d.free,label:'Passo libero w',color:C.gradient},{z:d.next,label:'Proiezione',color:C.current}]}
   segments={[{from:d.current,to:d.free,label:'Passo libero',color:C.gradient,dash:'dash'},{from:d.free,to:d.next,label:'Proiezione',color:C.current,dash:'dot'}]}
   minima={[[0,0]]}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Cambia passo e proiezione, non zᵏ']}
   extra={<LessonChoice label="Insieme" options={regionOptions} state={choice}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt50-example"/>
   <LiveMetrics items={[{id:'opt50-free',label:'Tentativo libero w',value:xy(d.free)},{id:'opt50-next',label:'Proiezione in Z',value:xy(d.next)},
    {id:'opt50-change',label:'Variazione di costo',value:fmt(d.change)}]}/>
   <FormulaContext definition={definition} formulaId="opt50-split"><span data-testid="opt50-verdict">{d.change>0?'Ammissibile, ma il costo aumenta: serve un passo diverso.':
    d.change===0?'Il costo pareggia: ammissibilità non significa discesa stretta.':d.freeFeasible?'Il passo resta già in Z: la proiezione non lo cambia.':'Proiezione attiva: in questo caso il costo diminuisce.'}</span></FormulaContext>
  </>}/>;
}
function FeasibleDirection({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),gamma=state.numbers[0],choice=useLessonChoice(definition,'region'),kind=choice.value as ConvexRegion;
 const d=useMemo(()=>feasibleStep(gamma,kind),[gamma,kind]);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt51-update"/>}
  legend="Esempio aggiunto · blu: zᵏ · viola: z̃ e segmento · arancio: nuovo punto · verde: Z."
  visual={<CostGeometryScene definition={definition} id="optimization-opt51-feasible" value={quadraticCost} region={kind} zRange={[0,3]}
   points={[{z:d.current,label:'Punto corrente',color:C.cost},{z:d.tilde,label:'Punto z̃',color:C.direction},{z:d.next,label:'Nuovo punto',color:d.feasible?C.current:C.gradient}]}
   segments={[{from:d.current,to:d.tilde,label:'Segmento ammissibile',color:C.direction},{from:d.current,to:d.next,label:'Passo scelto',color:C.current,dash:'dot'}]} minima={[[0,0]]}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['γ esterno: percorre il segmento']}
   extra={<LessonChoice label="Insieme" options={regionOptions} state={choice}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt51-projection"/>
   <LiveMetrics items={[{id:'opt51-slope',label:'Prodotto gᵀ(z̃−zᵏ)',value:fmt(d.slope)},{id:'opt51-feasible',label:'Nuovo punto in Z?',value:d.feasible?'sì':'no'},
    {id:'opt51-change',label:'Variazione di costo',value:fmt(d.change)}]}/>
   <FormulaContext definition={definition} formulaId="opt51-example"><span data-testid="opt51-verdict">{gamma===0?'Passo zero: nessun movimento.':!d.feasible?'Oltre il segmento: questo punto esce dall’insieme.':
    d.change>0?'Resta ammissibile, ma il passo aumenta il costo.':'Il passo scelto resta ammissibile e riduce il costo.'}</span></FormulaContext>
  </>}/>;
}
function ProjectedIterations({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[lambda,a,gamma]=state.numbers,data=useMemo(()=>projectedQp(lambda,a,gamma),[lambda,a,gamma]);
 const playback=usePlayback(data.states.length,650),k=Math.min(playback.index,data.states.length-1);
 useEffect(()=>{playback.restart();},[lambda,a,gamma]);
 return <LessonFrame definition={definition} className={cls+' projection-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt52-update"/>}
  legend="Esempio aggiunto · blu: iterati · arancio: selezione · verde: minimi · k non è tempo."
  visual={<CostGeometryScene definition={definition} id="optimization-opt52-qp" value={data.value} region={1} zRange={[-2,6]}
   points={[{z:data.states[k],label:'Iterato corrente',color:C.current}]} path={data.states.slice(0,k+1)} minima={data.minima}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();playback.restart();}}}
   hints={['Curvatura λ≥0','q₁=−a','Cambia il percorso']}
   extra={<IterationControls playback={playback} count={data.states.length}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt52-example"/>
   <LiveMetrics items={[{id:'opt52-cost',label:'Costo corrente',value:fmt(data.costs[k])},{id:'opt52-gradient',label:'Norma del gradiente',value:fmt(data.norms[k])},
    {id:'opt52-residual',label:'Residuo proiettato',value:fmt(data.residuals[k])}]}/>
   <FormulaContext definition={definition} formulaId="opt52-residual"><span data-testid="opt52-verdict">{lambda===0?'Retta di minimi nel quadrato; la coordinata piatta resta 0.8.':
    !data.stable?'Passo grande: la proiezione conserva ammissibilità, non convergenza.':
      data.residuals[k]===0?'Punto fisso proiettato: al bordo il gradiente può essere non nullo.':'Il residuo proiettato può annullarsi con gradiente non nullo.'}</span></FormulaContext>
  </>}/>;
}
function CostCatalog({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[a,x,y]=state.numbers,choice=useLessonChoice(definition,'cost',2),kind=choice.value;
 const scalar=kind<2,d=useMemo(()=>costCatalog(kind,scalar?a:x,scalar?0:y),[kind,a,x,y,scalar]);
 const active={...definition,controls:scalar?definition.controls.slice(0,1):definition.controls.slice(1)};
 const ids=['opt53-square','opt53-quartic','opt53-exponential','opt53-quadratic'];
 const scalarTraces=useMemo(()=>[
  traceCurve(z=>d.value(z,0),-4,kind===1?3:4,'Costo'),
  ...(kind===1?quarticCritical.map((z,i)=>({...marker(z,courseQuartic(z),i===0?'Minimo globale (numerico)':i===1?'Massimo locale (numerico)':'Minimo locale (numerico)',i===0?C.minimum:i===1?C.gradient:C.direction,14),
    marker:{size:14,symbol:courseQuarticHessian(z)>0?'star':'diamond',color:i===0?C.minimum:i===1?C.gradient:C.direction}})):
    [marker(0,0,'Minimo globale',C.minimum,17)]),
  marker(a,d.cost,'Punto esaminato',C.current,13)
 ],[d,kind,a]);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId={ids[kind]}/>}
  legend={scalar?'Funzione della fonte · arancio: sonda · verde: minimo globale · quartica: stazionari numerici.':
   'Funzione della fonte · arancio: sonda · verde: minimo noto · 3D: valore dello stesso costo.'}
  visual={scalar?<SceneViewport id="optimization-opt53-curve" traces={scalarTraces} height={335} fontSize={22} label="Curva del costo scalare originale"
   layout={{xaxis:{title:{text:'z [1]'},range:kind===1?[-4,3]:[-4,4]},yaxis:{title:{text:'ℓ(z) [costo]'},range:kind===1?[-80,35]:[-.2,16]}}}/>:
   <CostGeometryScene definition={definition} id="optimization-opt53-surface" value={d.value} range={d.range} zRange={d.zRange}
    points={[{z:[x,y],label:'Punto esaminato',color:C.current}]} minima={d.minima}/>}
  controls={<LessonControls definition={active} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={scalar?['Muove la sonda scalare']:['Muove z₁, funzione fissa','Muove z₂, stessi dati in 2D/3D']}
   extra={<LessonChoice label="Costo" options={['z²','Quartica','Somma di esponenziali','QP con dati dichiarati']} state={choice}/>}/>}
  example={<>{kind===3?<LessonEquation definition={definition} formulaId="opt53-qp-data"/>:
   <p className="lesson-caption">{kind===1?'Tutti i coefficienti sono quelli della slide; derivate e stazionari sono calcolati.':
    kind===2?'Minimo aggiunto: (−log(2)/2,0), valore 2√2 e⁻⁰·¹.':'Il costo ha gradiente 2z e derivata seconda 2.'}</p>}
   <LiveMetrics items={[{id:'opt53-cost',label:'Costo alla sonda',value:fmt(d.cost)},{id:'opt53-gradient',label:'Norma del gradiente',value:fmt(d.gradientNorm)},
    {id:'opt53-curvature',label:scalar?'Derivata seconda':'Autovalore minimo H',value:fmt(d.hessianMinimum)}]}/>
   <FormulaContext definition={definition} formulaId={ids[kind]}><span data-testid="opt53-verdict">{kind===1?'La quartica ha due minimi locali; quello sinistro è globale.':
    kind===3?'Solo questa istanza Q=diag(1,4), r=(−1,−1) viene visualizzata.':kind===2?'Il terzo asse è il costo: nessuna dimensione fisica aggiunta.':'Variabile scalare: una curva 2D è sufficiente.'}</span></FormulaContext>
  </>}/>;
}
function Barrier({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[epsilon,z]=state.numbers,d=useMemo(()=>barrierModel(epsilon,z),[epsilon,z]);
 const traces=useMemo(()=>{
  const samples=Array.from({length:361},(_,i)=>10**(-6+i*(6+Math.log10(2))/360));
  const curve=(fn:(z:number)=>number|null,name:string,color:string)=>({type:'scatter',mode:'lines',x:samples,y:samples.map(fn),name,line:{color,width:3}});
  return [traceCurve(d.original,-.25,2,'Costo originale'),curve(d.barrier,'Barriera −ε log z',C.gradient),curve(d.total,'Costo con barriera',C.direction),
   {...marker(0,.5,'Minimo originale al bordo',C.minimum,17),marker:{size:17,color:C.minimum,symbol:'star'}},
   marker(d.minimum,d.minimumCost,'Minimo con barriera',C.current,15),
   ...(d.valid?[{...marker(z,d.probeCost!,'Sonda',C.cost,12),marker:{size:12,color:C.cost,symbol:'circle-open',line:{width:2}}}]:[])];
 },[d,z]);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt54-barrier"/>}
  legend="Esempio aggiunto · blu: ℓ · rosso: barriera · viola: Fε · arancio: minimo interno."
  visual={<SceneViewport id="optimization-opt54-barrier" traces={traces} height={335} fontSize={22} label="Barriera logaritmica, dominio e minimo interno"
   layout={{xaxis:{title:{text:'z [1]'},range:[-.25,2]},yaxis:{title:{text:'Costo / barriera'},range:[-1,5]},
    shapes:[{type:'rect',xref:'x',yref:'paper',x0:-.25,x1:0,y0:0,y1:1,fillcolor:'#bb3c3c18',line:{width:0},layer:'below'},
     {type:'line',x0:0,x1:0,yref:'paper',y0:0,y1:1,line:{color:C.gradient,width:2,dash:'dot'}}],
    annotations:[{text:'z=0 escluso: Fε→+∞',x:.98,y:.98,xref:'paper',yref:'paper',xanchor:'right',showarrow:false,font:{size:22,color:C.gradient},bgcolor:'#ffffffef'}]}}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Cambia peso e minimo interno','Valuta anche bordo e punti esclusi']}
   extra={<div className="barrier-action"><button disabled={epsilon/2<.001} onClick={()=>state.update('opt54-epsilon',epsilon/2)}>Riduci ε</button>
    <span>Minimo risolto analiticamente.</span></div>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt54-example"
    latex="F_\varepsilon(z)=\tfrac12(z+1)^2-\varepsilon\log z,\quad z>0"/>
   <LiveMetrics items={[{id:'opt54-minimum',label:'Minimo interno zε',value:fmt(d.minimum)},{id:'opt54-barrier',label:'Barriera nella sonda',value:d.probeBarrier===null?'fuori dominio':fmt(d.probeBarrier)},
    {id:'opt54-total',label:'Costo Fε nella sonda',value:d.probeCost===null?'fuori dominio':fmt(d.probeCost)}]}/>
   <FormulaContext definition={definition} formulaId="opt54-minimum"><span data-testid="opt54-verdict">{!d.valid?
    d.originalFeasible?'z=0 è ammissibile per il vincolo originale, ma escluso dal log.':'z<0: fuori dal vincolo originale e dal dominio del log.':
     z>1?'La barriera è negativa per z>1: il valore viene conservato.':'Riducendo ε il minimo di questo esempio si avvicina al bordo.'}</span></FormulaContext>
  </>}/>;
}
export function ProjectionLesson(props:CompanionRendererProps){
 switch(props.definition.source_page){
  case 47:return <Opening {...props}/>;
  case 48:return <Optimality {...props}/>;
  case 49:return <Projection {...props}/>;
  case 50:return <ProjectedOneStep {...props}/>;
  case 51:return <FeasibleDirection {...props}/>;
  case 52:return <ProjectedIterations {...props}/>;
  case 53:return <CostCatalog {...props}/>;
  case 54:return <Barrier {...props}/>;
  default:throw new Error('Companion G non disponibile');
 }
}
