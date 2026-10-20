import {describe,it,expect} from 'vitest';
import {circleModel,circlePoint,complementaryModel,equalityQp,equalityQpSystem,nullDirection,qpPoint} from './constrainedQpModels';
describe('restricted curvature and equality QP',()=>{
 it('changes complementary slackness while preserving stationarity and signs',()=>{
  for(const a of [-.5,0,.5,1,1.5]){
   const d=complementaryModel(a,true);expect(d.stationarityNorm).toBeLessThan(1e-12);
   expect(d.dualViolation).toBe(0);expect(d.complementarityNorm).toBeGreaterThan(0);
  }
  expect(complementaryModel(-.5,false).satisfies).toBe(true);
  expect(complementaryModel(-.5,true).complementary[1]).toBe(-.4);
 });
 it('satisfies circle equality and first order for every tested cost',()=>{
  for(const [a,b] of [[-.5,1],[2,-1],[0,0]]){
   const d=circleModel(a,b,60);expect(d.probe[0]**2+d.probe[1]**2).toBeCloseTo(1);
   expect(d.lambda).toBe(b);expect(d.stationarity).toBe(0);
  }
  expect(circleModel(-.5,1,60).change).toBeCloseTo(.3125);
  expect(circlePoint(180)).toEqual([0,1]);
 });
 it('includes constraint curvature and rejects nontangent tests',()=>{
  const d=circleModel(-.5,1,0,0);expect(d.reduced).toBe(.5);expect(d.form).toBe(.5);expect(d.inTest).toBe(true);
  const normal=circleModel(2,-1,0,90);expect(normal.form).toBe(-1);expect(normal.inTest).toBe(false);
  expect(circleModel(2,-1,0,0).form).toBe(1);
  expect(circleModel(2,-1,0,1e-10).inTest).toBe(false);
 });
 it('keeps zero second derivative inconclusive and evaluates small differences stably',()=>{
  const d=circleModel(-1,1,.0001);expect(d.reduced).toBe(0);expect(d.change).toBeGreaterThan(0);
  expect(d.change).toBeCloseTo((.0001*Math.PI/180)**4/8,30);
  expect(circleModel(1,-1,30).type).toContain('Massimo locale piatto');
  expect(circleModel(0,0,90).change).toBe(0);
 });
 it('matches analytic reduced curvature to a derivative along the actual circle',()=>{
  const d=circleModel(-.5,1,0),eps=.001*180/Math.PI;
  const z=circlePoint(eps),zm=circlePoint(-eps);
  const derivative=(d.value(...z)+d.value(...zm)-2*d.value(...d.candidate))/.001**2;
  expect(derivative).toBeCloseTo(d.reduced,5);
 });
 it('has an indefinite full Q and positive restricted curvature',()=>{
  const d=equalityQp(1,-1,-.5,.5),z=qpPoint(.5,.5);
  expect(z[0]+z[1]).toBeCloseTo(.5);expect(d.value(...z)).toBeCloseTo(-.1875);
  expect(d.profile(.5)).toBe(-.1875);expect(d.candidate).toEqual(z);expect(d.lambda).toBe(.25);
  expect(d.Q[0][0]*d.Q[1][1]-d.Q[0][1]*d.Q[1][0]).toBe(-1);
 });
 it('separates unique, inconsistent and affine families without dividing by zero',()=>{
  expect(equalityQpSystem(1,-.5,.5)).toMatchObject({systemStatus:'soluzione unica',determinant:-2});
  expect(equalityQpSystem(0,-.5,.5)).toMatchObject({systemStatus:'incompatibile',candidate:null,residual:null});
  expect(equalityQpSystem(0,0,.5)).toMatchObject({systemStatus:'infinite soluzioni',candidate:[.25,.25]});
  const negative=equalityQpSystem(-1,-.5,.5);expect(negative.residual!).toBeLessThan(1e-12);expect(negative.classification).toContain('massimo');
 });
 it('retains multiplier families for redundant constraints',()=>{
  const d=equalityQpSystem(1,-.5,.5,true);expect(d.A).toEqual([[1,1],[2,2]]);expect(d.rhs).toEqual([.5,1]);
  expect(d.systemStatus).toBe('infinite soluzioni');expect(d.determinant).toBe(0);expect(d.residual!).toBeLessThan(1e-12);
  const tau=3;expect((d.lambda-2*tau)+2*tau).toBe(d.lambda);
 });
 it('uses ker(A) and retains an excluded negative normal direction',()=>{
  const t=nullDirection(1,-1,0),n=nullDirection(1,-1,90);
  expect(t.Ay).toBe(0);expect(t.form).toBe(1);expect(t.direction[0]+t.direction[1]).toBe(0);
  expect(n.Ay).toBe(Math.SQRT2);expect(n.form).toBe(-1);expect(n.inTest).toBe(false);
  expect(nullDirection(1,-1,.000001).inTest).toBe(false);
 });
 it('does not collapse small nonzero curvature to the singular branch',()=>{
  const d=equalityQp(.000001,-1,-.5,0);expect(d.sStar).toBe(500000);expect(d.status).toBe('unique_point');
  expect(d.candidate![0]).toBeGreaterThan(300000);
  expect(equalityQp(0,-1,0,0).classification).toContain('Ogni punto');
  expect(equalityQp(0,-1,-.5,0).classification).toContain('incompatibile');
 });
});
