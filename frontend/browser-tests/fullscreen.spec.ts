import { test,expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../../Data/introduction_companion_manifest.json',import.meta.url),'utf8'));
const selector='.scene-viewport,svg[role="img"],.cost-breakdown,.state-timeline,.vector-visualizer';
for(let n=1;n<=36;n++)test('fullscreen copertura pagina '+n,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#/study?page='+n);
  const lesson=page.locator('.lesson-page[data-source-page="'+n+'"]');await expect(lesson).toBeVisible();
  await expect(page.locator('canvas[data-rendered-page="'+n+'"]')).toBeVisible();
  const configured=manifest.pages[n-1].visualization.presentation.toggle;
  const views=configured.length?configured:['default'];
  for(const view of views){
    if(views.length===2)await lesson.getByRole('button',{name:view,exact:true}).click();
    if(await lesson.locator('.scene-viewport').count())await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
    await expect.poll(()=>lesson.locator(selector).evaluateAll(els=>els.filter(e=>!e.closest('.js-plotly-plot')).every(e=>!!e.closest('[data-graphic-owner="true"]')||e.hasAttribute('data-graphic-auto-owner')))).toBe(true);
    const owners=lesson.locator('[data-graphic-owner="true"]');
    const total=await owners.count();
    for(let i=0;i<total;i++){
      const owner=owners.nth(i),plot=owner.locator('.js-plotly-plot');
      const outputs=await lesson.locator('output').allTextContents();
      const before=await owner.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
      await owner.evaluate(el=>el.setAttribute('data-fullscreen-node-probe','same'));
      if(await plot.count())await plot.evaluate(e=>e.setAttribute('data-fullscreen-plot-probe','same'));
      await owner.locator(':scope > .graphic-expand').click();
      await expect(lesson).toHaveAttribute('data-graphic-fullscreen',/native|popover/);
      await expect(owner).toHaveAttribute('data-fullscreen-target','true');
      const b=await owner.boundingBox();expect(b!.width).toBeGreaterThan(before.width);expect(b!.height).toBeGreaterThan(before.height);
      await expect.poll(()=>owner.locator(selector).evaluateAll(els=>els.filter(e=>!e.closest('.js-plotly-plot')).every(e=>e.getBoundingClientRect().height>40&&e.getBoundingClientRect().width>40))).toBe(true);
      await expect.poll(()=>owner.locator('.scene-viewport').evaluateAll(scenes=>scenes.every(scene=>{
        const surface=scene.querySelector('.plot-surface')!,graph=scene.querySelector('.js-plotly-plot') as HTMLElement&{_fullLayout?:{width:number;height:number}};
        return graph?._fullLayout&&Math.abs(graph._fullLayout.width-surface.clientWidth)<3&&Math.abs(graph._fullLayout.height-surface.clientHeight)<3;
      }))).toBe(true);
      if(await plot.count())await expect(plot).toHaveAttribute('data-fullscreen-plot-probe','same');
      await expect(owner).toHaveAttribute('data-fullscreen-node-probe','same');
      expect(await lesson.locator('output').allTextContents()).toEqual(outputs);
      if(await lesson.locator('.block-controls').count())await expect(lesson.locator('.block-controls')).toBeVisible();
      await page.getByRole('button',{name:'Esci da schermo intero',exact:true}).click();
      await expect(lesson).not.toHaveAttribute('data-graphic-fullscreen');
      if(await plot.count())await expect(plot).toHaveAttribute('data-fullscreen-plot-probe','same');
    }
    const raw=lesson.locator('[data-graphic-auto-owner]');
    if(await raw.count()){
      await lesson.locator('.graphic-auto-expand').click();await expect(raw).toHaveAttribute('data-fullscreen-target','true');
      await page.keyboard.press('Escape');await expect(lesson).not.toHaveAttribute('data-graphic-fullscreen');
    }
  }
  expect(await lesson.evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight})) ).toEqual({height:1280,scroll:1280});
  expect(errors).toEqual([]);
});
test('fullscreen: camera, toggle, parametri e focus restano attivi',async({page})=>{
  await page.goto('/#/study?page=16');const lesson=page.locator('.lesson-page');
  await expect(lesson.locator('[data-plot-ready=true]')).toHaveCount(1);
  const scene=lesson.locator('.scene-viewport');await scene.getByRole('button',{name:/Zoom avanti/}).click();
  const camera=await scene.getAttribute('data-camera');
  const expand=lesson.locator('.graphic-expand').first();await expand.click();
  const close=lesson.getByRole('button',{name:'Esci da schermo intero',exact:true});
  await close.focus();await page.keyboard.press('Tab');
  expect(await lesson.evaluate(e=>e.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Shift+Tab');await expect(close).toBeFocused();
  await page.getByLabel('Secondo peso valore',{exact:true}).fill('2');
  await expect(page.getByTestId('weighted-total')).toHaveText('1.5000');
  expect(await scene.getAttribute('data-camera')).toBe(camera);
  await lesson.getByRole('button',{name:'2D',exact:true}).click();await expect(lesson.locator('[data-plot-dimension="2"]')).toHaveAttribute('data-plot-ready','true');
  await lesson.getByRole('button',{name:'3D',exact:true}).click();await expect(lesson.locator('[data-plot-dimension="3"]')).toHaveAttribute('data-plot-ready','true');
  await page.keyboard.press('Escape');await expect(lesson).not.toHaveAttribute('data-graphic-fullscreen');await expect(expand).toBeFocused();
});
test('fullscreen: simulazione, fallback, resize e cambio pagina puliscono lo stato',async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(HTMLElement.prototype,'requestFullscreen',{configurable:true,value:undefined});});
  await page.goto('/#/study?page=27');const lesson=page.locator('.lesson-page');
  await expect(lesson.locator('[data-plot-ready=true]')).toHaveCount(1);await lesson.locator('.graphic-expand').first().click();
  await expect(lesson).toHaveAttribute('data-graphic-fullscreen','popover');
  await lesson.getByRole('button',{name:'Play',exact:true}).click();
  await expect.poll(()=>page.getByLabel('Campione Euler valore').inputValue()).not.toBe('0');
  await lesson.getByRole('button',{name:'Pausa',exact:true}).click();
  await page.setViewportSize({width:900,height:720});await expect(lesson).toHaveAttribute('data-graphic-fullscreen','popover');
  await page.evaluate(()=>{location.hash='#/study?page=1';});
  await expect(page.locator('.lesson-page[data-source-page="1"]')).toBeVisible();
  expect(await page.evaluate(()=>({full:document.fullscreenElement,popovers:document.querySelectorAll(':popover-open').length,overflow:document.body.style.overflow}))).toEqual({full:null,popovers:0,overflow:''});
});
test('fullscreen: viste affiancate e grafici futuri ereditano il wrapper',async({page})=>{
  await page.goto('/#/dev');
  const group=page.locator('[data-graphic-owner=true]').filter({has:page.locator('.function-explorer')}).first();
  await expect(group.locator('[data-plot-ready=true]')).toHaveCount(2);await group.locator(':scope > .graphic-expand').click();
  await expect(group).toHaveAttribute('data-graphic-fullscreen',/native|popover/);
  expect(await page.locator('html,body').evaluateAll(els=>els.map(e=>e.hasAttribute('data-fullscreen-branch')))).toEqual([false,false]);
  for(const scene of await group.locator('.scene-viewport').all())expect((await scene.boundingBox())!.height).toBeGreaterThan(500);
  await page.getByRole('button',{name:'Esci da schermo intero'}).click();
});
