import {it,expect} from 'vitest';
import {rootNewton,cubicCost,cubicNewton,metricModel} from './newtonModels';
import {quadraticCost} from './descentMethods';

it('finds the zero of the affine residual, not an exact zero of the nonlinear residual',()=>{
  for(const c of [-2,-1.5,-.5,.5,1.5,2])for(const alpha of [0,.5,1,2]){
    const d=rootNewton(c,alpha);
    if(d.status==='step'){
      expect(d.linear(d.next!)).toBeCloseTo(0,12);
      expect(d.nextResidual).toBeCloseTo(d.increment!**2,12);
    }
  }
  expect(rootNewton(1.5,1).next).toBeCloseTo(13/12,12);
});
it('separates a singular nonroot, an already attained root and off-screen/overflow steps',()=>{
  expect(rootNewton(0,1)).toMatchObject({status:'singular',next:null,increment:null});
  expect(rootNewton(0,0)).toMatchObject({status:'root',next:null});
  expect(rootNewton(1,1).status).toBe('root');
  expect(rootNewton(.1,2)).toMatchObject({inside:false});
  expect(rootNewton(1e-320,2).status).toBe('numerical_limit');
  expect(rootNewton(Math.sqrt(2),2).status).toBe('numerical_root');
});
it('uses the same root system for the cubic gradient and allows a stationary maximum',()=>{
  const d=cubicNewton(-.5);
  expect(d.next).toBeCloseTo(-1.25,12);
  expect(d.nextCost!).toBeGreaterThan(d.cost);
  expect(d.modelMinimum).toBeNull();
  expect(cubicNewton(-1)).toMatchObject({stationary:true,hessian:-2});
  expect(cubicNewton(1)).toMatchObject({stationary:true,hessian:2});
  expect(cubicNewton(0).next).toBeNull();
  for(const a of [-1.5,-.5,.5,1.5]){
    const q=cubicNewton(a);expect(q.next).toBeCloseTo(rootNewton(a,1).next!,12);
    expect(q.gradient+q.hessian*q.increment!).toBeCloseTo(0,12);
  }
});
it('adds the signed argmin displacement and requires positive model curvature for minimization',()=>{
  const d=cubicNewton(.5);
  expect(d.increment).toBe(.75);expect(d.modelMinimum).toBe(1.25);
  expect(d.nextCost!).toBeLessThan(d.cost);
  // The literal minus would produce a different point and increase this cost.
  expect(cubicCost(.5-d.increment!)).toBeGreaterThan(d.cost);
  expect(cubicNewton(-.5).modelKind).toContain('nessun minimo');
  expect(cubicNewton(0).modelMinimum).toBeNull();
  for(const z of [-2,0,.75,1.25,2])expect(d.model(z)-d.model(d.modelMinimum!)).toBeCloseTo(d.hessian*(z-d.modelMinimum!)**2/2,12);
});
it('matches the Taylor quadratic and its exact cubic remainder',()=>{
  const d=cubicNewton(.7),eps=1e-5;
  expect((cubicCost(.7+eps)-cubicCost(.7-eps))/(2*eps)).toBeCloseTo(d.gradient,9);
  expect(d.model(.7)).toBe(d.cost);
  for(const z of [-1,.3,.7,1.4])expect(cubicCost(z)-d.model(z)).toBeCloseTo((z-.7)**3/3,12);
});
it('positive curvature and a minimizing model still do not guarantee full-step decrease',()=>{
  const d=cubicNewton(.32);
  expect(d.hessian).toBeGreaterThan(0);expect(d.modelMinimum).not.toBeNull();
  expect(Math.abs(d.next!)).toBeLessThan(1.8);
  expect(d.nextCost!).toBeGreaterThan(d.cost);
  expect(d.model(d.next!)).toBeLessThan(d.cost);
  expect(metricModel(.8,.6).change).toBeCloseTo(0,12);
});
it('minimizes a metric surrogate and shows that this need not reduce the real cost',()=>{
  const d=metricModel(1,1);
  expect(d.next).toEqual([0,-1.5]);expect(d.minimum).toBe(-1.5);
  expect(d.actual).toBe(4.5);expect(d.change).toBe(3.5);
  for(const x of [-2,0,1,2])for(const y of [-2,0,.5,2]){
    expect(d.model(x,y)-d.minimum).toBeCloseTo(((x-d.next[0])**2/d.d1+(y-d.next[1])**2/d.d2)/2,12);
  }
  const exact=metricModel(1,.25);
  expect(exact.next).toEqual([0,0]);expect(exact.actual).toBe(0);
  for(const x of [-1,0,2])for(const y of [-1,0,2])expect(exact.model(x,y)).toBeCloseTo(quadraticCost(x,y),12);
  expect(()=>metricModel(1,0)).toThrow();
});
