import { chromium,expect } from '@playwright/test';
import { readFile,writeFile } from 'node:fs/promises';
const root=new URL('../../',import.meta.url),base=process.env.F07_BASE_URL??'http://127.0.0.1:4173';
const all=process.env.F07_RUNTIME_ALL==='YES',manifest=JSON.parse(await readFile(new URL('Data/introduction_companion_manifest.json',root),'utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-precise-memory-info']});
const errors=[],checks=[],navigation=[],updates=[];
try{
  const page=await browser.newPage({viewport:{width:1500,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  const go=async n=>{await page.goto(base+'/#/study?page='+n);await page.locator('canvas[data-rendered-page="'+n+'"]').waitFor();await page.locator('.lesson-page[data-source-page="'+n+'"]').waitFor();};
  const set=async(n,i,value)=>page.getByLabel(manifest.pages[n-1].controls[i].label+' valore',{exact:true}).fill(String(value));
  const verify=async(id,value)=>{await expect(page.getByTestId(id)).toHaveText(value);checks.push({id,expected:value,status:'PASS'});};
  await go(21);await set(21,0,0);await verify('endpoint-feasible','no');await verify('endpoint-residual','-1.0000');
  await set(21,0,.5);await verify('endpoint-feasible','sì');await verify('endpoint-residual','0.0000');
  await go(23);await set(23,1,0);await verify('ocp-feasible','no');await verify('ocp-cost','non disponibile');
  await set(23,0,0);await verify('ocp-feasible','sì');await verify('ocp-cost','0.0000');
  await go(25);await set(25,1,0);await verify('tracking-command','0.0000');await verify('tracking-cost','0.0000');
  await go(26);await set(26,0,0);await set(26,1,0);await verify('drone-ay','-9.8100');await verify('drone-angular','0.0000');
  if(all){
    await go(29);await verify('drone-stage-cost','3.0500');
    await go(32);await verify('functional-endpoint','0.0000');
    await go(33);await verify('pendulum-acceleration','-4.9050');
    await set(33,1,4.905);await verify('pendulum-acceleration','0.0000');
    await go(35);await set(35,1,0);await verify('reference-valid','equilibrio costante');
    await go(36);await verify('pendulum-candidate-total','3.2284');await set(36,2,0);await verify('pendulum-terminal','0.0000');
  }
  await go(23);await page.getByRole('button',{name:'Ripristina parametri',exact:true}).click();
  const scene=page.locator('.scene-viewport[data-plot-dimension="3"]');await expect(scene).toHaveAttribute('data-plot-ready','true');
  await scene.locator('.js-plotly-plot').evaluate(e=>e.setAttribute('data-runtime-probe','retained'));
  await page.getByRole('button',{name:/^Zoom avanti /}).click();
  const camera=await scene.getAttribute('data-camera'),before=await page.evaluate(()=>performance.memory?.usedJSHeapSize??null);
  for(let i=1;i<=12;i++){
    const target=i/10,previous=Number(await scene.getAttribute('data-render-count')),start=performance.now();
    await set(23,0,target);
    await page.waitForFunction(({target,previous})=>{
      const outer=document.querySelector('.scene-viewport[data-plot-dimension="3"]'),plot=outer?.querySelector('.js-plotly-plot');
      const p=plot?.data?.find(t=>t.type==='scatter3d'&&t.mode==='markers');
      return Number(outer?.getAttribute('data-render-count'))>previous&&Math.abs(p?.x?.[0]-target/2)<1e-12;
    },{target,previous});
    updates.push({target,input_to_completed_plot_ms:Math.round(performance.now()-start)});
  }
  const preserved={dom:await scene.locator('.js-plotly-plot').getAttribute('data-runtime-probe')==='retained',camera:await scene.getAttribute('data-camera')===camera};
  for(const n of all?[28,29,31,32,33,35,36,24,26,2,8,12,16,17,27,30,34,1]:[20,21,22,23,24,25,26,1]){
    await page.getByLabel('Numero pagina').fill(String(n));await page.getByRole('button',{name:'Vai alla pagina',exact:true}).click();
    await page.locator('canvas[data-rendered-page="'+n+'"]').waitFor();await page.locator('.lesson-page[data-source-page="'+n+'"]').waitFor();
    const scenes=await page.locator('.scene-viewport').count();navigation.push({page:n,scenes,webglCanvases:await page.locator('.scene-viewport canvas').count()});
    if(scenes>1)throw new Error('Scene non rilasciate: '+n);
  }
  const after=await page.evaluate(()=>performance.memory?.usedJSHeapSize??null);
  const success=preserved.dom&&preserved.camera&&!errors.length&&navigation.at(-1).scenes===0&&navigation.at(-1).webglCanvases===0;
  const durations=updates.map(p=>p.input_to_completed_plot_ms).sort((a,b)=>a-b);
  const result={verified_at:new Date().toISOString(),base_url:base,environment:'Chrome headless / SwiftShader; software rendering, includes browser automation',
    checks,updates,median_update_ms:durations[Math.floor(durations.length/2)],maximum_update_ms:durations.at(-1),preserved,navigation,heap_before:before,heap_after_navigation:after,
    limitations:'No forced GC; heap snapshots are observations and do not prove absence of leaks. Not a hardware GPU benchmark.',errors,success};
  await writeFile(new URL('Data/reports/f07_'+(all?'runtime_measurements':'batch_c_runtime')+'.json',root),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));if(!success)process.exitCode=1;
}finally{await browser.close();}
