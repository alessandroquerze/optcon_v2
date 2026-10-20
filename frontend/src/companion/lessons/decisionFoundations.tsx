import { useMemo } from 'react';
import type { CompanionRendererProps } from '../registry';
import { ComparisonTable,ModelDiagram,StateInputTimeline } from '../../components/DataViews';
import { InlineMath } from '../../components/CompanionPage';
import { TrajectoryViewer } from '../../visualization';
import { FormulaContext,FormulaDeck,LessonControls,LessonEquation,LessonFrame,LiveMetrics,numberText,useLessonParameters } from '../LessonFrame';
import { CourseExplorer,interactiveDefinition } from '../courseSupport';
import { semanticAxes } from '../plotOptions';
import { finiteHorizon,equilibriumData,decisionData,distanceCurve,scalarDistance,constrainedDistanceFamily,constrainedDistanceData,dynamicsResidualData } from '../../math/courseOptimization';

export function HorizonInspector({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[T,n,m]=state.numbers,data=useMemo(()=>finiteHorizon(T,n,m),[T,n,m]);
  return <LessonFrame definition={definition} explanation={null}
    takeaway={<>Ultimo stato <InlineMath latex="x_T"/>, ultimo ingresso <InlineMath latex="u_{T-1}"/>.</>}
    formula={<FormulaDeck definition={definition} primaryId="p10-source-math-2"/>}
    visual={<><div className="horizon-inspector"><StateInputTimeline states={data.states.map(k=>'x'+k+(k===0?' dato':''))}
      inputs={data.inputs.map(k=>'u'+k)}/></div>
      <LessonEquation definition={definition} formulaId="p10-source-math-1"/>
      <LiveMetrics items={[{id:'horizon-nodes',label:'Nodi della timeline',value:data.states.length},{id:'horizon-states',label:'Componenti di 𝐱 = nT',value:data.stateDimension},
        {id:'horizon-inputs',label:'Componenti di 𝐮 = mT',value:data.inputDimension}]}/></>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia il numero di transizioni','Cambia la dimensione degli stati','Cambia la dimensione dei comandi']}/>}
    example={<><LessonEquation definition={definition} formulaId="p10-example"/>
      <p className="lesson-caption">Esempio fisso: n=m=1, T=3, x₀=1 → x₁=1.5 → x₂=1.25 → x₃=1.25. I controlli sopra agiscono solo sull’ispettore.</p></>}/>;
}
export function EquilibriumExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[x,u]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>equilibriumData(x,u,axes),[x,u,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p11-source-math-2"/>}
    legend={<FormulaContext definition={definition} formulaId="p11-enrichment-0">Esempio aggiunto f(x,u)=0.5x+u. Il terzo asse misura il residuo rₑ=xₑ−f(xₑ,uₑ).</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="equilibrium" grid={data.grid} points={[data.candidate]}
      layers={[{grid:data.zero,label:'rₑ=0',opacity:.2}]} curves={[data.line]}
      twoD={<TrajectoryViewer id="equilibrium-2d" mode="xy" axes={axes.slice(0,2)} series={[data.line,{id:'point',label:'Candidato',discrete:true,color:'#cf6b24',points:[data.candidate]}]} height={280} fontSize={22}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Muove lo stato candidato','Cambia la previsione del modello']}/>}
    example={<><LiveMetrics items={[{id:'equilibrium-prediction',label:'f(xₑ,uₑ)',value:numberText(data.check.prediction)},
      {id:'equilibrium-residual',label:'Residuo rₑ',value:numberText(data.check.residual)},
      {id:'equilibrium-valid',label:'Coppia di equilibrio?',value:data.check.equilibrium?'sì':'no'}]}/>
      <ComparisonTable label="Confronto fisso: x₀=0, u=1" columns={['Sequenza','Verifica']} rows={[
        {id:'trajectory',cells:['0 → 1 → 1.5 → 1.75','Traiettoria non costante']},{id:'invalid',cells:['0 → 2 al primo passo','Incompatibile: il modello prevede 1']},
      ]}/></>}/>;
}
export function ControlRecap({definition}:CompanionRendererProps){
  return <LessonFrame definition={definition} visual={<><div className="ingredient-grid">
    <section><h2>Strumenti</h2><p>Traiettorie · equilibri · linearizzazione lungo una nominale.</p></section>
    <section><h2>Task</h2><p>Stabilizzazione e tracking richiedono obiettivi distinti.</p></section>
    <section><h2>Tipicamente time-invariant</h2><p>Stabilizzazione di un equilibrio.</p></section>
    <section><h2>Tipicamente time-varying</h2><p>Tracking di un riferimento nel tempo.</p></section>
    </div><p className="lesson-caption">“Tipicamente” indica un’associazione frequente, non un’esclusione degli altri casi.</p>
    <ModelDiagram width={880} height={150} nodeWidth={220} fontSize={22} label="Dal modello alla scelta ottima"
      nodes={[{id:'model',label:'Modello e task',x:130,y:75},{id:'limits',label:'Indice e vincoli',x:440,y:75},{id:'choice',label:'Confronto delle scelte',x:750,y:75}]}
      edges={[{from:'model',to:'limits'},{from:'limits',to:'choice'}]}/></>}
    example={<><p>Supponiamo già verificate due leggi stabilizzanti, con sforzi diversi. La sola stabilizzazione non decide quale preferire: servono un indice e limiti espliciti.</p>
    <p className="lesson-caption">Confronto concettuale aggiunto; nessuna legge di controllo o prova di stabilità assegnata.</p></>}/>;
}
export function DecisionSetExplorer({definition:source}:CompanionRendererProps){
  const definition=useMemo(()=>interactiveDefinition(source),[source]),state=useLessonParameters(definition),[z1,z2]=state.numbers;
  const axes=useMemo(()=>semanticAxes(definition),[definition]),data=useMemo(()=>decisionData(z1,z2,axes),[z1,z2,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p14-dimension" warnings
      primaryLatex="z\in\mathbb R^d,\quad\ell:\mathbb R^d\to\mathbb R,\quad Z=\{z:h(z)=0,\ g(z)\le0\}"/>}
    legend="Verde: semiretta ammissibile Z, non limitata. La figura ne mostra un ritaglio; l’altezza 3D è il costo."
    visual={<CourseExplorer definition={definition} id="decision" grid={data.grid} points={[data.point]} curves={[data.feasible]} patches={[data.plane]}
      twoD={<TrajectoryViewer id="decision-2d" series={[data.feasible,{id:'candidate',label:'Candidato corrente',discrete:true,color:'#cf6b24',points:[data.point]}]}
        axes={axes.slice(0,2)} mode="xy" height={280} fontSize={22}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia costo, h e g','Cambia costo e h; g resta fisso']}/>}
    example={<><LessonEquation definition={definition} formulaId="p14-example"/>
      <LiveMetrics items={[{id:'decision-cost',label:'Costo ℓ',value:numberText(data.check.cost,2)},{id:'decision-residuals',label:'Residui (h,g)',value:numberText(data.check.h,2)+', '+numberText(data.check.g,2)},
        {id:'decision-feasible',label:'Candidato ammesso?',value:data.check.feasible?'sì':'no'}]}/></>}/>;
}
export function ScalarCostExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[z,reference]=state.numbers,curve=useMemo(()=>distanceCurve(reference),[reference]);
  const cost=scalarDistance(z,reference),point=useMemo(()=>({id:'candidate',x:z,y:cost}),[z,cost]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p15-source-math-1"/>}
    visual={<TrajectoryViewer id="scalar-cost-2d" mode="xy" axes={[{label:'z',unit:'1'},{label:'ℓ(z)',unit:'costo norm.'}]}
      series={[curve,{id:'candidate',label:'Decisione corrente',discrete:true,color:'#cf6b24',points:[point]}]} height={340} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Muove il punto sulla parabola','Trasla l’intera funzione costo']}/>}
    example={<><p className="lesson-caption">Confronti con il riferimento corrente: due scarti opposti hanno lo stesso costo. All’avvio z̄=2.</p>
      <LiveMetrics items={[{id:'scalar-cost-current',label:'ℓ(z) corrente',value:numberText(cost)},{id:'scalar-cost-zero',label:'ℓ(0)',value:numberText(scalarDistance(0,reference))},
        {id:'scalar-cost-three',label:'ℓ(3)',value:numberText(scalarDistance(3,reference))}]}/></>}/>;
}
export function ConstrainedMinimumExplorer({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[reference,bound]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const grid=useMemo(()=>constrainedDistanceFamily(axes),[axes]),data=useMemo(()=>constrainedDistanceData(reference,bound),[reference,bound]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p18-source-math-2"
      primaryLatex="\min_{z\in Z}\ell(z),\qquad Z=\{z:h(z)=0,\ g(z)\le0\}"/>}
    legend={<FormulaContext definition={definition} formulaId="p18-enrichment-0">Esempio aggiunto: ℓ=½(z−z̄)², z≤b. Blu: scelte ammesse; grigio: escluse. In 3D z̄ è un parametro.</FormulaContext>}
    visual={<CourseExplorer definition={definition} id="constrained-minimum" grid={grid} points={[data.point]} curves={[data.section,data.minima]} patches={[data.patch]}
      twoD={<TrajectoryViewer id="constrained-minimum-2d" mode="xy" axes={[axes[0],{label:'ℓ',unit:'costo norm.'}]} height={280} fontSize={22}
        series={[data.excluded,data.feasible,data.boundLine,{id:'min',label:'Minimo ammesso',discrete:true,color:'#cf6b24',points:[{...data.point,y:data.result.cost}]}]}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Sceglie una sezione e il suo minimo','Sposta il limite sulla decisione']}/>}
    example={<><LessonEquation definition={definition} formulaId="p18-enrichment-0"
      latex="z^\star=\min(\bar z,b)"/>
      <LiveMetrics items={[{id:'constrained-minimizer',label:'z★',value:numberText(data.result.decision)},{id:'constrained-cost',label:'Costo al minimo',value:numberText(data.result.cost)},
        {id:'constrained-free',label:'Minimo libero ammesso?',value:data.result.freeFeasible?'sì':'no'}]}/></>}/>;
}
export function DynamicsEqualities({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[x2]=state.numbers,axes=useMemo(()=>semanticAxes(definition),[definition]);
  const data=useMemo(()=>dynamicsResidualData(x2,axes),[x2,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p19-enrichment-0" warnings
      primaryLatex="\begin{gathered}f_0(x_0,u_0)-x_1=0\\f_1(x_1,u_1)-x_2=0\end{gathered}"/>}
    legend={<FormulaContext definition={definition} formulaId="p19-example">Esempio integratore: x₀=0, u₀=1, u₁=−0.5. L’altezza è il secondo residuo; il piano x₁=1 impone il primo.</FormulaContext>}
    visual={<><CourseExplorer definition={definition} id="dynamics-constraints" grid={data.grid} points={[data.point]} patches={[data.plane]}
      layers={[{grid:data.zero,label:'Secondo residuo zero',opacity:.2}]}
      twoD={<TrajectoryViewer id="dynamics-constraints-2d" mode="xy" series={[data.curve,{id:'current',label:'Candidato',discrete:true,color:'#cf6b24',points:[{id:'current',x:x2,y:data.check.second}]}]}
        axes={[axes[1],axes[2]]} height={260} fontSize={22}/>}/>
      <StateInputTimeline states={['x₀=0','x₁=1','x₂='+numberText(x2,2)]} inputs={['u₀=1','u₁=−0.5']}/></>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia solo il secondo residuo']}/>}
    example={<><LiveMetrics items={[{id:'dynamics-first',label:'Primo residuo',value:numberText(data.check.first)},{id:'dynamics-second',label:'Secondo residuo',value:numberText(data.check.second)},
      {id:'dynamics-valid',label:'È una traiettoria?',value:data.check.valid?'sì':'no'}]}/>
      <p className="lesson-caption">x₂=0.8 produce −0.3 al secondo residuo. Un costo basso non può rendere valida una transizione incompatibile.</p></>}/>;
}
