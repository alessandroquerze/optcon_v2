import {it,expect} from 'vitest';
import {segmentSet,jensen,constraintLevel,firstOrder,smoothQuadratic,quartic} from './convexity';

it('un controesempio di segmento confuta la convessità, inclusi estremi e punto medio',()=>{
  expect(segmentSet(1,0).inside).toBe(true);expect(segmentSet(1,1).inside).toBe(true);
  expect(segmentSet(1,.5).inside).toBe(false);
  for(const theta of [0,.15,.5,.8,1])expect(segmentSet(0,theta).inside).toBe(true);
});
it('distingue Jensen stretta, affine, concava e uguaglianza agli estremi',()=>{
  expect(jensen(0,.5).gap).toBe(1);expect(jensen(1,.3).gap).toBeCloseTo(0);
  expect(jensen(2,.5).gap).toBe(-1);expect(jensen(0,0).gap).toBe(0);
});
it('un singolo sottolivello convesso non implica quasiconvessità',()=>{
  const f=constraintLevel(false,2,0,0);
  expect(f.convex).toBe(true);expect(f.fn(-1/Math.sqrt(2),0)).toBeCloseTo(-.25);
  expect(f.fn(1/Math.sqrt(2),0)).toBeCloseTo(-.25);expect(f.fn(0,0)).toBeCloseTo(0);
});
it('h non affine può definire la stessa retta; una circonferenza collassa in un singleton',()=>{
  const nonlinear=constraintLevel(true,1,1,1);
  expect(nonlinear.feasible).toBe(true);expect(nonlinear.kind).toBe('retta affine');
  expect(constraintLevel(true,0,1,.9999999).feasible).toBe(false);
  expect(constraintLevel(true,1,1,.9999999).feasible).toBe(false);
  expect(constraintLevel(false,0,0,1e-7).feasible).toBe(false);
  expect(constraintLevel(true,2,1,1).convex).toBe(false);
  expect(constraintLevel(true,2,0,0).feasible).toBe(true);
  expect(constraintLevel(true,2,0,0).convex).toBe(true);
});
it('la monotonia stretta non offre un modulo uniforme positivo vicino a zero',()=>{
  for(const h of [1,.1,.01]){
    const d=firstOrder(-h,h,0);expect(d.monotonicity).toBeGreaterThan(0);expect(d.ratio).toBeCloseTo(h*h,10);
  }
  expect(firstOrder(0,0,0).ratio).toBeNull();
});
it('la normalizzazione µ/2 rende esatto il confronto di Jensen per una quadratica',()=>{
  const mu=2,theta=.3,a=-1,b=2,z=theta*a+(1-theta)*b;
  const q=(x:number)=>mu*x*x/2;
  expect(theta*q(a)+(1-theta)*q(b)-q(z)).toBeCloseTo(mu/2*theta*(1-theta)*(a-b)**2,12);
  const d=firstOrder(-.8,.6,mu);
  expect(d.monotonicity).toBeGreaterThanOrEqual(d.lower);
  expect(quartic(.3,mu)-quartic(0,mu)).toBeGreaterThan(0);
});
it('verifica Lipschitz, cocoercività e disuguaglianza raffinata sulle stesse derivate',()=>{
  for(const mu of [.1,.5,1])for(const L of [1,2,4])for(const angle of [0,.2,.8,Math.PI/2]){
    for(const refined of [false,true]){
      const d=smoothQuadratic(mu,L,angle,refined),h=1e-5,x=d.delta[0],y=d.delta[1];
      expect((d.value(x+h,y)-d.value(x-h,y))/(2*h)).toBeCloseTo(d.gradient[0],8);
      expect((d.value(x,y+h)-d.value(x,y-h))/(2*h)).toBeCloseTo(d.gradient[1],8);
      expect(d.norm).toBeLessThanOrEqual(L+1e-12);expect(d.margin).toBeGreaterThanOrEqual(-1e-12);
      expect(Math.hypot(d.plotted[0]-d.center[0],d.plotted[1]-d.center[1])).toBeLessThanOrEqual(d.radius+1e-12);
    }
  }
  const isotropic=smoothQuadratic(1,1,.7,true);expect(isotropic.radius).toBe(0);expect(isotropic.margin).toBeCloseTo(0);
});
