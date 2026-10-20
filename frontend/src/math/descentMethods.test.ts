import {it,expect} from 'vitest';
import {dot,norm,quadraticCost,rotatedDescent,scalarGradientStep,gradientIterations,spdDirection,directionMethod,nonlinearCost,finiteDifferenceHessian,normalizedDirection} from './descentMethods';

it('decreases at every displayed iterate with the stated stable steps',()=>{
  for(const gamma of [.05,.2,.25,.45]){
    const d=gradientIterations(gamma);
    for(let k=1;k<d.states.length;k++){expect(d.costs[k]).toBeLessThan(d.costs[k-1]);expect(d.costs[k]).toBe(quadraticCost(...d.states[k]));}
  }
});
it('separates a descent direction from a step that actually decreases cost',()=>{
  for(const angle of [-180,-90,-60,0,60,90,180]){
    const d=rotatedDescent(angle);
    expect(norm(d.direction)).toBeCloseTo(1,12);expect(dot(d.g,d.direction)).toBeCloseTo(d.slope,12);
    for(const gamma of [0,.1,.6,2]){
      const z=[d.current[0]+gamma*d.direction[0],d.current[1]+gamma*d.direction[1]] as const;
      expect(d.profile(gamma)).toBeCloseTo(quadraticCost(...z),12);
    }
    if(d.crossing){expect(d.change(d.crossing/2)).toBeLessThan(0);expect(d.change(d.crossing)).toBeCloseTo(0,12);expect(d.change(d.crossing*1.1)).toBeGreaterThan(0);}
  }
  expect(rotatedDescent(90).slope).toBe(0);
});
it('retains the quadratic Taylor remainder and guards stationary and zero-step cases',()=>{
  expect(scalarGradientStep(1,.5).change).toBe(-.375);
  expect(scalarGradientStep(1,2).change).toBe(0);
  expect(scalarGradientStep(1,2.5).change).toBeGreaterThan(0);
  expect(scalarGradientStep(0,1).change).toBe(0);
  expect(scalarGradientStep(1,0).change).toBe(0);
});
it('rotated SPD matrices stay symmetric and yield descent for every nonzero test gradient',()=>{
  for(const scale of [.25,.8,1,2])for(const angle of [-90,-37,0,61,90]){
    const d=spdDirection(scale,angle);
    expect(d.matrix[0][1]).toBe(d.matrix[1][0]);expect(d.slope).toBeLessThan(0);
    expect(d.minimumEigenvalue).toBeGreaterThan(0);expect(d.cost).toBeLessThan(quadraticCost(...d.current));
  }
  expect(spdDirection(.5,40,true)).toMatchObject({slope:0,direction:[0,0]});
});
it('computes a finite-difference Hessian from function evaluations, with its known quartic error',()=>{
  for(const h of [.1,.5,1,1.5]){
    const H=finiteDifferenceHessian(nonlinearCost,[.8,.6],h);
    expect(H[0][0]).toBeCloseTo(2.92+h*h/2,10);
    expect(H[1][1]).toBeCloseTo(4,10);expect(H[0][1]).toBeCloseTo(0,10);
  }
  expect(()=>finiteDifferenceHessian(nonlinearCost,[0,0],0)).toThrow();
});
it('compares the same point and step for the three methods, without promising global Newton convergence',()=>{
  for(const method of [0,1,2]){
    const d=directionMethod(method,.5,1);
    expect(d.slope).toBeLessThan(0);expect(d.cost).toBe(nonlinearCost(...d.next));
    if(method===0)expect(d.cost).toBeGreaterThan(d.initial);
    else expect(d.cost).toBeLessThan(d.initial);
  }
  const exact=directionMethod(1,.5,1),near=directionMethod(2,.1,1),far=directionMethod(2,1,1);
  expect(Math.abs(near.direction[0]-exact.direction[0])).toBeLessThan(Math.abs(far.direction[0]-exact.direction[0]));
});
it('minimizes slope over unit directions and leaves normalization undefined at zero gradient',()=>{
  for(const radius of [0,.1,2])for(const angle of [0,45,90,135,180,270,360]){
    const d=normalizedDirection(radius,angle);
    expect(norm(d.direction)).toBeCloseTo(1);expect(d.slope).toBeGreaterThanOrEqual(d.bestSlope-1e-12);
    if(angle===180)expect(d.gap).toBe(0);
    if(radius===0)expect(d.bestDirection).toBeNull();
  }
});
