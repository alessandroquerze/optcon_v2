import {it,expect} from 'vitest';
import {projectRegion,containsRegion,projectionComparison,firstOrderCase,projectedStep,feasibleStep,projectedQp,
  costCatalog,quarticCritical,courseQuartic,courseQuarticGradient,courseQuarticHessian,barrierModel} from './projectionModels';
it('projects the disk and square exactly and satisfies the projection inequality',()=>{
  expect(projectRegion([1.5,.8],0)[0]).toBeCloseTo(15/17,12);
  expect(projectRegion([2,2],1)).toEqual([1,1]);
  for(const kind of [0,1] as const)for(const z of [[1.5,.8],[0,0],[-2,1],[1,0]] as const)for(const theta of [-180,-90,0,45,90,180]){
    const d=projectionComparison(z,theta,kind);
    expect(containsRegion(d.projected,kind)).toBe(true);expect(d.angleProduct).toBeLessThanOrEqual(1e-12);
    expect(d.gap).toBeGreaterThanOrEqual(-1e-12);
    if(d.inside)expect(projectRegion(z,kind)).toEqual(z);
  }
});
it('distinguishes a boundary optimum, a refutable candidate and a stationary maximum',()=>{
  for(const theta of [-180,-90,0,90,180]){
    expect(firstOrderCase(0,theta).minimumProduct).toBe(0);
    expect(firstOrderCase(1,theta).minimumProduct).toBe(-2);
    expect(firstOrderCase(2,theta)).toMatchObject({product:0,costChange:-.5});
  }
  expect(firstOrderCase(0,90).gradient).toEqual([-1,0]);
});
it('does not confuse feasibility with descent or inner and outer step placement',()=>{
  for(const kind of [0,1] as const){
    const d=projectedStep(1,kind);expect(d.next).toEqual([0,-1]);expect(d.change).toBeCloseTo(.54,12);
    expect(projectedStep(.25,kind).cost).toBeCloseTo(.10125,12);
    const f=feasibleStep(.5,kind);expect(f.next[0]).toBeCloseTo(.3,12);expect(f.next[1]).toBeCloseTo(-.1,12);
    expect(f.cost).toBeCloseTo(.065,12);expect(f.slope).toBeCloseTo(-6.12,12);
    expect(feasibleStep(1.3,kind).feasible).toBe(false);
    expect(feasibleStep(0,kind).change).toBe(0);
    expect(feasibleStep(1,kind).change).toBeGreaterThan(0);
    for(const gamma of [.1,.3,.8,1])expect(feasibleStep(gamma,kind).feasible).toBe(true);
  }
});
it('keeps projected QP iterates feasible and allows nonzero gradient at an exact constrained solution',()=>{
  const d=projectedQp(4,2,.25);
  expect(d.states[1]).toEqual([.95,0]);expect(d.costs[1]).toBeCloseTo(-1.44875,12);
  expect(d.states[2]).toEqual([1,0]);expect(d.norms[2]).toBe(1);expect(d.residuals[2]).toBe(0);
  const flat=projectedQp(0,.5,.25);expect(flat.minima).toEqual([[.5,-1],[.5,1]]);
  expect(flat.states.every(z=>z[1]===.8)).toBe(true);
  const unstable=projectedQp(6,2,1);expect(unstable.states.slice(1,4).map(z=>z[1])).toEqual([-1,1,-1]);
  for(const lambda of [0,4,6])for(const a of [0,.5,2])for(const gamma of [.05,.25,1])expect(projectedQp(lambda,a,gamma).states.every(z=>containsRegion(z,1))).toBe(true);
});
it('uses the exact four course costs and analytically correct derivatives',()=>{
  for(let kind=0;kind<4;kind++){
    const x=.3,y=-.2,h=1e-5,d=costCatalog(kind,x,y);
    expect((d.value(x+h,y)-d.value(x-h,y))/(2*h)).toBeCloseTo(d.gradient[0],7);
    if(d.dimension===2)expect((d.value(x,y+h)-d.value(x,y-h))/(2*h)).toBeCloseTo(d.gradient[1],7);
  }
  expect(courseQuartic(0)).toBe(6);expect(courseQuartic(1)).toBe(-5);
  expect(costCatalog(2,0,0).cost).toBeCloseTo(3*Math.exp(-.1),12);
  expect(costCatalog(2,-Math.log(2)/2,0).gradientNorm).toBeLessThan(1e-12);
  expect(costCatalog(2,-Math.log(2)/2,0).cost).toBeCloseTo(2*Math.SQRT2*Math.exp(-.1),12);
  expect(costCatalog(3,1,.25).gradientNorm).toBe(0);
});
it('isolates and classifies all three stationary points of the exact quartic',()=>{
  expect(quarticCritical).toHaveLength(3);
  for(const z of quarticCritical)expect(Math.abs(courseQuarticGradient(z))).toBeLessThan(1e-10);
  expect(quarticCritical.map(z=>Math.sign(courseQuarticHessian(z)))).toEqual([1,-1,1]);
  expect(courseQuartic(quarticCritical[0])).toBeLessThan(courseQuartic(quarticCritical[2]));
});
it('respects the strict logarithmic domain and computes a stable positive minimizer',()=>{
  for(const e of [1e-10,.001,.2,1]){
    const d=barrierModel(e,0);expect(d.minimum).toBeGreaterThan(0);
    expect(d.minimum*d.minimum+d.minimum).toBeCloseTo(e,14);
    expect(d.probeCost).toBeNull();expect(d.originalFeasible).toBe(true);expect(d.valid).toBe(false);
    expect(barrierModel(e,-.1).probeBarrier).toBeNull();
    expect(barrierModel(e,2).probeBarrier!).toBeLessThan(0);
  }
  expect(barrierModel(.2,.5).minimum).toBeCloseTo(.1708203932499369,12);
  expect(barrierModel(.001,1).minimum).toBeLessThan(barrierModel(.2,1).minimum);
});
