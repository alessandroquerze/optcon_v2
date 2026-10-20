import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'63,64,65,66,67,68').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_i_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_I_assets/',root)),'Docs/Optimization_I_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
const choose=async(label,value)=>{await page.getByLabel(label,{exact:true}).selectOption(String(value));await ready();};
const capture=async name=>{await screenshot(name);expect(fits(await measure())).toBe(true);};
const view=async name=>{await lesson().getByRole('button',{name,exact:true}).click();await ready();};
const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
try{
 for(const n of selection){
  pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
  const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);let text=await readFile(url,'utf8');
  text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–62 complete; I 63–'+n+' esaminate, revisione in corso.');
  text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione visiva e interattiva I.');await writeFile(url,text);
 }
 await check('zero stationarity and nonnegative weights do not replace complementarity',async()=>{
  await open(63);await expect(page.getByTestId('opt63-sum')).toHaveText('0.0000');
  await choose('Moltiplicatori',1);expect(Math.abs(Number(await page.getByTestId('opt63-second').textContent()))).toBeCloseTo(.4);
  await expect(page.getByTestId('opt63-verdict')).toContainText('complementarità violata');await capture('p63-closed-balance-failed-products');
  await fill('Bersaglio orizzontale',.5);await expect(page.getByTestId('opt63-first')).toHaveText('-0.2000');await capture('p63-two-inactive-constraints');
  await choose('Moltiplicatori',0);await fill('Bersaglio orizzontale',0);await expect(page.getByTestId('opt63-verdict')).toContainText('Tutte le KKT');
 });
 await check('circle candidate retains first order while finite feasible costs change',async()=>{
  await open(64);await expect(page.getByTestId('opt64-change')).toHaveText('0.3125');await expect(page.getByTestId('opt64-regular')).toHaveText('1.0000');
  await fill('Termine verticale',-1);await expect(page.getByTestId('opt64-lambda')).toHaveText('-1.0000');
  await expect(page.getByTestId('opt64-verdict')).toContainText('non è minimo');await capture('p64-first-order-not-minimum');
  await fill('Sonda sul vincolo',0);await expect(page.getByTestId('opt64-change')).toHaveText('0.0000');
  await fill('Curvatura del costo',0);await fill('Termine verticale',0);await fill('Sonda sul vincolo',180);await capture('p64-constant-cost');
 });
 await check('Lagrangian curvature includes the constraint and only tangent directions are tested',async()=>{
  await open(65);await expect(page.getByTestId('opt65-form')).toHaveText('0.5000');await expect(page.getByTestId('opt65-tangent')).toHaveText('0.0000');
  await fill('Curvatura del costo',2);await fill('Moltiplicatore esatto',-1);await expect(page.getByTestId('opt65-reduced')).toHaveText('1.0000');
  await fill('Direzione da esaminare',90);await expect(page.getByTestId('opt65-form')).toHaveText('-1.0000');
  await expect(page.getByTestId('opt65-verdict')).toContainText('esclusa');await capture('p65-negative-normal-excluded');
  await fill('Direzione da esaminare',0);await fill('Curvatura del costo',-1);await fill('Moltiplicatore esatto',1);
  await expect(page.getByTestId('opt65-reduced')).toHaveText('0.0000');await expect(page.getByTestId('opt65-verdict')).toContainText('Minimo stretto piatto');
  await view('3D');await capture('p65-zero-curvature-strict-minimum-3d');
 });
 await check('QP separates tangent normal curvatures and moving the affine set',async()=>{
  await open(66);await expect(page.getByTestId('opt66-cost')).toHaveText('-0.1875');await expect(page.getByTestId('opt66-verdict')).toContainText('Q indefinita');
  await fill('Posizione della retta',0);const before=await page.getByTestId('opt66-cost').textContent();await fill('Curvatura normale',2);
  await expect(page.getByTestId('opt66-cost')).toHaveText(before);await capture('p66-normal-curvature-invariant-profile');
  await fill('Curvatura tangente',0);await expect(page.getByTestId('opt66-verdict')).toContainText('nessun minimo');await capture('p66-linear-unbounded');
  await fill('Curvatura tangente',-1);await view('3D');await capture('p66-negative-tangent-3d');
 });
 await check('QP KKT system distinguishes unique incompatible families and redundant multipliers',async()=>{
  await open(67);await expect(page.getByTestId('opt67-system')).toHaveText('soluzione unica');await expect(page.getByTestId('opt67-point')).toHaveText('(0.6036, -0.1036)');
  await choose('Vincoli',1);await expect(page.getByTestId('opt67-system')).toHaveText('infinite soluzioni');
  await expect(page.getByTestId('opt67-verdict')).toContainText('moltiplicatori non unici');await capture('p67-redundant-multipliers');
  await fill('Curvatura tangente',0);await expect(page.getByTestId('opt67-system')).toHaveText('incompatibile');await expect(page.getByTestId('opt67-point')).toHaveText('non esiste');await capture('p67-incompatible');
  await fill('Termine tangente',0);await expect(page.getByTestId('opt67-system')).toHaveText('infinite soluzioni');await expect(page.getByTestId('opt67-verdict')).toContainText('Ogni punto');await capture('p67-affine-family');
  await choose('Vincoli',0);await fill('Curvatura tangente',-1);await fill('Termine tangente',-.5);await expect(page.getByTestId('opt67-system')).toHaveText('soluzione unica');
  await expect(page.getByTestId('opt67-verdict')).toContainText('massimo');await view('3D');await capture('p67-unique-maximum-3d');
  await fill('Curvatura tangente',.000001);await expect(page.getByTestId('opt67-point')).toContainText('e+5');await capture('p67-small-nonzero-curvature');
 });
 await check('correct nullspace test distinguishes excluded directions from failure of first order',async()=>{
  await open(68);await expect(lesson().locator('.source-warning')).toContainText('Ay=0 e ker(A)');
  await expect(page.getByTestId('opt68-Ay')).toHaveText('0.0000');await expect(page.getByTestId('opt68-form')).toHaveText('1.0000');
  await fill('Direzione di prova',90);await expect(page.getByTestId('opt68-form')).toHaveText('-1.0000');await expect(page.getByTestId('opt68-verdict')).toContainText('esclusa');await capture('p68-negative-normal-excluded');
  await fill('Direzione di prova',0);await fill('Curvatura tangente',0);await expect(page.getByTestId('opt68-verdict')).toContainText('incompatibile');await capture('p68-zero-test-no-minimum');
  await fill('Termine lineare',0);await expect(page.getByTestId('opt68-verdict')).toContainText('Ogni punto');await capture('p68-zero-test-all-minima');
  await fill('Curvatura tangente',-1);await expect(page.getByTestId('opt68-form')).toHaveText('-1.0000');await capture('p68-negative-admissible-direction');
 });
 await check('fullscreen preserves camera and controls across the same mathematical scene',async()=>{
  await open(68);await view('3D');await lesson().getByRole('button',{name:'Zoom avanti Costo e uguaglianza sulla superficie',exact:true}).click();
  const scene=lesson().locator('[data-plot-id="optimization-opt68-curvature-3d"]'),camera=await scene.getAttribute('data-camera');
  await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();await fill('Curvatura normale',1);
  await page.screenshot({path:fileURLToPath(new URL('Docs/Optimization_I_assets/p68-fullscreen.png',root))});
  await page.keyboard.press('Escape');await ready();await expect(scene).toHaveAttribute('data-camera',camera);
  await expect(page.getByLabel('Curvatura normale valore',{exact:true})).toHaveValue('1');expect(fits(await measure())).toBe(true);
 });
 await check('previous companions PDF and next batch placeholder remain intact',async()=>{
  for(const href of ['#/study?doc=optimization&page=62','#/study?doc=optimization&page=58','#/study?doc=optimization&page=54','#/study?page=12','#/study?page=16','#/study?page=17','#/study?page=27','#/study?page=34']){
   await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
   if(href.endsWith('page=16')||href.endsWith('page=34'))await screenshot('reference-introduction-'+href.split('page=')[1]);
  }
  await page.goto(base+'/#/study?doc=optimization&page=69');await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
  await expect(page.locator('canvas[data-rendered-page="69"]')).toBeVisible();
 });
 const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
 expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
 pages.sort((a,b)=>a.page-b.page);
 const success=pages.length===6&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
 await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
 console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
