import { useMemo } from 'react';
import type { CompanionRendererProps } from '../registry';
import { ComparisonTable, ModelDiagram, StateInputTimeline } from '../../components/DataViews';
import { TrajectoryViewer, VisualizationSwitch } from '../../visualization';
import { FormulaContext, FormulaDeck, LessonControls, LessonFrame, LiveMetrics, numberText, useLessonParameters } from '../LessonFrame';
import { CourseExplorer, interactiveDefinition } from '../courseSupport';
import { semanticAxes } from '../plotOptions';
import { discreteMapData, obstaclePaths } from '../../math/courseFoundations';

const domains:Record<number,{kind:string;criteria:string;geometry:string;input:string;internal:string;comparison:string[][]}>={
  3:{kind:'Velivolo',criteria:'Tracking di percorso/velocità · tempo · consumo · comfort',geometry:'Ostacoli · assetto · stallo',input:'Thrust e flaps',internal:'Velocità lineari/angolari · limiti aerodinamici',
    comparison:[['A','Più rapida','Viola un limite di stallo: esclusa'],['B','Più lenta','Rispetta i limiti: confrontabile']]},
  4:{kind:'Robot',criteria:'Tracking dell’end-effector · tempo',geometry:'Workspace · ostacoli · ingombro del payload',input:'Saturazione dei motori',internal:'Giunti · velocità',
    comparison:[['Punto','Passa accanto all’ostacolo','Il solo end-effector non basta'],['Carico','Ha un ingombro','Può urtare: moto escluso']]},
  5:{kind:'Veicolo autonomo',criteria:'Corsia/velocità · tempo · comfort · consumo',geometry:'Corsia · ostacoli',input:'Throttle · steering wheel',internal:'Pneumatici · carico normale · velocità',
    comparison:[['A','20 s, frenate brusche','Preferibile per il solo tempo'],['B','23 s, variazioni dolci','Per il comfort serve un criterio']]},
  6:{kind:'Drone',criteria:'Percorso 3D/velocità · tempo · energia · exploration cost',geometry:'Edifici · ostacoli · assetto',input:'Thrust',internal:'Velocità lineari e angolari',comparison:[]},
  7:{kind:'Sistema spaziale',criteria:'Orbita/velocità · energia · tempo',geometry:'Orbita · orientamento Sole/Terra',input:'Thrust',internal:'Velocità lineari e angolari',
    comparison:[['A','Consuma meno','Viola l’orientamento richiesto'],['B','Rispetta l’orientamento','Ammissibile: poi si confronta il costo']]},
};
function IngredientMatrix({page}:{page:number}) {
  const d=domains[page];
  return <div className="ingredient-grid" aria-label={'Ingredienti: '+d.kind}>
    {[['Criteri · che cosa preferire',d.criteria],['Geometria · dove può passare',d.geometry],['Ingressi · che cosa comandare',d.input],['Limiti interni · che cosa rispettare',d.internal]].map(([title,text])=>
      <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
  </div>;
}
export function CourseOrientation({definition}:CompanionRendererProps) {
  return <LessonFrame definition={definition} explanation="Prima descriviamo come evolve un sistema; poi confrontiamo le scelte ammesse mediante un criterio."
    visual={<div className="course-orientation">
      <p className="course-author">Prof. Giuseppe Notarstefano</p><p>Optimal Control and Reinforcement Learning</p>
      <ol>{[['Motivazione','Che cosa significa controllare bene?'],['Modelli','Stato, ingresso, uscita e traiettoria'],['Ottimizzazione','Decisione, costo e vincoli'],['Applicazioni','Drone e pendolo']].map(([a,b],i)=>
        <li key={a}><strong>{'0'+(i+1)}</strong><div><h2>{a}</h2><p>{b}</p></div></li>)}</ol>
      <p className="lesson-caption">Università di Bologna · uso interno del corso. Contributi: L. Sforni, S. Baroncini, M. Falotico.</p>
      <p className="lesson-caption">Mappa di orientamento aggiunta; il documento originale rimane a sinistra.</p>
    </div>} example={null}/>;
}
export function DomainMotivation({definition}:CompanionRendererProps) {
  const d=domains[definition.source_page];
  return <LessonFrame definition={definition} visual={<><IngredientMatrix page={definition.source_page}/>
    {definition.source_page===4&&<svg viewBox="0 0 880 150" className="study-diagram" role="img" aria-label="Il punto passa, il carico urta">
      <rect x="420" y="20" width="60" height="55" fill="#afbec7"/><path d="M80 100 H800" stroke="#176c98" strokeWidth="3" strokeDasharray="6 5"/>
      <rect x="385" y="50" width="130" height="90" fill="#a72d3220" stroke="#a72d32"/><circle cx="450" cy="100" r="8" fill="#176c98"/>
      <text x="80" y="40">Percorso del punto</text><text x="560" y="60">Il carico urta l’ostacolo</text></svg>}
    {definition.source_page===7&&<ModelDiagram width={880} height={130} nodeWidth={210} fontSize={22}
      label="Prima orientamento, poi confronto delle manovre"
      nodes={[{id:'a',label:'Manovre candidate',x:130,y:65},{id:'b',label:'Orientamento',x:440,y:65},{id:'c',label:'Confronto dei costi',x:750,y:65}]}
      edges={[{from:'a',to:'b'},{from:'b',to:'c'}]}/>}
    </>} example={<><ComparisonTable label="Confronto concettuale aggiunto" columns={['Caso','Comportamento','Come valutarlo']}
      rows={d.comparison.map((cells,i)=>({id:String(i),cells}))}/>
      <p className="lesson-caption">{definition.source_page===5?'Tempi ipotetici: i colori della figura originale non assegnano valori numerici di accelerazione.':'Nessun modello quantitativo o algoritmo viene attribuito alla fonte.'}</p></>}/>;
}
export function AerialGeometry({definition:source}:CompanionRendererProps) {
  const definition=useMemo(()=>interactiveDefinition(source),[source]),state=useLessonParameters(definition),[h]=state.numbers;
  const data=useMemo(()=>obstaclePaths(h),[h]),axes=useMemo(()=>semanticAxes(definition),[definition]);
  return <LessonFrame definition={definition} explanation="La lunghezza conta solo dopo aver escluso i percorsi che attraversano un ostacolo."
    visual={<><IngredientMatrix page={6}/><TrajectoryViewer id="aerial-geometry-3d" series={data.series} patches={data.patches}
      axes={axes} mode="xyz" height={300} fontSize={22} camera={definition.visualization.presentation.camera} label="Due percorsi geometrici e un edificio"/>
      <p className="lesson-caption">Rosso: A diretto · blu: B deviazione. Coordinate spaziali in metri; nessun moto simulato.</p></>}
    controls={<LessonControls definition={definition} state={state} hints={['Alza entrambi i percorsi; edificio fisso']}/>}
    example={<><FormulaDeck definition={definition} primaryId="p06-geometry"/>
      <LiveMetrics items={[{id:'aerial-direct',label:'A interseca l’edificio?',value:data.directIntersects?'sì':'no'},
        {id:'aerial-detour',label:'B interseca l’edificio?',value:'no'},
        {id:'aerial-clearance',label:'Quota meno tetto [m]',value:numberText(data.roofClearance,2)}]}/></>}/>;
}
export function DiscreteTransition({definition}:CompanionRendererProps) {
  const state=useLessonParameters(definition),[a,u,x0]=state.numbers;
  const axes=useMemo(()=>semanticAxes(definition),[definition]),data=useMemo(()=>discreteMapData(a,u,x0,axes),[a,u,x0,axes]);
  return <LessonFrame definition={definition} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p09-source-math-1"/>}
    legend={<FormulaContext definition={definition} formulaId="p09-enrichment-0">Esempio aggiunto: piano stato–ingresso–stato successivo. Sei passi, senza tempo di campionamento assegnato.</FormulaContext>}
    visual={<><CourseExplorer definition={definition} id="discrete-map" grid={data.grid} points={data.points} curves={[data.section]}
      twoD={<TrajectoryViewer id="discrete-map-2d" series={[data.curve]} axes={[{label:'t',unit:'indice'},{label:'x_t',unit:'u. stato'}]} mode="xy" height={280} fontSize={22}/>}/>
      <StateInputTimeline states={data.states.map((x,k)=>'x'+k+'='+numberText(x,2))} inputs={data.states.slice(1).map((_,k)=>'u'+k+'='+numberText(u,1))}/></>}
    controls={<LessonControls definition={definition} state={state} hints={['Inclina il piano e propaga i campioni','Cambia la sezione e gli stati futuri','Cambia la partenza']}/>}
    example={<><FormulaContext definition={definition} formulaId="p09-enrichment-0"/>
      <LiveMetrics items={[{id:'discrete-x1',label:'x₁',value:numberText(data.states[1])},{id:'discrete-x2',label:'x₂',value:numberText(data.states[2])},
        {id:'discrete-x6',label:'x₆',value:numberText(data.states[6])}]}/></>}/>;
}
