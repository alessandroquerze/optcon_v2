import {useMemo} from 'react';
import type {CompanionRendererProps} from '../registry';
import {LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters} from '../LessonFrame';
import {useLessonChoice,LessonChoice} from '../useLessonChoice';
import {circleModel,circlePoint,complementaryModel,equalityQp,equalityQpSystem,nullDirection} from '../../math/constrainedQpModels';
import type {Vec2} from '../../math/descentMethods';
import type {NamedVector} from '../../math/kktModels';
import {FeasibleCurveScene,GradientPolygon,C} from './constrainedQpGraphics';
import type {CurvePoint} from './constrainedQpGraphics';
import '../../styles/optimization.css';
import '../../styles/constrainedQp.css';
const cls='optimization-lesson constrained-qp-lesson';
const fmt=(v:number)=>!Number.isFinite(v)?'fuori scala numerica':v!==0&&(Math.abs(v)<.0001||Math.abs(v)>=10000)?v.toExponential(3):numberText(v,4);
const xy=(z:Vec2)=>'('+z.map(fmt).join(', ')+')';
const residual=(v:number)=>v!==0&&Math.abs(v)<1e-12?'≈0':fmt(v);
function Complementarity({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),a=state.numbers[0],choice=useLessonChoice(definition,'multipliers');
 const d=useMemo(()=>complementaryModel(a,choice.value===1),[a,choice.value]);
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt63-balance"/>}
  legend="Esempio aggiunto · contributi testa-coda · anello arancio: somma finale, uguale all’origine."
  visual={<GradientPolygon id="optimization-opt63-balance" vectors={d.vectors}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Muove il minimo e cambia i pesi esatti']}
   extra={<LessonChoice label="Moltiplicatori" options={['KKT esatti','Solo bilancio']} state={choice}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt63-example"
   latex="\ell=\tfrac12((z_1-a)^2+(z_2-0.6)^2),\quad0\le z_1\le1,\ z_2=0"/>
   <p className="lesson-caption">{choice.value===0?'Pesi KKT esatti.':'Pesi di prova: aggiunti 0.4 a μ₁ e μ₂; λ resta 0.6.'} Punto {xy(d.point)}.</p>
   <LiveMetrics items={[{id:'opt63-sum',label:'Norma della somma',value:residual(d.stationarityNorm)},
    {id:'opt63-first',label:'Prodotto μ₁g₁',value:fmt(d.complementary[0])},{id:'opt63-second',label:'Prodotto μ₂g₂',value:fmt(d.complementary[1])}]}/>
   <FormulaContext definition={definition} formulaId="opt63-perturbation"><span data-testid="opt63-verdict">{choice.value===0?
    'Tutte le KKT soddisfatte, inclusi i prodotti complementari.':'Bilancio nullo e μ≥0, ma complementarità violata.'}</span></FormulaContext>
  </>}/>;
}
function CircleLesson({definition,second=false}:CompanionRendererProps&{second?:boolean}){
 const state=useLessonParameters(definition),[alpha,beta,last]=state.numbers;
 const d=useMemo(()=>circleModel(alpha,beta,second?0:last,second?last:0),[alpha,beta,last,second]);
 const n=second?65:64;
 const vectors:NamedVector[]=second?[{label:'y',v:d.direction,color:d.inTest?C.current:C.gradient}]:[
  {label:'∇ℓ',v:d.gradient,color:C.gradient},{label:'λ∇h',v:[0,-beta],color:C.direction}];
 const points:CurvePoint[]=[{z:d.candidate,parameter:0,label:'Candidato v=(0,−1)',color:C.direction,symbol:'diamond'},
  ...(second?[]:[{z:d.probe,parameter:last,label:'Sonda ammissibile',color:C.current}])];
 return <LessonFrame definition={definition} className={cls} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId={'opt'+n+(second?'-second':'-kkt')}/>}
  legend={second?'Esempio aggiunto · verde: h=0 · viola: v · freccia 2D: direzione y, arancio se nel test.':
   'Esempio aggiunto · verde: h=0 · viola: candidato v · arancio: sonda · frecce 2D: ∇ℓ e λ∇h.'}
  visual={<FeasibleCurveScene definition={definition} id={'optimization-opt'+n+'-circle'} value={d.value} curve={circlePoint}
   interval={[-180,180]} parameterLabel="θ [°]" circle points={points} vectors={vectors} base={d.candidate}/>}
  controls={<LessonControls definition={definition} state={state} hints={second?
   ['Modifica ∇²ℓ, vincolo fisso','λ=β aggiunge β∇²h','Ruota y: solo la tangente è nel test']:
   ['KKT in v restano valide','Cambia anche λ=β','Muove la sonda']}/>}
  example={<><LessonEquation definition={definition} formulaId={'opt'+n+'-example'} latex="\ell=\tfrac\alpha2z_1^2+\beta z_2,\quad h_1=\tfrac12(\|z\|^2-1)"/>
   <LiveMetrics items={second?[{id:'opt65-tangent',label:'Residuo ∇h(v)ᵀy',value:fmt(d.directionalConstraint)},
    {id:'opt65-form',label:'Forma yᵀ∇²₁₁Ly',value:fmt(d.form)},{id:'opt65-reduced',label:'Curvatura tangente α+β',value:fmt(d.reduced)}]:
    [{id:'opt64-regular',label:'Norma ∇h(v)',value:'1.0000'},{id:'opt64-lambda',label:'Moltiplicatore λ',value:fmt(d.lambda)},
     {id:'opt64-change',label:'Costo sonda − costo v',value:fmt(d.change)}]}/>
   <FormulaContext definition={definition} formulaId={'opt'+n+(second?'-reduced':'-probe')}><span data-testid={'opt'+n+'-verdict'}>{second?
    d.inTest?'Direzione nel test. '+d.type:'Direzione esclusa: il segno della forma non verifica il criterio.':
    d.change<0?'KKT in v, ma la sonda ha costo minore: v non è minimo.':'Stazionarietà in v sempre nulla; questo confronto da solo non prova minimo.'}</span></FormulaContext>
  </>}/>;
}
function QpSetup({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[kappa,nu,b,s]=state.numbers;
 const d=useMemo(()=>equalityQp(kappa,nu,-.5,b),[kappa,nu,b]),point=d.curve(s);
 return <LessonFrame definition={definition} className={cls+' qp-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt66-qp"/>}
  legend="Esempio aggiunto · verde: retta Az=b e relativo costo · arancio: sonda ammissibile."
  visual={<FeasibleCurveScene definition={definition} id="optimization-opt66-qp" value={d.value} curve={d.curve} interval={[-1.5,1.5]}
   parameterLabel="s [1]" points={[{z:point,parameter:s,label:'Sonda ammissibile',color:C.current}]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Cambia il profilo','Parte normale','Trasla il vincolo','Muove la sonda']}/>}
  example={<><LessonEquation definition={definition} formulaId="opt66-profile" latex="\ell(z(s))=\tfrac\kappa2s^2-\tfrac12s+\tfrac\nu4b^2"/>
   <p className="lesson-caption">A=(1,1), q=−v/2; z(s)=(b/2,b/2)+sv, v=(1,−1)/√2.</p>
   <LiveMetrics items={[{id:'opt66-point',label:'Sonda z(s)',value:xy(point)},{id:'opt66-feasible',label:'Az(s) − b',value:residual(point[0]+point[1]-b)},
    {id:'opt66-cost',label:'Costo della sonda',value:fmt(d.profile(s))}]}/>
   <FormulaContext definition={definition} formulaId="opt66-basis"><span data-testid="opt66-verdict">{kappa>0&&nu<0?'Q indefinita, ma profilo sul vincolo strettamente convesso.':
    kappa>0?'Profilo sul vincolo strettamente convesso.':kappa===0?'Profilo lineare non costante: nessun minimo finito.':'Curvatura tangente negativa: costo illimitato inferiormente.'}</span></FormulaContext>
  </>}/>;
}
function QpStationarity({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[kappa,sigma,b]=state.numbers,choice=useLessonChoice(definition,'constraints');
 const d=useMemo(()=>equalityQpSystem(kappa,sigma,b,choice.value===1),[kappa,sigma,b,choice.value]);
 const points:CurvePoint[]=d.candidate?[{z:d.candidate,parameter:d.sStar!,label:d.status==='affine_family'?'Rappresentante della famiglia':'Punto KKT',color:C.direction,symbol:'diamond'}]:[];
 return <LessonFrame definition={definition} className={cls+' qp-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt67-system"/>}
  legend="Esempio aggiunto · verde: Az=b · viola: punto KKT, quando esiste. Stesso costo in 2D/3D."
  visual={<FeasibleCurveScene definition={definition} id="optimization-opt67-system" value={d.value} curve={d.curve} interval={[-1.5,1.5]}
   parameterLabel="s [1]" points={points}/>}
  controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Zero: singolare','Cambia q=σv','Trasla la retta']}
   extra={<LessonChoice label="Vincoli" options={['Singolo','Ridondanti']} state={choice}/>}/>}
  example={<><LessonEquation definition={definition} formulaId="opt67-reduced"/>
   <p className="lesson-caption">ν=−1, q=σ(1,−1)/√2. {choice.value===0?'A=(1,1).':'A ha righe (1,1),(2,2); termini noti (b,2b).'}</p>
   <LiveMetrics items={[{id:'opt67-system',label:'Sistema completo',value:d.systemStatus},{id:'opt67-point',label:'Punto KKT z',value:d.candidate?xy(d.candidate):'non esiste'},
    {id:'opt67-residual',label:'Residuo KKT',value:d.residual===null?'non definito':residual(d.residual)}]}/>
   <FormulaContext definition={definition} formulaId="opt67-block"><span data-testid="opt67-verdict">{d.candidate?
    choice.value===1?'λ₁+2λ₂='+fmt(d.lambda)+': moltiplicatori non unici. '+d.classification:
     'λ='+fmt(d.lambda)+'. '+d.classification:d.classification}</span></FormulaContext>
  </>}/>;
}
function QpCurvature({definition}:CompanionRendererProps){
 const state=useLessonParameters(definition),[kappa,nu,sigma,phi]=state.numbers;
 const d=useMemo(()=>equalityQp(kappa,nu,sigma,0),[kappa,nu,sigma]),y=useMemo(()=>nullDirection(kappa,nu,phi),[kappa,nu,phi]);
 const points:CurvePoint[]=d.candidate?[{z:d.candidate,parameter:d.sStar!,label:d.status==='affine_family'?'Rappresentante della famiglia':'Punto stazionario vincolato',color:C.direction,symbol:'diamond'}]:[];
 return <LessonFrame definition={definition} className={cls+' qp-four-controls'} explanation={null}
  formula={<FormulaDeck definition={definition} primaryId="opt68-corrected" warnings/>}
  legend="Esempio aggiunto · verde: z₁+z₂=0 · freccia 2D: y dall’origine, arancio se Ay=0."
  visual={<FeasibleCurveScene definition={definition} id="optimization-opt68-curvature" value={d.value} curve={d.curve} interval={[-1.5,1.5]}
   parameterLabel="s [1]" points={points} vectors={[{label:'y',v:y.direction,color:y.inTest?C.current:C.gradient}]}/>}
  controls={<LessonControls definition={definition} state={state} hints={['Curvatura su ker(A)','Curvatura fuori dal vincolo','Cambia il primo ordine','Ruota y, Q resta fissa']}/>}
  example={<><p className="lesson-caption">Q ha autovalori κ lungo v=(1,−1)/√2 e ν lungo n=(1,1)/√2; q=σv.</p>
   <LiveMetrics items={[{id:'opt68-Ay',label:'Derivata del vincolo Ay',value:fmt(y.Ay)},{id:'opt68-form',label:'Forma quadratica yᵀQy',value:fmt(y.form)},
    {id:'opt68-reduced',label:'Curvatura ridotta vᵀQv',value:fmt(y.reduced)}]}/>
   <FormulaContext definition={definition} formulaId="opt68-full-test"><span data-testid="opt68-verdict">{y.inTest?'Direzione nel test. ':'Direzione esclusa dal test. '}{d.sStar===null?'':d.status==='affine_family'?'Tutti gli s. ':'Stazionario s='+fmt(d.sStar)+'. '}{d.classification}</span></FormulaContext>
  </>}/>;
}
export function ConstrainedQpLesson(props:CompanionRendererProps){
 switch(props.definition.source_page){
  case 63:return <Complementarity {...props}/>;
  case 64:return <CircleLesson {...props}/>;
  case 65:return <CircleLesson {...props} second/>;
  case 66:return <QpSetup {...props}/>;
  case 67:return <QpStationarity {...props}/>;
  case 68:return <QpCurvature {...props}/>;
  default:throw new Error('Companion I non disponibile');
 }
}
