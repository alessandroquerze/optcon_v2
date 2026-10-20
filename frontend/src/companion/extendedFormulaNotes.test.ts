import { readFileSync } from 'node:fs';
import { it,expect } from 'vitest';
import { parseManifest } from '../data/manifest';
import { pageFormulaExplanations } from './formulaExplanations';
import { extendedFormulaNotes } from './extendedFormulaNotes';
import { interactiveDefinition } from './courseDefinition';
import katex from 'katex';
import { readableFormulaLatex } from '../components/ExplainedEquation';
const repo=parseManifest(JSON.parse(readFileSync('../Data/introduction_companion_manifest.json','utf8')));
for(const number of Object.keys(extendedFormulaNotes).map(Number)) it('p'+number+': copertura formule, simboli e parametri F07',()=>{
  const definition=interactiveDefinition(repo.getPage(number)),formulas=pageFormulaExplanations(definition);
  for(const original of definition.formulas_to_show)expect(formulas.find(f=>f.formulaId===original.id)?.latex).toBe(original.expression);
  for(const f of formulas){
    expect(()=>katex.renderToString(f.displayLatex??readableFormulaLatex(f.latex),{displayMode:true,throwOnError:true,strict:false})).not.toThrow();
    expect(f.conceptualExplanation.length).toBeGreaterThan(30);expect(f.purpose.length).toBeGreaterThan(20);
    for(const related of f.relatedFormulaIds)expect(formulas.map(f=>f.formulaId)).toContain(related);
    for(const p of f.parameterInterpretation)expect(definition.controls.map(c=>c.id)).toContain(p.controlId);
  }
  for(const c of definition.controls)expect(formulas.some(f=>f.parameterInterpretation.some(p=>p.controlId===c.id))).toBe(true);
});
