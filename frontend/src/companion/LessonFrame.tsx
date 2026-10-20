import { useState, type ReactNode } from 'react';
import type { CompanionDefinition } from '../data/manifest';
import { studentNotices } from '../data/manifest';
import { CompanionHeader, CompanionPage, ControlsBlock, ExampleBlock, InlineMath,
  ExplanationBlock, SourceWarnings, TakeawayBlock } from '../components/CompanionPage';
import { ParameterControl } from '../components/ParameterControl';
import { ExplainedEquation } from '../components/ExplainedEquation';
import { formulaExplanation, pageFormulaExplanations } from './formulaExplanations';
import { courseDocuments,documentFromId } from '../data/documents';

type Values = Readonly<Record<string, number>>;
const sessionValues = new Map<string, Values>();
export function useLessonParameters(definition: CompanionDefinition) {
  const defaults = () => Object.fromEntries(definition.controls.map(control => [control.id, control.default]));
  const [values, setValues] = useState<Values>(() => sessionValues.get(definition.page_id) ?? defaults());
  const update = (id: string, value: number) => setValues(previous => {
    const next = { ...previous, [id]: value };
    sessionValues.set(definition.page_id, next); return next;
  });
  const reset = () => { const next = defaults(); sessionValues.set(definition.page_id, next); setValues(next); };
  return { values, update, reset, numbers: definition.controls.map(control => values[control.id]) };
}
export const numberText = (value: number, digits = 4) => Math.abs(value) < .5 * 10 ** -digits ? (0).toFixed(digits) : value.toFixed(digits);
export function LocalWarnings({ definition }: { definition: CompanionDefinition }) {
  const notices = studentNotices(definition);
  return <>{notices.map(notice => <SourceWarnings key={notice.issue_id} notices={[notice]} anchor={notice.adjacent_to}/>)}</>;
}
export function LessonEquation({ definition, formulaId, latex, showFormula = true }: {
  definition: CompanionDefinition; formulaId: string; latex?: string; showFormula?: boolean;
}) {
  return <ExplainedEquation explanation={formulaExplanation(definition, formulaId)} latex={latex} showFormula={showFormula}/>;
}
/** A formula repeated by a graph/readout links to the same explanation, without duplicating prose. */
export function FormulaContext({ definition, formulaId, children }: {
  definition: CompanionDefinition; formulaId: string; children?: ReactNode;
}) {
  const formula = formulaExplanation(definition, formulaId);
  return <div className="formula-context" data-formula-reference={formulaId}>
    <p className="lesson-caption">{children ?? formula.graphExplanation ?? formula.conceptualExplanation}</p>
    <details className="formula-details">
      <summary aria-label={'Modello e spiegazione: ' + formulaId}>Approfondisci</summary>
      <div className="formula-detail-content"><ExplainedEquation explanation={formula}/></div>
    </details>
  </div>;
}
export function FormulaDeck({ definition, primaryId, primaryLatex, warnings = false }: {
  definition: CompanionDefinition; primaryId: string; primaryLatex?: string; warnings?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const formulas = pageFormulaExplanations(definition);
  return <div className="formula-deck" data-formula-source-ids={definition.formulas_to_show.map(f => f.id).join(' ')}>
    <LessonEquation definition={definition} formulaId={primaryId} latex={primaryLatex}/>
    {warnings && <LocalWarnings definition={definition}/>}
    <button className="formula-disclosure" aria-expanded={open} onClick={() => setOpen(v => !v)}>Formule e prerequisiti {open ? '−' : '+'}</button>
    {open && <section className="formula-reference" aria-label="Formule complete">
      <button onClick={() => setOpen(false)}>Chiudi</button>
      <p className="lesson-caption">Prima di iniziare: {definition.prerequisite.map(p => p.concept).join(' · ')}.</p>
      {formulas.map(f => <div key={f.formulaId} data-formula-id={f.formulaId}>
        <span className="lesson-caption">{f.origin === 'source' ? 'Dalla slide' : f.origin === 'correction' ? 'Versione usata nella companion' : 'Chiarimento aggiunto'}</span>
        <ExplainedEquation explanation={f}/>
        {f.origin === 'correction' && <LocalWarnings definition={definition}/>}
      </div>)}
    </section>}
  </div>;
}
export function LessonControls({ definition, state, hints = [], extra }: {
  definition: CompanionDefinition; state: ReturnType<typeof useLessonParameters>; hints?: readonly string[]; extra?: ReactNode;
}) {
  return <div className="lesson-controls">
    <div className="controls-heading"><span>Parametri dell’esempio aggiunto</span><button onClick={state.reset}>Ripristina parametri</button></div>
    <ControlsBlock>{definition.controls.map((control, i) => <ParameterControl key={control.id}
      label={control.label} unit={control.unit} domain={control.domain} value={state.values[control.id]}
      displayLabel={<InlineMath latex={control.symbol}/>}
      onChange={value => state.update(control.id, value)} description={hints[i]}/>)}{extra}</ControlsBlock>
  </div>;
}
export function LiveMetrics({ items }: { items: readonly { label: ReactNode; value: ReactNode; id: string }[] }) {
  return <dl className="live-metrics">{items.map(item => <div key={item.id}><dt>{item.label}</dt>
    <dd><output data-testid={item.id}>{item.value}</output></dd></div>)}</dl>;
}
export function LessonFrame({ definition, formula, visual, controls, example, explanation, legend, takeaway,className='' }: {
  definition: CompanionDefinition; formula?: ReactNode; visual: ReactNode; controls?: ReactNode;
  example?: ReactNode; explanation?: ReactNode; legend?: ReactNode; takeaway?: ReactNode;className?:string;
}) {
  return <CompanionPage className={'lesson-page'+(className?' '+className:'')} sourcePage={definition.source_page} archetype={definition.layout.archetype}
    blockOrder={definition.layout.visual_block_order}
    blocks={{
      HEADER: <CompanionHeader subtitle={courseDocuments.find(d=>d.key===documentFromId(definition.page_id))!.label+' · PAGINA ' + String(definition.source_page).padStart(2, '0')} title={definition.title}/>,
      EXPLANATION: explanation === null ? undefined : <ExplanationBlock><p>{explanation ?? definition.intuitive_explanation}</p></ExplanationBlock>,
      FORMULA: formula,
      MAIN_VISUAL: <div className="lesson-visual">{legend && <div className="lesson-caption visual-legend">{legend}</div>}{visual}</div>,
      CONTROLS: controls,
      WORKED_EXAMPLE: example==null?undefined:<ExampleBlock>{example}</ExampleBlock>,
      TAKEAWAY: <TakeawayBlock>{takeaway ?? definition.takeaway}</TakeawayBlock>,
    }}/>;
}
