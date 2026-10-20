import {chromium,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

/** Shared browser inspection for a physical page: real PDF, every view and the common fullscreen boundary. */
export async function studyBrowser(folder,reportFolder=folder){
  await mkdir(folder,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:2300,height:1650}});
  page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));
  const lesson=()=>page.locator('.lesson-page');
  const ready=async()=>{
    await expect(lesson()).toBeVisible();
    for(const scene of await lesson().locator('.scene-viewport').all())await expect(scene).toHaveAttribute('data-plot-ready','true');
    await page.evaluate(()=>document.fonts.ready);
    await expect.poll(()=>lesson().locator('.scene-viewport').evaluateAll(scenes=>scenes.every(scene=>{
      const graph=scene.querySelector('.js-plotly-plot'),surface=scene.querySelector('.plot-surface');
      return graph?._fullLayout&&Math.abs(graph._fullLayout.width-surface.clientWidth)<3&&Math.abs(graph._fullLayout.height-surface.clientHeight)<3;
    }))).toBe(true);
  };
  const measure=()=>lesson().evaluate(e=>{
    const box=e.getBoundingClientRect(),scale=box.width/960;
    return{height:e.clientHeight,scroll:e.scrollHeight,blocks:Array.from(e.children).map(child=>{const b=child.getBoundingClientRect();return{class:child.className,top:(b.top-box.top)/scale,bottom:(b.bottom-box.top)/scale};}),
      formula_overflow:Array.from(e.querySelectorAll('.equation')).filter(x=>!x.closest('details:not([open])')&&!x.closest('.formula-reference')&&x.scrollWidth>x.clientWidth+2).map(x=>({width:x.clientWidth,scroll:x.scrollWidth})),
      alerts:Array.from(e.querySelectorAll('[role=alert]')).map(x=>x.textContent),
      outputs:Object.fromEntries(Array.from(e.querySelectorAll('output[data-testid]')).map(x=>[x.dataset.testid,x.textContent]))};
  });
  const fits=v=>v.height===1280&&v.scroll<=1281&&!v.alerts.length&&!v.formula_overflow.length&&v.blocks.every(b=>b.bottom<=1241);
  const screenshot=async name=>{await page.mouse.move(0,0);await lesson().screenshot({path:folder+'/'+name+'.png'});};
  const inspect=async(n,definition,base)=>{
    await page.goto(base+'/#/study?doc=optimization&page='+n);await ready();
    await expect(page.locator('canvas[data-rendered-page="'+n+'"]')).toBeVisible();
    const records=[];
    for(const view of definition.visualization.presentation.toggle.length?definition.visualization.presentation.toggle:['2D']){
      if(definition.visualization.presentation.toggle.length)await lesson().getByRole('button',{name:view,exact:true}).click();await ready();
      await screenshot('p'+n+'-'+view.toLowerCase());
      const geometry=await measure();records.push({view,screenshot:reportFolder+'/p'+n+'-'+view.toLowerCase()+'.png',...geometry});
      console.log(JSON.stringify({page:n,view,scroll:geometry.scroll,bottom:geometry.blocks.at(-1).bottom,overflow:geometry.formula_overflow,alerts:geometry.alerts}));
      const formulas=lesson().getByRole('button',{name:/Formule e prerequisiti/});
      await formulas.click();expect(await lesson().locator('.formula-reference [role=alert]').count()).toBe(0);
      await lesson().getByRole('button',{name:'Chiudi',exact:true}).click();
      const expand=lesson().locator('[data-graphic-owner=true] > .graphic-expand').first();
      await expand.click();await expect(lesson()).toHaveAttribute('data-graphic-fullscreen',/native|popover/);await ready();
      if(n===12||n===18)await screenshot('p'+n+'-'+view.toLowerCase()+'-fullscreen');
      await page.keyboard.press('Escape');await expect(lesson()).not.toHaveAttribute('data-graphic-fullscreen');await ready();
    }
    return{page:n,views:records};
  };
  return{browser,page,lesson,ready,measure,fits,screenshot,inspect,errors};
}
