import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
const base = process.env.F06_BASE_URL ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch({channel:'chrome',headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-precise-memory-info',
]});
try {
  const page = await browser.newPage({viewport:{width:1500,height:1000}});
  await page.goto(base + '/#/study?page=16');
  const scene = page.locator('[data-plot-id="weighted-3d"]');
  await scene.locator('canvas').first().waitFor();
  await scene.locator('.js-plotly-plot').evaluate(el => el.setAttribute('data-measurement-instance','retained'));
  await page.getByLabel('Zoom avanti Superficie 3D',{exact:true}).click();
  const camera = await scene.getAttribute('data-camera');
  const before = await page.evaluate(() => performance.memory?.usedJSHeapSize ?? null);
  const updates = [];
  for (const w2 of [1,2,3,4,5]) {
    const previous = Number(await scene.getAttribute('data-render-count'));
    const start = performance.now();
    await page.getByLabel('Secondo peso valore',{exact:true}).fill(String(w2));
    await page.waitForFunction(({w2,previous}) => {
      const outer = document.querySelector('[data-plot-id="weighted-3d"]');
      const graph = outer?.querySelector('.js-plotly-plot');
      return Number(outer?.getAttribute('data-render-count')) > previous && Math.abs(graph?.data?.[0]?.z?.[32]?.[32] - (.5 + .5*w2)) < 1e-12;
    },{w2,previous});
    updates.push({w2,input_to_updated_plot_ms:Math.round(performance.now() - start)});
  }
  const preserved = {
    dom_instance:await scene.locator('.js-plotly-plot').getAttribute('data-measurement-instance') === 'retained',
    camera:await scene.getAttribute('data-camera') === camera,
  };
  const navigation = [];
  for (const number of [12,17,27,30,34,1]) {
    await page.getByLabel('Numero pagina').fill(String(number));
    await page.getByRole('button',{name:'Vai alla pagina'}).click();
    await page.locator('canvas[data-rendered-page="' + number + '"]').waitFor();
    await page.getByLabel('Companion pagina ' + number,{exact:true}).waitFor();
    if (number !== 1 && number !== 30)
      await page.locator('.lesson-page[data-source-page="' + number + '"] [data-plot-ready="true"]').waitFor();
    navigation.push({page:number,scene_count:await page.locator('.scene-viewport').count(),gl_canvas_count:await page.locator('.scene-viewport canvas').count()});
  }
  const after = await page.evaluate(() => performance.memory?.usedJSHeapSize ?? null);
  const result = {verified_at:new Date().toISOString(),base_url:base,
    environment:'Chrome headless / SwiftShader; not a physical GPU benchmark',
    grid:[49,49],updates,preserved,navigation,usedJSHeapBefore:before,usedJSHeapAfterUnmount:after,
    interpretation:'Times include automation and software rendering. No forced GC; heap samples do not prove absence of leaks. No lesson scene or WebGL canvas remains on placeholder page 1.'};
  if (!preserved.dom_instance || !preserved.camera || navigation.some(p => p.scene_count > 1) ||
      navigation.at(-1).scene_count !== 0 || navigation.at(-1).gl_canvas_count !== 0) throw new Error('Regressione del ciclo di vita dei grafici.');
  await writeFile(new URL('Data/reports/f06_runtime_measurements.json',root),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally { await browser.close(); }
