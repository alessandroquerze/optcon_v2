import { useId } from 'react';
import { EquationCard, InlineMath } from './CompanionPage';

export interface FormulaExplanation {
  formulaId: string;
  latex: string;
  displayLatex?: string;
  conceptualExplanation: string;
  purpose: string;
  symbolDefinitions: readonly { symbol: string; meaning: string }[];
  assumptions: readonly string[];
  optionalDetails: readonly string[];
  relatedFormulaIds: readonly string[];
  parameterInterpretation: readonly { controlId: string; explanation: string }[];
  graphExplanation?: string;
  origin: 'source' | 'correction' | 'enrichment';
  sourceFormulaIds: readonly string[];
}

/** Line breaks are presentation only; canonical source notation is kept on the element. */
export function readableFormulaLatex(latex: string) {
  if (latex.length <= 80 || latex.includes('\\begin{gathered}')) return latex;
  const broken = latex.replace(/([,;])\\q(?:quad|uad)\s*/g, '$1\\\\')
    .replace(/=\\frac12w_1/, '\\\\=\\frac12w_1');
  return broken === latex ? latex : '\\begin{gathered}' + broken + '\\end{gathered}';
}

/** Presentation only: explanations and numerical models never derive from LaTeX. */
export function ExplainedEquation({ explanation, latex, showFormula = true, children }: {
  explanation: FormulaExplanation; latex?: string; showFormula?: boolean; children?: React.ReactNode;
}) {
  const id = useId(), f = explanation;
  if (!f.conceptualExplanation.trim()) throw new Error('Spiegazione concettuale obbligatoria: ' + f.formulaId);
  return <div className="explained-equation" data-explained-formula-id={f.formulaId} data-formula-origin={f.origin}
    data-canonical-latex={f.latex} data-related-formula-ids={f.relatedFormulaIds.join(' ')}>
    {showFormula && <EquationCard latex={latex ?? f.displayLatex ?? readableFormulaLatex(f.latex)}/>}
    <p className="formula-concept" id={id}>{f.conceptualExplanation}</p>
    {children}
    <details className="formula-details">
      <summary aria-label={'Simboli e ipotesi: ' + f.formulaId}>Dettagli</summary>
      <div className="formula-detail-content">
        <p><strong>A cosa serve.</strong> {f.purpose}</p>
        <dl>{f.symbolDefinitions.map(s => <div key={s.symbol}><dt><InlineMath latex={s.symbol}/></dt><dd>{s.meaning}</dd></div>)}</dl>
        {f.assumptions.length > 0 && <p><strong>Vale quando.</strong> {f.assumptions.join(' ')}</p>}
        {f.parameterInterpretation.length > 0 && <ul>{f.parameterInterpretation.map(p =>
          <li key={p.controlId}>{p.explanation}</li>)}</ul>}
        {f.optionalDetails.map((text, i) => <p key={i}>{text}</p>)}
      </div>
    </details>
  </div>;
}
