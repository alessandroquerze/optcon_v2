import { useMemo } from 'react';
import type { CompanionRendererProps } from '../registry';
import { FeedbackDiagram } from '../../components/StudyDiagrams';
import { ComparisonTable } from '../../components/DataViews';
import { FunctionExplorer, ProjectionLink, SurfacePlot3D } from '../../visualization';
import { AlignedTimeSeries } from '../../visualization/shared/AlignedTimeSeries';
import { continuousFamily, continuousSection } from '../../math/introductionData';
import { introductionFixtures, scalarConstrainedChoice } from '../../math/introduction';
import { FormulaContext, FormulaDeck, LessonControls, LessonEquation, LessonFrame, LiveMetrics, numberText, useLessonParameters } from '../LessonFrame';
import { semanticAxes } from '../plotOptions';

export function FeedbackLesson({ definition }: CompanionRendererProps) {
  const fixture = introductionFixtures.feedback;
  const result = scalarConstrainedChoice(fixture.target, fixture.limit);
  return <LessonFrame definition={definition}
    visual={<><FeedbackDiagram/><div className="concept-pair">
      <section><h2>Performance index</h2><p>Quanto è buona una scelta?</p><span>Il costo esprime una preferenza.</span></section>
      <section><h2>Constraints</h2><p>Quali scelte sono ammesse?</p><span>I limiti delimitano le decisioni.</span></section>
    </div></>}
    example={<><LessonEquation definition={definition} formulaId="p02-example-choice"/>
      <ComparisonTable label="Prima l’ammissibilità, poi il costo" columns={['Caso', 'Scelta migliore', 'Costo']}
        rows={[{ id: 'free', cells: ['Senza vincolo', result.unconstrained.decision, numberText(result.unconstrained.cost, 2)] },
          { id: 'limited', cells: ['Con il limite', result.decision, numberText(result.cost, 2)] }]}/>
      </>}
    explanation={<>{definition.intuitive_explanation} Il feedback sceglie l’ingresso da stato o uscita; il controllo ottimo aggiunge un criterio e vincoli.</>}/>;
}

export function ContinuousResponseLesson({ definition }: CompanionRendererProps) {
  const state = useLessonParameters(definition), [a, input, initial] = state.numbers;
  const axes = useMemo(() => semanticAxes(definition), [definition]);
  const grid = useMemo(() => continuousFamily(a, initial, axes), [a, initial, axes]);
  const section = useMemo(() => continuousSection(a, input, initial), [a, input, initial]);
  const rows = useMemo(() => [{ label: 'x = y [u. stato]', curves: [section.state] },
    { label: 'u [u. stato/s]', curves: [section.control] }], [section]);
  const points = useMemo(() => [{ id: 'at-one', x: 1, y: input, z: section.atOne }], [input, section.atOne]);
  return <LessonFrame definition={definition}
    explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="p08-source-math-1"/>}
    legend={<FormulaContext definition={definition} formulaId="p08-enrichment-0"/>}
    visual={<ProjectionLink initialId="at-one"><FunctionExplorer id="continuous" grid={grid}
      policy={definition.visualization.visualizationMode} height={290} fontSize={22}
      camera={definition.visualization.presentation.camera} points={points}
      twoDView={<AlignedTimeSeries id="continuous-2d" rows={rows} height={290} timeLabel={axes[0].label}/>}
      threeDView={<SurfacePlot3D id="continuous-3d" grid={grid} curves={[section.spatial]} patches={[section.patch]}
        points={points} height={290} fontSize={22} camera={definition.visualization.presentation.camera}/>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={state} hints={['Richiamo: cambia rapidità e u/a', 'Sposta la risposta e la sezione', 'Sposta la partenza']}/>}
    example={<><LessonEquation definition={definition} formulaId="p08-enrichment-0"
      latex={a === 0 ? 'x(t)=x^0+ut\\quad(a=0)' : 'x(t)=u/a+(x^0-u/a)e^{-at}\\quad(a>0)'}/>
      <LiveMetrics items={[{ id: 'continuous-at-one', label: 'x(1) = y(1)', value: numberText(section.atOne) },
        { id: 'continuous-initial', label: 'x(0) = x⁰', value: numberText(initial) },
        { id: 'continuous-input', label: 'u costante', value: numberText(input) }]}/>
      </>}/>;
}
