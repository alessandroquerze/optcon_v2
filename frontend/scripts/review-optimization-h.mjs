import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'55,56,57,58,59,60,61,62').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_h_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_H_assets/',root)),'Docs/Optimization_H_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
const choose=async(label,value)=>{await page.getByLabel(label,{exact:true}).selectOption(String(value));await ready();};
const capture=async name=>{await screenshot(name);expect(fits(await measure())).toBe(true);};
const view=async(name)=>{await lesson().getByRole('button',{name,exact:true}).click();await ready();};
const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
try{
 for(const n of selection){
  if(n===55){
   await page.goto(base+'/#/study?doc=optimization&page=55');await ready();await expect(page.locator('canvas[data-rendered-page="55"]')).toBeVisible();
   await screenshot('p55-static');pages.push({page:55,views:[{view:'static',screenshot:'Docs/Optimization_H_assets/p55-static.png',...await measure()}]});
  }else pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
  const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);let text=await readFile(url,'utf8');
  text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–54 complete; H 55–'+n+' esaminate, revisione in corso.');
  text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione visiva e interattiva H.');await writeFile(url,text);
 }
 await check('all constraints intersect and moving cost target preserves equality',async()=>{
  await open(56);await expect(page.getByTestId('opt56-minimum')).toHaveText('(0.0000, 0.0000)');
  await fill('Ordinata della sonda',.1);await expect(page.getByTestId('opt56-verdict')).toContainText('inammissibile');await capture('p56-equality-violation');
  await fill('Ordinata della sonda',0);await fill('Ascissa della sonda',1.2);await expect(page.getByTestId('opt56-verdict')).toContainText('inammissibile');
  await fill('Bersaglio orizzontale',.5);await fill('Bersaglio verticale',-1);await expect(page.getByTestId('opt56-minimum')).toHaveText('(0.5000, 0.0000)');
  await view('3D');await capture('p56-shifted-cost-3d');
 });
 await check('active gradients regularity redundancy and zero normals are distinct',async()=>{
  await open(57);await expect(page.getByTestId('opt57-active')).toHaveText('{1}');await expect(page.getByTestId('opt57-regular')).toHaveText('sì');
  await choose('Rappresentazione',1);await expect(page.getByTestId('opt57-rank')).toHaveText('2 / 3');await capture('p57-redundant');
  await fill('Punto sul segmento',.5);await expect(page.getByTestId('opt57-active')).toHaveText('∅');await expect(page.getByTestId('opt57-regular')).toHaveText('sì');
  await choose('Rappresentazione',2);await expect(page.getByTestId('opt57-rank')).toHaveText('0 / 1');await capture('p57-zero-equality-gradient');
  await choose('Rappresentazione',3);await fill('Punto sul segmento',0);await expect(page.getByTestId('opt57-rank')).toHaveText('1 / 2');await capture('p57-zero-active-gradient');
  await fill('Punto sul segmento',1);await expect(page.getByTestId('opt57-active')).toHaveText('{2}');await expect(page.getByTestId('opt57-regular')).toHaveText('sì');
 });
 await check('fixed price Lagrangian keeps signed contributions and original feasibility',async()=>{
  await open(58);await expect(page.getByTestId('opt58-total')).toHaveText('0.4300');
  await expect(lesson().locator('.source-note')).toContainText('tutte le variabili');
  await fill('Moltiplicatore disuguaglianza',0);await expect(page.getByTestId('opt58-verdict')).toContainText('inammissibile');await capture('p58-free-minimum-infeasible');
  await fill('Moltiplicatore disuguaglianza',-1);await fill('Moltiplicatore uguaglianza',2);await view('3D');await capture('p58-real-multipliers-3d');
  await fill('Ordinata della sonda',1);await expect(page.getByTestId('opt58-terms')).toHaveText('(0.5000, 2.0000)');
 });
 await check('same smooth constrained minimum can fail regularity and multiplier existence',async()=>{
  await open(59);await expect(page.getByTestId('opt59-regular')).toContainText('✓');
  await choose('Rappresentazione',1);await expect(page.getByTestId('opt59-regular')).toContainText('✗');await expect(page.getByTestId('opt59-verdict')).toContainText('nessun μ₁');await capture('p59-nonregular-minimum');
 });
 await check('KKT balances active sets zero active multipliers and complementarity',async()=>{
  await open(60);await expect(page.getByTestId('opt60-stationarity')).toHaveText('0.0000');await expect(page.getByTestId('opt60-verdict')).toContainText('KKT soddisfatte');
  await fill('Bersaglio orizzontale',0);await lesson().getByRole('button',{name:'Usa moltiplicatori KKT',exact:true}).click();await ready();
  await expect(page.getByTestId('opt60-active')).toHaveText('{1}');await expect(page.getByTestId('opt60-verdict')).toContainText('attivo può avere μ=0');await capture('p60-active-zero-multiplier');
  await fill('Bersaglio orizzontale',.5);await fill('Moltiplicatore sinistro',.2);await fill('Moltiplicatore destro',.2);
  await expect(page.getByTestId('opt60-stationarity')).toHaveText('0.0000');expect(Number(await page.getByTestId('opt60-complementarity').textContent())).toBeGreaterThan(0);await capture('p60-stationary-not-complementary');
  await fill('Bersaglio orizzontale',1.5);await lesson().getByRole('button',{name:'Usa moltiplicatori KKT',exact:true}).click();await ready();await expect(page.getByTestId('opt60-active')).toHaveText('{2}');
  await view('3D');await capture('p60-right-boundary-3d');await fill('Moltiplicatore uguaglianza',-1);await expect(page.getByTestId('opt60-verdict')).toContainText('fallisce');
 });
 await check('tangent curvature distinguishes local and finite changes including zero curvature',async()=>{
  await open(61);await expect(page.getByTestId('opt61-change')).toHaveText('-0.1094');
  await fill('Curvatura tangente',0);await expect(page.getByTestId('opt61-change')).toHaveText('0.0156');await expect(page.getByTestId('opt61-verdict')).toContainText('Minimo stretto piatto');await capture('p61-zero-curvature-minimum');
  await fill('Curvatura tangente',-.25);await fill('Spostamento ammissibile',1);expect(Number(await page.getByTestId('opt61-change').textContent())).toBeGreaterThan(0);await capture('p61-local-versus-finite');
  await fill('Spostamento ammissibile',0);await expect(page.getByTestId('opt61-change')).toHaveText('0.0000');
 });
 await check('all four KKT point types retain feasibility and zero residuals',async()=>{
  await open(62);
  for(const [kind,word] of [[0,'Minimo stretto:'],[1,'Massimo locale'],[2,'Minimo stretto piatto'],[3,'Ogni punto']]){
   await choose('Tipo di costo',kind);await expect(page.getByTestId('opt62-kkt')).toHaveText('tutti zero');await expect(page.getByTestId('opt62-verdict')).toContainText(word);
   for(const v of ['2D','3D']){await view(v);await capture('p62-kind-'+kind+'-'+v.toLowerCase());}
  }
 });
 await check('fullscreen view camera and parameter state persist across cost changes',async()=>{
  await open(62);await view('3D');await lesson().getByRole('button',{name:'Zoom avanti Funzione e vincoli sulla superficie',exact:true}).click();
  const scene=lesson().locator('[data-plot-id="optimization-opt62-curvature-3d"]'),camera=await scene.getAttribute('data-camera');
  await choose('Tipo di costo',2);await expect(scene).toHaveAttribute('data-camera',camera);await expect(lesson().locator('.function-explorer')).toHaveAttribute('data-current-view','3D');
  await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();await fill('Sonda ammissibile',.8);
  await page.screenshot({path:fileURLToPath(new URL('Docs/Optimization_H_assets/p62-fullscreen.png',root))});await page.keyboard.press('Escape');await ready();
  await expect(scene).toHaveAttribute('data-camera',camera);await expect(page.getByLabel('Sonda ammissibile valore',{exact:true})).toHaveValue('0.8');expect(fits(await measure())).toBe(true);
 });
 await check('completed lessons source PDF and next batch placeholder remain preserved',async()=>{
  for(const href of ['#/study?doc=optimization&page=54','#/study?doc=optimization&page=46','#/study?page=12','#/study?page=16','#/study?page=17','#/study?page=27','#/study?page=34']){
   await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
   if(href.endsWith('page=16')||href.endsWith('page=34'))await screenshot('reference-introduction-'+href.split('page=')[1]);
  }
  await page.goto(base+'/#/study?doc=optimization&page=63');await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
  await expect(page.locator('canvas[data-rendered-page="63"]')).toBeVisible();
 });
 const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
 expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
 pages.sort((a,b)=>a.page-b.page);
 const success=pages.length===8&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
 await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
 console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
