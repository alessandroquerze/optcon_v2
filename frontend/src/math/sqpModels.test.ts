import {describe,it,expect} from 'vitest';
import {kktResidual,localNewton,nonlinearStepResidual,primalDualIterations,sqpCost} from './sqpModels';
describe('equality Newton and SQP',()=>{
 it('distinguishes feasibility and joint stationarity at three analytic roots',()=>{
  expect(kktResidual({z:[1,1],lambda:.2})).toMatchObject({h:0,g:[.6,.2]});
  for(const x of [-Math.SQRT1_2,Math.SQRT1_2])expect(kktResidual({z:[x,.5],lambda:.5}).norm).toBeLessThan(1e-14);
  expect(kktResidual({z:[0,0],lambda:1}).norm).toBe(0);
  expect(sqpCost(.1,.01)).toBeLessThan(sqpCost(0,0));
 });
 it('solves the full Newton system with the correct signs',()=>{
  const d=localNewton({z:[1,1],lambda:0});expect(d.status).toBe('unique');
  expect(d.delta![0]).toBeCloseTo(-.2);expect(d.delta![1]).toBeCloseTo(-.4);expect(d.deltaLambda!).toBeCloseTo(.4);
  expect(d.systemResidual!).toBeLessThan(1e-14);expect(d.next!.z[0]).toBeCloseTo(.8);
  expect(kktResidual(d.next!).h).toBeCloseTo(-.04);
 });
 it('distinguishes the QP multiplier from the Newton increment',()=>{
  const d=localNewton({z:[1,1],lambda:.2});expect(d.D).toBeCloseTo(4.6);
  expect(d.delta![0]).toBeCloseTo(-5/23);expect(d.lambdaQp!).toBeCloseTo(10/23);
  expect(d.deltaLambda!).toBeCloseTo(10/23-.2);expect(d.next!.lambda).toBeCloseTo(d.lambdaQp!);
  expect(d.next!.lambda).not.toBeCloseTo(.2+d.lambdaQp!);
 });
 it('preserves the exact nonlinear remainder along the segment',()=>{
  const p={z:[1,.8] as const,lambda:.2},d=localNewton(p);
  for(const theta of [0,.2,.5,1]){
   const r=nonlinearStepResidual(d,theta)!,x=p.z[0]+theta*d.delta![0],y=p.z[1]+theta*d.delta![1];
   expect(r.actual).toBeCloseTo(y-x*x,14);
  }
  expect(Math.abs(nonlinearStepResidual(d,1)!.linear)).toBe(0);
  expect(nonlinearStepResidual(d,1)!.actual).toBeCloseTo(-25/529);
 });
 it('separates compatible and incompatible exact singularities',()=>{
  const family=localNewton({z:[0,0],lambda:.5}),bad=localNewton({z:[.5,.25],lambda:1});
  expect(family).toMatchObject({D:0,status:'singular_family',qpStatus:'minimum_family',next:null});
  expect(family.lambdaQp).toBe(1);expect(family.deltaLambda).toBe(.5);expect(family.delta).toBeNull();
  expect(bad).toMatchObject({D:0,status:'inconsistent',qpStatus:'unbounded',next:null});
 });
 it('shows an invertible Newton system with an unbounded QP',()=>{
  const d=localNewton({z:[0,0],lambda:1});expect(d.status).toBe('unique');expect(d.D).toBe(-1);
  expect(d.qpStatus).toBe('unbounded');expect(Math.hypot(...d.delta!)).toBe(0);
  expect(d.model(10)).toBe(-50);
 });
 it('allows an indefinite full Hessian with positive reduced curvature',()=>{
  const d=localNewton({z:[1,1],lambda:1});expect(d.B).toBe(-1);expect(d.D).toBe(3);expect(d.qpStatus).toBe('unique_minimum');
  expect(d.model(d.delta![0]+.1)).toBeGreaterThan(d.model(d.delta![0]));
 });
 it('Newton can find a nonminimal root while SQP refuses an unbounded model',()=>{
  const p={z:[0,.4] as const,lambda:1},n=primalDualIterations(p,'newton'),s=primalDualIterations(p,'sqp');
  expect(n.states.at(-1)).toEqual({z:[0,0],lambda:1});expect(n.status).toContain('tolleranza');
  expect(s.states).toHaveLength(1);expect(s.status).toContain('QP illimitato');
 });
 it('full Newton and exact SQP agree when their local QPs have unique minima',()=>{
  const p={z:[1,1] as const,lambda:.2},n=primalDualIterations(p,'newton'),s=primalDualIterations(p,'sqp');
  expect(s.status).toContain('tolleranza');expect(n.states).toHaveLength(s.states.length);
  expect(s.states.at(-1)!.z[0]).toBeCloseTo(Math.SQRT1_2,8);
  expect(s.states.at(-1)!.z[1]).toBeCloseTo(.5,8);expect(s.states.at(-1)!.lambda).toBeCloseTo(.5,8);
 });
 it('small nonzero pivots are not replaced by exact singularities',()=>{
  const d=localNewton({z:[.5,.25],lambda:1-1e-9});expect(d.D).not.toBe(0);expect(d.status).toBe('unique');
  expect(Math.abs(d.delta![0])).toBeGreaterThan(1e6);
 });
});
