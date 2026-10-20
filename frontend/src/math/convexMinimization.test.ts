import {it,expect} from 'vitest';
import {lowerSupport,upperSupport,proofSegment,convexStationarity,quadraticModel,quadraticCase} from './convexMinimization';
it('validates both bounds, tangency and their signs, including a nonconvex smooth cost',()=>{
  for(const a of [-1.2,0,.8])for(const b of [-1.2,0,1.2]){
    for(const model of [lowerSupport(a,b),upperSupport(a,b)]){
      expect(model.margin).toBeGreaterThanOrEqual(-1e-12);
      expect(model.bound(a)).toBeCloseTo(model.value(a),12);
      const h=1e-5;
      expect((model.bound(a+h)-model.bound(a-h))/(2*h)).toBeCloseTo((model.value(a+h)-model.value(a-h))/(2*h),8);
    }
  }
  expect(Math.cos(Math.PI)).toBe(-1); // upper model is not globally convex
});
it('moves a strictly cheaper point arbitrarily close, and treats theta=1 separately',()=>{
  for(const theta of [0,.5,.9,.999999]){const d=proofSegment(theta);expect(d.cost).toBeLessThanOrEqual(d.chord);expect(d.chord).toBeLessThan(1);expect(d.distance).toBeCloseTo(1-theta);}
  expect(proofSegment(1).improvement).toBe(0);
});
it('distinguishes a flat Hessian at a unique minimum from a constant objective',()=>{
  expect(convexStationarity(1,0)).toMatchObject({stationary:true,unique:true,hessian:0});
  expect(convexStationarity(2,1)).toMatchObject({stationary:true,unique:false,hessian:0});
  expect(convexStationarity(1,.01).stationary).toBe(false);
});
it('requires PSD and compatibility together; never inverts a singular matrix',()=>{
  expect(quadraticModel(1,-.5).minimizer).toEqual([.5,.5]);
  expect(quadraticModel(0,0).kind).toBe('infiniti minimi globali');
  expect(quadraticModel(0,.5).stationary).toBeNull();
  expect(quadraticModel(0,1e-10).minimizer).toBeNull();
  expect(quadraticModel(-1e-10,0).minimizer).toBeNull();
  expect(quadraticModel(-1,0).stationary).toEqual([.5,0]);
  expect(quadraticModel(-1,0).minimizer).toBeNull();
  for(const i of [2,3]){const d=quadraticCase(i,0);expect(d.value(.5,d.descentY(100))).toBeLessThan(d.value(.5,d.descentY(10)));}
});
it('matches gradients and exact completed-square costs for all admissible quadratic examples',()=>{
  for(const lambda of [-1,0,.5,2])for(const b of [-.5,0,.5]){
    const d=quadraticModel(lambda,b),h=1e-5,[gx,gy]=d.gradient(.4,.7);
    expect((d.value(.4+h,.7)-d.value(.4-h,.7))/(2*h)).toBeCloseTo(gx,8);
    expect((d.value(.4,.7+h)-d.value(.4,.7-h))/(2*h)).toBeCloseTo(gy,8);
    if(d.minimizer){expect(d.gradient(...d.minimizer)).toEqual([0,0]);expect(d.value(.4,.7)-d.minimum!).toBeCloseTo((.4-.5)**2+lambda/2*(.7-d.minimizer[1])**2,12);}
  }
});
