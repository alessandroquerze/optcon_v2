import {describe,it,expect} from 'vitest';
import {segmentModel,activeGeometry,lagrangianModel,hypothesisCase,kktBalance,exactSegmentMultipliers,curvatureCase,rankInPlane} from './kktModels';
describe('constrained geometry and KKT models',()=>{
 it('intersects all constraints and clips the exact minimizer',()=>{
  expect(segmentModel(-.5,.6,[.5,0])).toMatchObject({minimum:[0,0],minimumCost:.305,feasible:true});
  expect(segmentModel(.4,-.8,[.5,.00001]).feasible).toBe(false);
  expect(segmentModel(1.5,.6,[1.1,0])).toMatchObject({minimum:[1,0],feasible:false});
 });
 it('excludes inactive gradients and handles both endpoints exactly',()=>{
  expect(activeGeometry(.5,0)).toMatchObject({active:[],count:1,rank:1,regular:true});
  expect(activeGeometry(0,0)).toMatchObject({active:[1],count:2,rank:2,regular:true});
  expect(activeGeometry(1,0)).toMatchObject({active:[2],regular:true});
  expect(activeGeometry(1e-9,3)).toMatchObject({active:[],regular:true});
 });
 it('detects redundant and vanishing normals without changing geometry',()=>{
  expect(activeGeometry(0,1)).toMatchObject({active:[1,3],count:3,rank:2,regular:false});
  expect(activeGeometry(.5,2)).toMatchObject({count:1,rank:0,regular:false});
  expect(activeGeometry(0,3)).toMatchObject({count:2,rank:1,regular:false});
  expect(rankInPlane([])).toBe(0);expect(rankInPlane([[1,0],[2,0]])).toBe(1);
 });
 it('keeps signed Lagrangian contributions and the fixed-price minimum',()=>{
  const d=lagrangianModel(.5,.6,[.5,0]);
  expect(d.originalCost).toBeCloseTo(.68);expect(d.inequalityTerm).toBe(-.25);
  expect(d.total).toBeCloseTo(.43);expect(d.minimum).toEqual([0,0]);
  expect(lagrangianModel(0,.6,[0,0]).minimumFeasible).toBe(false);
  expect(lagrangianModel(1,0,[1,0]).total).toBeLessThan(lagrangianModel(0,0,[1,0]).total);
 });
 it('a smooth nonregular minimum can have no KKT multipliers',()=>{
  expect(hypothesisCase(false)).toMatchObject({regular:true,multiplierExists:true,mu:1});
  expect(hypothesisCase(true)).toMatchObject({rank:1,regular:false,multiplierExists:false,mu:null});
 });
 it('analytic multipliers satisfy all conditions throughout active-set changes',()=>{
  for(const a of [-.5,0,.00001,.5,1,1.5]){
   const {mu1,mu2,lambda}=exactSegmentMultipliers(a),d=kktBalance(a,mu1,mu2,lambda);
   expect(d.stationarityNorm).toBeLessThan(1e-12);expect(d.complementarityNorm).toBe(0);expect(d.satisfies).toBe(true);
  }
  expect(kktBalance(0,0,0,.6)).toMatchObject({active:[1],satisfies:true});
 });
 it('distinguishes stationarity, dual feasibility and complementary slackness',()=>{
  const d=kktBalance(.5,.2,.2,.6);expect(d.stationarityNorm).toBe(0);
  expect(d.complementarityNorm).toBeGreaterThan(0);expect(d.satisfies).toBe(false);
  expect(kktBalance(-.5,-.5,0,.6).dualViolation).toBe(.5);
  expect(kktBalance(-.5,.5,0,-.6).stationarityNorm).toBeCloseTo(1.2);
 });
 it('KKT persists at a constrained maximum and a flat strict minimum',()=>{
  expect(curvatureCase(-1,.5)).toMatchObject({change:-.109375,curvature:-1,stationary:true,regular:true});
  expect(curvatureCase(0,.5)).toMatchObject({change:.015625,curvature:0,stationary:true});
  expect(curvatureCase(1,.5).change).toBe(.140625);
  expect(curvatureCase(0,.5,true)).toMatchObject({change:0,curvature:0});
  expect(curvatureCase(-.25,1).change).toBeGreaterThan(0);
 });
});
