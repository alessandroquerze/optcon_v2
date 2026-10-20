import {it,expect} from 'vitest';
import {armijoTrials,powerSteps,armijoIterations,scalarIterations,alternatingSequence,coercivityCase,qpIterations} from './stepSizeModels';

it('matches all three progressive Armijo candidates and rejects equality exactly',()=>{
  const d=armijoTrials(.7,.5);
  expect(d.trials).toHaveLength(3);
  expect(d.trials.map(x=>x.accepted)).toEqual([false,false,true]);
  expect(d.trials[1].cost).toBeCloseTo(.16,12);
  expect(d.trials[2].gamma).toBeCloseTo(.49,12);
  expect(d.trials[2].cost).toBeCloseTo(.0004,12);
  const boundary=armijoTrials(.5,.5).trials;
  expect(boundary[1]).toMatchObject({gamma:.5,gap:0,accepted:false});
  expect(boundary[2]).toMatchObject({gamma:.25,accepted:true});
  expect(armijoTrials(.7,.5,.1).trials).toHaveLength(1);
  expect(armijoTrials(.7,.5,1,0)).toMatchObject({status:'stationary',trials:[]});
});
it('every recorded Armijo trial satisfies the same analytic cost and threshold',()=>{
  for(const beta of [.2,.7,.9])for(const c of [.05,.5,.95]){
    const d=armijoTrials(beta,c);
    expect(d.status).toBe('accepted');
    for(const t of d.trials){
      expect(t.gap).toBeCloseTo(t.cost-t.threshold,12);
      expect(t.accepted).toBe(t.gamma<1-c);
    }
    expect(d.trials.at(-1)!.accepted).toBe(true);
  }
});
it('distinguishes infinite-series criteria from finite partial sums and handles boundaries',()=>{
  for(const a of [.25,.5,.75,1,1.5]){
    const d=powerSteps(a,40);
    expect(d.steps[0]).toBe(1);
    expect(d.sums.at(-1)).toBeCloseTo(d.steps.reduce((s,v)=>s+v,0),12);
    expect(d.squares.at(-1)).toBeCloseTo(d.steps.reduce((s,v)=>s+v*v,0),12);
    expect(d.sumDiverges).toBe(a<=1);expect(d.squaresConverge).toBe(a>.5);
  }
});
it('reruns a complete strict Armijo search at every outer iteration',()=>{
  for(const beta of [.4,.7,.8]){
    const d=armijoIterations(beta);
    expect(d.states).toHaveLength(d.steps.length+1);
    for(let k=0;k<d.steps.length;k++){
      const z=d.states[k],gamma=d.steps[k],squared=z[0]**2+16*z[1]**2;
      expect(d.costs[k+1]).toBeLessThan(d.costs[k]-.5*gamma*squared);
      if(d.rejections[k]>0){
        const previous=gamma/beta;
        const cost=((1-previous)*z[0])**2/2+2*((1-4*previous)*z[1])**2;
        expect(cost).toBeGreaterThanOrEqual(d.costs[k]-.5*previous*squared-1e-12);
      }
    }
  }
  expect(armijoIterations(.7).states[1][0]).toBeCloseTo(1.13985,12);
});
it('does not manufacture a limit for a linear cost and exposes the constant-step boundary',()=>{
  expect(scalarIterations(false,false,2,1).states.slice(0,4)).toEqual([1,-1,1,-1]);
  expect(scalarIterations(false,false,2.2,1).states.at(-1)!).toBeGreaterThan(30);
  const linear=scalarIterations(true,true,.5,1);
  expect(linear.gradients.every(g=>g===1)).toBe(true);
  expect(linear.states.at(-1)).toBeCloseTo(1-linear.steps.reduce((s,g)=>s+g,0),12);
  expect(alternatingSequence(6).map(x=>x.z)).toEqual([1,-1,1,-1,1,-1]);
});
it('classifies convexity/coercivity and stationary maxima independently',()=>{
  expect(coercivityCase(0,0)).toMatchObject({coercive:true,convex:true,stationary:true,atMaximum:false});
  expect(coercivityCase(1,0)).toMatchObject({coercive:true,convex:false,stationary:true,atMaximum:true});
  expect(coercivityCase(1,1)).toMatchObject({stationary:true,atMaximum:false});
  expect(coercivityCase(2,0)).toMatchObject({coercive:false,convex:true,stationary:false,minima:[]});
});
it('preserves flat compatible minima, incompatible drift and large real iterates',()=>{
  const d=qpIterations(4,0,.25);
  expect(d.states[1]).toEqual([1.125,0]);expect(d.costs[1]).toBe(.6328125);
  expect(qpIterations(0,0,.25)).toMatchObject({kind:'line',minimizer:null});
  expect(qpIterations(0,0,.25).states.every(z=>z[1]===1)).toBe(true);
  expect(qpIterations(0,1,.25)).toMatchObject({kind:'none',minimizer:null});
  expect(qpIterations(0,1,.25).states.at(-1)![1]).toBe(-4);
  expect(qpIterations(4,0,.5).states.slice(0,3).map(z=>z[1])).toEqual([1,-1,1]);
  expect(Math.abs(qpIterations(6,0,1).states.at(-1)![1])).toBeGreaterThan(1e12);
  expect(qpIterations(1e-320,1,.25)).toMatchObject({kind:'unique',minimizerFinite:false});
  expect(qpIterations(1e-8,1,.25).minimizer![1]).toBe(-1e8);
});
