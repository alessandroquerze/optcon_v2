import { useMemo } from 'react';
import type { CompanionRendererProps } from '../registry';
import { CostBreakdown,StateInputTimeline,ComparisonTable } from '../../components/DataViews';
import { TrajectoryViewer,ProjectionLink } from '../../visualization';
import { FormulaContext,FormulaDeck,LessonControls,LessonEquation,LessonFrame,LiveMetrics,LocalWarnings,numberText,useLessonParameters } from '../LessonFrame';
import { CourseExplorer,interactiveDefinition } from '../courseSupport';
import { semanticAxes } from '../plotOptions';
import { stageCostData,reachabilityData,trackingData,trackingChoice,twoStepData,outputData,droneAccelerationData } from '../../math/courseOcp';

export function StageCostExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[a,b,g]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>stageCostData(a,b,g,axes),[a,b,g,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p20-source-math-0"/>}
    legend={<FormulaContext definition={definition} formulaId="p20-enrichment-0">Candidata fissa: stati (1,0.5,0.5), ingressi (−0.5,0). In 3D variano i pesi, non la traiettoria.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="stage-costs" grid={data.grid} points={[data.point]}
      twoD={<><StateInputTimeline states={['x₀=1','x₁=0.5','x₂=0.5']} inputs={['u₀=−0.5','u₁=0']}/><CostBreakdown model={data.model}/></>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Pesa i due stati di stadio','Pesa i comandi','Pesa soltanto lo stato finale']}/>}
    example={<><LessonEquation definition={definition} formulaId="p20-enrichment-0"/>
      <LiveMetrics items={[{id:'stage-total',label:'Costo della candidata',value:numberText(data.model.total)}]}/></>}/>;
}
export function EndpointExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[b]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>reachabilityData(b,axes),[b,axes]),r=data.result;
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p21-source-math-0" primaryLatex="r(x_0,x_T)=0,\quad g_t(x_t,u_t)\le0,\quad t=0,\ldots,T-1"/>}
    legend={<FormulaContext definition={definition} formulaId="p21-enrichment-0">Integratore, x₀=0, T=2, target 1, |uₜ|≤b. Il residuo 3D misura u₀+u₁−1.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="endpoints" grid={data.grid} points={[data.point]} curves={[data.intersection]}
      layers={[{grid:data.zero,label:'Endpoint raggiunto',opacity:.2}]}
      twoD={<svg className="reachable-diagram" viewBox="0 0 880 250" role="img" aria-label="Intervallo degli stati finali raggiungibili e target">
        <line x1="60" y1="130" x2="820" y2="130" stroke="#9eacb7"/>
        <line x1={440+170*r.min} x2={440+170*r.max} y1="130" y2="130" stroke="#176c98" strokeWidth="12"/>
        <circle cx="610" cy="130" r="9" fill="#a72d32"/><text x="610" y="85" textAnchor="middle">target 1</text>
        <text x={440+170*r.min} y="180" textAnchor="middle">{numberText(r.min,2)}</text><text x={440+170*r.max} y="215" textAnchor="middle">{numberText(r.max,2)}</text>
        <text x="440" y="40" textAnchor="middle">Raggiungibile in due passi · x₂ [u. stato]</text>
      </svg>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Allarga il box degli ingressi e il raggiungibile']}/>}
    example={<><p>Con b=0.4 si arriva al massimo a 0.8. Con b=0.5 i due ingressi 0.5 raggiungono esattamente il target.</p>
      <LiveMetrics items={[{id:'endpoint-feasible',label:'Vincoli compatibili?',value:r.feasible?'sì':'no'},
        {id:'endpoint-input',label:r.feasible?'Testimone u₀=u₁':'Sonda al bordo u₀=u₁',value:numberText(r.probe)},
        {id:'endpoint-residual',label:'Residuo della coppia mostrata',value:numberText(r.residual)}]}/></>}/>;
}
/** Same numerical model for p22 (fixed) and p25 (optimal); semantics stay explicit. */
export function TrackingExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[R,QT,a=1]=state.numbers,optimize=definition.source_page===25;
  const choice=useMemo(()=>trackingChoice(R,QT,a),[R,QT,a]),candidate=optimize?choice.u:.5;
  const axes=useMemo(()=>semanticAxes(definition),[definition]),data=useMemo(()=>trackingData(R,QT,a,candidate,axes),[R,QT,a,candidate,axes]);
  const id=optimize?'p25-enrichment-0':'p22-source-math-0';
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={id}
      primaryLatex={optimize?'u_0^\\star=\\frac{Q_Ta}{R+Q_T},\\qquad x_1^\\star=u_0^\\star':undefined}/>}
    legend={<>{optimize?
      <FormulaContext definition={definition} formulaId="p25-source-math-0">Ora si minimizza. Esempio: T=1, Q=0, x₀=x₀des=0, x₁=u₀, u₀des=0; target finale a.</FormulaContext>:
      <><FormulaContext definition={definition} formulaId="p22-enrichment-0">Candidata fissa u₀=x₁=0.5; x₀=x₀des=0, Q=0, T=1. Target finale 1, ingresso desiderato 0.</FormulaContext><LocalWarnings definition={definition}/></>}</>}
    visual={<CourseExplorer definition={definition} id={optimize?'tracking-optimum':'tracking-fixed'} height={optimize?280:240} grid={data.grid} curves={[data.line]} patches={[data.plane]} points={[data.point]}
      twoD={optimize?<TrajectoryViewer id="tracking-reduced" mode="xy" axes={[axes[0],{label:'ℓ',unit:'costo norm.'}]}
        series={[data.reduced,{id:'optimal',label:'Minimo lungo la dinamica',discrete:true,color:'#cf6b24',points:[{id:'optimal',x:candidate,y:data.model.total}]}]} height={250} fontSize={22}/>:
        <><StateInputTimeline states={['x₀=0','x₁=0.5']} inputs={['u₀=0.5']} /><CostBreakdown model={data.model}/></>}/>}
    controls={<LessonControls definition={definition} state={state} hints={optimize?['Pesa lo sforzo e aggiorna l’ottimo','Pesa l’arrivo e aggiorna l’ottimo','Sposta il target e aggiorna l’ottimo']:['Cambia il costo, non il comando','Cambia il costo, non lo stato']}/>}
    example={<><p className="lesson-caption">Stesso integratore di p22/p25. Il desiderato (x₁,u₀)=(1,0) non rispetta la dinamica. Solo le coppie x₁=u₀ sono traiettorie.</p>
      <LiveMetrics items={[{id:'tracking-command',label:optimize?'u₀★ = x₁★':'u₀ = x₁ fissato',value:numberText(candidate)},
        {id:'tracking-cost',label:optimize?'Costo minimo dell’esempio':'Costo della candidata',value:numberText(data.model.total)},
        {id:'tracking-error',label:'Scarto finale',value:numberText(candidate-a)}]}/>
      {optimize&&<p className="lesson-caption">Con R=Q_T=a=1: u₀★=0.5 e costo 0.25. Nessun vincolo di ampiezza è aggiunto dalla finestra grafica.</p>}</>}/>;
}
export function CompleteOcpExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[target,b]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>twoStepData(target,b,axes),[target,b,axes]),o=data.optimum;
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p23-source-math-0"
      primaryLatex="\begin{gathered}\min\ \sum_{t=0}^{T-1}\ell_t(x_t,u_t)+\ell_T(x_T)\\x_{t+1}=f_t(x_t,u_t),\quad r(x_0,x_T)=0,\quad g_t(x_t,u_t)\le0\end{gathered}"/>}
    legend={<FormulaContext definition={definition} formulaId="p23-enrichment-0">Esempio: T=2, integratore, r=col(x₀,x₂−target), |uₜ|≤b; costo ½(u₀²+u₁²). Il piano impone l’endpoint, il box gli ingressi.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="complete-ocp" grid={data.grid} points={data.points} curves={[data.line,data.box]} patches={[data.plane]}
      twoD={<TrajectoryViewer id="complete-ocp-2d" mode="xy" axes={axes.slice(0,2)} series={[data.line,data.box,{id:'optimal',label:'Ottimo se ammissibile',discrete:true,color:'#cf6b24',points:data.points}]} height={260} fontSize={22}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Sposta l’endpoint richiesto','Cambia il limite di ciascun comando']}/>}
    example={<><LiveMetrics items={[{id:'ocp-feasible',label:'Istanza ammissibile?',value:o.feasible?'sì':'no'},{id:'ocp-input',label:'u₀★ = u₁★',value:o.u===null?'non disponibile':numberText(o.u)},
      {id:'ocp-cost',label:'Costo ottimo',value:o.cost===null?'non disponibile':numberText(o.cost)}]}/>
      {o.feasible?<StateInputTimeline states={['x₀=0','x₁='+numberText(o.u!,2),'x₂='+numberText(target,2)]} inputs={['u₀='+numberText(o.u!,2),'u₁='+numberText(o.u!,2)]}/>:
        <p>Il target è fuori da [−2b,2b]: non esiste una sequenza ammissibile e non si assegna un costo ottimo.</p>}</>}/>;
}
export function OutputTrajectoryExplorer({definition:source}:CompanionRendererProps){
  const definition=useMemo(()=>interactiveDefinition(source),[source]),state=useLessonParameters(definition),[c]=state.numbers;
  const axes=useMemo(()=>semanticAxes(definition),[definition]),data=useMemo(()=>outputData(c),[c]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p24-source-math-2"
      primaryLatex="x_{t+1}=f_t(x_t,u_t),\quad y_t=h_t(x_t,u_t),\quad y_t\approx y_t^{\mathrm{des}}"/>}
    legend={<FormulaContext definition={definition} formulaId="p24-example">Esempio integratore, y=x, x₀=0, u₀=u₁=c∈[0,1]. Desiderato aggiunto (0,2,2); punti discreti. In 3D l’errore è una coordinata derivata.</FormulaContext>}
    visual={<ProjectionLink initialId="sample:1"><TrajectoryModes definition={definition} axes={axes} data={data}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Aggiorna entrambi i comandi e tutti gli scarti']}/>}
    example={<><ComparisonTable label="Campioni della stessa candidata" columns={['t','yₜ','yₜdes','errore eₜ']}
      rows={data.actual.map((y,t)=>({id:String(t),cells:[t,numberText(y,2),data.desired[t],numberText(data.error[t],2)]}))}/>
      <LiveMetrics items={[{id:'output-final',label:'Uscita finale',value:numberText(data.actual[2])},{id:'output-first-error',label:'Scarto al primo passo',value:numberText(data.error[1])}]}/></>}/>;
}
import { VisualizationSwitch } from '../../visualization/shared/FunctionExplorer';
function TrajectoryModes({definition,axes,data}:{definition:CompanionRendererProps['definition'];axes:ReturnType<typeof semanticAxes>;data:ReturnType<typeof outputData>}){
  return <VisualizationSwitch id="output-trajectory" policy={definition.visualization.visualizationMode}
    twoDView={<TrajectoryViewer id="output-trajectory-2d" mode="xy" series={[data.actualCurve,data.desiredCurve]} axes={axes.slice(0,2)} height={280} fontSize={22}/>}
    threeDView={<TrajectoryViewer id="output-trajectory-3d" mode="xyz" series={[data.actualCurve,data.desiredCurve]} axes={axes} height={280} fontSize={22} camera={definition.visualization.presentation.camera}/>}/>;
}
function DroneSnapshot({u1,u2,theta,ax,ay}:{u1:number;u2:number;theta:number;ax:number;ay:number}){
  const dx=90*Math.cos(theta),dy=-90*Math.sin(theta),normal=[-Math.sin(theta),-Math.cos(theta)];
  return <svg className="drone-snapshot" viewBox="0 0 880 260" role="img" aria-label="Drone planare con spinte e accelerazione istantanea">
    <defs><marker id="snapshot-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#176c98"/></marker></defs>
    <line x1="60" y1="225" x2="210" y2="225" stroke="#9eacb7"/><line x1="60" y1="225" x2="60" y2="50" stroke="#9eacb7"/>
    <text x="220" y="233">p_x</text><text x="40" y="35">p_y</text>
    <line x1={400-dx} y1={160-dy} x2={400+dx} y2={160+dy} stroke="#294658" strokeWidth="8"/>
    {[{u:u1,s:1,label:'u₁'},{u:u2,s:-1,label:'u₂'}].map(({u,s,label})=>{
      const x=400+s*dx,y=160+s*dy;
      return <g key={label}><circle cx={x} cy={y} r="10" fill="#fff" stroke="#294658"/>
        {u>0&&<line x1={x} y1={y} x2={x+normal[0]*u*8} y2={y+normal[1]*u*8} stroke="#176c98" strokeWidth="3" markerEnd="url(#snapshot-arrow)"/>}
        <text x={x+s*25} y={y+35} textAnchor="middle">{label}</text></g>;
    })}
    <text x="620" y="45">a [m/s²]</text><line x1="690" y1="155" x2={690+ax*7} y2={155-ay*7} stroke="#176c98" strokeWidth="3" markerEnd={Math.hypot(ax,ay)>1e-9?'url(#snapshot-arrow)':undefined}/>
    <circle cx="690" cy="155" r="4" fill="#cf6b24"/><text x="420" y="250">Scale: spinte 8 px/N; a 7 px/(m/s²)</text>
  </svg>;
}
export function DroneForceExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[u1,u2,theta]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>droneAccelerationData(u1,u2,theta,axes),[u1,u2,theta,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p26-source-math-1"
      primaryLatex="\begin{gathered}\ddot p_x=-\frac{u_1+u_2}{M}\sin\theta,\quad\ddot p_y=\frac{u_1+u_2}{M}\cos\theta-g\\\ddot\theta=\frac L{2J}(u_1-u_2)\end{gathered}"/>}
    legend={<><FormulaContext definition={definition} formulaId="p26-source-math-3">Uscita: (p_x,p_y). Il terzo asse del grafico è accelerazione verticale, non posizione fuori piano.</FormulaContext><LocalWarnings definition={definition}/></>}
    visual={<CourseExplorer definition={definition} id="drone-forces" grid={data.grid} points={[data.point]}
      layers={[{grid:data.zero,label:'Accelerazione verticale nulla',opacity:.15}]}
      twoD={<DroneSnapshot u1={u1} u2={u2} theta={theta} ax={data.result.x} ay={data.result.y}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Spinta del rotore destro','Spinta del rotore sinistro','Inclina la spinta totale']}/>}
    example={<><p className="lesson-caption">Parametri aggiunti: M=1 kg, g=9.81 m/s², L=0.4 m, J=0.02 kg m².</p>
      <LiveMetrics items={[{id:'drone-ax',label:'p̈_x [m/s²]',value:numberText(data.result.x)},{id:'drone-ay',label:'p̈_y [m/s²]',value:numberText(data.result.y)},{id:'drone-angular',label:'θ̈ [rad/s²]',value:numberText(data.result.angular)}]}/>
      <p className="lesson-caption">È un’istantanea. Accelerazioni nulle implicano hover soltanto con velocità nulle; non provano stabilità.</p></>}/>;
}
