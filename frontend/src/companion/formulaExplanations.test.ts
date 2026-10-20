import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseManifest } from '../data/manifest';
import { formulaExplanation, introductionFormulaNotes, pageFormulaExplanations } from './formulaExplanations';
const repository = parseManifest(JSON.parse(readFileSync('../Data/introduction_companion_manifest.json', 'utf8')));
const pages = [2,8,12,16,17,27,30,34];

describe('contratto permanente delle spiegazioni matematiche', () => {
  it('limita il catalogo alle otto companion esistenti', () => {
    expect(Object.keys(introductionFormulaNotes).map(Number)).toEqual(pages);
    expect(() => pageFormulaExplanations({...repository.getPage(1),source_page:99})).toThrow('non disponibile');
  });
  for (const page of pages) it('p' + page + ': copertura della fonte, provenienza e riferimenti risolvibili', () => {
    const definition = repository.getPage(page), formulas = pageFormulaExplanations(definition);
    const ids = formulas.map(f => f.formulaId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const original of definition.formulas_to_show) {
      const f = formulas.find(entry => entry.formulaId === original.id)!;
      expect(f).toBeDefined(); expect(f.latex).toBe(original.expression); expect(f.origin).toBe(original.origin);
    }
    for (const f of formulas) {
      expect(f.conceptualExplanation.trim().length).toBeGreaterThan(40);
      expect(f.purpose.trim().length).toBeGreaterThan(20);
      for (const related of f.relatedFormulaIds) expect(ids).toContain(related);
      for (const p of f.parameterInterpretation) expect(definition.controls.map(c => c.id)).toContain(p.controlId);
    }
    for (const control of definition.controls)
      expect(formulas.some(f => f.parameterInterpretation.some(p => p.controlId === control.id))).toBe(true);
  });
  it('rifiuta espressioni non censite, anziché aggiungere una spiegazione generica', () => {
    const definition = repository.getPage(8);
    expect(() => formulaExplanation(definition, 'unknown')).toThrow('non censita');
    expect(() => pageFormulaExplanations({...definition, formulas_to_show:[...definition.formulas_to_show,
      {...definition.formulas_to_show[0], id:'new-unexplained-formula'}]})).toThrow('priva di spiegazione');
  });
  it('mantiene esclusivamente le tre correzioni F03 autorizzate', () => {
    const corrected = pages.flatMap(p => pageFormulaExplanations(repository.getPage(p))).filter(f => f.origin === 'correction');
    expect(corrected.map(f => f.formulaId)).toEqual(['p16-correction-0','p30-correction-0','p34-correction-0']);
    expect(corrected[0].latex).toContain('w_2(z_2');
    expect(corrected[1].latex).toContain('T-1');
    expect(corrected[2].latex).toBe('0=x_{2,e}');
  });
});
