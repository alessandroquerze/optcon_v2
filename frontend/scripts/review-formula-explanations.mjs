import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../../', import.meta.url);
const pages = [2,8,12,16,17,27,30,34];
const url = process.env.F06_1_BASE_URL ?? 'http://127.0.0.1:5173';
const manifest = JSON.parse(await readFile(new URL('Data/introduction_companion_manifest.json', root), 'utf8'));
const directory = new URL('Docs/F06_1_assets/', root);
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true,
  args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const results = [], errors = [];
const failedRequests = [];
try {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failedRequests.push({url:response.url(),status:response.status()}); });
  page.on('requestfailed', request => failedRequests.push({url:request.url(),failure:request.failure()?.errorText}));
  await page.goto(url + '/#/study?page=2');
  const pdfBytes = await (await page.request.get(url + '/course-assets/' + manifest.source_pdf.filename)).body();
  const pdfHash = createHash('sha256').update(pdfBytes).digest('hex');
  if (pdfHash !== manifest.source_pdf.sha256) throw new Error('Il PDF servito non coincide con la fonte.');
  for (const number of pages) {
    const id = String(number).padStart(2, '0');
    if (number !== 2) {
      await page.getByLabel('Numero pagina').fill(String(number));
      await page.getByRole('button', { name: 'Vai alla pagina' }).click();
    }
    await page.locator('canvas[data-rendered-page="' + number + '"]').waitFor();
    const lesson = page.locator('.lesson-page[data-source-page="' + number + '"]');
    await lesson.waitFor();
    if (number !== 2 && number !== 30) await lesson.locator('.scene-viewport[data-plot-ready="true"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: new URL('page-' + id + '-desktop.png', directory).pathname.replace(/^\/([A-Za-z]:)/, '$1'), fullPage: true });
    await page.setViewportSize({ width: 2300, height: 1650 });
    await page.locator('.companion-scroll').evaluate(el => { el.scrollTop = 0; el.scrollLeft = 0; });
    await page.waitForTimeout(450);
    const measure = await lesson.evaluate(el => {
      const box = el.getBoundingClientRect(), scale = box.width / 960;
      return { width: el.clientWidth, height: el.clientHeight, scrollHeight: el.scrollHeight, scale,
        liveOutputs: Object.fromEntries(Array.from(el.querySelectorAll('output[data-testid]')).map(e => [e.getAttribute('data-testid'),e.textContent])),
        unexplainedEquationCards: Array.from(el.querySelectorAll('.equation-card')).filter(e => !e.closest('[data-explained-formula-id]')).length,
        formulaOccurrences: Array.from(el.querySelectorAll('[data-explained-formula-id]')).filter(e => !e.closest('details:not([open])')).map(e => ({formulaId:e.getAttribute('data-explained-formula-id'),concept:e.querySelector('.formula-concept')?.textContent,fontSize:getComputedStyle(e.querySelector('.formula-concept')).fontSize})),
        formulaContexts: Array.from(el.querySelectorAll('[data-formula-reference]')).map(e => ({formulaId:e.getAttribute('data-formula-reference'),text:e.querySelector('p')?.textContent ?? e.textContent})),
        proseWords: Array.from(el.querySelectorAll('p')).map(p => p.textContent).join(' ').split(/\s+/).filter(Boolean).length,
        blocks: Array.from(el.querySelectorAll(':scope > .slide-block')).map(block => {
          const b = block.getBoundingClientRect();
          return { block: block.className, top: (b.top - box.top) / scale, bottom: (b.bottom - box.top) / scale, height: b.height / scale };
        }), formulaOverflow: Array.from(el.querySelectorAll('.explained-equation > .equation-card .equation')).filter(e => !e.closest('details:not([open])') && e.getClientRects().length > 0).map(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth })),
        warnings: Array.from(el.querySelectorAll('.source-warning,.source-note')).map(e => {
          const b = e.getBoundingClientRect();return { text: e.textContent, top: (b.top - box.top) / scale, bottom: (b.bottom - box.top) / scale };
        }), alerts: Array.from(el.querySelectorAll('[role="alert"]')).map(e => e.textContent),
      };
    });
    await lesson.screenshot({ path: new URL('page-' + id + '-companion.png', directory).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
    if (number !== 2) {
      await lesson.getByRole('button', {name:'Formule e prerequisiti',exact:false}).click();
      measure.formulas = await lesson.locator('.formula-reference > [data-formula-id]').evaluateAll(elements => elements.map(el => ({
        formulaId:el.getAttribute('data-formula-id'),
        latex:el.querySelector('[data-canonical-latex]')?.getAttribute('data-canonical-latex'),
        displayedLatex:el.querySelector('annotation[encoding="application/x-tex"]')?.textContent,
        conceptualExplanation:el.querySelector('.formula-concept')?.textContent,
        details:el.querySelector('.formula-detail-content')?.textContent
      })));
      await page.locator('.companion-scroll').evaluate(el => {el.scrollTop=0;el.scrollLeft=0;});
      await lesson.locator('.formula-reference').evaluate(el => {el.scrollTop=0;});
      await lesson.locator('.formula-reference').screenshot({path:new URL('page-' + id + '-formula-reference.png',directory).pathname.replace(/^\/([A-Za-z]:)/,'$1')});
      await lesson.getByRole('button',{name:'Chiudi',exact:true}).click();
    } else measure.formulas = await lesson.locator('[data-explained-formula-id]').evaluateAll(elements => elements.map(el => ({
      formulaId:el.getAttribute('data-explained-formula-id'), latex:el.querySelector('annotation')?.textContent,
      conceptualExplanation:el.querySelector('.formula-concept')?.textContent, details:el.querySelector('.formula-detail-content')?.textContent
    })));

    if ([30,34].includes(number)) {
      const context = lesson.locator('.formula-context').first();
      await context.locator(':scope > details > summary').click();
      await context.locator('.formula-detail-content').first().waitFor();
      await page.locator('.companion-scroll').evaluate(el => {el.scrollTop=0;el.scrollLeft=0;});
      await lesson.screenshot({path:new URL('page-' + id + '-context-details.png',directory).pathname.replace(/^\/([A-Za-z]:)/,'$1')});
      await context.locator(':scope > details > summary').click();
    }
    if (number !== 2) {
      const initial = await lesson.locator('.function-explorer').getAttribute('data-current-view');
      const other = initial === '2D' ? '3D' : '2D';
      await lesson.getByRole('button', { name: other, exact: true }).click();
      await lesson.locator('.scene-viewport[data-plot-ready="true"]').waitFor({ timeout: 30000 });
      await page.waitForTimeout(250);
      await page.locator('.companion-scroll').evaluate(el => {el.scrollTop=0;el.scrollLeft=0;});
      await lesson.screenshot({ path: new URL('page-' + id + '-' + other.toLowerCase() + '.png', directory).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
      measure.alternativeGeometry = await lesson.evaluate(el => {
        const b=el.getBoundingClientRect(),scale=b.width/960;
        return {scrollHeight:el.scrollHeight,bottom:(el.querySelector('.takeaway').getBoundingClientRect().bottom-b.top)/scale};
      });
      measure.defaultView = initial; measure.otherView = other;
      await lesson.getByRole('button', { name: initial, exact: true }).click();
      if (number !== 30) await lesson.locator('.scene-viewport[data-plot-ready="true"]').waitFor();
    }
    results.push({ page: number, expectedMode: manifest.pages[number-1].visualization.visualizationMode, ...measure });
    console.log(JSON.stringify({page:number,scrollHeight:measure.scrollHeight,bottom:measure.blocks.at(-1).bottom,formulaCount:measure.formulas.length,overflows:measure.formulaOverflow.filter(e => e.scrollWidth > e.width+1)}));
    await page.setViewportSize({ width: 1500, height: 1000 });
  }
  const success = errors.length === 0 && failedRequests.length === 0 && results.length === 8 &&
    results.every(result => (!result.alternativeGeometry || (result.alternativeGeometry.scrollHeight <= 1281 && result.alternativeGeometry.bottom <= 1241)) && result.scrollHeight <= 1281 && result.blocks.every(b => b.bottom <= 1241) &&
      result.unexplainedEquationCards === 0 && result.formulas.every(f => f.conceptualExplanation?.trim()) && result.alerts.length === 0 && result.formulaOverflow.every(e => e.scrollWidth <= e.width + 1));
  await writeFile(new URL('Data/reports/f06_1_visual_measurements.json', root), JSON.stringify({
    verified_at: new Date().toISOString(), base_url: url, browser: 'Chrome headless / SwiftShader', pages: results, page_errors: errors,
    failed_requests: failedRequests, original_pdf_sha256: pdfHash, success,
    note: 'Geometry measurements and actual screenshots; visual judgment is recorded separately after inspection.',
  }, null, 2) + '\n');
  if (!success) process.exitCode = 1;
} finally { await browser.close(); }
