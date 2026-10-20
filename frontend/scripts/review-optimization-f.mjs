import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'38,39,40,41,42,43,44,45,46').split(',').map(Number);
const url=new URL('Data/reports/optimization_batch_f_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(url,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_F_assets/',root)),'Docs/Optimization_F_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
const choose=async(label,value)=>{await page.getByLabel(label,{exact:true}).selectOption(String(value));await ready();};
const capture=async name=>{await screenshot(name);expect(fits(await measure())).toBe(true);};
const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
try{
 for(const n of selection){
  pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
  const progress=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);
  let text=await readFile(progress,'utf8');
  text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–37 complete; F 38–'+n+' esaminate, revisione in corso.');
  text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione visiva e interattiva F.');
  await writeFile(progress,text);
 }
 await check('progressive Armijo candidates remain separate and strict equality is rejected',async()=>{
  for(const [n,gamma,word] of [[38,'1.0000','Rifiutato'],[39,'0.7000','Rifiutato'],[40,'0.4900','Accettato']]){
   await open(n);await expect(page.getByTestId('opt'+n+'-gamma')).toHaveText(gamma);await expect(page.getByTestId('opt'+n+'-verdict')).toContainText(word);
  }
  await open(38);await fill('Fattore di riduzione',.5);await lesson().getByRole('button',{name:'Prossimo tentativo',exact:true}).click();
  await expect(page.getByTestId('opt38-verdict')).toContainText('Pareggio');await capture('p38-strict-equality');
  await lesson().getByRole('button',{name:'Prossimo tentativo',exact:true}).click();await expect(page.getByTestId('opt38-gamma')).toHaveText('0.2500');
  await expect(page.getByTestId('opt38-verdict')).toContainText('Accettato');
  await fill('Fattore di riduzione',.9);await fill('Frazione richiesta',.95);await capture('p38-demanding-search');
 });
 await check('power series boundaries and all three quantities are consistent',async()=>{
  await open(41);await fill('Esponente',.5);await expect(page.getByTestId('opt41-squares')).toHaveText('diverge');
  await fill('Esponente',1);await expect(page.getByTestId('opt41-sum')).toHaveText('diverge');await expect(page.getByTestId('opt41-squares')).toHaveText('converge');
  await fill('Esponente',1.5);await expect(page.getByTestId('opt41-sum')).toHaveText('converge');await capture('p41-finite-sum');
  await fill('Esponente',.25);await fill('Campioni',100);
  for(const value of [1,2]){await choose('Quantità mostrata',value);await capture('p41-quantity-'+value);}
 });
 await check('outer Armijo iterations recompute search and parameter changes reset playback',async()=>{
  await open(42);await lesson().getByRole('button',{name:'Passo',exact:true}).click();await expect(page.getByTestId('opt42-step')).toHaveText('0.2401');
  expect(Number(await page.getByTestId('opt42-norm').textContent())).toBeLessThan(4.3);
  await fill('Iterazione',10);await capture('p42-iteration-10');
  await lesson().getByRole('button',{name:'Play',exact:true}).click();await fill('Fattore di riduzione',.6);
  await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('0');
  await expect(lesson().getByRole('button',{name:'Play',exact:true})).toHaveAttribute('aria-pressed','false');
 });
 await check('linear escape and quadratic oscillation are not false convergence',async()=>{
  await open(43);await choose('Costo',1);await fill('Iterazione',20);await expect(page.getByTestId('opt43-z')).toHaveText('-9.0000');
  await expect(page.getByTestId('opt43-norm')).toHaveText('1.0000');await capture('p43-linear-escape');
  await choose('Regola del passo',1);await fill('Iterazione',20);expect(Number(await page.getByTestId('opt43-z').textContent())).toBeLessThan(-2.5);
  await capture('p43-linear-diminishing');
  await choose('Costo',0);await choose('Regola del passo',0);await fill('Passo costante',2);await fill('Iterazione',19);
  await expect(page.getByTestId('opt43-z')).toHaveText('-1.0000');await capture('p43-oscillation');
  await fill('Passo costante',2.2);await fill('Iterazione',20);
  expect(Number(await page.getByTestId('opt43-z').textContent())).toBeGreaterThan(30);await capture('p43-outside');
 });
 await check('subsequence selector does not claim full sequence convergence',async()=>{
  await open(44);await expect(page.getByTestId('opt44-full')).toHaveText('non converge');
  for(const [value,name] of [[1,'even'],[2,'odd']]){await choose('Campioni mostrati',value);await capture('p44-'+name);}
  await fill('Campioni',40);await capture('p44-longer-window');
 });
 await check('coercivity convexity and maximum or minimum have independent meanings',async()=>{
  await open(45);await expect(page.getByTestId('opt45-coercive')).toHaveText('sì');
  await choose('Costo',1);await expect(page.getByTestId('opt45-verdict')).toContainText('massimo locale');await capture('p45-stationary-maximum');
  await fill('Punto da esaminare',1);await expect(page.getByTestId('opt45-verdict')).toContainText('minimo globale');
  await choose('Costo',2);await expect(page.getByTestId('opt45-coercive')).toHaveText('no');
  await expect(page.getByTestId('opt45-verdict')).toContainText('non raggiunto');await capture('p45-unattained-infimum');
 });
 await check('QP flat minima drift oscillation and offscreen values remain mathematically honest',async()=>{
  await open(46);await lesson().getByRole('button',{name:'Passo',exact:true}).click();await expect(page.getByTestId('opt46-point')).toHaveText('(1.1250, 0.0000)');
  await fill('Seconda curvatura',0);await fill('Iterazione',20);await expect(page.getByTestId('opt46-verdict')).toContainText('retta di minimi');
  await capture('p46-flat-minima-2d');
  await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();await capture('p46-flat-minima-3d');
  await fill('Termine lineare',1);await fill('Iterazione',20);await expect(page.getByTestId('opt46-verdict')).toContainText('nessun minimo');
  await capture('p46-drift');
  await fill('Seconda curvatura',4);await fill('Termine lineare',0);await fill('Passo costante',.5);await fill('Iterazione',19);
  await expect(page.getByTestId('opt46-verdict')).toContainText('bordo');await capture('p46-spectral-boundary');
  await fill('Seconda curvatura',6);await fill('Passo costante',1);await fill('Iterazione',20);await capture('p46-divergence');
  await fill('Seconda curvatura',1e-8);await fill('Termine lineare',1);await capture('p46-minimum-outside');
 });
 await check('fullscreen keeps current iteration parameters and 3D camera',async()=>{
  await open(46);await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();
  await lesson().getByRole('button',{name:'Zoom avanti Costo del QP e iterati sulla superficie',exact:true}).click();
  const scene=lesson().locator('[data-plot-id="optimization-opt46-qp-3d"]');const camera=await scene.getAttribute('data-camera');
  await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();
  await fill('Iterazione',4);await page.screenshot({path:fileURLToPath(new URL('Docs/Optimization_F_assets/p46-fullscreen.png',root))});
  await page.keyboard.press('Escape');await ready();await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('4');
  await expect(scene).toHaveAttribute('data-camera',camera);expect(fits(await measure())).toBe(true);
 });
 await check('previous companions original PDF and next batch placeholder are preserved',async()=>{
  for(const href of ['#/study?doc=optimization&page=16','#/study?doc=optimization&page=27','#/study?doc=optimization&page=37','#/study?page=12','#/study?page=16']){
   await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
  }
  await page.goto(base+'/#/study?doc=optimization&page=47');await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
  await expect(page.locator('canvas[data-rendered-page="47"]')).toBeVisible();
 });
 const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
 expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
 pages.sort((a,b)=>a.page-b.page);
 const success=pages.length===9&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
 await writeFile(url,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
 console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
