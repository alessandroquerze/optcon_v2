import { useMemo } from 'react';
import type { CompanionRendererProps } from '../registry';
import { CostBreakdown,ComparisonTable } from '../../components/DataViews';
import { TrajectoryViewer,ProjectionLink,VisualizationSwitch } from '../../visualization';
import { AlignedTimeSeries } from '../../visualization/shared/AlignedTimeSeries';
import { FormulaContext,FormulaDeck,LessonControls,LessonFrame,LiveMetrics,numberText,useLessonParameters } from '../LessonFrame';
import { CourseExplorer,interactiveDefinition } from '../courseSupport';
import { semanticAxes } from '../plotOptions';
import { droneTaskData,inspectDroneSample,droneCostData,continuousFamily,piecewiseFamily,pendulumAccelerationData,desiredPendulumData,fixedPendulumData } from '../../math/courseContinuous';

export function DroneRequirementsExplorer({definition:source}:CompanionRendererProps){
  const definition=useMemo(()=>interactiveDefinition(source),[source]),state=useLessonParameters(definition),[k]=state.numbers;
  const data=useMemo(droneTaskData,[]),sample=useMemo(()=>inspectDroneSample(data,k),[data,k]),axes=useMemo(()=>semanticAxes(definition),[definition]);
  const rows=useMemo(()=>[{label:'p_y [m]',curves:data.altitude},{label:'v_y [m/s]',curves:data.velocity}],[data]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p28-source-math-0"
      primaryLatex="(p_{x,t}^{\mathrm{des}},p_{y,t}^{\mathrm{des}}),\quad(v_{x,t}^{\mathrm{des}},v_{y,t}^{\mathrm{des}}),\quad t=1,\ldots,T"/>}
    legend={<FormulaContext definition={definition} formulaId="p28-example">Esempio: blu Euler (δ=0.1 s), grigio continuo; assi (τ,p_y,v_y).</FormulaContext>}
    visual={<ProjectionLink selectedId={sample.id}><VisualizationSwitch id="drone-requirements" policy={definition.visualization.visualizationMode}
      twoDView={<AlignedTimeSeries id="drone-requirements-2d" rows={rows} height={280} timeLabel="τ"/>}
      threeDView={<TrajectoryViewer id="drone-requirements-3d" mode="xyz" series={data.series} axes={axes} height={280} fontSize={22} camera={definition.visualization.presentation.camera}/>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Ispeziona un campione senza cambiare la candidata']}/>}
    example={<><LiveMetrics items={[{id:'requirement-time',label:'τ [s]',value:numberText(sample.time,2)},
      {id:'requirement-position-error',label:'Scarto p_y [m]',value:numberText(sample.errorPosition)},{id:'requirement-velocity-error',label:'Scarto v_y [m/s]',value:numberText(sample.errorVelocity)}]}/>
      <ComparisonTable label="Requisiti → variabili del modello" columns={['Requisito','Componenti']} rows={[
        {id:'position',cells:['Posizione vicina al desiderato','x₁=p_x, x₃=p_y']},{id:'velocity',cells:['Velocità vicina al desiderato','x₂=v_x, x₄=v_y']},
        {id:'angular',cells:['Angolo e velocità angolare contenuti','x₅=θ, x₆=ω']},{id:'input',cells:['Ingressi contenuti','u₁, u₂']}]}/>
      <p className="lesson-caption">Esempio p27: u₁=u₂=6 N, p_x=v_x=θ=ω=0. Soglie e pesi non assegnati dalla slide.</p></>}
    takeaway="Requisiti distinti richiedono verifiche distinte."/>;
}
export function DroneStageExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[q1,q5,r1,r2]=state.numbers,axes=useMemo(()=>{
    const a=semanticAxes(definition);return [{...a[0],label:'e_px',unit:'errore norm.'},a[1],a[2]] as const;
  },[definition]);
  const data=useMemo(()=>droneCostData(q1,q5,r1,r2,axes),[q1,q5,r1,r2,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p29-example"/>}
    legend={<FormulaContext definition={definition} formulaId="p29-source-math-1">e_px=x₁−p_xdes. I primi quattro termini pesano errori; θ, ω e spinte sono pesati rispetto a zero. Una penalità alta non è un vincolo rigido.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="drone-stage" grid={data.grid} points={[data.point]} twoD={<CostBreakdown model={data.model}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Pesa errore di posizione','Pesa l’angolo rispetto a zero','Pesa u₁ rispetto a zero','Pesa u₂ rispetto a zero']}/>}
    example={<><LiveMetrics items={[{id:'drone-stage-cost',label:'Costo del solo stadio',value:numberText(data.model.total)}]}/>
      <p className="lesson-caption">Il terminale è distinto nella fonte; qui si valuta il solo stadio. Snapshot non certificato come traiettoria ammissibile o ottima.</p></>}/>;
}
export function ContinuousFunctionalExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[c,T]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>continuousFamily(c,T,axes),[c,T,axes]);
  const rows=useMemo(()=>[{label:'x(t) [u. stato]',curves:[data.state]},{label:'Densità di costo [costo/s]',curves:[data.density]}],[data]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p31-source-math-2"
      primaryLatex="\ell(x(\cdot),u(\cdot))=\int_0^T\ell_\tau(x(\tau),u(\tau))\,d\tau+\ell_T(x(T))"/>}
    legend={<FormulaContext definition={definition} formulaId="p31-enrichment-0">Famiglia aggiunta: ẋ=u, x(0)=0, u=c. L’area sotto la densità è l’integrale; il terminale si aggiunge separatamente.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="continuous-functional" grid={data.grid} curves={[data.line]} points={[data.point]}
      twoD={<AlignedTimeSeries id="continuous-functional-2d" rows={rows} height={280} timeLabel="t"/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia la funzione scelta','Cambia la durata, non la dimensione di 𝓕']}/>}
    example={<><CostBreakdown model={data.model}/><LiveMetrics items={[{id:'functional-cost',label:'Valore del funzionale',value:numberText(data.model.total)}]}/>
      <p className="lesson-caption">𝓣 raccoglie coppie dinamicamente coerenti. La fonte distingue dinamica su [0,T] e path constraints su [0,T).</p></>}/>;
}
export function FunctionSpaceExplorer({definition:source}:CompanionRendererProps){
  const definition=useMemo(()=>interactiveDefinition(source),[source]),state=useLessonParameters(definition),[c1,c2]=state.numbers;
  const axes=useMemo(()=>semanticAxes(definition),[definition]),data=useMemo(()=>piecewiseFamily(c1,c2,axes),[c1,c2,axes]);
  const rows=useMemo(()=>[{label:'x(t) [u. stato]',curves:[data.state]},{label:'u(t) [u. stato/s]',curves:data.input}],[data]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p32-source-math-0"/>}
    legend={<FormulaContext definition={definition} formulaId="p32-example">Esempio aggiunto: K=2 tratti, ẋ=u, x(0)=0. La superficie varia c₂ tenendo fisso c₁. Nessun segmento collega i due livelli dell’ingresso.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="function-space" grid={data.grid} curves={[data.curve]} points={[data.point]}
      twoD={<AlignedTimeSeries id="function-space-2d" rows={rows} height={280} timeLabel="t"/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia il primo tratto e tutta la famiglia','Cambia la sezione e il secondo tratto']}/>}
    example={<><LiveMetrics items={[{id:'functional-coefficients',label:'Coefficienti dell’esempio',value:2},
      {id:'functional-endpoint',label:'x(2) = c₁+c₂',value:numberText(data.endpoint)}]}/>
      <p>Due parametri descrivono una sottofamiglia. La formulazione originale sceglie funzioni anche su tempo finito. Trascurare i vincoli terminali non elimina il costo terminale.</p>
      <p className="lesson-caption">Lo stato è continuo; con un cambio d’ingresso la dinamica dell’esempio vale quasi ovunque, senza derivata classica al cambio.</p></>}/>;
}
export function PendulumDynamicsExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[angle,torque]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>pendulumAccelerationData(angle,torque,axes),[angle,torque,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p33-source-math-1"/>}
    legend={<FormulaContext definition={definition} formulaId="p33-enrichment-0">Esempio: l≡ℓ=1 m, m≡M=1 kg, g=9.81 m/s². Istantanea con velocità zero; uscita y=θ. Asse verticale 3D: accelerazione, non un terzo stato.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="pendulum-dynamics" grid={data.grid} points={[data.point]}
      layers={[{grid:data.zero,label:'Accelerazione nulla',opacity:.15}]}
      twoD={<TrajectoryViewer id="pendulum-acceleration-2d" mode="xy" axes={[axes[0],axes[2]]} height={280} fontSize={22}
        series={[data.section,{id:'instant',label:'Angolo corrente',color:'#cf6b24',discrete:true,points:[{id:'instant',x:angle,y:data.snapshot.acceleration}]}]}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Muove il punto e cambia il termine gravitazionale','Sposta la sezione di accelerazione']}/>}
    example={<><LiveMetrics items={[{id:'pendulum-acceleration',label:'ẋ₂ [rad/s²]',value:numberText(data.snapshot.acceleration)},
      {id:'pendulum-support',label:'Coppia che annulla ẋ₂ [N m]',value:numberText(data.snapshot.support)}]}/>
      <p className="lesson-caption">Con θ=π/6 e u=0: ẋ₂=−4.905. Con u=4.905: ẋ₂=0. Per un equilibrio serve anche x₂=0; nessuna stabilità è dedotta.</p></>}/>;
}
export function PendulumReferenceExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[first,second,T]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>desiredPendulumData(first,second,T),[first,second,T]);
  const rows=useMemo(()=>[{label:'x₁des [rad]',curves:data.segments},{label:'udes [N m]',curves:data.torques}],[data]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p35-source-math-0"
      primaryLatex="\begin{gathered}x_1^{\mathrm{des}}(t)=\begin{cases}\theta_e^1&0\le t<T/2\\\theta_e^2&T/2\le t\le T\end{cases}\\x_2^{\mathrm{des}}(t)=0\end{gathered}"/>}
    legend={<FormulaContext definition={definition} formulaId="p35-support">RIFERIMENTO: due livelli separati di angolo e coppia, non un moto simulato. I valori di coppia usano la condizione corretta di p34. Il cambio appartiene al secondo ramo.</FormulaContext>}
    visual={<ProjectionLink initialId="reference:1:0"><VisualizationSwitch id="pendulum-reference" policy={definition.visualization.visualizationMode}
      twoDView={<AlignedTimeSeries id="pendulum-reference-2d" rows={rows} height={280} timeLabel="t"/>}
      threeDView={<TrajectoryViewer id="pendulum-reference-3d" mode="xyz" series={data.segments} axes={axes} height={280} fontSize={22} label="Riferimento di angolo e coppia" camera={definition.visualization.presentation.camera}/>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia il primo livello e la coppia','Cambia il secondo livello e la coppia','Sposta il cambio a T/2']}/>}
    example={<><LiveMetrics items={[{id:'reference-switch',label:'Cambio T/2 [s]',value:numberText(T/2,2)},
      {id:'reference-switch-angle',label:'Angolo a T/2 [rad]',value:numberText(data.atSwitch.angle)},{id:'reference-switch-torque',label:'Coppia a T/2 [N m]',value:numberText(data.atSwitch.torque)}]}/>
      <p><output data-testid="reference-valid">{data.constant?'equilibrio costante':'salto non realizzabile'}</output>: {data.constant?'i due livelli coincidono.':'l’angolo desiderato salta mentre la velocità desiderata è zero. Il sistema deve compiere un trasferimento reale.'}</p></>}
    takeaway="Il riferimento esprime il task; la dinamica determina il moto."/>;
}
export function PendulumCostExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[q1,r,qT1]=state.numbers,axes=useMemo(()=>{
    const a=semanticAxes(definition);return [a[0],{...a[1],label:'e_θ'},{...a[2],unit:'costo norm.'}] as const;
  },[definition]);
  const data=useMemo(()=>fixedPendulumData(q1,r,qT1,axes),[q1,r,qT1,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p36-source-math-0"
      primaryLatex="\begin{aligned}\min\ &\int_0^T\bigl[q_1(x_1(\tau)-x_1^{\mathrm{des}}(\tau))^2+q_2x_2(\tau)^2\\&+r(u(\tau)-u^{\mathrm{des}}(\tau))^2\bigr]d\tau\\&+q_{T1}(x_1(T)-x_1^{\mathrm{des}}(T))^2+q_{T2}x_2(T)^2\end{aligned}"/>}
    legend={<FormulaContext definition={definition} formulaId="p36-enrichment-0">Candidata fattibile, non ottima: x=(0,0), u=0, T=2. Desiderato 0→π/6 a t=1, coppia 0→4.905. e_θ=x₁−x₁des; mesh interrotta al salto.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="pendulum-cost" grid={data.grid} curves={data.curves} points={[data.point]}
      twoD={<CostBreakdown model={data.model}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Pesa l’errore angolare corrente','Pesa lo scarto dall’ingresso desiderato','Cambia solo il termine finale']}/>}
    example={<><LiveMetrics items={[{id:'pendulum-running',label:'Integrale corrente',value:numberText(data.model.parts[0].value+data.model.parts[1].value)},
        {id:'pendulum-terminal',label:'Termine terminale',value:numberText(data.model.parts[2].value)},{id:'pendulum-candidate-total',label:'Costo candidata, senza ½',value:numberText(data.model.total)}]}/>
      <p className="lesson-caption">l≡ℓ=m=1, g=9.81; x⁰=(0,0). q₂=q_T2=1, contributi nulli. Nessun endpoint hard.</p></>}
    takeaway="Costo finito non implica arrivo esatto o ottimalità."/>;
}
