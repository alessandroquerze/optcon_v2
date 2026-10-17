import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { pageFormulaExplanations } from '../src/companion/formulaExplanations';
const manifest = JSON.parse(readFileSync(new URL('../../Data/introduction_companion_manifest.json', import.meta.url), 'utf8'));
for (const number of [2,8,12,16,17,27,30,34]) test('F06.1 p' + number + ': formule spiegate nel contesto e dettagli accessibili', async ({page}) => {
  await page.goto('/#/study?page=' + number);
  const lesson = page.locator('.lesson-page[data-source-page="' + number + '"]');
  await expect(lesson).toBeVisible();
  if (number !== 2 && number !== 30) await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
  const primary = lesson.locator('.explained-equation > .formula-concept').first();
  await expect(primary).toBeVisible();
  const formula = lesson.locator('[data-explained-formula-id]').first();
  const details = formula.locator(':scope > details');
  const values = await lesson.locator('output[data-testid]').allTextContents();
  await details.locator('summary').first().focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open','');
  await expect(details.locator('.formula-detail-content').first()).toBeVisible();
  await page.keyboard.press('Enter');
  expect(await lesson.locator('output[data-testid]').allTextContents()).toEqual(values);
  const expected = pageFormulaExplanations(manifest.pages[number-1]);
  if (number !== 2) {
    await lesson.getByRole('button',{name:'Formule e prerequisiti',exact:false}).click();
    const panel = lesson.getByRole('region',{name:'Formule complete'});
    for (const f of expected) {
      const entry = panel.locator(':scope > [data-formula-id="' + f.formulaId + '"]');
      await expect(entry.locator('.formula-concept')).toHaveText(f.conceptualExplanation);
      await expect(entry.locator('[data-canonical-latex]')).toHaveAttribute('data-canonical-latex',f.latex);
      await entry.scrollIntoViewIfNeeded();
      await expect(entry.locator('.formula-concept')).toBeVisible();
    }
    await panel.getByRole('button',{name:'Chiudi',exact:true}).click();
    await expect(panel).toHaveCount(0);
    const context = lesson.locator('.formula-context').first();
    await context.locator(':scope > details > summary').click();
    await expect(context.locator('.formula-detail-content').first()).toBeVisible();
    const bounds = await context.locator('.formula-detail-content').first().evaluate(el => {
      const a=el.getBoundingClientRect(), b=el.closest('.lesson-page')!.getBoundingClientRect();
      return a.left >= b.left-1 && a.right <= b.right+1 && a.top >= b.top-1 && a.bottom <= b.bottom+1;
    });
    expect(bounds).toBe(true);
    await context.locator(':scope > details > summary').click();
    await expect(lesson.locator('.function-explorer')).toBeVisible();
  }
  await expect(lesson.locator('[role="alert"]')).toHaveCount(0);
  expect(await lesson.locator('output[data-testid]').allTextContents()).toEqual(values);
});
