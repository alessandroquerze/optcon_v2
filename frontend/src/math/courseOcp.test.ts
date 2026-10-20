import { it,expect } from 'vitest';
import { stageCosts,reachability,reachabilityData,trackingCost,trackingChoice,trackingData,twoStepOptimum,twoStepData,outputData,droneAcceleration } from './courseOcp';
const axes=[{label:'u',unit:'1'},{label:'x',unit:'1'},{label:'cost',unit:'1'}] as const;
it('p20: contabilità indipendente dei due stadi e del terminale, incluso costo nullo',()=>{
  expect(stageCosts(1,1,4).parts.map(p=>p.value)).toEqual([.625,.125,.5]);
  expect(stageCosts(1,1,4).total).toBe(1.25);expect(stageCosts(0,0,0).total).toBe(0);
});
it('p21: compatibilità, soglia esatta e box degenere senza spessori inventati',()=>{
  expect(reachability(.4)).toMatchObject({max:.8,feasible:false,residual:expect.closeTo(-.2)});
  expect(reachability(.5)).toMatchObject({feasible:true,probe:.5,residual:0});
  const data=reachabilityData(0,axes);
  expect(data.grid.x).toEqual([0,0]);expect(data.grid.z.flat().every(z=>z===-1)).toBe(true);expect(data.intersection.points).toEqual([]);
});
it('p22/p25: distinguere costo della candidata fissa e nuovo ottimo dopo cambio di peso',()=>{
  expect(trackingCost(2,1,1,.5,.5).total).toBe(.375);
  const optimal=trackingChoice(2,1,1);
  expect(optimal.u).toBeCloseTo(1/3);expect(optimal.model.total).toBeCloseTo(1/3);
  expect(trackingData(2,1,1,.5,axes).point.z).toBe(.375);
  expect(trackingChoice(1,0,2)).toMatchObject({u:0,x:0,model:{total:0}});
  expect(()=>trackingChoice(0,1,1)).toThrow();
});
it('p23: soluzione analitica, infeasibilità e limite nullo',()=>{
  expect(twoStepOptimum(1,.8)).toEqual({feasible:true,u:.5,cost:.25});
  expect(twoStepOptimum(1,.4)).toEqual({feasible:false,u:null,cost:null});
  expect(twoStepOptimum(0,0)).toEqual({feasible:true,u:0,cost:0});
  expect(twoStepOptimum(-1,.5).u).toBe(-.5);
});
it('p24: gli stessi campioni alimentano uscita ed errore nelle due viste',()=>{
  expect(outputData(1).actual).toEqual([0,1,2]);expect(outputData(1).error).toEqual([0,-1,0]);
  expect(outputData(0).error).toEqual([0,-2,-2]);
  expect(outputData(.5).actualCurve.points[2]).toMatchObject({x:2,y:1,z:-1,id:'sample:2'});
});
it('p23: bordo del box sollevato al costo reale anche a metà dei lati',()=>{
  const data=twoStepData(1,.8,axes);
  const midpoint=data.box.points.find(p=>Math.abs(p.x-.8)<1e-12&&Math.abs(p.y)<1e-12)!;
  expect(midpoint).toBeDefined();expect(midpoint.z).toBeCloseTo(.32);
  expect(data.box.points[0].z).toBeCloseTo(.64);
});
it('p26: bilancio di hover, differenziale dei rotori e inclinazione senza integrazione',()=>{
  expect(droneAcceleration(4.905,4.905,0)).toEqual({x:-0,y:0,angular:0});
  expect(droneAcceleration(5,4,0)).toEqual({x:-0,y:expect.closeTo(-.81),angular:10});
  expect(droneAcceleration(5,5,Math.PI/6).x).toBeCloseTo(-5);
});
