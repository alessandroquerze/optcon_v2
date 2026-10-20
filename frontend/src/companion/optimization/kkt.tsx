import {useMemo} from 'react';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {LessonChoice,useLessonChoice} from '../useLessonChoice';
import {segmentModel,activeGeometry,lagrangianModel,hypothesisCase,kktBalance,exactSegmentMultipliers,curvatureCase} from '../../math/kktModels';
import type {NamedVector} from '../../math/kktModels';
import type {Vec2} from '../../math/descentMethods';
import {ConstraintScene,NormalScene,C} from './kktGraphics';
import '../../styles/optimization.css';
import '../../styles/kkt.css';
const compactKkt='\\begin{gathered}\\nabla_1L(z^\\star,\\mu^\\star,\\lambda^\\star)=0\\\\\\mu_j^\\star\\ge0,\\quad\\mu_j^\\star g_j(z^\\star)=0,\\quad j\\in\\{1,\\ldots,r\\}\\end{gathered}';
const cls='optimization-lesson kkt-lesson';
const fmt=(v:number)=>v!==0&&(Math.abs(v)<.0001||Math.abs(v)>10000)?v.toExponential(3):numberText(v,4);
const residual=(v:number)=>v>0&&v<1e-12?'≈0':fmt(v);
const xy=(v:Vec2)=>'('+v.map(fmt).join(', ')+')';
const set=(v:number[])=>v.length?'{'+v.join(', ')+'}':'∅';
function Opening({definition}:CompanionRendererProps){
 return <LessonFrame definition={definition} className={cls} visual={<><div className="opt-section-cards">
  {[
   ['01','Descrivere le decisioni ammissibili','Le disuguaglianze e le uguaglianze definiscono insieme dove si può cercare la soluzione.'],
   ['02','Leggere la geometria locale','Attività dei vincoli e indipendenza dei loro gradienti spiegano il ruolo della regolarità.'],
   ['03','Bilanciare i gradienti','La Lagrangiana raccoglie costo e vincoli. Le KKT danno condizioni necessarie, sotto le loro ipotesi.']
  ].map(([n,title,text])=><section key={n}><span className="opt-step-number">{n}</span><h2>{title}</h2><p>{text}</p></section>)}
 </div><p className="lesson-caption">Mappa aggiunta al titolo della sezione. Le formule vengono introdotte nelle pagine successive.</p></>}/>;
}
function Problem({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[a,b,x,y]=state.numbers;
 const d=useMemo(()=>segmentModel(a,b,[x,y]),[a,b,x,y]);
 return <LessonFrame definition={definition} className={cls+' kkt-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt56-problem"/>}
  legend="Esempio aggiunto · verde: segmento ammissibile e minimo ★ · arancio/rosso: sonda."
  visual={<ConstraintScene definition={definition} id="optimization-opt56-problem" value={d.value} minima={[d.minimum]}
   points={[{z:[x,y],label:d.feasible?'Sonda ammissibile':'Sonda inammissibile',color:d.feasible?C.current:C.gradient}]} zRange={[0,5]} profileRange={[0,2]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Sposta il minimo','Cambia il costo','Verifica g₁ e g₂','Verifica h₁=0']}/>}
  example={<><LessonEquation definition={definition} formulaId="opt56-example" latex="\ell=\tfrac12((z_1-a)^2+(z_2-b)^2)"/>
   <LiveMetrics items={[{id:'opt56-g',label:'Residui (g₁, g₂)',value:xy([d.residuals[0],d.residuals[1]])},
    {id:'opt56-h',label:'Residuo h₁',value:fmt(d.residuals[2])},{id:'opt56-minimum',label:'Minimo vincolato',value:xy(d.minimum)}]}/>
   <FormulaContext definition={definition} formulaId="opt56-solution"><span data-testid="opt56-verdict">{d.feasible?'Sonda ammissibile':'Sonda inammissibile'} · costo {fmt(d.cost)} · minimo {fmt(d.minimumCost)}.</span></FormulaContext>
  </>}/>;
}
function Active({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),x=state.numbers[0],choice=useLessonChoice(definition,'representation');
 const d=useMemo(()=>activeGeometry(x,choice.value),[x,choice.value]);
 const expressions=['g_1=-z_1,\\quad g_2=z_1-1,\\quad h_1=z_2',
  'g_1=-z_1,\\ g_2=z_1-1,\\ g_3=-2z_1,\\ h_1=z_2','h_1=z_2^3,\\quad g_1=-z_1,\\quad g_2=z_1-1',
  'g_1=-z_1^3,\\quad g_2=z_1-1,\\quad h_1=z_2'];
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt57-active"/>}
  legend="Esempio aggiunto · frecce: gradienti reali · viola: ∇h₁ · rosso: ∇gⱼ · blu: ∇g₃."
  visual={<NormalScene id="optimization-opt57-normals" origin={[x,0]} vectors={d.vectors}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
   hints={['Cambia l’insieme attivo, non il segmento']}
   extra={<LessonChoice label="Rappresentazione" state={choice} options={['Standard','Disuguaglianza ridondante','Uguaglianza cubica','Disuguaglianza cubica']}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt57-variants" latex={expressions[choice.value]}/>
   <p className="lesson-caption kkt-vector-list">{d.vectors.map(v=><span key={v.label} style={{color:v.color}}>{v.label}={xy(v.v)}{v.v.every(a=>a===0)?' (nullo)':''}</span>)}</p>
   <LiveMetrics items={[{id:'opt57-active',label:'Insieme attivo A(z)',value:set(d.active)},
    {id:'opt57-rank',label:'Rango / n. vettori',value:d.rank+' / '+d.count},{id:'opt57-regular',label:'Punto regolare?',value:d.regular?'sì':'no'}]}/>
   <FormulaContext definition={definition} formulaId="opt57-regular"><span data-testid="opt57-verdict">{d.regular?'Gradienti pertinenti indipendenti.':d.vectors.some(v=>v.v.every(a=>a===0))?
    'Un gradiente nullo impedisce l’indipendenza.':'Gradienti dipendenti: la normale ridondante non aggiunge una direzione.'}</span></FormulaContext>
  </>}/>;
}
function Lagrangian({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[mu,lambda,x,y]=state.numbers;
 const d=useMemo(()=>lagrangianModel(mu,lambda,[x,y]),[mu,lambda,x,y]);
 return <LessonFrame definition={definition} className={cls+' kkt-four-controls kkt-lagrangian'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt58-lagrangian" warnings/>}
  legend="Esempio aggiunto · grafico di L a μ,λ fissati · verde: z₁≥0, z₂=0 · viola: minimo di L."
  visual={<ConstraintScene definition={definition} id="optimization-opt58-lagrangian" value={d.value} low={0} high={1.7} symbol="L" zRange={[-3,5]}
   points={[{z:d.minimum,label:'Minimo libero di L',color:C.direction,symbol:'diamond'},{z:[x,y],label:'Sonda',color:C.current}]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Inclina L lungo z₁','Inclina L lungo z₂','Sposta la sonda','Sposta la sonda']}/>}
  example={<><p className="lesson-caption">ℓ=((z₁+0.5)²+(z₂−0.6)²)/2; g₁=−z₁, h₁=z₂.</p>
   <LiveMetrics items={[{id:'opt58-original',label:'Costo ℓ alla sonda',value:fmt(d.originalCost)},
    {id:'opt58-terms',label:'Contributi (μg₁, λh₁)',value:xy([d.inequalityTerm,d.equalityTerm])},{id:'opt58-total',label:'L alla sonda',value:fmt(d.total)}]}/>
   <FormulaContext definition={definition} formulaId="opt58-free-minimum"><span data-testid="opt58-verdict">Minimo libero di L: {xy(d.minimum)} · {d.minimumFeasible?'ammissibile':'inammissibile'} per il problema originale.</span></FormulaContext>
  </>}/>;
}
function Hypotheses({definition}:CompanionRendererProps){
 const choice=useLessonChoice(definition,'representation'),d=useMemo(()=>hypothesisCase(choice.value===1),[choice.value]);
 const vectors:NamedVector[]=[{label:'∇ℓ',v:[1,0],color:C.cost},{label:'∇g₁',v:d.normals[0],color:C.gradient},{label:'∇h₁',v:[0,1],color:C.direction}];
 const state=useLessonParameters(definition);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt59-problem"/>}
  legend="Esempio aggiunto · minimo z⋆=(0,0) · blu: ∇ℓ · rosso: ∇g₁ · viola: ∇h₁."
  visual={<NormalScene id="optimization-opt59-hypotheses" low={0} high={2} origin={[0,0]} vectors={vectors}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:choice.reset}}
   extra={<LessonChoice label="Rappresentazione" state={choice} options={['Vincolo lineare','Stesso vincolo cubico']}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt59-example"
   latex={choice.value===0?'\\ell=z_1,\\quad g_1=-z_1,\\quad h_1=z_2':'\\ell=z_1,\\quad g_1=-z_1^3,\\quad h_1=z_2'}/>
   <div className="kkt-hypotheses"><span>Ammissibile ✓</span><span>Minimo ✓</span><span>Funzioni C¹ ✓</span><span data-testid="opt59-regular">Regolare {d.regular?'✓':'✗'}</span></div>
   <FormulaContext definition={definition} formulaId="opt59-balance"><span data-testid="opt59-verdict">{d.regular?
    'Ipotesi valide. Nell’esempio, il bilancio dà μ₁=1 e λ₁=0.':'∇g₁(0)=0: nessun μ₁ cancella ∇ℓ=(1,0). Il minimo resta valido.'}</span></FormulaContext>
  </>}/>;
}
function Multipliers({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[a,mu1,mu2,lambda]=state.numbers;
 const d=useMemo(()=>kktBalance(a,mu1,mu2,lambda),[a,mu1,mu2,lambda]);
 const solve=()=>{const v=exactSegmentMultipliers(a);state.update('opt60-mu1',v.mu1);state.update('opt60-mu2',v.mu2);state.update('opt60-lambda',v.lambda);};
 return <LessonFrame definition={definition} className={cls+' kkt-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt60-kkt" primaryLatex={compactKkt}/>}
  legend="Esempio aggiunto · rosso: ∇ℓ · viola: μ₁∇g₁ · blu: μ₂∇g₂ · arancio: λ₁∇h₁ (solo 2D)."
  visual={<ConstraintScene definition={definition} id="optimization-opt60-balance" value={d.value} origin={d.point} vectors={d.vectors}
   points={[{z:d.point,label:'Minimo vincolato',color:C.current}]} zRange={[0,5]} profileRange={[0,1.5]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Muove il minimo','Pesa ∇g₁','Pesa ∇g₂','λ₁ reale']}
   extra={<div className="kkt-solve"><button onClick={solve}>Usa moltiplicatori KKT</button></div>}/>}
  example={<><p className="lesson-caption">ℓ=((z₁−a)²+(z₂−0.6)²)/2; 0≤z₁≤1, z₂=0. Minimo {xy(d.point)}.</p>
   <LiveMetrics items={[{id:'opt60-stationarity',label:'Norma ∇₁L',value:residual(d.stationarityNorm)},
    {id:'opt60-complementarity',label:'Norma dei prodotti μⱼgⱼ',value:residual(d.complementarityNorm)},{id:'opt60-active',label:'Vincoli attivi A(z⋆)',value:set(d.active)}]}/>
   <FormulaContext definition={definition} formulaId="opt60-multipliers"><span data-testid="opt60-verdict">{d.satisfies?'KKT soddisfatte: terna unica. ': 'Moltiplicatori di prova: almeno una condizione KKT fallisce. '}
    {d.active.length&&mu1===0&&mu2===0?'Un vincolo attivo può avere μ=0.':'Il punto è sempre ammissibile; μ≥0 è imposto dai controlli.'}</span></FormulaContext>
  </>}/>;
}
function Curvature({definition,definitionPage=61}:CompanionRendererProps&{definitionPage?:61|62}){
 const state=useLessonParameters(definition),choice=useLessonChoice(definition,'cost',1),isTypes=definitionPage===62;
 const [kappa,t,flat]=isTypes?[[1,-1,0,0][choice.value],state.numbers[0],choice.value===3]:[state.numbers[0],state.numbers[1],false];
 const d=useMemo(()=>curvatureCase(kappa,t,flat),[kappa,t,flat]);
 const n=definitionPage;
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId={'opt'+n+'-kkt'} primaryLatex={compactKkt}/>}
  legend="Esempio aggiunto · verde: ammissibili z₂=0, z₁≤1 · viola: punto KKT · arancio: sonda."
  visual={<ConstraintScene definition={definition} id={'optimization-opt'+n+'-curvature'} value={d.value} low={-1.7} high={1} zRange={[-1.2,5]} profileRange={[-1.2,1.5]}
   points={[{z:[0,0],label:'Punto KKT: origine',color:C.direction,symbol:'diamond'},{z:[t,0],label:'Sonda ammissibile',color:C.current}]}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
   hints={isTypes?['Muove (t,0), punto KKT fisso']:['Cambia curvatura, KKT invariate','Confronta un punto ammissibile']}
   extra={isTypes?<LessonChoice label="Tipo di costo" state={choice} options={['Minimo stretto','Massimo locale','Minimo piatto','Minimi multipli']}/>:undefined}/>}
  example={<><LessonEquation definition={definition} formulaId={'opt'+n+'-example'}
   latex={flat?'\\ell(z)=\\tfrac12z_2^2,\\quad z_1\\le1,\\ z_2=0':'\\ell_\\kappa(z)=\\tfrac\\kappa2z_1^2+\\tfrac14z_1^4+\\tfrac12z_2^2'+(isTypes?',\\quad\\kappa='+kappa:'')}/>
   <LiveMetrics items={[{id:'opt'+n+'-curvature',label:'Curvatura lungo (1,0)',value:fmt(d.curvature)},
    {id:'opt'+n+'-change',label:'ℓ(t,0) − ℓ(0,0)',value:fmt(d.change)},{id:'opt'+n+'-kkt',label:'Residui KKT all’origine',value:'tutti zero'}]}/>
   <FormulaContext definition={definition} formulaId={'opt'+n+(isTypes?'-types':'-curvature')}><span data-testid={'opt'+n+'-verdict'}>{d.classification}</span></FormulaContext>
  </>}/>;
}
export function KktLesson(props:CompanionRendererProps){
 switch(props.definition.source_page){
  case 55:return <Opening {...props}/>;
  case 56:return <Problem {...props}/>;
  case 57:return <Active {...props}/>;
  case 58:return <Lagrangian {...props}/>;
  case 59:return <Hypotheses {...props}/>;
  case 60:return <Multipliers {...props}/>;
  case 61:return <Curvature {...props}/>;
  case 62:return <Curvature {...props} definitionPage={62}/>;
  default:throw new Error('Companion H non disponibile');
 }
}
