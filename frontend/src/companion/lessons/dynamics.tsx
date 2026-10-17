import { useEffect, useMemo } from 'react';
import type { CompanionRendererProps } from '../registry';
import { StateInputTimeline } from '../../components/DataViews';
import { ParameterControl } from '../../components/ParameterControl';
import { EquilibriumPoses, IntervalBand } from '../../components/StudyDiagrams';
import { FunctionExplorer, ProjectionLink, SurfacePlot3D, TrajectoryViewer, VisualizationSwitch } from '../../visualization';
import { AlignedTimeSeries } from '../../visualization/shared/AlignedTimeSeries';
import { eulerData, equilibriumLocus, pathConstraintFamily, pathSection, timeId, verticalSectionPatch } from '../../math/introductionData';
import { introductionFixtures, inspectPathConstraint, pendulumEquilibrium } from '../../math/introduction';
import { usePlayback } from '../../simulations/usePlayback';
import { FormulaContext, FormulaDeck, LessonControls, LessonEquation, LessonFrame, LiveMetrics, numberText, useLessonParameters } from '../LessonFrame';
import { LESSON_PLOT_HEIGHT as height, semanticAxes } from '../plotOptions';

export function EulerDiscretizationLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [delta] = state.numbers;
  const data = useMemo(() => eulerData(delta), [delta]);
  const playback = usePlayback(data.simulation.states.length, 220);
  useEffect(() => { playback.restart(); }, [delta]); // Changing the discretization never keeps a stale sample or running timer.
  const index = Math.min(playback.index, data.simulation.N);
  const sample = data.simulation.states[index], time = data.simulation.times[index];
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const rows = useMemo(() => [{ label: 'p_y [m]', curves: data.altitude }, { label: 'v_y [m/s]', curves: data.velocity }], [data]);
  return <LessonFrame definition={definition}
    explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p27-source-math-0"
      primaryLatex="x_{t+1}=x_t+\delta f_{\mathrm{CT}}(x_t,u_t,t)=f_t(x_t,u_t)"/>}
    legend={<FormulaContext definition={definition} formulaId="p27-enrichment-0">
      ● Euler · ┄ continuo · assi (τ,p_y,v_y): il terzo asse è la velocità, non lo spazio.
    </FormulaContext>}
    visual={<ProjectionLink selectedId={timeId(time)} onSelect={id => {
      if (id?.startsWith('time:')) playback.seek(Math.round(Number(id.slice(5)) / delta));
    }}>
      <VisualizationSwitch id="euler" policy={definition.visualization.visualizationMode}
        twoDView={<AlignedTimeSeries id="euler-2d" rows={rows} height={height}/>}
        threeDView={<TrajectoryViewer id="euler-3d" series={data.series} axes={axes} mode="xyz"
          label="Tempo, quota e velocità del drone planare" height={height} fontSize={22} camera={definition.visualization.presentation.camera}/>}/>
      <div className="state-readout" aria-label="Ordine dello stato x_t">
        {['p_x [m]', 'v_x [m/s]', 'p_y [m]', 'v_y [m/s]', 'θ [rad]', 'ω [rad/s]'].map((name, i) =>
          <div key={name}><span>{name}</span><output data-testid={'euler-state-' + i}>{numberText(sample[i], 3)}</output></div>)}</div>
    </ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Durata fisica fissa a 1 s']}
      extra={<><ParameterControl label="Campione Euler" domain={{ min: 0, max: data.simulation.N, step: 1, integer: true }}
        value={index} onChange={playback.seek} unit="k" description={'τ = ' + numberText(time, 2) + ' s · N = ' + data.simulation.N}/>
        <div className="lesson-playback"><button aria-pressed={playback.playing} onClick={playback.toggle}>{playback.playing ? 'Pausa' : 'Play'}</button>
          <button onClick={playback.restart}>Restart</button></div></>}/>}
    example={<><LessonEquation definition={definition} formulaId="p27-enrichment-0"
      latex="p_{y,t+1}=p_{y,t}+\delta v_{y,t},\quad v_{y,t+1}=v_{y,t}+\delta a_y"/>
      <LiveMetrics items={[{ id: 'euler-final-altitude', label: 'Quota Euler a 1 s [m]', value: numberText(data.simulation.finalAltitude) },
        { id: 'euler-exact-altitude', label: 'Quota continua [m]', value: numberText(data.simulation.exact.altitude) },
        { id: 'euler-error', label: 'Scarto finale [m]', value: numberText(data.simulation.error) }]}/>
      <FormulaContext definition={definition} formulaId="p27-example-acceleration">
        M={introductionFixtures.drone.mass} kg, u₁=u₂={introductionFixtures.drone.thrust[0]} N:
        la spinta supera il peso, a_y={numberText(data.simulation.acceleration, 2)} m/s².
      </FormulaContext></>}/>;
}

export function PathConstraintsLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [minimum, maximum, altitude] = state.numbers;
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const family = useMemo(() => pathConstraintFamily(maximum, axes), [maximum, axes]);
  const section = useMemo(() => pathSection(minimum, maximum), [minimum, maximum]);
  const check = useMemo(() => inspectPathConstraint(altitude, minimum, maximum, 1), [altitude, minimum, maximum]);
  const point = useMemo(() => [{ id: 'altitude-candidate', x: altitude, y: minimum, z: check.maximum }], [altitude, minimum, check.maximum]);
  const patch = useMemo(() => verticalSectionPatch('Limite inferiore corrente', 0, 4, minimum, -2, 4), [minimum]);
  return <LessonFrame definition={definition}
    explanation={null}
    formula={<FormulaDeck definition={definition} warnings primaryId="p30-correction-0"
      primaryLatex={'\\begin{gathered}' + definition.formulas_to_show[0].expression.split(';\\qquad').join('\\\\') + '\\end{gathered}'}/>}
    legend={<FormulaContext definition={definition} formulaId="p30-maximum-residual">
      V=max(min−p_y,p_y−max): V≤0 ammette la quota. Asse 3D: V.
    </FormulaContext>}
    visual={<ProjectionLink initialId="altitude-candidate"><FunctionExplorer id="path" grid={family.grid}
      policy={definition.visualization.visualizationMode} height={height} fontSize={22} camera={definition.visualization.presentation.camera}
      twoDView={<IntervalBand minimum={minimum} maximum={maximum} value={altitude} empty={check.empty} status={check.classification}/>}
      threeDView={<SurfacePlot3D id="path-3d" grid={family.grid} layers={[{ grid: family.zero, label: 'V=0', opacity: .2 }]}
        patches={[patch]} curves={[section]} points={point} height={height} fontSize={22} camera={definition.visualization.presentation.camera}/>}/>
      <p className="lesson-caption selected-readout"><output data-testid="path-status">{check.classification}</output>
        {' · '}violazione positiva = <output data-testid="path-violation">{numberText(check.violation, 2)}</output> m.</p>
    </ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['min>max: vuoto', 'Sposta il bordo max', 'Muove il candidato']}/>}
    example={<><LiveMetrics items={[
      { id: 'path-residual-min', label: 'min − p_y [m]', value: numberText(check.residuals[0], 2) },
      { id: 'path-residual-max', label: 'p_y − max [m]', value: numberText(check.residuals[1], 2) },
      { id: 'path-residual', label: 'V [m] · ammesso se ≤0', value: numberText(check.maximum, 2) },
    ]}/>
      <FormulaContext definition={definition} formulaId="p30-enrichment-0">
        Entrambi i residui devono essere ≤0; la quota p_y è x₃.
      </FormulaContext>
      <div data-testid="path-index-timeline"><StateInputTimeline states={['x₀ (dato)', 'x₁ (previsto)']} inputs={['u₀ ∈ [u₀min,u₀max]']}/></div>
      <FormulaContext definition={definition} formulaId="p30-index-example">
        T=1: un comando, uno stato previsto; nessun u₁.
      </FormulaContext></>}/>;
}

export function PendulumEquilibriumLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [theta1, theta2] = state.numbers;
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const locus = useMemo(() => equilibriumLocus(), []);
  const poses = useMemo(() => [pendulumEquilibrium(theta1), pendulumEquilibrium(theta2)], [theta1, theta2]);
  const markers = useMemo(() => ({ id: 'pairs', label: 'Coppie di equilibrio', color: '#cf6b24', discrete: true,
    points: poses.map((p, i) => ({ id: 'equilibrium:' + i, x: p.angle, y: p.velocity, z: p.torque })) }), [poses]);
  const series = useMemo(() => [locus, markers], [locus, markers]);
  const projected = useMemo(() => series.map(curve => ({ ...curve, points: curve.points.map(p => ({ ...p, y: p.z! })) })), [series]);
  const plane = useMemo(() => verticalSectionPatch('x₂,e=0', -Math.PI / 2, Math.PI / 2, 0, -9.81, 9.81), []);
  return <LessonFrame definition={definition}
    explanation={null}
    takeaway="Gli equilibri fissano gli estremi. Il moto resta da scegliere."
    formula={<FormulaDeck definition={definition} warnings primaryId="p34-correction-0"/>}
    legend={theta1 === theta2 ? 'Esempio aggiunto · coppie coincidenti · luogo degli equilibri, non un moto' :
      'Esempio aggiunto · luogo degli equilibri (θ_e,0,u_e), non una traiettoria di trasferimento'}
    visual={<ProjectionLink initialId="equilibrium:1"><VisualizationSwitch id="pendulum"
      policy={definition.visualization.visualizationMode}
      threeDView={<TrajectoryViewer id="pendulum-3d" series={series} axes={axes} mode="xyz" patches={[plane]}
          label="Coppie nello spazio stato ingresso" height={310} fontSize={22} camera={definition.visualization.presentation.camera}/>}
      twoDView={<div className="pendulum-projections"><EquilibriumPoses poses={poses}/>
        <TrajectoryViewer id="pendulum-2d" series={projected} axes={[axes[0], axes[2]]} mode="xy"
          label="Angolo e coppia di equilibrio" height={180} fontSize={22}/></div>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Aggiorna u_e¹ e i residui', 'Aggiorna u_e²; nessun trasferimento']}/>}
    example={<><LessonEquation definition={definition} formulaId="p34-equilibrium-law"
      latex="u_e=mg\ell\sin\theta_e,\qquad x_{2,e}=0"/>
      <LiveMetrics items={[{ id: 'pendulum-torque-1', label: 'u_e¹ [N m]', value: numberText(poses[0].torque) },
        { id: 'pendulum-torque-2', label: 'u_e² [N m]', value: numberText(poses[1].torque) },
        { id: 'pendulum-residual', label: <FormulaContext definition={definition} formulaId="p34-residuals">
          Residui: velocità e accelerazione
        </FormulaContext>, value: poses.map(p => '(' + p.residual.map(v => v === 0 ? '0' : v.toExponential(1)).join(', ') + ')').join(' · ') }]}/>
      </>}/>;
}
