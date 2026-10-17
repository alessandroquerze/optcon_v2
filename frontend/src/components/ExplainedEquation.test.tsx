import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExplainedEquation, type FormulaExplanation, readableFormulaLatex } from './ExplainedEquation';
const explanation: FormulaExplanation = {
  formulaId:'example', latex:'J(u)=(u-1)^2', conceptualExplanation:'La distanza dal bersaglio penalizza scelte lontane da uno.',
  purpose:'Confrontare le scelte possibili.', symbolDefinitions:[{symbol:'u',meaning:'Decisione scalare.'}],
  assumptions:['Nessuna dinamica.'], optionalDetails:[], relatedFormulaIds:[], parameterInterpretation:[],
  sourceFormulaIds:[], origin:'enrichment',
};
describe('ExplainedEquation', () => {
  it('mostra il concetto senza richiedere interazione e rende espandibili i dettagli', () => {
    const {container} = render(<ExplainedEquation explanation={explanation}/>);
    expect(screen.getByText(explanation.conceptualExplanation)).toBeVisible();
    const details = container.querySelector('details')!;
    expect(details.open).toBe(false);
    fireEvent.click(screen.getByText('Dettagli')); // Native details toggles in the browser, not in jsdom.
    expect(screen.getByText('Decisione scalare.')).toBeInTheDocument();
    expect(container.querySelector('[data-canonical-latex]')).toHaveAttribute('data-canonical-latex', explanation.latex);
  });
  it('non accetta una spiegazione vuota o solo spazi', () => {
    expect(() => render(<ExplainedEquation explanation={{...explanation,conceptualExplanation:'  '}}/>)).toThrow('obbligatoria');
  });
  it('tratta le spiegazioni come testo, senza HTML eseguibile', () => {
    const {container} = render(<ExplainedEquation explanation={{...explanation,conceptualExplanation:'<img src=x onerror=alert(1)>'}}/>);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeVisible();
  });
  it('può spiegare un risultato o una formula già presente nel contesto', () => {
    const {container} = render(<ExplainedEquation explanation={explanation} showFormula={false}/>);
    expect(container.querySelector('.equation-card')).toBeNull();
    expect(screen.getByText(explanation.conceptualExplanation)).toBeVisible();
  });
  it('spezza soltanto la presentazione di formule lunghe conservando simboli e termini', () => {
    const long = '\\dot{x}=f(x,u,t),\\quad x(0)=x^0;\\quad ' + 'y=h(x,u,t)'.repeat(10);
    expect(readableFormulaLatex(long)).toContain('\\begin{gathered}');
    expect(readableFormulaLatex(long)).toContain('x(0)=x^0');
    expect(readableFormulaLatex('x=0')).toBe('x=0');
  });
});
