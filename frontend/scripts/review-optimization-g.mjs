import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'47,48,49,50,51,52,53,54').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_g_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_G_assets/',root)),'Docs/Optimization_G_assets');
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
  if(n===47){
   await page.goto(base+'/#/study?doc=optimization&page=47');await ready();await expect(page.locator('canvas[data-rendered-page="47"]')).toBeVisible();
   await screenshot('p47-static');pages.push({page:47,views:[{view:'static',screenshot:'Docs/Optimization_G_assets/p47-static.png',...await measure()}]});
  }else pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
  const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);let text=await readFile(url,'utf8');
  text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: 1–46 complete; G 47–'+n+' esaminate, revisione in corso.');
  text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione visiva e interattiva G.');await writeFile(url,text);
 }
 await check('first order necessity is distinct from unconstrained gradient zero and sufficiency',async()=>{
  await open(48);await expect(page.getByTestId('opt48-universal')).toHaveText('0.0000');
  await expect(page.getByTestId('opt48-verdict')).toContainText('gradiente non deve annullarsi');
  await choose('Caso',1);await expect(page.getByTestId('opt48-universal')).toHaveText('-2.0000');await capture('p48-refuted-candidate');
  await choose('Caso',2);await expect(page.getByTestId('opt48-product')).toHaveText('0.0000');
  await expect(page.getByTestId('opt48-change')).toHaveText('-0.5000');await capture('p48-stationary-maximum-2d');
  await view('3D');await capture('p48-stationary-maximum-3d');
 });
 await check('projection preserves inside points and handles a square corner uniquely',async()=>{
  await open(49);await expect(page.getByTestId('opt49-distance')).toHaveText('0.7000');
  await expect(page.getByTestId('opt49-p')).toHaveText('(0.8824, 0.4706)');
  await fill('Prima coordinata',0);await fill('Seconda coordinata',0);await expect(page.getByTestId('opt49-distance')).toHaveText('0.0000');
  await capture('p49-inside');await choose('Insieme',1);await fill('Prima coordinata',2);await fill('Seconda coordinata',2);
  await expect(page.getByTestId('opt49-p')).toHaveText('(1.0000, 1.0000)');await capture('p49-square-corner');
 });
 await check('projected step can be feasible while increasing the cost',async()=>{
  await open(50);expect(Number(await page.getByTestId('opt50-change').textContent())).toBeGreaterThan(0);
  await expect(page.getByTestId('opt50-verdict')).toContainText('costo aumenta');
  await fill('Passo',.25);await expect(page.getByTestId('opt50-next')).toHaveText('(0.4500, 0.0000)');await capture('p50-small-step');
  await fill('Passo',1);await expect(page.getByTestId('opt50-free')).toHaveText('(0.0000, -2.4000)');
  await expect(page.getByTestId('opt50-next')).toHaveText('(0.0000, -1.0000)');await capture('p50-free-outside');
  await choose('Insieme',1);await view('3D');await capture('p50-square-3d');
 });
 await check('outer relaxation retains feasibility on the segment but not for arbitrary extrapolation',async()=>{
  await open(51);await expect(page.getByTestId('opt51-slope')).toHaveText('-6.1200');expect(Number(await page.getByTestId('opt51-change').textContent())).toBeLessThan(0);
  await fill('Frazione del segmento',0);await expect(page.getByTestId('opt51-change')).toHaveText('0.0000');
  await fill('Frazione del segmento',1);await expect(page.getByTestId('opt51-feasible')).toHaveText('sì');
  expect(Number(await page.getByTestId('opt51-change').textContent())).toBeGreaterThan(0);await capture('p51-feasible-cost-increase');
  await fill('Frazione del segmento',1.3);await expect(page.getByTestId('opt51-feasible')).toHaveText('no');await capture('p51-extrapolation');
  await choose('Insieme',1);await view('3D');await capture('p51-square-extrapolation-3d');
 });
 await check('constrained QP distinguishes projected residual from nonzero gradient and multiple minima',async()=>{
  await open(52);await lesson().getByRole('button',{name:'Passo',exact:true}).click();expect(Number(await page.getByTestId('opt52-cost').textContent())).toBeCloseTo(-1.44875,3);
  await lesson().getByRole('button',{name:'Passo',exact:true}).click();await expect(page.getByTestId('opt52-residual')).toHaveText('0.0000');
  await expect(page.getByTestId('opt52-gradient')).toHaveText('1.0000');await capture('p52-boundary-fixed-point');
  await fill('Seconda curvatura',0);await fill('Termine lineare',.5);await fill('Iterazione',20);await capture('p52-segment-minima-2d');
  await view('3D');await capture('p52-segment-minima-3d');
  await fill('Seconda curvatura',6);await fill('Termine lineare',2);await fill('Passo',1);await fill('Iterazione',19);
  await expect(page.getByTestId('opt52-cost')).toHaveText('1.5000');await expect(page.getByTestId('opt52-verdict')).toContainText('non convergenza');await capture('p52-bounded-oscillation');
  await lesson().getByRole('button',{name:'Play',exact:true}).click();await fill('Passo',.25);await expect(page.getByLabel('Iterazione valore',{exact:true})).toHaveValue('0');
  await expect(lesson().getByRole('button',{name:'Play',exact:true})).toHaveAttribute('aria-pressed','false');
 });
 await check('all four original cost functions and the scalar to surface transition are available',async()=>{
  await open(53);await expect(page.getByTestId('opt53-cost')).toHaveText('2.7145');
  await choose('Costo',1);await expect(lesson().getByRole('button',{name:'3D',exact:true})).toHaveCount(0);
  await expect(page.getByTestId('opt53-cost')).toHaveText('6.0000');await expect(page.getByTestId('opt53-curvature')).toHaveText('-24.0000');await capture('p53-quartic');
  await fill('Punto scalare',-4);await expect(page.getByTestId('opt53-cost')).toHaveText('-50.0000');await capture('p53-quartic-edge');
  await choose('Costo',0);await expect(page.getByTestId('opt53-cost')).toHaveText('16.0000');await capture('p53-square');
  await choose('Costo',3);await fill('Prima coordinata',1);await fill('Seconda coordinata',.25);
  await expect(page.getByTestId('opt53-cost')).toHaveText('-0.6250');await expect(page.getByTestId('opt53-gradient')).toHaveText('0.0000');
  for(const v of ['2D','3D']){await view(v);await capture('p53-qp-'+v.toLowerCase());}
 });
 await check('barrier domain remains strict and negative log values are preserved',async()=>{
  await open(54);await expect(page.getByTestId('opt54-minimum')).toHaveText('0.1708');
  await lesson().getByRole('button',{name:'Riduci ε',exact:true}).click();expect(Number(await page.getByTestId('opt54-minimum').textContent())).toBeLessThan(.171);
  await fill('Punto da valutare',0);await expect(page.getByTestId('opt54-total')).toHaveText('fuori dominio');
  await expect(page.getByTestId('opt54-verdict')).toContainText('ammissibile per il vincolo originale');await capture('p54-boundary');
  await fill('Punto da valutare',-.1);await expect(page.getByTestId('opt54-barrier')).toHaveText('fuori dominio');await capture('p54-outside-domain');
  await fill('Punto da valutare',2);expect(Number(await page.getByTestId('opt54-barrier').textContent())).toBeLessThan(0);await capture('p54-negative-barrier');
  await fill('Peso della barriera',.001);expect(Number(await page.getByTestId('opt54-minimum').textContent())).toBeGreaterThan(0);
  await expect(lesson().getByRole('button',{name:'Riduci ε',exact:true})).toBeDisabled();await capture('p54-small-positive-weight');
 });
 await check('function selection and fullscreen retain 3D camera and parameters',async()=>{
  await open(53);await view('3D');await lesson().getByRole('button',{name:'Zoom avanti Costo e punti sulla superficie',exact:true}).click();
  const scene=lesson().locator('[data-plot-id="optimization-opt53-surface-3d"]');const camera=await scene.getAttribute('data-camera');
  await choose('Costo',3);await expect(lesson().locator('.function-explorer')).toHaveAttribute('data-current-view','3D');await expect(scene).toHaveAttribute('data-camera',camera);
  await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();await fill('Prima coordinata',.5);
  await page.screenshot({path:fileURLToPath(new URL('Docs/Optimization_G_assets/p53-fullscreen-qp.png',root))});await page.keyboard.press('Escape');await ready();
  await expect(page.getByLabel('Prima coordinata valore',{exact:true})).toHaveValue('0.5');await expect(scene).toHaveAttribute('data-camera',camera);expect(fits(await measure())).toBe(true);
 });
 await check('earlier companions PDF rendering and next batch placeholder remain preserved',async()=>{
  for(const href of ['#/study?doc=optimization&page=49','#/study?doc=optimization&page=46','#/study?doc=optimization&page=37','#/study?page=17','#/study?page=27','#/study?page=34']){
   await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
  }
  await page.goto(base+'/#/study?doc=optimization&page=55');await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
  await expect(page.locator('canvas[data-rendered-page="55"]')).toBeVisible();
 });
 const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
 expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
 pages.sort((a,b)=>a.page-b.page);
 const success=pages.length===8&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
 await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
 console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
