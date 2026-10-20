import { test,expect,type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { companionRenderers } from '../src/companion/registry';
import { interactiveDefinition } from '../src/companion/courseDefinition';
import { pageFormulaExplanations } from '../src/companion/formulaExplanations';
const manifest=JSON.parse(readFileSync(new URL('../../Data/introduction_companion_manifest.json',import.meta.url),'utf8'));
const existing=new Set([2,8,12,16,17,27,30,34]);
const implemented=Object.keys(companionRenderers).map(Number).filter(n=>!existing.has(n));
async function snapshot(lesson:Locator){
  return lesson.evaluate(el=>JSON.stringify({
    values:Array.from(el.querySelectorAll('output')).map(x=>x.textContent),
    graphs:Array.from(el.querySelectorAll('.js-plotly-plot')).map((p:any)=>p.data.map((t:any)=>[t.x,t.y,t.z])),
  }));
}
async function geometry(lesson:Locator){
  const g=await lesson.evaluate(el=>{
    const b=el.getBoundingClientRect(),scale=b.width/960;
    const blocks=Array.from(el.children).map(e=>e.getBoundingClientRect());
    return {height:el.clientHeight,overflow:el.scrollHeight-el.clientHeight,
      bottom:(el.querySelector('.takeaway')!.getBoundingClientRect().bottom-b.top)/scale,
      overlaps:blocks.some((r,i)=>i>0&&r.top<blocks[i-1].bottom-1),
      equations:Array.from(el.querySelectorAll('.equation')).filter(e=>!e.closest('details:not([open])'))
        .filter(e=>e.scrollWidth>e.clientWidth+1).length};
  });
  expect(g.height).toBe(1280);expect(g.overflow).toBeLessThanOrEqual(1);expect(g.bottom).toBeLessThanOrEqual(1241);
  expect(g.overlaps).toBe(false);expect(g.equations).toBe(0);
}
for(const number of implemented)test('F07 p'+number+': completezza, input, viste, formule e PDF sincronizzati',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const definition=interactiveDefinition(manifest.pages[number-1]);
  await page.goto('/#/study?page='+number);
  await expect(page.locator('canvas[data-rendered-page="'+number+'"]')).toBeVisible();
  const lesson=page.locator('.lesson-page[data-source-page="'+number+'"]');
  await expect(lesson).toBeVisible();await expect(lesson.getByRole('heading',{level:1})).toHaveText(definition.title);
  await expect(lesson.getByText('Companion pianificata',{exact:true})).toHaveCount(0);
  if(definition.worked_example.required)await expect(lesson.locator('.example-block')).toBeVisible();
  if(definition.visualization.threeDRequirements.enabled) {
    const explorer=lesson.locator('.function-explorer');
    if(await explorer.count())await expect(explorer).toHaveAttribute('data-current-view',definition.visualization.presentation.defaultView);
    if(await lesson.locator('.scene-viewport').count())await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
  }
  await page.evaluate(()=>document.fonts.ready);await geometry(lesson);
  for(const notice of definition.source_warning.student_notices)await expect(lesson.getByRole('note')).toContainText(notice.text);
  if(definition.visualization.presentation.toggle.length===2)
    await lesson.getByRole('button',{name:'3D',exact:true}).click();
  const cameraScene=lesson.locator('.scene-viewport[data-plot-dimension="3"]');
  if(await cameraScene.count()){
    await expect(cameraScene).toHaveAttribute('data-plot-ready','true');
    await lesson.getByRole('button',{name:/^Zoom avanti /}).click();
    await expect(cameraScene).toHaveAttribute('data-camera',/.+/);
    await cameraScene.locator('.js-plotly-plot').evaluate(e=>e.setAttribute('data-preserve-probe','same'));
  }
  const camera=await cameraScene.count()?await cameraScene.first().getAttribute('data-camera'):null;
  for(const control of definition.controls){
    const before=await snapshot(lesson);
    if('choices' in control.domain)await lesson.getByLabel(control.label,{exact:true}).selectOption(String(control.domain.choices.find(v=>v!==control.default)));
    else {
      const d=control.domain,next=control.default+d.step<=d.max?control.default+d.step:control.default-d.step;
      await lesson.getByLabel(control.label+' valore',{exact:true}).fill(String(Number(next.toPrecision(10))));
    }
    await expect.poll(()=>snapshot(lesson)).not.toBe(before);
    if(camera!==null){
      expect(await cameraScene.first().getAttribute('data-camera')).toBe(camera);
      await expect(cameraScene.locator('.js-plotly-plot')).toHaveAttribute('data-preserve-probe','same');
    }
    await lesson.getByRole('button',{name:'Ripristina parametri',exact:true}).click();
  }
  for(const view of definition.visualization.presentation.toggle){
    await lesson.getByRole('button',{name:view,exact:true}).click();
    if(view==='3D'||await lesson.locator('.scene-viewport').count())await expect(lesson.locator('[data-plot-ready="true"]')).toHaveCount(1);
    await geometry(lesson);
  }
  const formulas=pageFormulaExplanations(definition);
  if(formulas.length){
    await expect(lesson.locator('.formula-concept:visible').first()).toBeVisible();
    await lesson.getByRole('button',{name:'Formule e prerequisiti',exact:false}).click();
    const panel=lesson.getByRole('region',{name:'Formule complete'});
    for(const f of formulas){
      const entry=panel.locator('[data-formula-id="'+f.formulaId+'"]');
      await expect(entry.locator('[data-canonical-latex]')).toHaveAttribute('data-canonical-latex',f.latex);
      await expect(entry.locator('.formula-concept')).toHaveText(f.conceptualExplanation);
    }
    await expect(panel.locator('[role="alert"]')).toHaveCount(0);
    await panel.getByRole('button',{name:'Chiudi',exact:true}).click();
  }
  await expect(lesson.locator('[role="alert"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
