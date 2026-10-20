import {it,expect} from 'vitest';
import {doubleWell,wellCost,plateauCost,coupledQuadratic,vectorFunction,stationaryExample,localSufficiency} from './optimizationFoundations';
it('distingue unicità globale e strettezza locale senza inferirle dai campioni',()=>{
  const tied=doubleWell(0,0,.5);expect(tied.global).toBe(true);expect(tied.local).toBe(true);expect(tied.strictGlobal).toBe(false);
  const left=doubleWell(.25,0,.5),right=doubleWell(.25,1,.5),top=doubleWell(.25,2,.5);
  expect(left.strictGlobal).toBe(true);expect(right.local).toBe(true);expect(right.global).toBe(false);expect(top.local).toBe(false);
  for(const point of left.critical)expect(4*point*(point*point-1)+.25).toBeCloseTo(0,10);
  expect(left.cost).toBe(wellCost(left.candidate,.25));
});
it('mantiene plateau e raccordi dichiarati del modello illustrativo',()=>{
  expect(plateauCost(-2)).toBe(0);expect(plateauCost(0)).toBe(3);expect(plateauCost(2.5)).toBe(1);
  for(const x of [-2,0,2,3])expect(Math.abs(plateauCost(x-1e-7)-plateauCost(x+1e-7))).toBeLessThan(1e-6);
});
it('derivate scalari corrispondono alle differenze finite della stessa funzione',()=>{
  const x=.6,y=.4,rho=.5,h=1e-5,data=coupledQuadratic(x,y,rho);
  expect(data.value).toBeCloseTo(.46,10);expect(data.gradient[0]).toBeCloseTo(.8,10);expect(data.gradient[1]).toBeCloseTo(1.1,10);
  expect((coupledQuadratic(x+h,y,rho).value-coupledQuadratic(x-h,y,rho).value)/(2*h)).toBeCloseTo(data.gradient[0],8);
  expect((coupledQuadratic(x,y+h,rho).gradient[0]-coupledQuadratic(x,y-h,rho).gradient[0])/(2*h)).toBeCloseTo(data.hessian[0][1],8);
});
it('orientamento d per m è coerente con il differenziale r(z+δz)',()=>{
  const x=.7,y=-.2,h=1e-6,data=vectorFunction(x,y);
  expect(data.gradient).toHaveLength(2);expect(data.jacobian).toHaveLength(3);
  for(let j=0;j<3;j++){
    expect((vectorFunction(x+h,y).value[j]-vectorFunction(x-h,y).value[j])/(2*h)).toBeCloseTo(data.gradient[0][j],7);
    expect((vectorFunction(x,y+h).value[j]-vectorFunction(x,y-h).value[j])/(2*h)).toBeCloseTo(data.jacobian[j][1],7);
  }
});
it('Hessiana nulla non distingue il minimo quartico dal massimo quartico',()=>{
  const min=stationaryExample(3),max=stationaryExample(4);
  expect(min.semidefinite).toBe(true);expect(max.semidefinite).toBe(true);expect(min.minimum).toBe(true);expect(max.minimum).toBe(false);
  expect(min.fn(.1,0)).toBeGreaterThan(0);expect(max.fn(.1,0)).toBeLessThan(0);
});
it('la sufficienza locale non garantisce globalità e non è necessaria',()=>{
  const local=localSufficiency(1,-1);expect(local.positiveDefinite).toBe(true);expect(local.fn(0,.1)).toBeGreaterThan(0);
  expect(local.comparison).toBe(-.5);expect(local.global).toBe(false);expect(local.unbounded).toBe(true);
  const flat=localSufficiency(0,1);expect(flat.positiveDefinite).toBe(false);expect(flat.classification).toBe('minimo stretto');
  expect(localSufficiency(0,0).classification).toBe('minimo non stretto');expect(localSufficiency(-1,1).classification).toBe('sella');
});
