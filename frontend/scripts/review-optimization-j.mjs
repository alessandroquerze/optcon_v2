import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'69,70,71,72,73,74').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_j_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_J_assets/',root)),'Docs/Optimization_J_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
const capture=async name=>{await screenshot(name);expect(fits(await measure())).toBe(true);};
const view=async name=>{await lesson().getByRole('button',{name,exact:true}).click();await ready();};
const button=async name=>{await lesson().getByRole('button',{name,exact:true}).click();await ready();};
const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
try{
 for(const n of selection){
  if(n===69){
   await page.goto(base+'/#/study?doc=optimization&page=69');await ready();await expect(page.locator('canvas[data-rendered-page="69"]')).toBeVisible();
   await screenshot('p69-static');pages.push({page:69,views:[{view:'static',screenshot:'Docs/Optimization_J_assets/p69-static.png',...await measure()}]});
  }else pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
  const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);let text=await readFile(url,'utf8');
  text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–68 complete; J 69–'+n+' esaminate, revisione in corso.');
  text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione visiva e interattiva J.');await writeFile(url,text);
 }
 await check('joint residual distinguishes feasibility stationarity and nonminimal roots',async()=>{
  await open(70);await expect(page.getByTestId('opt70-feasibility')).toHaveText('0.0000');await expect(page.getByTestId('opt70-total')).toHaveText('0.6325');
  await button('Minimo KKT');await expect(page.getByTestId('opt70-verdict')).toContainText('minimo noto');await capture('p70-minimum-root');
  await button('Massimo KKT');await expect(page.getByTestId('opt70-total')).toHaveText('0.0000');await expect(page.getByTestId('opt70-verdict')).toContainText('massimo locale');await capture('p70-maximum-root');
  await fill('Moltiplicatore corrente',.5);await expect(page.getByTestId('opt70-total')).toHaveText('0.5000');
  await fill('Ascissa corrente',1.2);await fill('Ordinata corrente',1.5);await fill('Moltiplicatore corrente',1.5);
  await expect(lesson().locator('.annotation-text').filter({hasText:'Componenti oltre la scala fissa'})).toHaveCount(1);await capture('p70-fixed-scale-overrun');
 });
 await check('Newton moves primal and dual variables and can converge to a constrained maximum',async()=>{
  await open(71);await button('Passo');await expect(page.getByTestId('opt71-h')).toHaveText('-0.0400');await capture('p71-first-newton-step');
  await fill('Ascissa iniziale',0);await fill('Ordinata iniziale',.4);await fill('Moltiplicatore iniziale',1);await button('Passo');
  await expect(page.getByTestId('opt71-status')).toContainText('massimo locale');await expect(page.getByTestId('opt71-total')).toHaveText('0.0000');await capture('p71-newton-maximum');
  await fill('Ascissa iniziale',1);await fill('Ordinata iniziale',1);await fill('Moltiplicatore iniziale',0);await button('Play');
  await fill('Ascissa iniziale',.9);await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('0');await expect(lesson().getByRole('button',{name:'Play',exact:true})).toHaveAttribute('aria-pressed','false');
 });
 await check('linearized feasibility is distinct from exact feasibility and singular cases',async()=>{
  await open(72);await expect(page.getByTestId('opt72-real')).toHaveText('-0.0473');await capture('p72-nonlinear-remainder');
  await button('D=0: famiglia');await expect(page.getByTestId('opt72-status')).toContainText('infinite direzioni');await expect(page.getByTestId('opt72-delta')).toContainText('non univoco');await capture('p72-singular-family');
  await button('D=0: incompatibile');await expect(page.getByTestId('opt72-status')).toContainText('incompatibile');await capture('p72-inconsistent-system');
  await fill('Moltiplicatore corrente',1-1e-9);await expect(page.getByTestId('opt72-delta')).toContainText('e+8');await capture('p72-small-nonzero-pivot');
 });
 await check('QP sufficiency warning is local and negative reduced curvature does not create an argmin',async()=>{
  await open(73);await expect(lesson().locator('.source-warning')).toContainText('curvatura non negativa');await expect(page.getByTestId('opt73-qp')).toHaveText('minimo unico');
  await expect(page.getByTestId('opt73-lambda')).toHaveText('0.4348');await button('QP illimitato');await expect(page.getByTestId('opt73-qp')).toHaveText('illimitato');
  await expect(page.getByTestId('opt73-status')).toContainText('residuo del sistema=0.0000');await expect(page.getByTestId('opt73-lambda')).toContainText('nessun minimo');await capture('p73-invertible-system-unbounded-qp');
  await button('D=0: famiglia');await expect(page.getByTestId('opt73-qp')).toHaveText('minimi multipli');await expect(page.getByTestId('opt73-lambda')).toHaveText('1.0000');await capture('p73-qp-minimum-family');
  await fill('Ascissa corrente',1);await fill('Ordinata corrente',1);await fill('Moltiplicatore corrente',1);await expect(page.getByTestId('opt73-D')).toHaveText('3.0000');
  await expect(page.getByTestId('opt73-qp')).toHaveText('minimo unico');await view('3D');await capture('p73-indefinite-B-positive-reduced-curvature');
 });
 await check('SQP assigns the QP multiplier and explicitly stops without a QP optimum',async()=>{
  await open(74);await expect(page.getByTestId('opt74-current-lambda')).toHaveText('0.2000');await expect(page.getByTestId('opt74-qp-lambda')).toHaveText('0.4348');
  await expect(page.getByTestId('opt74-newton-delta')).toHaveText('0.2348');await button('Passo');await expect(page.getByTestId('opt74-current-lambda')).toHaveText('0.4348');await capture('p74-multiplier-assignment');
  const last=Number(await page.getByLabel('Iterazione slider',{exact:true}).getAttribute('max'));await fill('Iterazione',last);await expect(page.getByTestId('opt74-status')).toContainText('tolleranza');await capture('p74-computed-convergence');
  await fill('Ascissa iniziale',0);await fill('Ordinata iniziale',.4);await fill('Moltiplicatore iniziale',1);
  await expect(page.getByTestId('opt74-status')).toContainText('QP illimitato');await expect(lesson().getByRole('button',{name:'Play',exact:true})).toHaveCount(0);await capture('p74-unbounded-qp-stop');
  await fill('Ordinata iniziale',0);await fill('Moltiplicatore iniziale',.5);await expect(page.getByTestId('opt74-status')).toContainText('infinite direzioni');
  await expect(page.getByTestId('opt74-qp-lambda')).toHaveText('1.0000');await expect(page.getByTestId('opt74-newton-delta')).toHaveText('0.5000');await capture('p74-nonunique-direction-stop');
 });
 await check('fullscreen preserves camera parameters and selected iteration semantics',async()=>{
  await open(74);await view('3D');await lesson().getByRole('button',{name:'Zoom avanti Costo vincolo e passi primal duali',exact:true}).click();
  const scene=lesson().locator('[data-plot-id="optimization-opt74-iterations-3d"]'),camera=await scene.getAttribute('data-camera');
  await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();await fill('Moltiplicatore iniziale',.1);await button('Passo');
  await page.screenshot({path:fileURLToPath(new URL('Docs/Optimization_J_assets/p74-fullscreen.png',root))});await page.keyboard.press('Escape');await ready();
  await expect(scene).toHaveAttribute('data-camera',camera);await expect(page.getByLabel('Moltiplicatore iniziale valore',{exact:true})).toHaveValue('0.1');await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('1');
  expect(fits(await measure())).toBe(true);
 });
 await check('completed companions source rendering and next batch remain preserved',async()=>{
  for(const href of ['#/study?doc=optimization&page=68','#/study?doc=optimization&page=62','#/study?doc=optimization&page=54','#/study?page=12','#/study?page=16','#/study?page=17','#/study?page=27','#/study?page=34']){
   await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
   if(href.endsWith('page=16')||href.endsWith('page=34'))await screenshot('reference-introduction-'+href.split('page=')[1]);
  }
  await page.goto(base+'/#/study?doc=optimization&page=75');await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();await expect(page.locator('canvas[data-rendered-page="75"]')).toBeVisible();
 });
 const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
 pages.sort((a,b)=>a.page-b.page);
 const success=pages.length===6&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
 await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
 console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
