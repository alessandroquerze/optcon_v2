import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';
const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'34,35,36,37').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_e_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_E_assets/',root)),'Docs/Optimization_E_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
try{
  for(const n of selection){
    const record=await inspect(n,manifest.pages.find(p=>p.source_page===n),base);
    if(n===37){
      await page.getByLabel('Funzione mostrata',{exact:true}).selectOption('1');await ready();
      for(const view of ['2D','3D']){
        await lesson().getByRole('button',{name:view,exact:true}).click();await ready();
        await screenshot('p37-real-'+view.toLowerCase());
        const geometry=await measure();record.views.push({view:view+' costo reale',screenshot:'Docs/Optimization_E_assets/p37-real-'+view.toLowerCase()+'.png',...geometry});
        console.log(JSON.stringify({page:n,view:'real-'+view,scroll:geometry.scroll,bottom:geometry.blocks.at(-1).bottom,overflow:geometry.formula_overflow}));
      }
    }
    pages.push(record);
    const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);let text=await readFile(url,'utf8');
    text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: A–D già completi; E 34–'+n+' esaminate, correzioni visive in corso.');
    text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione browser E.');
    await writeFile(url,text);
  }
  const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
  const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
  const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
  await check('root model versus real residual and iteration',async()=>{
    await open(34);await expect(page.getByTestId('opt34-next')).toHaveText('1.0833');
    await expect(page.getByTestId('opt34-new-residual')).toHaveText('0.1736');
    await lesson().getByRole('button',{name:'Esegui un passo',exact:true}).click();
    expect(Number(await page.getByTestId('opt34-residual').textContent())).toBeLessThan(.18);
    await screenshot('p34-after-step');expect(fits(await measure())).toBe(true);
  });
  await check('singular nonroot already root and offscreen update',async()=>{
    await open(34);await fill('Punto corrente',0);
    await expect(page.getByTestId('opt34-verdict')).toContainText('non ha zero');
    await expect(lesson().getByRole('button',{name:'Esegui un passo',exact:true})).toBeDisabled();
    await screenshot('p34-singular');expect(fits(await measure())).toBe(true);
    await fill('Parametro del residuo',0);await expect(page.getByTestId('opt34-verdict')).toContainText('Radice già raggiunta');
    await fill('Parametro del residuo',2);await fill('Punto corrente',.1);
    await expect(page.getByTestId('opt34-next')).toHaveText('10.0500');
    await expect(page.getByTestId('opt34-verdict')).toContainText('senza clamp');
    await screenshot('p34-outside');expect(fits(await measure())).toBe(true);
  });
  await check('stationarity may be a maximum and Hessian may be singular',async()=>{
    await open(35);await fill('Punto corrente',-.5);
    await expect(page.getByTestId('opt35-hessian')).toHaveText('-1.0000');
    expect(Number(await page.getByTestId('opt35-cost-change').textContent())).toBeGreaterThan(0);
    await screenshot('p35-negative-curvature');expect(fits(await measure())).toBe(true);
    await lesson().getByRole('button',{name:'Esegui un passo',exact:true}).click();
    await expect(page.getByLabel('Punto corrente valore',{exact:true})).toHaveValue('-1.25');
    await fill('Punto corrente',-1);await expect(page.getByTestId('opt35-verdict')).toContainText('massimo locale');
    await fill('Punto corrente',0);await expect(page.getByTestId('opt35-verdict')).toContainText('Hessiana nulla');
    await expect(lesson().getByRole('button',{name:'Esegui un passo',exact:true})).toBeDisabled();
    await fill('Punto corrente',.32);await expect(page.getByTestId('opt35-verdict')).toContainText('Hessiana positiva, ma');
    expect(Number(await page.getByTestId('opt35-cost-change').textContent())).toBeGreaterThan(0);
    await screenshot('p35-positive-curvature-overshoot');expect(fits(await measure())).toBe(true);
    await fill('Punto corrente',1.0000000000001);await expect(page.getByTestId('opt35-verdict')).toContainText('arresto numerico');
    await expect(lesson().getByRole('button',{name:'Esegui un passo',exact:true})).toBeDisabled();expect(fits(await measure())).toBe(true);
  });
  await check('corrected sign and valid model minimization',async()=>{
    await open(36);await expect(page.getByTestId('opt36-step')).toHaveText('0.7500');await expect(page.getByTestId('opt36-next')).toHaveText('1.2500');
    await lesson().getByRole('button',{name:'Esegui un passo',exact:true}).click();
    await expect(page.getByLabel('Punto di costruzione valore',{exact:true})).toHaveValue('1.25');
    await fill('Punto di costruzione',-.5);await expect(page.getByTestId('opt36-step')).toHaveText('nessun minimo');
    await expect(page.getByTestId('opt36-type')).toContainText('massimo');
    await expect(lesson().getByRole('button',{name:'Esegui un passo',exact:true})).toBeDisabled();
    await screenshot('p36-negative-curvature');expect(fits(await measure())).toBe(true);
    await fill('Punto di costruzione',0);await expect(page.getByTestId('opt36-type')).toHaveText('nessuno');
    await expect(page.getByTestId('opt36-verdict')).toContainText('lineare');expect(fits(await measure())).toBe(true);
    await fill('Punto di costruzione',.32);await expect(page.getByTestId('opt36-verdict')).toContainText('aumenta il costo');
    await screenshot('p36-positive-curvature-overshoot');expect(fits(await measure())).toBe(true);
  });
  await check('surrogate minimum differs from real decrease and recovers exact Hessian',async()=>{
    await open(37);await expect(page.getByTestId('opt37-model-minimum')).toHaveText('-1.5000');
    await expect(page.getByTestId('opt37-real-cost')).toHaveText('4.5000');await expect(page.getByTestId('opt37-change')).toHaveText('3.5000');
    await fill('Seconda diagonale D',.25);await expect(page.getByTestId('opt37-real-cost')).toHaveText('0.0000');
    await expect(page.getByTestId('opt37-verdict')).toContainText('coincidono');
    await screenshot('p37-exact-model');expect(fits(await measure())).toBe(true);
    await fill('Prima diagonale D',.8);await fill('Seconda diagonale D',.6);
    await expect(page.getByTestId('opt37-verdict')).toContainText('precisione numerica');expect(fits(await measure())).toBe(true);
  });
  await check('function selection and fullscreen preserve parameters view and camera',async()=>{
    await open(37);await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();
    await lesson().getByRole('button',{name:'Zoom avanti Superficie del modello quadratico',exact:true}).click();
    const scene=lesson().locator('[data-plot-id="optimization-opt37-metric-3d"]');
    await expect(scene).toHaveAttribute('data-camera',/.+/);const camera=await scene.getAttribute('data-camera');
    await page.getByLabel('Funzione mostrata',{exact:true}).selectOption('1');await ready();
    await expect(lesson().locator('.function-explorer')).toHaveAttribute('data-current-view','3D');
    await expect(scene).toHaveAttribute('data-camera',camera);
    await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();await ready();
    await fill('Prima diagonale D',1.25);await screenshot('p37-fullscreen-real-3d');
    await page.keyboard.press('Escape');await ready();await expect(page.getByLabel('Prima diagonale D valore',{exact:true})).toHaveValue('1.25');
    expect(fits(await measure())).toBe(true);
  });
  await check('previous companions and next batch placeholder',async()=>{
    for(const href of ['#/study?doc=optimization&page=7','#/study?doc=optimization&page=25','#/study?doc=optimization&page=32','#/study?page=12']){
      await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
    }
    await page.goto(base+'/#/study?doc=optimization&page=38');await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
    await expect(page.locator('canvas[data-rendered-page="38"]')).toBeVisible();
  });
  const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
  expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
  pages.sort((a,b)=>a.page-b.page);
  const success=pages.length===4&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
  await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
  console.log(JSON.stringify({success,checks}));if(!success)process.exitCode=1;
}finally{await review.browser.close();}
