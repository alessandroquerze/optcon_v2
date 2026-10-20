import { chromium } from '@playwright/test';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=new URL('../../',import.meta.url),manifest=JSON.parse(await readFile(new URL('Data/introduction_companion_manifest.json',root),'utf8'));
const batches={A:[1,3,4,5,6,7,9],B:[10,11,13,14,15,18,19],C:[20,21,22,23,24,25,26],D:[28,29,31,32,33,35,36]};
const batch=process.env.F07_BATCH??'ALL',numbers=batch==='ALL'?Array.from({length:36},(_,i)=>i+1):batches[batch];
if(!numbers)throw new Error('Batch non valido');
const base=process.env.F07_BASE_URL??'http://127.0.0.1:5173';
const directory=new URL('Docs/F07_assets/',root);await mkdir(directory,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[],errors=[],requests=[];
try{
  const page=await browser.newPage({viewport:{width:2300,height:1650}});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>requests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)requests.push({url:r.url(),status:r.status()});});
  const pdf=await(await page.request.get(base+'/course-assets/'+manifest.source_pdf.filename)).body();
  const hash=createHash('sha256').update(pdf).digest('hex');
  if(hash!==manifest.source_pdf.sha256)throw new Error('PDF modificato');
  for(const number of numbers){
    const start=performance.now(),definition=manifest.pages[number-1],id=String(number).padStart(2,'0');
    await page.goto(base+'/#/study?page='+number);
    await page.locator('canvas[data-rendered-page="'+number+'"]').waitFor();
    const lesson=page.locator('.lesson-page[data-source-page="'+number+'"]');await lesson.waitFor();
    const modes=definition.visualization.presentation.toggle;
    const ready=async()=>{if(await lesson.locator('.scene-viewport').count())await lesson.locator('[data-plot-ready="true"]').waitFor();};
    await ready();await page.evaluate(()=>document.fonts.ready);
    const capture=async(name)=>{await page.mouse.move(0,0);await page.locator('.companion-scroll').evaluate(e=>{e.scrollTop=0;e.scrollLeft=0;});await lesson.screenshot({path:fileURLToPath(new URL(name,directory))});};
    const measure=()=>lesson.evaluate(el=>{
      const b=el.getBoundingClientRect(),scale=b.width/960;
      const blocks=Array.from(el.children).map(e=>{const r=e.getBoundingClientRect();return{top:(r.top-b.top)/scale,bottom:(r.bottom-b.top)/scale};});
      return {height:el.clientHeight,scrollHeight:el.scrollHeight,blocks,bottom:blocks.at(-1).bottom,
        overlaps:blocks.some((b,i)=>i>0&&b.top<blocks[i-1].bottom-1),
        equations:Array.from(el.querySelectorAll('.equation')).filter(e=>!e.closest('details:not([open])')&&!e.closest('.formula-reference')).map(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth})),
        orphanEquations:Array.from(el.querySelectorAll('.equation-card')).filter(e=>!e.closest('[data-explained-formula-id]')).length,
        outputs:Object.fromEntries(Array.from(el.querySelectorAll('output[data-testid]')).map(e=>[e.getAttribute('data-testid'),e.textContent])),
        warnings:Array.from(el.querySelectorAll('[role="note"]')).map(e=>e.textContent),
        alerts:Array.from(el.querySelectorAll('[role="alert"]')).map(e=>e.textContent),
        concepts:Array.from(el.querySelectorAll('.formula-concept')).filter(e=>!e.closest('details:not([open])')).map(e=>e.textContent),
        formulaOccurrences:Array.from(el.querySelectorAll('[data-explained-formula-id]')).map(e=>({id:e.getAttribute('data-explained-formula-id'),canonical:e.getAttribute('data-canonical-latex')})),
        formulaContexts:Array.from(el.querySelectorAll('[data-formula-reference]')).map(e=>e.getAttribute('data-formula-reference')),
      };
    });
    const geometry=await measure();await capture('page-'+id+'-companion.png');
    const alternatives=[];
    if(modes.length===2){
      const initial=definition.visualization.presentation.defaultView,other=initial==='2D'?'3D':'2D';
      await lesson.getByRole('button',{name:other,exact:true}).click();await ready();
      alternatives.push({view:other,...await measure()});await capture('page-'+id+'-'+other.toLowerCase()+'.png');
      await lesson.getByRole('button',{name:initial,exact:true}).click();await ready();
    }
    let formulas=[],formulaOverflow=[];
    const disclosure=lesson.getByRole('button',{name:'Formule e prerequisiti',exact:false});
    if(await disclosure.count()){
      await disclosure.click();
      formulas=await lesson.locator('.formula-reference > [data-formula-id]').evaluateAll(els=>els.map(e=>({
        formulaId:e.getAttribute('data-formula-id'),latex:e.querySelector('[data-canonical-latex]')?.getAttribute('data-canonical-latex'),
        conceptualExplanation:e.querySelector('.formula-concept')?.textContent,details:e.querySelector('.formula-detail-content')?.textContent,
      })));
      const formulaErrors=await lesson.locator('.formula-reference [role=alert]').allTextContents();
      if(formulaErrors.length)errors.push(...formulaErrors);
      formulaOverflow=await lesson.locator('.formula-reference .equation').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth})));
      await lesson.getByRole('button',{name:'Chiudi',exact:true}).click();
    } else formulas=await lesson.locator('[data-explained-formula-id]').evaluateAll(els=>els.filter(e=>!e.closest('details')).map(e=>({
      formulaId:e.getAttribute('data-explained-formula-id'),latex:e.getAttribute('data-canonical-latex'),conceptualExplanation:e.querySelector('.formula-concept')?.textContent,
    })));
    const record={page:number,mode:definition.visualization.visualizationMode,defaultView:definition.visualization.presentation.defaultView,
      loadAndReviewMs:Math.round(performance.now()-start),geometry,alternatives,formulas,formulaOverflow};
    results.push(record);
    console.log(JSON.stringify({page:number,bottom:geometry.bottom,scrollHeight:geometry.scrollHeight,alternativeBottoms:alternatives.map(a=>a.bottom),formulas:formulas.length,alerts:geometry.alerts}));
  }
  const valid=g=>g.height===1280&&g.scrollHeight<=1281&&g.bottom<=1241&&!g.overlaps&&!g.orphanEquations&&!g.alerts.length&&g.equations.every(e=>e.scrollWidth<=e.width+1);
  const success=!errors.length&&!requests.length&&results.every(p=>valid(p.geometry)&&p.alternatives.every(valid)&&!p.formulaOverflow.length&&p.formulas.every(f=>f.conceptualExplanation?.trim()));
  await writeFile(new URL('Data/reports/f07_'+(batch==='ALL'?'final':'batch_'+batch.toLowerCase())+'_visual.json',root),JSON.stringify({
    verified_at:new Date().toISOString(),batch,base_url:base,browser:'Chrome / SwiftShader',pdf_sha256:hash,pages:results,errors,failed_requests:requests,success,
  },null,2)+'\n');
  if(!success)process.exitCode=1;
}finally{await browser.close();}
