import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-precise-memory-info',
]});
try {
  const page=await browser.newPage({viewport:{width:1500,height:1000}});
  await page.goto('http://127.0.0.1:5173/#/dev');
  await page.locator('[data-plot-id="wave-3d"][data-plot-ready="true"]').waitFor();
  const memoryBefore=await page.evaluate(()=>performance.memory?.usedJSHeapSize??null);
  const updates=[];
  for(const value of [.5,1,1.5,2,2.5]) {
    const previous=await page.locator('[data-plot-id="wave-3d"]').getAttribute('data-render-count');
    const start=performance.now();
    await page.getByLabel('Ampiezza valore').fill(String(value));
    await page.waitForFunction(({value,previous})=>{
      const outer=document.querySelector('[data-plot-id="wave-3d"]');
      const graph=outer?.querySelector('.js-plotly-plot');
      return Number(outer?.getAttribute('data-render-count'))>Number(previous)&&Math.abs(graph?.data?.[0]?.z?.[16]?.[24]-value)<1e-9;
    },{value,previous});
    updates.push({value,input_to_plotly_react_ms:Math.round(performance.now()-start)});
  }
  const runtime=await page.evaluate(()=>{
    const canvas=document.querySelector('[data-plot-id="wave-3d"] canvas');
    const gl=canvas?.getContext('webgl2')??canvas?.getContext('webgl');
    const debug=gl?.getExtension('WEBGL_debug_renderer_info');
    return {userAgent:navigator.userAgent,renderer:gl?(debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)):null,
      usedJSHeapSize:performance.memory?.usedJSHeapSize??null,canvas_count:document.querySelectorAll('canvas').length};
  });
  await page.getByRole('button',{name:'Componenti',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.scene-viewport').length===0);
  const afterUnmount=await page.evaluate(()=>({canvas_count:document.querySelectorAll('canvas').length,usedJSHeapSize:performance.memory?.usedJSHeapSize??null}));
  const result={environment:'Installed Chrome headless, software WebGL (SwiftShader); local measurements, not hardware-GPU benchmark',
    updates,memoryBefore,runtime,afterUnmount,
    interpretation:'Input-to-Plotly.react includes browser automation overhead. Heap snapshots without forced GC are not a leak proof. No rendered canvases remain after unmount.'};
  await writeFile(new URL('../../Data/reports/f05_runtime_measurements.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally {await browser.close();}
