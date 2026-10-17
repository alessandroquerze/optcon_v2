import { useEffect, useMemo, useState } from 'react';
import { ControlsBlock, EquationCard, ExampleBlock, InfoNote, TakeawayBlock, WarningBanner } from '../components/CompanionPage';
import { ParameterControl } from '../components/ParameterControl';
import { ComparisonTable, CostBreakdown, ModelDiagram, StateInputTimeline, VectorVisualizer } from '../components/DataViews';
import { FunctionExplorer } from '../visualization/shared/FunctionExplorer';
import { ProjectionLink, useLinkedSelection } from '../visualization/shared/ProjectionLink';
import { TrajectoryViewer } from '../visualization/shared/TrajectoryViewer';
import { FunctionPlot2D } from '../visualization/2d/FunctionPlot2D';
import { ConstraintVisualizer } from '../visualization/shared/ConstraintVisualizer';
import { VectorField } from '../visualization/shared/VectorField';
import { usePlayback } from '../simulations/usePlayback';
import { waveFixture, twoAxes, trajectoryAxes, helix, fieldSamples, fieldAxes } from './fixtures';
function SurfaceDemo() {
  const [amplitude, setAmplitude] = useState(1);
  const [presentation, setPresentation] = useState<'side-by-side'|'toggle'>('side-by-side');
  const [representation, setRepresentation] = useState<'surface'|'wireframe'|'mesh'>('surface');
  const {grid,layers,points,curves,mask} = useMemo(() => waveFixture(amplitude),[amplitude]);
  return <ProjectionLink initialId="probe"><section className="dev-section" data-demo="surfaces">
    <div className="section-heading"><div><p className="eyebrow">RENDERER SCIENTIFICO</p><h2>Una funzione, due viste</h2></div>
      <span className="demo-badge">Demo indipendente dalle slide</span></div>
    <EquationCard latex={'f(x,y)=a\\sin(x)\\cos(y)'} label="Formula del dataset demo" />
    <ControlsBlock><ParameterControl label="Ampiezza" value={amplitude} onChange={setAmplitude} unit="1" domain={{min:0,max:3,step:.1}} />
      <div className="control-option"><label htmlFor="presentation">Presentazione</label><select id="presentation" value={presentation} onChange={e => setPresentation(e.target.value as typeof presentation)}><option value="side-by-side">2D + 3D affiancati</option><option value="toggle">Toggle 2D / 3D</option></select></div>
      <div className="control-option"><label htmlFor="surface-style">Superficie</label><select id="surface-style" value={representation} onChange={e => setRepresentation(e.target.value as typeof representation)}><option value="surface">Surface</option><option value="wireframe">Wireframe</option><option value="mesh">Mesh</option></select></div>
    </ControlsBlock>
    <div className="numeric-readout">f(π/2, 0) = <output data-testid="probe-value">{amplitude.toFixed(3)}</output> · stesso punto nelle due viste</div>
    <FunctionExplorer id="wave" grid={grid} points={points} layers={layers} policy="2D_AND_3D_EQUAL" display={presentation} representation={representation} />
    <div className="combined-plots secondary-plots"><section><h3>Sezione 1D · y=0</h3><FunctionPlot2D id="wave-section" curves={curves} axes={twoAxes} label="Grafico di funzione 2D" height={230}/></section>
      <section><h3>Regione f(x,y) ≤ 0</h3><ConstraintVisualizer id="wave-feasible" residual={grid} feasibleMask={mask}/></section></div>
    <p className="caption">Rotazione, pan e zoom cambiano la camera. Il parametro modifica il dataset; la camera corrente viene conservata. Il piano grigio rappresenta f=0.</p>
  </section></ProjectionLink>;
}
function TrajectoryContent() {
  const playback = usePlayback(97);
  const linked = useLinkedSelection();
  useEffect(() => { linked?.select('sample:'+playback.index); },[playback.index,linked?.select]);
  return <section className="dev-section">
    <h2>Traiettoria e proiezione collegate</h2>
    <p>Curva geometrica di test: (cos s, sin s, s/2π). Nessun modello fisico del corso.</p>
    <ControlsBlock><ParameterControl label="Campione" value={playback.index} onChange={playback.seek} domain={{min:0,max:96,step:1,integer:true}}/>
      <div className="playback"><button onClick={playback.toggle}>{playback.playing?'Pausa':'Play'}</button><button onClick={playback.restart}>Restart</button><output>Punto {linked?.selectedId}</output></div></ControlsBlock>
    <div className="combined-plots">
      <TrajectoryViewer id="helix-2d" series={helix} axes={trajectoryAxes.slice(0,2)} mode="xy" label="Proiezione traiettoria 2D"/>
      <TrajectoryViewer id="helix-3d" series={helix} axes={trajectoryAxes} mode="xyz" label="Traiettoria 3D"/>
    </div>
  </section>;
}
function ComponentsDemo() {
  return <section className="dev-section"><h2>Componenti didattici generici</h2>
    <EquationCard latex={'\\Delta v=A\\Delta x+B\\Delta u'} label="Rendering KaTeX dimostrativo"/>
    <WarningBanner shortWarning="⚠ Warning: avviso dimostrativo, visibile soltanto nel playground."/>
    <InfoNote text="Nota dimostrativa breve: le motivazioni tecniche non vengono renderizzate."/>
    <ModelDiagram label="Schema generico" nodes={[{id:'a',label:'Modello',x:100,y:80},{id:'b',label:'Dati',x:320,y:80},{id:'c',label:'Vista',x:540,y:80}]} edges={[{from:'a',to:'b'},{from:'b',to:'c'}]}/>
    <div className="combined-plots"><VectorVisualizer label="Vettore" entries={[{symbol:'v_1',value:1},{symbol:'v_2',value:2}]}/>
      <CostBreakdown model={{parts:[{id:'a',label:'Stadio',kind:'stage',value:2},{id:'b',label:'Terminale',kind:'terminal',value:1}],total:3}}/></div>
    <StateInputTimeline states={['x₀','x₁','x₂']} inputs={['u₀','u₁']}/>
    <ComparisonTable label="Lettura accessibile dei dati" columns={['Quantità','Valore']} rows={[{id:'a',cells:['Stadio','2']},{id:'b',cells:['Terminale','1']}]}/>
    <ExampleBlock><p>Questa composizione verifica le API dei componenti. Non è una companion del corso.</p></ExampleBlock>
    <TakeawayBlock>Matematica → dati numerici → visualizzazione.</TakeawayBlock>
  </section>;
}
function FieldsDemo() {
  return <section className="dev-section"><h2>Campi vettoriali nativi</h2><p>Campioni del campo geometrico (−y/4, x/4, 0.15), senza dinamica attribuita al corso.</p>
    <div className="combined-plots"><VectorField id="field-2d" samples={fieldSamples.filter(s => s.z===0)} axes={fieldAxes} dimensions={2}/>
      <VectorField id="field-3d" samples={fieldSamples} axes={fieldAxes} dimensions={3}/></div></section>;
}
export default function DevPlayground() {
  const [tab,setTab]=useState('surfaces');
  return <main className="dev-playground"><div className="dev-heading"><div><p className="eyebrow">DEVELOPMENT PLAYGROUND</p><h1>Foundation 2D / 3D</h1></div><p>Verifica dei componenti · nessuna companion implementata</p></div>
    <nav className="dev-tabs" aria-label="Demo">
      {([['surfaces','Superfici e proiezioni'],['trajectories','Traiettorie'],['components','Componenti'],['fields','Campi vettoriali']] as const).map(([id,label]) => <button key={id} aria-pressed={tab===id} onClick={() => setTab(id)}>{label}</button>)}
    </nav>
    {tab==='surfaces'&&<SurfaceDemo/>}
    {tab==='trajectories'&&<ProjectionLink initialId="sample:0"><TrajectoryContent/></ProjectionLink>}
    {tab==='components'&&<ComponentsDemo/>}
    {tab==='fields'&&<FieldsDemo/>}
  </main>;
}
