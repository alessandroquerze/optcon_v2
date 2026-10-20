import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';

const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'19,20,21,22,23,24,25').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_c_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_C_assets/',root)),'Docs/Optimization_C_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
try{
  for(const n of selection){
    pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
    const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);
    let text=await readFile(url,'utf8');
    text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: A/B già completi; C 19–'+n+' esaminate; correzioni visive in corso.');
    text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione browser C.');
    await writeFile(url,text);
  }
  const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
  const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
  const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
  await check('lower and upper support including coincidence',async()=>{
    for(const n of [19,20]){
      await open(n);expect(Number(await page.getByTestId('opt'+n+'-margin').textContent())).toBeGreaterThan(0);
      await fill('Punto di confronto',-.4);await expect(page.getByTestId('opt'+n+'-margin')).toHaveText('0.0000');
      await fill('Punto di tangenza',1.2*(n===19?2/3:1));await fill('Punto di confronto',-1.2);
      expect(Number(await page.getByTestId('opt'+n+'-margin').textContent())).toBeGreaterThan(0);
      expect(fits(await measure())).toBe(true);
    }
  });
  await check('proof limit and endpoint',async()=>{
    await open(21);await fill('Vicino al candidato',.99999);
    expect(Number(await page.getByTestId('opt21-improvement').textContent())).toBeGreaterThan(0);
    await fill('Vicino al candidato',1);await expect(page.getByTestId('opt21-improvement')).toHaveText('0.0000');
    await expect(lesson()).toContainText('A θ=1 non c’è miglioramento');
    await screenshot('p21-endpoint');expect(fits(await measure())).toBe(true);
  });
  await check('zero gradient flat Hessian and nonuniqueness',async()=>{
    await open(22);await page.getByLabel('Costo',{exact:true}).selectOption('1');await fill('Punto candidato',0);
    await expect(page.getByTestId('opt22-minimum')).toHaveText('sì, globale');await expect(page.getByTestId('opt22-hessian')).toHaveText('0.0000');
    await screenshot('p22-quartic');expect(fits(await measure())).toBe(true);
    await fill('Punto candidato',.01);await expect(page.getByTestId('opt22-minimum')).toHaveText('no');
    await page.getByLabel('Costo',{exact:true}).selectOption('2');
    await expect(page.getByTestId('opt22-minimum')).toHaveText('sì, globale');await screenshot('p22-constant');
  });
  await check('quadratic definition has no positivity restriction',async()=>{
    await open(23);await fill('Curvatura seconda',-1);await expect(page.getByTestId('opt23-convex')).toHaveText('no');
    await screenshot('p23-indefinite');await fill('Curvatura seconda',0);await fill('Inclinazione seconda',0);
    await expect(page.getByTestId('opt23-convex')).toHaveText('sì');expect(fits(await measure())).toBe(true);
  });
  await check('joint conditions singular drift and saddle',async()=>{
    await open(24);
    for(const mode of ['2D','3D']){
      await lesson().getByRole('button',{name:mode,exact:true}).click();
      for(const which of [0,1,2,3]){
        await page.getByLabel('Scenario',{exact:true}).selectOption(String(which));await fill('Coordinata della sonda',which===3?0:.5);
        await expect(page.getByTestId('opt24-candidate')).toHaveText(which<2?'sì, globale':'no');
        await expect(page.getByTestId('opt24-psd')).toHaveText(which===3?'no':'sì');
        if(which===3)await expect(page.getByTestId('opt24-residual')).toHaveText('0.0000');
        await screenshot('p24-case'+which+'-'+mode.toLowerCase());expect(fits(await measure())).toBe(true);
      }
    }
  });
  await check('inverse unique and singular solution sets',async()=>{
    await open(25);
    await expect(page.getByTestId('opt25-solution')).toHaveText('(0.5, 0.125)');
    await page.getByLabel('Curvatura di Q',{exact:true}).selectOption('1');
    await expect(page.getByTestId('opt25-solution')).toHaveText('(0.5, 0.500)');
    await page.getByLabel('Curvatura di Q',{exact:true}).selectOption('2');await expect(page.getByTestId('opt25-solution')).toHaveText('nessuno');
    await fill('Inclinazione seconda',0);await expect(page.getByTestId('opt25-solution')).toHaveText('(0.5, t), t∈R');
    await expect(page.getByTestId('opt25-minimum')).toHaveText('-0.2500');
    await screenshot('p25-flat');expect(fits(await measure())).toBe(true);
    await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();
    await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();
    await screenshot('p25-fullscreen-3d');await page.keyboard.press('Escape');await ready();
    await expect(page.getByLabel('Curvatura di Q',{exact:true})).toHaveValue('2');
    await fill('Inclinazione seconda',.5);await screenshot('p25-drift-3d');expect(fits(await measure())).toBe(true);
    await fill('Inclinazione seconda',1e-6);
    await expect(page.getByTestId('opt25-solution')).toHaveText('nessuno');
    await expect(lesson().locator('[data-explained-formula-id="opt25-example"] .katex')).toContainText('10');
    await screenshot('p25-small-drift');expect(fits(await measure())).toBe(true);
  });
  await check('previous batches introduction and next batch placeholder',async()=>{
    for(const href of ['#/study?doc=optimization&page=6','#/study?doc=optimization&page=12','#/study?doc=optimization&page=18','#/study?page=16']){
      await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
    }
    await page.goto(base+'/#/study?doc=optimization&page=26');
    await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
    await expect(page.locator('canvas[data-rendered-page="26"]')).toBeVisible();
  });
  const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
  expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
  pages.sort((a,b)=>a.page-b.page);
  const success=pages.length===7&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
  await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
  console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
