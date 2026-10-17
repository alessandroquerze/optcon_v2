import { test, expect, type Page, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync(new URL('../../Data/introduction_companion_manifest.json', import.meta.url), 'utf8'));
const slice = [2,8,12,16,17,27,30,34];
async function openLesson(page: Page, number: number) {
  await page.goto('/#/study?page=' + number);
  await expect(page.locator('canvas[data-rendered-page="' + number + '"]')).toBeVisible();
  const lesson = page.locator('.lesson-page[data-source-page="' + number + '"]');
  await expect(lesson).toBeVisible();
  if (number !== 2 && number !== 30) await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
  return lesson;
}
async function geometry(lesson: Locator) {
  return lesson.evaluate(el => {
    const b = el.getBoundingClientRect(), scale = b.width / 960;
    return { height: el.clientHeight, overflow: el.scrollHeight - el.clientHeight,
      bottom: (el.querySelector('.takeaway')!.getBoundingClientRect().bottom - b.top) / scale,
      badEquations: [...el.querySelectorAll('.formula-deck > .equation-card .equation')].filter(e => e.scrollWidth > e.clientWidth + 1).length,
      overlaps: [...el.children].some((child, index, all) => index > 0 && child.getBoundingClientRect().top < all[index - 1].getBoundingClientRect().bottom - 1),
    };
  });
}
for (const number of slice) test('companion ' + number + ': render, geometria, controlli, viste e resize', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const lesson = await openLesson(page, number);
  await page.evaluate(() => document.fonts.ready);
  const metric = await geometry(lesson);
  expect(metric.height).toBe(1280); expect(metric.overflow).toBeLessThanOrEqual(1);
  expect(metric.bottom).toBeLessThanOrEqual(1241); expect(metric.badEquations).toBe(0); expect(metric.overlaps).toBe(false);
  await expect(lesson.locator('[role="alert"]')).toHaveCount(0);
  await expect(lesson.locator('.katex').first()).toBeVisible();
  if (number === 8) await expect.poll(() => lesson.locator('[data-plot-id="continuous-2d"] .js-plotly-plot')
    .evaluate((el:any) => el._fullLayout.xaxis2.title.text)).toBe('t [s]');
  for (const notice of manifest.pages[number - 1].source_warning.student_notices)
    await expect(lesson.getByRole('note')).toContainText(notice.text);
  await expect(lesson.getByText('correction_reason', {exact:false})).toHaveCount(0);
  if (number === 2) {
    await expect(lesson.locator('.scene-viewport')).toHaveCount(0);
    await expect(lesson.getByText('0.16', {exact:true})).toBeVisible();
  } else {
    const first = manifest.pages[number - 1].controls[0];
    if (number === 27) await lesson.getByLabel(first.label, {exact:true}).selectOption('0.05');
    else {
      const input = lesson.getByLabel(first.label + ' valore', {exact:true});
      await input.fill(String(first.default + first.domain.step));
      await expect(input).toHaveValue(String(first.default + first.domain.step));
    }
    const expectedView = manifest.pages[number - 1].visualization.presentation.defaultView;
    await expect(lesson.locator('.function-explorer')).toHaveAttribute('data-current-view', expectedView);
    for (const view of ['2D', '3D']) {
      await lesson.getByRole('button', {name:view,exact:true}).click();
      if (number !== 30 || view === '3D') await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
      await expect(lesson.locator('.function-explorer')).toHaveAttribute('data-current-view', view);
      const g = await geometry(lesson); expect(g.bottom).toBeLessThanOrEqual(1241); expect(g.overflow).toBeLessThanOrEqual(1);
    }
    if (number === 8) {
      await expect(lesson.getByTestId('continuous-at-one')).not.toHaveText('0.6321');
      await lesson.getByLabel('Coefficiente del modello valore', {exact:true}).fill('0');
      await expect(lesson.getByTestId('continuous-at-one')).toHaveText('1.0000');
    }
    if (number === 12) await expect(lesson.getByTestId('linearization-error')).toHaveText('0.0121');
    if (number === 16) await expect(lesson.getByTestId('weighted-total')).toHaveText('2.5500');
    if (number === 27) expect(Math.abs(Number(await lesson.getByTestId('euler-final-altitude').innerText()) - 1.04025)).toBeLessThanOrEqual(.000050001);
    if (number === 34) await expect(lesson.getByTestId('pendulum-torque-1')).toHaveText('0.0981');
    await lesson.getByRole('button', {name:'Ripristina parametri',exact:true}).click();
  }
  if (number !== 2) {
    await lesson.getByRole('button', {name:'Formule e prerequisiti',exact:false}).click();
    await expect(lesson.getByRole('region', {name:'Formule complete'})).toBeVisible();
    await expect(lesson.locator('[role="alert"]')).toHaveCount(0);
    await lesson.getByRole('button', {name:'Chiudi',exact:true}).click();
  }
  await page.setViewportSize({width:900,height:800});
  await expect(page.locator('canvas[data-rendered-page="' + number + '"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.setViewportSize({width:560,height:850});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expect(lesson).toBeVisible();
  expect(errors).toEqual([]);
});
test('p16: camera e nodo conservati, stessa superficie corretta dopo input', async ({page}) => {
  const lesson = await openLesson(page, 16);
  const graph = lesson.locator('[data-plot-id="weighted-3d"] .js-plotly-plot');
  await graph.evaluate(el => el.setAttribute('data-instance-probe', 'preserved'));
  const scene = lesson.locator('[data-plot-id="weighted-3d"]');
  await lesson.getByLabel('Zoom avanti Superficie 3D', {exact:true}).click();
  await expect(scene).toHaveAttribute('data-camera', /.+/);
  const camera = await scene.getAttribute('data-camera');
  await lesson.getByLabel('Secondo peso valore', {exact:true}).fill('2');
  await expect(lesson.getByTestId('weighted-total')).toHaveText('1.5000');
  await expect.poll(() => graph.evaluate((el:any) => el.data[0].z[32][32])).toBeCloseTo(1.5);
  await expect(graph).toHaveAttribute('data-instance-probe', 'preserved');
  expect(await scene.getAttribute('data-camera')).toBe(camera);
  await lesson.getByRole('button', {name:'2D',exact:true}).click();
  const contour = lesson.locator('[data-plot-id="weighted-2d"] .js-plotly-plot');
  await expect.poll(() => contour.evaluate((el:any) => el.data[0].z[32][32])).toBeCloseTo(1.5);
  await lesson.getByLabel('Primo peso valore', {exact:true}).fill('0');
  await lesson.getByLabel('Secondo peso valore', {exact:true}).fill('0');
  await expect(lesson.getByTestId('weighted-total')).toHaveText('0.0000');
  await lesson.getByRole('button', {name:'3D',exact:true}).click();
  await expect.poll(() => lesson.locator('[data-plot-id="weighted-3d"] .js-plotly-plot').evaluate((el:any) =>
    el.data[0].z.every((row:number[]) => row.every(v => v === 0)))).toBe(true);
  expect((await geometry(lesson)).bottom).toBeLessThanOrEqual(1241);
});
test('p12: perturbazioni non ricalcolano le superfici, errore nullo quando Δx=0', async ({page}) => {
  const lesson = await openLesson(page, 12);
  const graph = lesson.locator('[data-plot-id="linearization-3d"] .js-plotly-plot');
  await graph.evaluate((el:any) => { (window as any).__fixedSurface = el.data[0].z; });
  await lesson.getByLabel('Perturbazione di stato valore', {exact:true}).fill('0');
  await lesson.getByLabel(manifest.pages[11].controls[1].label + ' valore', {exact:true}).fill('0.1');
  await expect(lesson.getByTestId('linearization-exact')).toHaveText('0.1000');
  await expect(lesson.getByTestId('linearization-linear')).toHaveText('0.1000');
  await expect(lesson.getByTestId('linearization-error')).toHaveText('0.0000');
  expect(await graph.evaluate((el:any) => el.data[0].z === (window as any).__fixedSurface)).toBe(true);
});
test('p17: selezione, classificazione e degenerazioni complete', async ({page}) => {
  const lesson = await openLesson(page, 17);
  for (const [point, expected] of [['(0,0)','interno'], ['(1,0)','bordo'], ['(2,0)','non ammissibile']]) {
    await lesson.getByRole('button', {name:'Punto ' + point,exact:true}).click();
    await expect(lesson.getByTestId('constraint-status')).toHaveText(expected);
  }
  await lesson.getByLabel('Livello valore', {exact:true}).fill('0');
  await expect(lesson.getByTestId('constraint-kind')).toHaveText('solo origine');
  await lesson.getByLabel('Livello valore', {exact:true}).fill('-1');
  await expect(lesson.getByTestId('constraint-kind')).toHaveText('insieme vuoto');
  await lesson.getByLabel('Coefficiente prima coordinata valore', {exact:true}).fill('0');
  await lesson.getByLabel('Coefficiente seconda coordinata valore', {exact:true}).fill('0');
  await lesson.getByLabel('Livello valore', {exact:true}).fill('0');
  await expect(lesson.getByTestId('constraint-kind')).toHaveText('tutto il piano');
  await expect(lesson.getByTestId('constraint-status')).toHaveText('ammissibile (g=0)');
  expect((await geometry(lesson)).bottom).toBeLessThanOrEqual(1241);
});
test('p27: playback, selezione collegata e cambio passo in pausa a zero', async ({page}) => {
  const lesson = await openLesson(page, 27);
  await lesson.getByLabel('Campione Euler valore', {exact:true}).fill('2');
  await expect(lesson.getByTestId('euler-state-2')).toHaveText('0.022');
  await expect(lesson.getByTestId('euler-state-3')).toHaveText('0.438');
  await lesson.getByRole('button', {name:'Play',exact:true}).click();
  await expect(lesson.getByRole('button', {name:'Pausa',exact:true})).toBeVisible();
  await lesson.getByLabel('Passo', {exact:true}).selectOption('0.02');
  await expect(lesson.getByLabel('Campione Euler valore', {exact:true})).toHaveValue('0');
  await expect(lesson.getByRole('button', {name:'Play',exact:true})).toBeVisible();
  await lesson.getByLabel('Campione Euler valore', {exact:true}).fill('5');
  await lesson.getByRole('button', {name:'2D',exact:true}).click();
  await expect.poll(() => lesson.locator('[data-plot-id="euler-2d"] .js-plotly-plot').evaluate((el:any) =>
    el.data.filter((trace:any) => trace.name === undefined && trace.customdata?.[0] === 'time:0.100000').length)).toBe(2);
});
test('p30: T=1, quota violata, banda vuota e warning persistente', async ({page}) => {
  const lesson = await openLesson(page, 30);
  await expect(lesson.getByTestId('path-index-timeline')).toContainText('u₀');
  await expect(lesson.getByTestId('path-index-timeline')).toContainText('x₁');
  await expect(lesson.getByTestId('path-index-timeline')).not.toContainText('u₁');
  await lesson.getByLabel('Quota candidata valore', {exact:true}).fill('3.2');
  await expect(lesson.getByTestId('path-violation')).toHaveText('0.20');
  await lesson.getByLabel('Limite inferiore valore', {exact:true}).fill('4');
  await lesson.getByLabel('Limite superiore valore', {exact:true}).fill('1');
  await expect(lesson.getByTestId('path-status')).toHaveText('insieme vuoto');
  await lesson.getByRole('button', {name:'3D',exact:true}).click();
  await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
  await expect(lesson.getByRole('note')).toContainText('Gli ingressi usano');
});
test('sessione: parametri locali, cleanup scene e 28 placeholder invariati', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await openLesson(page, 16);
  await page.getByLabel('Secondo peso valore', {exact:true}).fill('3');
  for (const number of [17, 27, 34, 1, 16]) {
    await page.locator('.companion-scroll').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.getByLabel('Numero pagina').fill(String(number));
    await page.getByRole('button', {name:'Vai alla pagina'}).click();
    await expect(page.locator('canvas[data-rendered-page="' + number + '"]')).toBeVisible();
    await expect(page.getByLabel('Companion pagina ' + number, {exact:true})).toBeVisible();
    expect(await page.locator('.companion-scroll').evaluate(el => el.scrollTop)).toBe(0);
    expect(await page.locator('.scene-viewport').count()).toBeLessThanOrEqual(1);
    if (number === 1) {
      await expect(page.getByText('Companion pianificata', {exact:true})).toBeVisible();
      await expect(page.locator('.scene-viewport canvas')).toHaveCount(0);
    }
  }
  await expect(page.getByLabel('Secondo peso valore', {exact:true})).toHaveValue('3');
  await expect(page.getByTestId('weighted-total')).toHaveText('2.0000');
  expect(errors).toEqual([]);
});
