import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'75,76,77,78,79,80,81').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_k_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_K_assets/',root)),'Docs/Optimization_K_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
const capture=async name=>{await screenshot(name);const m=await measure();expect(fits(m),JSON.stringify(m.blocks)).toBe(true);};
const view=async name=>{await lesson().getByRole('button',{name,exact:true}).click();await ready();};
const button=async name=>{await lesson().getByRole('button',{name,exact:true}).click();await ready();};
const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
try{
 for(const n of selection){
  if(n===79){await page.goto(base+'/#/study?doc=optimization&page=79');await ready();await expect(page.locator('canvas[data-rendered-page="79"]')).toBeVisible();await screenshot('p79-static');pages.push({page:79,views:[{view:'static',screenshot:'Docs/Optimization_K_assets/p79-static.png',...await measure()}]});}
  else pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
  const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);let text=await readFile(url,'utf8');
  text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–74 complete; K 75–'+n+' esaminate, revisione in corso.');
  text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione visiva e interattiva K.');await writeFile(url,text);
 }
 await check('penalty threshold preserves infeasible minima and the exact family',async()=>{
  await open(75);await expect(lesson().locator('.source-warning')).toContainText('h(z)');await expect(page.getByTestId('opt75-merit')).toHaveText('0.5000');
  await fill('Peso della penalità',.2);await fill('Ascissa di prova',0);await fill('Ordinata di prova',.8);await expect(page.getByTestId('opt75-merit')).toHaveText('0.1800');await expect(page.getByTestId('opt75-status')).toContainText('non ammissibile');await capture('p75-weak-penalty');
  await button('Soglia s=1/2');await expect(page.getByTestId('opt75-status')).toContainText('minimi multipli');await capture('p75-threshold-family');
  await fill('Peso della penalità',.8);await expect(page.getByTestId('opt75-status')).toContainText('due minimi');await view('3D');await capture('p75-exact-penalty-surface');
 });
 await check('merit Armijo rejects full steps and exact ties',async()=>{
  await open(76);await expect(page.getByTestId('opt76-gamma')).toHaveText('1.0000');await expect(page.getByTestId('opt76-status')).toContainText('Rifiutato');
  await button('Prossimo');await expect(page.getByTestId('opt76-gamma')).toHaveText('0.5000');await expect(page.getByTestId('opt76-status')).toContainText('Accettato');await capture('p76-half-step-accepted');
  await button('Pareggio Armijo');await expect(page.getByTestId('opt76-gap')).toHaveText('0.0000');await expect(page.getByTestId('opt76-status')).toContainText('Pareggio rifiutato');await capture('p76-exact-tie-rejected');
  await fill('Fattore di riduzione',.2);await expect(page.getByLabel('Tentativo valore',{exact:true})).toHaveValue('0');await button('Prossimo');await expect(page.getByTestId('opt76-gamma')).toHaveText('0.2000');
 });
 await check('globalized SQP relaxes the complete multiplier and follows KKT residuals',async()=>{
  await open(77);await expect(page.getByTestId('opt77-gamma')).toHaveText('0.5000');await expect(page.getByTestId('opt77-weight')).toHaveText('3.0000');await expect(page.getByTestId('opt77-next-lambda')).toHaveText('0.3174');
  await button('Passo');await capture('p77-first-relaxed-step');
  const last=Number(await page.getByLabel('Iterazione slider',{exact:true}).getAttribute('max'));await fill('Iterazione',last);await expect(page.getByTestId('opt77-status')).toContainText('tolleranza');await capture('p77-numerical-convergence');
  await fill('Peso minimo',2);await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('0');
 });
 await check('merit decrease allows cost increase and does not hide an unbounded QP',async()=>{
  await open(77);await fill('Ascissa iniziale',.4);await fill('Ordinata iniziale',1.1);await button('Passo');await expect(page.getByTestId('opt77-status')).toContainText('costo è aumentato');await capture('p77-cost-increase-merit-decrease');
  await fill('Ascissa iniziale',.1);await fill('Ordinata iniziale',1);await fill('Peso minimo',.1);await button('Passo');await expect(page.getByTestId('opt77-status')).toContainText('QP illimitato');await capture('p77-unbounded-qp-stop');
  await fill('Ascissa iniziale',0);await fill('Ordinata iniziale',1);await fill('Peso minimo',3);await button('Passo');await expect(page.getByTestId('opt77-status')).toContainText('massimo locale');await capture('p77-nonminimal-kkt-root');
 });
 await check('barrier strict domain does not replace equality feasibility',async()=>{
  await open(78);await expect(lesson().getByRole('note')).toContainText('h(z)=0');await expect(page.getByTestId('opt78-h')).toHaveText('0.6000');
  await button('Dimezza ε');await expect(page.getByLabel('Peso della barriera valore',{exact:true})).toHaveValue('0.2');await capture('p78-shrinking-barrier');
  await fill('Ascissa di prova',0);await expect(page.getByTestId('opt78-cost')).toHaveText('fuori dominio');await capture('p78-boundary-domain-excluded');await view('3D');await capture('p78-boundary-no-fake-height');
  await fill('Ascissa di prova',.4);await fill('Ordinata di prova',.6);await expect(page.getByTestId('opt78-status')).toContainText('rispetta h=0');
  await fill('Peso della barriera',.01);await expect(page.getByTestId('opt78-status')).toContainText('0.0099');await capture('p78-small-positive-barrier');
 });
 await check('generic decision and iteration estimate are independent',async()=>{
  await open(80);await fill('Iterazione selezionata',0);await expect(page.getByTestId('opt80-estimate')).toHaveText('-2.0000');await expect(page.getByTestId('opt80-probe')).toHaveText('0.5000');await capture('p80-initial-estimate');
  await fill('Iterazione selezionata',3);await expect(page.getByTestId('opt80-estimate')).toHaveText('0.6250');await fill('Decisione di prova',-1.4);await expect(page.getByTestId('opt80-estimate')).toHaveText('0.6250');await capture('p80-decision-versus-estimate');
 });
 await check('time and algorithm indices select different components with no terminal input',async()=>{
  await open(81);await expect(page.getByTestId('opt81-state')).toHaveText('1.5200');await expect(page.getByTestId('opt81-input')).toHaveText('-0.4800');
  await fill('Tempo selezionato',3);await expect(page.getByTestId('opt81-state')).toHaveText('0.5600');await expect(page.getByTestId('opt81-input')).toHaveText('non presente');await capture('p81-terminal-state-without-input');
  await fill('Iterazione selezionata',1);await expect(page.getByLabel('Tempo selezionato valore',{exact:true})).toHaveValue('3');await expect(page.getByTestId('opt81-state')).toHaveText('0.8000');
  await fill('Tempo selezionato',1);await expect(page.getByTestId('opt81-state')).toHaveText('1.6000');await fill('Iterazione selezionata',0);await expect(page.getByTestId('opt81-state')).toHaveText('2.0000');await capture('p81-initial-trajectory');
 });
 await check('fullscreen keeps camera penalty and selected iteration',async()=>{
  await open(77);await view('3D');await lesson().getByRole('button',{name:'Zoom avanti Superficie della merit function',exact:true}).click();const scene=lesson().locator('[data-plot-id="optimization-opt77-global-sqp-3d"]'),camera=await scene.getAttribute('data-camera');
  await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();await fill('Peso minimo',1.5);await button('Passo');
  await page.screenshot({path:fileURLToPath(new URL('Docs/Optimization_K_assets/p77-fullscreen.png',root))});await page.keyboard.press('Escape');await ready();await expect(scene).toHaveAttribute('data-camera',camera);await expect(page.getByLabel('Peso minimo valore',{exact:true})).toHaveValue('1.5');await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('1');expect(fits(await measure())).toBe(true);
 });
 await check('all pages authored while completed documents keep rendering',async()=>{
  expect(manifest.pages.map(p=>p.source_page)).toEqual(Array.from({length:81},(_,i)=>i+1));
  for(const href of ['#/study?doc=optimization&page=74','#/study?doc=optimization&page=68','#/study?doc=optimization&page=54','#/study?page=12','#/study?page=16','#/study?page=17','#/study?page=27','#/study?page=34']){
   await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
   if(href.endsWith('page=16')||href.endsWith('page=34'))await screenshot('reference-introduction-'+href.split('page=')[1]);
  }
 });
 const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
 pages.sort((a,b)=>a.page-b.page);const success=pages.length===7&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
 await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
 console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
