import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'26,27,28,29,30,31,32,33').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_d_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_D_assets/',root)),'Docs/Optimization_D_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
try{
  for(const n of selection){
    if(n===26){
      await page.goto(base+'/#/study?doc=optimization&page=26');await ready();
      await expect(page.locator('canvas[data-rendered-page="26"]')).toBeVisible();
      await screenshot('p26-static');const geometry=await measure();
      pages.push({page:26,views:[{view:'static',screenshot:'Docs/Optimization_D_assets/p26-static.png',...geometry}]});
      console.log(JSON.stringify({page:26,scroll:geometry.scroll,bottom:geometry.blocks.at(-1).bottom}));
    }else pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
    const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);
    let text=await readFile(url,'utf8');
    text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: A/B/C già completi; D 26–'+n+' esaminate, correzioni visive in corso.');
    text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione browser D.');
    await writeFile(url,text);
  }
  const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
  const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
  const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
  await check('iteration playback reset and fullscreen state',async()=>{
    await open(27);await expect(page.getByTestId('opt27-k')).toHaveText('0');
    await lesson().getByRole('button',{name:'Passo',exact:true}).click();
    await expect(page.getByTestId('opt27-cost')).toHaveText('0.8000');
    await lesson().getByRole('button',{name:'Play',exact:true}).click();
    await expect.poll(async()=>Number(await page.getByTestId('opt27-k').textContent())).toBeGreaterThan(1);
    await lesson().getByRole('button',{name:'Pausa',exact:true}).click();
    await fill('Iterazione',4);await screenshot('p27-k4');
    await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();
    await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();await screenshot('p27-fullscreen-3d');
    await page.keyboard.press('Escape');await ready();await expect(page.getByTestId('opt27-k')).toHaveText('4');
    await lesson().getByRole('button',{name:'Play',exact:true}).click();
    await fill('Passo costante',.25);await expect(page.getByTestId('opt27-k')).toHaveText('0');
    await expect(lesson().getByRole('button',{name:'Play',exact:true})).toBeVisible();expect(fits(await measure())).toBe(true);
  });
  await check('direction versus step and orthogonality',async()=>{
    await open(28);await fill('Passo scelto',2);
    expect(Number(await page.getByTestId('opt28-slope').textContent())).toBeLessThan(0);
    expect(Number(await page.getByTestId('opt28-change').textContent())).toBeGreaterThan(0);
    await screenshot('p28-overshoot');expect(fits(await measure())).toBe(true);
    await fill('Rotazione della direzione',90);await expect(page.getByTestId('opt28-slope')).toHaveText('0.0000');
    await fill('Passo scelto',0);await expect(page.getByTestId('opt28-change')).toHaveText('0.0000');
  });
  await check('Taylor remainder zero gradient and equal-cost boundary',async()=>{
    await open(29);await fill('Passo del gradiente',2);await expect(page.getByTestId('opt29-change')).toHaveText('0.0000');
    await fill('Passo del gradiente',2.5);expect(Number(await page.getByTestId('opt29-change').textContent())).toBeGreaterThan(0);
    await screenshot('p29-large-step');expect(fits(await measure())).toBe(true);
    await fill('Punto corrente',0);await expect(page.getByTestId('opt29-change')).toHaveText('0.0000');
    await expect(page.getByTestId('opt29-verdict')).toContainText('Gradiente nullo');
  });
  await check('direction classification remains separate from cost change',async()=>{
    await open(30);await fill('Rotazione della direzione',90);await expect(page.getByTestId('opt30-direction')).toHaveText('ortogonale');
    await fill('Rotazione della direzione',180);await expect(page.getByTestId('opt30-direction')).toHaveText('salita');
    await fill('Rotazione della direzione',0);await fill('Lunghezza del passo',1.6);
    await expect(page.getByTestId('opt30-direction')).toHaveText('discesa');
    expect(Number(await page.getByTestId('opt30-change').textContent())).toBeGreaterThan(0);
    await screenshot('p30-descent-overshoot');expect(fits(await measure())).toBe(true);
  });
  await check('positive definite transformed direction and zero-gradient guard',async()=>{
    await open(31);await fill('Secondo autovalore',1);
    const before=await page.getByTestId('opt31-product').textContent();await fill('Rotazione della matrice',75);
    await expect(page.getByTestId('opt31-product')).toHaveText(before);
    await page.getByLabel('Punto corrente',{exact:true}).selectOption('1');await expect(page.getByTestId('opt31-product')).toHaveText('0.0000');
    await expect(page.getByTestId('opt31-verdict')).toContainText('g=0');await screenshot('p31-zero-gradient');expect(fits(await measure())).toBe(true);
  });
  await check('three methods same initial point and step with finite differences',async()=>{
    await open(32);expect(Number(await page.getByTestId('opt32-change').textContent())).toBeGreaterThan(0);
    await page.getByLabel('Metodo',{exact:true}).selectOption('1');
    await expect(page.getByLabel('Passo comune valore',{exact:true})).toHaveValue('1');
    expect(Number(await page.getByTestId('opt32-change').textContent())).toBeLessThan(0);
    await expect(page.getByLabel('Passo delle differenze valore',{exact:true})).toHaveCount(0);
    await screenshot('p32-newton');expect(fits(await measure())).toBe(true);
    await page.getByLabel('Metodo',{exact:true}).selectOption('2');await ready();
    await fill('Passo delle differenze',.1);const close=Number(await page.getByTestId('opt32-cost').textContent());
    await fill('Passo delle differenze',1.5);expect(Number(await page.getByTestId('opt32-cost').textContent())).toBeGreaterThan(close);
    await screenshot('p32-discretized');expect(fits(await measure())).toBe(true);
    await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();await screenshot('p32-discretized-3d');expect(fits(await measure())).toBe(true);
  });
  await check('unit direction optimality and undefined normalized gradient',async()=>{
    await open(33);await fill('Direzione di prova',180);await expect(page.getByTestId('opt33-gap')).toHaveText('0.0000');
    await fill('Direzione di prova',90);await expect(page.getByTestId('opt33-slope')).toHaveText('0.0000');
    await fill('Norma del gradiente',0);await expect(page.getByTestId('opt33-verdict')).toContainText('non è definita');
    await screenshot('p33-zero-gradient');expect(fits(await measure())).toBe(true);
  });
  await check('previous batches and future placeholder',async()=>{
    for(const href of ['#/study?doc=optimization&page=6','#/study?doc=optimization&page=18','#/study?doc=optimization&page=25','#/study?page=27']){
      await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
    }
    await page.goto(base+'/#/study?doc=optimization&page=34');
    await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
    await expect(page.locator('canvas[data-rendered-page="34"]')).toBeVisible();
  });
  const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
  expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
  pages.sort((a,b)=>a.page-b.page);
  const success=pages.length===8&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
  await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
  console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
