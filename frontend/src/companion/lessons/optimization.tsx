import { useMemo, useState } from 'react';
import type { CompanionRendererProps } from '../registry';
import { CostBreakdown, ComparisonTable } from '../../components/DataViews';
import { UnitCircleInset } from '../../components/StudyDiagrams';
import { ConstraintVisualizer, ContourPlot2D, FunctionExplorer, ProjectionLink, SurfacePlot3D, TrajectoryViewer } from '../../visualization';
import { linearizationFamily, linearizationSection, quadraticSetData, weightedCostData } from '../../math/introductionData';
import { quadraticPointClass, quadraticResidual } from '../../math/introduction';
import { FormulaContext, FormulaDeck, LessonControls, LessonEquation, LessonFrame, LiveMetrics, LocalWarnings, numberText, useLessonParameters } from '../LessonFrame';
import { LESSON_PLOT_HEIGHT as height, semanticAxes } from '../plotOptions';

export function LinearizationLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [dx, du] = state.numbers;
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const family = useMemo(() => linearizationFamily(axes), [axes]);
  const section = useMemo(() => linearizationSection(dx, du), [dx, du]);
  return <LessonFrame definition={definition}
    explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p12-source-math-2"/>}
    legend={<><span className="legend-exact">● Esatta</span> · <span className="legend-linear">┄ Lineare</span>
      <FormulaContext definition={definition} formulaId="p12-enrichment-2"/></>}
    visual={<ProjectionLink initialId="exact"><FunctionExplorer id="linearization" policy={definition.visualization.visualizationMode}
      grid={family.exact} height={height} fontSize={22} camera={definition.visualization.presentation.camera}
      threeDView={<SurfacePlot3D id="linearization-3d" grid={family.exact}
        layers={[{ grid: family.tangent, label: 'Piano tangente', opacity: .5, colorScale: 'Purples' }]}
        curves={[section.spatialSection, section.errorSegment]} points={section.points}
        camera={definition.visualization.presentation.camera} fontSize={22} height={height}/>}
      twoDView={<TrajectoryViewer id="linearization-2d" mode="xy" axes={[axes[0], axes[2]]}
        series={[section.exact, section.linear, { id: 'current', label: 'Punti correnti', discrete: true, color: '#cf6b24', points: section.sectionPoints }]}
        label="Sezione esatta e lineare" height={height} fontSize={22}/>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Muove il punto: scarto (Δx)²', 'Cambia la sezione; scarto invariato']}/>}
    example={<><LessonEquation definition={definition} formulaId="p12-enrichment-2"
      latex={'\\begin{gathered}f(x,u)=x^2+u,\\quad(\\bar x,\\bar u)=(1,0),\\quad A=2,\\ B=1\\\\\\Delta x_{t+1}^{\\rm exact}=2\\Delta x+(\\Delta x)^2+\\Delta u,\\quad\\Delta x_{t+1}^{\\rm lin}=2\\Delta x+\\Delta u\\end{gathered}'}/>
      <LiveMetrics items={[{ id: 'linearization-exact', label: 'Variazione esatta', value: numberText(section.result.exact) },
        { id: 'linearization-linear', label: '2Δx + Δu', value: numberText(section.result.linear) },
        { id: 'linearization-error', label: 'Scarto (Δx)²', value: numberText(section.result.error) }]}/>
      </>}/>;
}

export function WeightedCostLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [w1, w2] = state.numbers;
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const data = useMemo(() => weightedCostData(w1, w2, axes), [w1, w2, axes]);
  const model = useMemo(() => ({ total: data.cost.total, parts: data.cost.contributions.map((value, i) => ({
    id: 'part-' + i, label: i ? '½ w₂ e₂²' : '½ w₁ e₁²', value, kind: 'stage' as const,
  })) }), [data.cost]);
  const corrected = definition.formulas_to_show[3].expression;
  const split = corrected.lastIndexOf('=');
  return <LessonFrame definition={definition}
    explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p16-correction-0" primaryLatex={'\\ell(z)=' + corrected.slice(split + 1)} warnings/>}
    legend="Esempio aggiunto · z̄=(0,0), z=e=(1,1) fissi · livelli ℓ=0.5, 1, 2, 4"
    visual={<ProjectionLink initialId="candidate"><FunctionExplorer id="weighted" grid={data.grid} points={data.points}
      policy={definition.visualization.visualizationMode} camera={definition.visualization.presentation.camera} fontSize={22} height={height}
      twoDView={<ContourPlot2D id="weighted-2d" grid={data.grid} points={data.points} levels={[.5, 1, 2, 4]} fontSize={22} height={height}/>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Curvatura lungo z₁', 'Curvatura lungo z₂']}/>}
    example={<><div className="weighted-example"><div className="matrix-readout" data-formula-reference="p16-source-math-2">
      <span>W diagonale</span><span>({w1}, {w2})</span></div><CostBreakdown model={model}/></div>
      <FormulaContext definition={definition} formulaId="p16-source-math-2"/>
      <output data-testid="weighted-total" className="sr-only">{numberText(data.cost.total)}</output>
      <p className="lesson-caption">{w1 === 0 && w2 === 0 ? 'Pesi nulli: costo identicamente zero, senza minimo unico.' :
        w1 === 0 || w2 === 0 ? 'Un peso nullo: direzione non penalizzata (caso semidefinito).' : 'w₁,w₂>0: W>0. Zero esplora l’estensione semidefinita.'}</p></>}/>;
}

export function ConstraintSetsLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [a, b, c] = state.numbers;
  const [probe, setProbe] = useState('probe:1');
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const data = useMemo(() => quadraticSetData(a, b, c, axes), [a, b, c, axes]);
  const current = data.points.find(p => p.id === probe) ?? data.points[1];
  const pointRows = data.points.map(p => {
    const eq = quadraticResidual(p.x, p.y, 1, 1, 1);
    return { id: p.id, cells: [<button key={p.id} aria-pressed={probe === p.id} onClick={() => setProbe(p.id)}
      aria-label={'Punto (' + p.x + ',' + p.y + ')'}>{'(' + p.x + ',' + p.y + ')'}</button>,
      numberText(p.z!, 2) + ' · ' + (quadraticPointClass(p.z!, data.kind) === 'non ammissibile' ? 'fuori' :
        quadraticPointClass(p.z!, data.kind) === 'ammissibile (g=0)' ? 'ammesso' : quadraticPointClass(p.z!, data.kind)), Math.abs(eq) <= 1e-9 ? 'sì' : 'no'] };
  });
  return <LessonFrame definition={definition}
    explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p17-source-math-0"
      primaryLatex={definition.formulas_to_show[0].expression.split(',\\quad')[0]}/>}
    legend={<><LocalWarnings definition={definition}/><FormulaContext definition={definition} formulaId="p17-residual"/></>}
    visual={<ProjectionLink selectedId={probe} onSelect={id => { if (id?.startsWith('probe:')) setProbe(id); }}>
      <FunctionExplorer id="constraint" grid={data.grid} points={data.points} layers={[{ grid: data.zero, label: 'Piano g=0', opacity: .25 }]}
        policy={definition.visualization.visualizationMode} fontSize={22} height={height} camera={definition.visualization.presentation.camera}
        twoDView={<ConstraintVisualizer id="constraint-2d" residual={data.grid} feasibleMask={data.mask} points={data.points}
          zeroSet={data.zeroSet} hideMask={data.hideMask} hideContour={data.hideContour} height={height} fontSize={22}/>}/>
      <p className="lesson-caption selected-readout"><output data-testid="constraint-kind">{data.kind}</output>
        {' · '}({current.x},{current.y}): g=<output data-testid="constraint-residual">{numberText(current.z!, 2)}</output>
        {' · '}<output data-testid="constraint-status">{quadraticPointClass(current.z!, data.kind)}</output>.</p>
    </ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Curvatura lungo z₁', 'Curvatura lungo z₂', 'c sale: g scende, Z si amplia']}/>}
    example={<><div className="constraint-example"><UnitCircleInset/><ComparisonTable label="Disequazione / cerchio fisso"
      columns={['Punto', 'g corrente', 'Cerchio =1?']} rows={pointRows}/></div>
      <FormulaContext definition={definition} formulaId="p17-enrichment-0"/></>}/>;
}
