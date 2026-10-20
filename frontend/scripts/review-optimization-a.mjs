import { chromium,expect } from '@playwright/test';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const folder=new URL('Docs/Optimization_A_assets/',root);await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pages=[],errors=[];
try{
  const page=await browser.newPage({viewport:{width:2300,height:1650}});
  page.on('pageerror',e=>errors.push({message:e.message,url:page.url()}));
  const lesson=()=>page.locator('.lesson-page');
  const ready=async()=>{
    await expect(lesson()).toBeVisible();
    for(const scene of await lesson().locator('.scene-viewport').all())await expect(scene).toHaveAttribute('data-plot-ready','true');
    await page.evaluate(()=>document.fonts.ready);
    await expect.poll(()=>lesson().locator('.scene-viewport').evaluateAll(scenes=>scenes.every(scene=>{
      const graph=scene.querySelector('.js-plotly-plot'),surface=scene.querySelector('.plot-surface');
      return graph?._fullLayout&&Math.abs(graph._fullLayout.width-surface.clientWidth)<3&&Math.abs(graph._fullLayout.height-surface.clientHeight)<3;
    }))).toBe(true);
  };
  const measure=()=>lesson().evaluate(e=>{
    const box=e.getBoundingClientRect(),scale=box.width/960;
    const blocks=Array.from(e.children).map(child=>{const b=child.getBoundingClientRect();return{class:child.className,top:(b.top-box.top)/scale,bottom:(b.bottom-box.top)/scale};});
    return {height:e.clientHeight,scroll:e.scrollHeight,blocks,
      formula_overflow:Array.from(e.querySelectorAll('.equation')).filter(x=>!x.closest('details:not([open])')&&!x.closest('.formula-reference')&&x.scrollWidth>x.clientWidth+2).map(x=>({width:x.clientWidth,scroll:x.scrollWidth})),
      alerts:Array.from(e.querySelectorAll('[role=alert]')).map(x=>x.textContent),
      outputs:Object.fromEntries(Array.from(e.querySelectorAll('output[data-testid]')).map(x=>[x.dataset.testid,x.textContent]))};
  });
  for(let n=1;n<=9;n++){
    await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();
    await expect(page.locator('canvas[data-rendered-page="'+n+'"]')).toBeVisible();
    const views=manifest.pages[n-1].visualization.presentation.toggle,records=[];
    for(const view of views.length?views:['2D']){
      if(views.length)await lesson().getByRole('button',{name:view,exact:true}).click();await ready();
      await page.mouse.move(0,0);
      const file='p'+String(n).padStart(2,'0')+'-'+view.toLowerCase()+'.png';
      await lesson().screenshot({path:fileURLToPath(new URL(file,folder))});
      const geometry=await measure();records.push({view,screenshot:'Docs/Optimization_A_assets/'+file,...geometry});
      console.log(JSON.stringify({page:n,view,scroll:geometry.scroll,bottom:geometry.blocks.at(-1)?.bottom,overflow:geometry.formula_overflow,alerts:geometry.alerts}));
      const formulas=lesson().getByRole('button',{name:/Formule e prerequisiti/});
      if(await formulas.count()){
        await formulas.click();expect(await lesson().locator('.formula-reference [role=alert]').count()).toBe(0);
        await lesson().getByRole('button',{name:'Chiudi',exact:true}).click();
      }
    }
    // Expand the actual graphic boundary (including the composite matrix view).
    const expand=lesson().locator('[data-graphic-owner=true] > .graphic-expand').first();
    if(await expand.count()){
      await page.setViewportSize({width:1500,height:1000});await ready();await expand.click();
      await expect(lesson()).toHaveAttribute('data-graphic-fullscreen',/native|popover/);await ready();
      if(n===7){
        for(const svg of await lesson().locator('.matrix-diagram').all())expect((await svg.boundingBox()).height).toBeGreaterThan(150);
        await page.screenshot({path:fileURLToPath(new URL('p07-fullscreen.png',folder))});
      }
      await page.keyboard.press('Escape');await expect(lesson()).not.toHaveAttribute('data-graphic-fullscreen');
      await page.setViewportSize({width:2300,height:1650});await ready();
    }
    pages.push({page:n,views:records});
    const progressUrl=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);
    let progress=await readFile(progressUrl,'utf8');
    progress=progress.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–'+n+'; geometria e contenuti visivi ancora in revisione fino alla chiusura del batch.');
    progress=progress.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; prima revisione browser eseguita.');
    await writeFile(progressUrl,progress);
  }

  // Numerical interactions: check what the learner actually sees, not only plot presence.
  const open=async n=>{
    await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();
    await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();
  };
  const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
  await open(3);
  await fill('Inclinazione',0);
  await expect(page.getByTestId('opt03-classification')).toHaveText('locale stretto · globale, con pareggio');
  await fill('Inclinazione',.5);await page.getByLabel('Punto da classificare',{exact:true}).selectOption('1');
  await fill('Raggio dell’intorno',1.5);
  await expect(page.getByTestId('opt03-classification')).toHaveText('locale stretto · non globale');
  await expect(lesson()).toContainText('Questo raggio include punti meno costosi');
  await page.getByLabel('Punto da classificare',{exact:true}).selectOption('2');
  await expect(page.getByTestId('opt03-classification')).toHaveText('non è un minimo · non globale');
  await expect(lesson()).toContainText('arbitrariamente vicini');
  await open(4);
  await expect(page.getByTestId('opt04-value')).toHaveText('1.00');
  await page.getByLabel('Funzione visualizzata',{exact:true}).selectOption('1');
  await expect(page.getByTestId('opt04-value')).toHaveText('-1.00');
  await page.getByLabel('Punto del profilo',{exact:true}).selectOption('0');
  await expect(page.getByTestId('opt04-classification')).toContainText('Massimo globale stretto');
  await open(5);await fill('Posizione del minimo',-1.2);await fill('Valore minimo',-.5);
  await expect(page.getByTestId('opt05-argmin')).toHaveText('-1.20');await expect(page.getByTestId('opt05-min')).toHaveText('-0.50');
  await open(6);await fill('Prima coordinata',0);await fill('Seconda coordinata',0);await fill('Accoppiamento',-1);
  await expect(page.getByTestId('opt06-value')).toHaveText('0.000');
  expect(await lesson().locator('[role=alert]').count()).toBe(0);
  const derivativeLatex=await lesson().locator('.opt-derivative-values annotation').allTextContents();
  expect(derivativeLatex).toEqual(['\\begin{bmatrix}0.00\\\\0.00\\end{bmatrix}','\\begin{bmatrix}1&-1.00\\\\-1.00&2\\end{bmatrix}']);
  await lesson().getByRole('button',{name:'2D',exact:true}).click();await ready();
  const originArrow=await lesson().locator('.js-plotly-plot').evaluate(graph=>graph.data[1]);
  expect(originArrow.x).toEqual([0,0]);expect(originArrow.y).toEqual([0,0]);
  expect(originArrow.marker.size[1]).toBe(0); // A zero gradient must not invent a direction.
  await open(7);
  await lesson().getByRole('button',{name:'r₃, z₂: 2.00',exact:true}).click();
  await expect(page.getByTestId('opt07-selected')).toContainText('∂r₃/∂z₂ = 2.00');
  expect(await lesson().locator('.matrix-entry[aria-pressed=true]').count()).toBe(2);
  await lesson().getByRole('button',{name:'z₁, r₁: 2.00',exact:true}).focus();await page.keyboard.press('Enter');
  await fill('Prima coordinata',1.7);
  await expect(page.getByTestId('opt07-selected')).toContainText('∂r₁/∂z₁ = 3.40');
  await open(8);
  for(const [choice,classification] of [['3','minimo globale stretto'],['4','massimo globale stretto']]){
    await page.getByLabel('Funzione dell’esempio',{exact:true}).selectOption(choice);await ready();
    await expect(page.getByTestId('opt08-first')).toHaveText('sì');await expect(page.getByTestId('opt08-second')).toHaveText('sì');
    await expect(page.getByTestId('opt08-eigenvalues')).toHaveText('0, 0');
    await expect(page.getByTestId('opt08-classification')).toHaveText('Nel modello: '+classification+'.');
    const geometry=await measure();expect(geometry.scroll).toBe(1280);expect(geometry.blocks.at(-1).bottom).toBeLessThanOrEqual(1241);
  }
  await lesson().getByRole('button',{name:'2D',exact:true}).click();await ready();
  await lesson().screenshot({path:fileURLToPath(new URL('p08-degenerate-2d.png',folder))});
  await open(9);await fill('Curvatura al punto',0);await fill('Termine di ordine quattro',1);
  await expect(page.getByTestId('opt09-verdict')).toContainText('non si applica');
  await expect(page.getByTestId('opt09-classification')).toHaveText('Nel modello: minimo stretto globale.');
  await fill('Termine di ordine quattro',0);
  await expect(page.getByTestId('opt09-classification')).toHaveText('Nel modello: minimo non stretto globale.');
  await fill('Curvatura al punto',-1);
  await expect(page.getByTestId('opt09-classification')).toContainText('sella');

  // Document/page/parameter identity: same physical page number must not cross courses.
  await page.goto(base+'/#/study?page=16');await ready();
  await page.getByLabel('Secondo peso valore',{exact:true}).fill('2');
  await page.getByLabel('Documento del corso').selectOption('optimization');
  await expect(page.locator('.study-shell')).toHaveAttribute('data-document-id',manifest.document_id);await ready();
  await page.getByLabel('Numero pagina').fill('5');await page.getByRole('button',{name:'Vai alla pagina'}).click();await ready();
  await page.getByLabel('Posizione del minimo valore',{exact:true}).fill('1.3');
  await expect(page.getByTestId('opt05-argmin')).toHaveText('1.30');
  await page.getByLabel('Documento del corso').selectOption('introduction');
  await expect(page.locator('.lesson-page')).toHaveAttribute('data-source-page','16');await ready();
  await expect(page.getByLabel('Secondo peso valore',{exact:true})).toHaveValue('2');
  await page.getByLabel('Documento del corso').selectOption('optimization');await ready();
  await expect(lesson()).toHaveAttribute('data-source-page','5');await expect(page.getByTestId('opt05-argmin')).toHaveText('1.30');
  await page.getByLabel('Numero pagina').fill('16');await page.getByRole('button',{name:'Vai alla pagina'}).click();
  await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();expect(await page.getByTestId('weighted-total').count()).toBe(0);
  await expect(page.locator('canvas[data-rendered-page="16"]')).toBeVisible();
  for(const n of [12,16,17,27,34]){
    await page.goto(base+'/#/study?page='+n);await ready();
    expect(await lesson().locator('[role=alert]').count()).toBe(0);
    await lesson().screenshot({path:fileURLToPath(new URL('introduction-reference-'+n+'.png',folder))});
  }
  const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
  expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
  const success=errors.length===0&&pages.every(p=>p.views.every(v=>v.height===1280&&v.scroll<=1281&&!v.alerts.length&&!v.formula_overflow.length&&v.blocks.every(b=>b.bottom<=1241)));
  await writeFile(new URL('Data/reports/optimization_batch_a_visual.json',root),JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,errors,interactive_edge_cases:'PASS',multi_document_state:'PASS',pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
  if(!success)process.exitCode=1;
}finally{await browser.close();}
