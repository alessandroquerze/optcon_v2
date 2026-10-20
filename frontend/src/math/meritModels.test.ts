import {describe,it,expect} from 'vitest';
import {meritValue,meritMinima,meritLine,fixedMeritLine,meritBacktracking,globalizedSqp,equalityBarrier,notationEstimate,controlNotation} from './meritModels';
import {sqpCost,kktResidual,localNewton} from './sqpModels';
describe('merit functions, globalized SQP and index semantics',()=>{
 it('penalizes the equality residual, without changing the original cost',()=>{
  expect(meritValue([0,.8],.2)).toBeCloseTo(.18);expect(meritValue([1,1],4)).toBe(.5);
  expect(meritValue([0,.8],.8)-meritValue([0,.8],.2)).toBeCloseTo(.48);
 });
 it('preserves the family at the exact penalty threshold',()=>{
  expect(meritMinima(.2).points[0]).toEqual([0,.8]);expect(meritMinima(.5).family).toBe(true);
  for(const x of [0,.2,Math.SQRT1_2])expect(meritValue([x,.5],.5)).toBeCloseTo(3/8,14);
  expect(meritMinima(.5-1e-10).family).toBe(false);expect(meritMinima(.5+1e-10).family).toBe(false);
  for(const p of meritMinima(.8).points)expect(kktResidual({z:p,lambda:.5}).norm).toBeLessThan(1e-14);
 });
 it('uses exact nonlinear constraints and costs along the SQP direction',()=>{
  const p={z:[.4,1.1] as const,lambda:.2},d=localNewton(p).delta!,line=meritLine(p,d,3);
  for(const gamma of [0,.01,.5,1]){
   expect(line.value(gamma)).toBeCloseTo(meritValue(line.point(gamma),3),13);
   expect(line.cost(gamma)).toBeCloseTo(sqpCost(...line.point(gamma)),13);
  }
  expect((line.value(1e-6)-line.initial)/1e-6).toBeCloseTo(line.slope,4);
 });
 it('backtracks from a rejected full step to a half step',()=>{
  const b=meritBacktracking(fixedMeritLine(3),.5,.1);expect(b.gamma).toBe(.5);
  expect(b.trials.map(t=>t.accepted)).toEqual([false,true]);expect(b.trials[0].gap).toBeCloseTo(68/1058);
 });
 it('rejects an exact Armijo tie without an epsilon shortcut',()=>{
  const line=fixedMeritLine(.95);expect(line.gap(1,.25)).toBe(0);
  const b=meritBacktracking(line,.5,.25);expect(b.trials[0].accepted).toBe(false);expect(b.gamma).toBe(.5);
 });
 it('stops an unusable descent search explicitly',()=>{
  const l=fixedMeritLine(1);expect(meritBacktracking({...l,slope:0},.5,.1).gamma).toBeNull();
  expect(meritBacktracking(l,.5,.1,0).status).toContain('limite numerico');
 });
 it('relaxes the complete QP multiplier with the accepted primal step',()=>{
  const r=globalizedSqp({z:[1,1],lambda:.2},3);expect(r.steps[0].search.gamma).toBe(.5);
  expect(r.states[1].z[0]).toBeCloseTo(41/46);expect(r.states[1].lambda).toBeCloseTo(.5*(.2+10/23));
  expect(kktResidual(r.states[1]).h).toBeCloseTo(-25/2116);
  expect(r.status).toContain('tolleranza');expect(r.states.at(-1)!.z[0]).toBeCloseTo(Math.SQRT1_2,8);
 });
 it('checks decrease at each frozen weight instead of comparing changing objectives',()=>{
  const r=globalizedSqp({z:[1,.8],lambda:.2},.1);
  for(let k=0;k<r.states.length-1;k++)expect(meritValue(r.states[k+1].z,r.weights[k])).toBeLessThan(meritValue(r.states[k].z,r.weights[k]));
 });
 it('allows a cost increase when the same merit function decreases',()=>{
  const r=globalizedSqp({z:[.4,1.1],lambda:.2},3),first=r.states[1];expect(first).toBeDefined();
  expect(sqpCost(...first.z)).toBeGreaterThan(sqpCost(.4,1.1));expect(meritValue(first.z,r.weights[0])).toBeLessThan(meritValue([.4,1.1],r.weights[0]));
 });
 it('does not turn unbounded or nonunique QPs into selected steps',()=>{
  expect(globalizedSqp({z:[0,.4],lambda:1},3).status).toContain('QP illimitato');
  const family=globalizedSqp({z:[0,0],lambda:.5},3);expect(family.states).toHaveLength(1);expect(family.status).toContain('non unico');
  const subsequent=globalizedSqp({z:[.1,1],lambda:.2},.1);expect(subsequent.status).toContain('QP illimitato');expect(subsequent.states).toHaveLength(2);
 });
 it('does not certify a minimum from a KKT root at the origin',()=>{
  const r=globalizedSqp({z:[0,1],lambda:.2},3);expect(r.status).toContain('tolleranza');
  expect(r.states.at(-1)!.z).toEqual([0,0]);expect(sqpCost(.1,.01)).toBeLessThan(sqpCost(0,0));
 });
 it('keeps barrier domain separate from equality feasibility',()=>{
  expect(equalityBarrier(.4,[0,.6]).probeCost).toBeNull();const b=equalityBarrier(.4,[.4,1.2]);
  expect(b.g).toBe(-.4);expect(b.h).toBeCloseTo(.6);expect(b.minimum[0]).toBeCloseTo(.3062257748);
  expect(b.minimum[1]).toBe(.6);expect(equalityBarrier(1e-12,[1,.6]).minimum[0]).toBeGreaterThan(0);
  const x=b.minimum[0];expect(x+1-.4/x).toBeCloseTo(0,13);
 });
 it('numbers estimates independently of a generic trial decision',()=>{
  expect(notationEstimate(0)).toBe(-2);expect(notationEstimate(1)).toBe(-.5);expect(notationEstimate(2)).toBe(.25);
 });
 it('generates genuine gradient iterates with feasible state trajectories',()=>{
  for(let k=0;k<5;k++){
   const a=controlNotation(k),b=controlNotation(k+1),terminal=a.x[3];
   for(let t=0;t<3;t++){expect(a.component(t).residual!).toBeCloseTo(0,14);expect(b.u[t]).toBeCloseTo(a.u[t]-.2*(a.u[t]+terminal),14);}
   expect(b.cost).toBeLessThan(a.cost);expect(a.x[0]).toBe(2);
  }
 });
 it('distinguishes algorithm and time indices and omits the terminal input',()=>{
  const k2=controlNotation(2);expect(k2.component(1).x).toBeCloseTo(1.52);expect(k2.component(1).u).toBe(-.48);
  expect(k2.component(3).x).toBeCloseTo(.56);expect(k2.component(3).u).toBeNull();expect(k2.component(3).residual).toBeNull();
 });
});
