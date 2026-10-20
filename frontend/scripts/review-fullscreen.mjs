import { chromium,expect } from '@playwright/test';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=new URL('../../',import.meta.url),base=process.env.FULLSCREEN_BASE_URL??'http://127.0.0.1:5173';
const read=async name=>JSON.parse(await readFile(new URL(name,root),'utf8'));
const manifest=await read('Data/introduction_companion_manifest.json');
const previous=await read('Data/reports/f07_final_visual.json');
const evidence=new URL('Docs/fullscreen_assets/',root);await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pages=[],errors=[],screenshots=[],checks=[];
const graphicSelector='.scene-viewport,svg[role="img"],.cost-breakdown,.state-timeline,.vector-visualizer';
try {
  const page=await browser.newPage({viewport:{width:1500,height:1000}});
  page.on('pageerror',e=>{const error={message:e.message,stack:e.stack,url:page.url()};errors.push(error);console.error(JSON.stringify(error));});
  const lesson=()=>page.locator('.lesson-page');
  const ready=async()=>{
    await expect(lesson()).toBeVisible();
    for(const scene of await lesson().locator('.scene-viewport').all())await expect(scene).toHaveAttribute('data-plot-ready','true');
    await page.evaluate(()=>document.fonts.ready);
  };
  const snapshot=()=>lesson().evaluate(e=>({
    outputs:Object.fromEntries(Array.from(e.querySelectorAll('output[data-testid]')).map(x=>[x.dataset.testid,x.textContent])),
    formulas:Array.from(e.querySelectorAll('[data-explained-formula-id]')).map(x=>({id:x.dataset.explainedFormulaId,canonical:x.dataset.canonicalLatex})),
  }));
  const capture=async(name)=>{
    await page.mouse.move(0,0);
    await page.screenshot({path:fileURLToPath(new URL(name,evidence))});screenshots.push('Docs/fullscreen_assets/'+name);
  };
  const resized=async(scope)=>{
    await expect.poll(()=>scope.locator('.scene-viewport').evaluateAll(scenes=>scenes.every(scene=>{
      const surface=scene.querySelector('.plot-surface'),plot=scene.querySelector('.js-plotly-plot');
      return plot?._fullLayout&&Math.abs(plot._fullLayout.width-surface.clientWidth)<3&&Math.abs(plot._fullLayout.height-surface.clientHeight)<3;
    }))).toBe(true);
  };
  for(let n=1;n<=36;n++){
    await page.goto(base+'/#/study?page='+n);await ready();
    await expect(page.locator('canvas[data-rendered-page="'+n+'"]')).toBeVisible();
    const baseline=previous.pages.find(p=>p.page===n),actual=await snapshot();
    expect(actual.outputs).toEqual(baseline.geometry.outputs);
    expect(actual.formulas).toEqual(baseline.geometry.formulaOccurrences);
    const modes=manifest.pages[n-1].visualization.presentation.toggle,views=[];
    for(const view of modes.length?modes:['default']){
      if(modes.length===2)await lesson().getByRole('button',{name:view,exact:true}).click();await ready();
      await expect.poll(()=>lesson().locator(graphicSelector).evaluateAll(els=>els.filter(e=>!e.closest('.js-plotly-plot')).every(e=>!!e.closest('[data-graphic-owner=true]')||e.hasAttribute('data-graphic-auto-owner')))).toBe(true);
      const graphics=await lesson().locator(graphicSelector).evaluateAll(els=>els.filter(e=>!e.closest('.js-plotly-plot')).map(e=>({
        kind:e.matches('.scene-viewport')?'scene-'+e.getAttribute('data-plot-dimension')+'d':e.tagName.toLowerCase()==='svg'?'svg':e.className,
        label:e.getAttribute('aria-label')??e.querySelector('title')?.textContent??e.closest('[data-graphic-label]')?.getAttribute('data-graphic-label'),
        covered:!!e.closest('[data-graphic-owner=true]')||e.hasAttribute('data-graphic-auto-owner'),
        in_example:!!e.closest('.block-worked_example'),
      })));
      views.push({view,graphics,fullscreen_controls:await lesson().locator('[data-graphic-owner=true],.graphic-auto-expand').count()});
    }
    pages.push({page:n,views,f07_outputs_and_formulas_unchanged:true});
    console.log('Coverage '+n+'/36: '+views.map(v=>v.view+'='+v.graphics.length).join(', '));
  }

  // Review representative SVG, example, simulation and native 2D/3D layouts.
  const representatives=[{page:4,index:0,auto:true,name:'p04-inline-svg'},
    {page:16,index:0,name:'p16-3d'},{page:16,index:1,name:'p16-example-bars'},
    {page:17,index:1,name:'p17-example-circle'},{page:20,index:0,view:'2D',name:'p20-cost-and-timeline'},
    {page:10,index:0,name:'p10-timeline'},{page:27,index:0,name:'p27-simulation'},
    {page:34,index:0,view:'2D',name:'p34-equilibrium-poses-and-curve'}];
  for(const target of representatives){
    await page.goto(base+'/#/study?page='+target.page);await ready();
    if(target.view){await lesson().getByRole('button',{name:target.view,exact:true}).click();await ready();}
    const button=target.auto?lesson().locator('.graphic-auto-expand'):lesson().locator('[data-graphic-owner=true] > .graphic-expand').nth(target.index);
    await button.click();await expect(lesson()).toHaveAttribute('data-graphic-fullscreen',/native|popover/);
    await resized(lesson().locator('[data-fullscreen-target]'));
    await capture(target.name+'-fullscreen.png');
    const layout=await lesson().evaluate(e=>{
      const r=e.getBoundingClientRect(),selected=e.querySelector('[data-fullscreen-target]'),b=selected.getBoundingClientRect();
      return {root:{width:r.width,height:r.height},target:{width:b.width,height:b.height},controls:e.querySelector('.block-controls')?.getBoundingClientRect().height??0};
    });
    checks.push({name:target.name,...layout});
    await page.keyboard.press('Escape');await expect(lesson()).not.toHaveAttribute('data-graphic-fullscreen');
    await resized(lesson());
    if(target.page===16&&target.index===0)await capture('p16-restored.png');
  }

  // Plotly's actual zoom ranges and original node survive fullscreen and a height-only resize.
  await page.goto(base+'/#/study?page=15');await ready();
  const graph=lesson().locator('.js-plotly-plot');
  const ranges=()=>graph.evaluate(e=>({x:e.layout.xaxis.range,y:e.layout.yaxis.range}));
  const height=()=>graph.evaluate(e=>e._fullLayout.height),initialHeight=await height();
  const initial=await ranges();await graph.locator('[data-title="Zoom in"]').click({force:true});
  await expect.poll(ranges).not.toEqual(initial);const zoom=await ranges();
  await graph.evaluate(e=>e.dataset.retained='same-node');
  await lesson().locator('.graphic-expand').click();await expect(lesson()).toHaveAttribute('data-graphic-fullscreen',/native|popover/);
  await expect.poll(ranges).toEqual(zoom);
  await expect.poll(height).toBeGreaterThan(initialHeight);const beforeHeight=await height();
  await page.setViewportSize({width:1500,height:800});await expect.poll(height).toBeLessThan(beforeHeight);
  await expect(graph).toHaveAttribute('data-retained','same-node');await expect.poll(ranges).toEqual(zoom);
  await capture('p15-2d-zoom-resized-fullscreen.png');
  await page.keyboard.press('Escape');await expect(lesson()).not.toHaveAttribute('data-graphic-fullscreen');
  await resized(lesson());
  await expect.poll(ranges).toEqual(zoom);await expect(graph).toHaveAttribute('data-retained','same-node');
  checks.push({name:'2d_zoom_and_height_only_resize',unchanged_ranges:zoom,node_retained:true});
  await page.setViewportSize({width:1500,height:1000});

  await page.goto(base+'/#/dev');
  const combined=page.locator('[data-graphic-owner=true]').filter({has:page.locator('.function-explorer')}).first();
  await expect(combined.locator('[data-plot-ready=true]')).toHaveCount(2);
  await combined.locator(':scope > .graphic-expand').click();await expect(combined).toHaveAttribute('data-graphic-fullscreen',/native|popover/);
  await resized(combined);
  await capture('future-combined-2d-3d-fullscreen.png');
  await page.keyboard.press('Escape');

  const preserved={};
  for(const [name,key] of [['Data/reviews/fullscreen_baseline.json','files'],['Data/reviews/f05_source_baseline.json','protected_files']]){
    const baseline=await read(name),changed=[];
    for(const [path,expected] of Object.entries(baseline[key])){
      const actual=createHash('sha256').update(await readFile(new URL(path,root))).digest('hex');if(actual!==expected)changed.push(path);
    }
    expect(changed).toEqual([]);preserved[name]={checked:Object.keys(baseline[key]).length,changed};
  }
  expect(errors).toEqual([]);
  const report={verified_at:new Date().toISOString(),base_url:base,pages_checked:pages.length,
    graphs_checked:pages.flatMap(p=>p.views.flatMap(v=>v.graphics)).length,uncovered_graphs:[],pages,checks,screenshots,preserved,browser_errors:errors,success:true};
  await writeFile(new URL('Data/reports/fullscreen_coverage.json',root),JSON.stringify(report,null,2)+'\n');
} finally {await browser.close();}
