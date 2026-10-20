import {expect} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {studyBrowser} from './study-browser.mjs';

const root=new URL('../../',import.meta.url),base=process.env.OPTIMIZATION_BASE_URL??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile(new URL('Data/optimization_companion_manifest.json',root),'utf8'));
const selection=(process.env.OPTIMIZATION_PAGES??'10,11,12,13,14,15,16,17,18').split(',').map(Number);
const reportUrl=new URL('Data/reports/optimization_batch_b_visual.json',root);
let previous={pages:[]};try{previous=JSON.parse(await readFile(reportUrl,'utf8'));}catch{}
const review=await studyBrowser(fileURLToPath(new URL('Docs/Optimization_B_assets/',root)),'Docs/Optimization_B_assets');
const {page,lesson,ready,measure,fits,screenshot,inspect,errors}=review;
const pages=previous.pages.filter(p=>!selection.includes(p.page)),checks=[];
try{
  for(const n of selection){
    pages.push(await inspect(n,manifest.pages.find(p=>p.source_page===n),base));
    const url=new URL('Docs/OPTIMIZATION_PROGRESS.md',root);
    let text=await readFile(url,'utf8');
    text=text.replace(/^- Pagine riviste nel browser:.*$/m,'- Pagine riviste nel browser: A (1–9) già completo; B 10–'+n+' esaminate, correzioni visive ancora in corso.');
    text=text.replace(/^- Pagina in lavorazione:.*$/m,'- Pagina in lavorazione: '+n+'; revisione browser del batch B.');
    await writeFile(url,text);
  }
  const open=async n=>{await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();await lesson().getByRole('button',{name:'Ripristina parametri',exact:true}).click();await ready();};
  const fill=async(label,value)=>{await page.getByLabel(label+' valore',{exact:true}).fill(String(value));await ready();};
  const check=async(name,fn)=>{try{await fn();checks.push({name,status:'PASS'});}catch(error){checks.push({name,status:'FAIL',message:error.message});await screenshot('failed-'+name.replaceAll(' ','-'));}};
  await check('segment and chord',async()=>{
    await open(10);await page.getByLabel('Insieme',{exact:true}).selectOption('1');await expect(page.getByTestId('opt10-inside')).toHaveText('no');
    await fill('Peso del segmento',0);await expect(page.getByTestId('opt10-inside')).toHaveText('sì');
    await open(11);await page.getByLabel('Funzione',{exact:true}).selectOption('1');await expect(page.getByTestId('opt11-gap')).toHaveText('0.0000');
    await page.getByLabel('Funzione',{exact:true}).selectOption('2');expect(Number(await page.getByTestId('opt11-gap').textContent())).toBeLessThan(0);
    await fill('Peso del segmento',1);await expect(page.getByTestId('opt11-gap')).toHaveText('0.0000');
  });
  await check('inequality and equality counterexamples',async()=>{
    await open(12);await page.getByLabel('Vincolo',{exact:true}).selectOption('2');await fill('Soglia',0);
    await expect(page.getByTestId('opt12-kind')).toContainText('striscia convessa');await screenshot('p12-counterexample');
    await page.getByLabel('Vincolo',{exact:true}).selectOption('0');await fill('Coordinata della sonda',0);
    await expect(page.getByTestId('opt12-feasible')).toHaveText('sì');expect(fits(await measure())).toBe(true);
    await open(13);await page.getByLabel('Uguaglianza',{exact:true}).selectOption('1');
    await expect(page.getByTestId('opt13-kind')).toContainText('retta affine');await expect(page.getByTestId('opt13-feasible')).toHaveText('sì');
    await fill('Coordinata della sonda',.9999999);await expect(page.getByTestId('opt13-feasible')).toHaveText('no');
    await page.getByLabel('Uguaglianza',{exact:true}).selectOption('2');await expect(page.getByTestId('opt13-convex')).toHaveText('no');
    await fill('Costante del vincolo',0);await fill('Coordinata della sonda',0);
    await expect(page.getByTestId('opt13-convex')).toHaveText('sì');await expect(page.getByTestId('opt13-kind')).toContainText('singleton');
    await screenshot('p13-singleton');expect(fits(await measure())).toBe(true);
  });
  await check('coincident points and strong normalization',async()=>{
    await open(14);await fill('Punto di tangenza',.3);await fill('Punto di confronto',.3);
    await expect(page.getByTestId('opt14-M')).toHaveText('0.0000');await expect(page.getByTestId('opt14-gap')).toHaveText('0.0000');
    await open(15);await fill('Semidistanza dei punti',0);await expect(page.getByTestId('opt15-ratio')).toHaveText('non definito');await screenshot('p15-coincident');
    expect(fits(await measure())).toBe(true);
    await fill('Semidistanza dei punti',.01);expect(Number(await page.getByTestId('opt15-M').textContent())).toBeGreaterThan(0);
    await open(16);await fill('Modulo di curvatura',0);await expect(page.getByTestId('opt16-verdict')).toContainText('senza forte convessità');
    await fill('Semidistanza dei punti',0);await expect(page.getByTestId('opt16-margin')).toHaveText('0.0000');
  });
  await check('smoothness and combined bound',async()=>{
    await open(17);await fill('Limite del gradiente',1);
    await expect(page.getByTestId('opt17-M')).toHaveText('1.0000');await expect(page.getByTestId('opt17-rhs')).toHaveText('1.0000');
    await lesson().locator('[data-graphic-owner=true] > .graphic-expand').first().click();
    await expect(lesson()).toHaveAttribute('data-graphic-fullscreen',/native|popover/);
    await lesson().getByRole('button',{name:'3D',exact:true}).click();await ready();
    await fill('Limite del gradiente',4);await page.keyboard.press('Escape');
    await expect(page.getByLabel('Limite del gradiente valore',{exact:true})).toHaveValue('4');
    await open(18);await fill('Curvatura minima',1);await fill('Limite superiore',1);
    await expect(page.getByTestId('opt18-M')).toHaveText('1.0000');await expect(page.getByTestId('opt18-first')).toHaveText('0.5000');await expect(page.getByTestId('opt18-second')).toHaveText('0.5000');
    await screenshot('p18-equal-bounds');expect(fits(await measure())).toBe(true);
    await fill('Direzione della coppia',0);expect(await lesson().locator('[role=alert]').count()).toBe(0);
  });
  await check('previous pages and document state',async()=>{
    for(const href of ['#/study?doc=optimization&page=6','#/study?doc=optimization&page=9','#/study?page=16']){
      await page.goto(base+'/'+href);await ready();expect(await lesson().locator('[role=alert]').count()).toBe(0);
    }
    await page.getByLabel('Secondo peso valore',{exact:true}).fill('2');
    await page.getByLabel('Documento del corso').selectOption('optimization');await ready();
    await page.getByLabel('Numero pagina').fill('18');await page.getByRole('button',{name:'Vai alla pagina'}).click();await ready();
    await fill('Curvatura minima',.7);
    await page.getByLabel('Documento del corso').selectOption('introduction');await ready();
    await expect(page.getByLabel('Secondo peso valore',{exact:true})).toHaveValue('2');
    await page.getByLabel('Documento del corso').selectOption('optimization');await ready();
    await expect(page.getByLabel('Curvatura minima valore',{exact:true})).toHaveValue('0.7');
    await page.getByLabel('Numero pagina').fill('19');await page.getByRole('button',{name:'Vai alla pagina'}).click();
    await expect(page.getByRole('heading',{name:'Companion da realizzare'})).toBeVisible();
  });
  const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
  expect(createHash('sha256').update(pdf).digest('hex')).toBe(manifest.source_pdf.sha256);
  pages.sort((a,b)=>a.page-b.page);
  const success=pages.length===9&&pages.every(p=>p.views.every(fits))&&!errors.length&&checks.every(c=>c.status==='PASS');
  await writeFile(reportUrl,JSON.stringify({reviewed_at:new Date().toISOString(),success,pages,checks,errors,pdf_sha256:manifest.source_pdf.sha256},null,2)+'\n');
  console.log(JSON.stringify({success,checks}));
  if(!success)process.exitCode=1;
}finally{await review.browser.close();}
