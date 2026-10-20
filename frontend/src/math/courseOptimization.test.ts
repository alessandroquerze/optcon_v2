import { describe,it,expect } from 'vitest';
import { finiteHorizon,equilibriumCheck,decisionCheck,scalarDistance,constrainedDistance,dynamicsResiduals } from './courseOptimization';
describe('batch B: dimensioni, fattibilità e minimi analitici',()=>{
  it('p10: gli stack escludono il dato iniziale e hanno nT / mT componenti',()=>{
    const d=finiteHorizon(3,2,1);expect(d.states).toEqual([0,1,2,3]);expect(d.inputs).toEqual([0,1,2]);
    expect(d.stateDimension).toBe(6);expect(d.inputDimension).toBe(3);
    expect(finiteHorizon(1,3,2).states).toHaveLength(2);
  });
  it('p11: f(2,1)=2; cambiare solo ingresso rompe la costanza',()=>{
    expect(equilibriumCheck(2,1)).toEqual({prediction:2,residual:0,equilibrium:true});
    expect(equilibriumCheck(2,0)).toEqual({prediction:1,residual:1,equilibrium:false});
  });
  it('p14: un residuo di uguaglianza nullo non basta se g è positivo',()=>{
    expect(decisionCheck(.5,.5)).toEqual({h:0,g:-.5,cost:.25,feasible:true});
    expect(decisionCheck(-.5,1.5).h).toBe(0);expect(decisionCheck(-.5,1.5).feasible).toBe(false);
    expect(decisionCheck(.5,.6).feasible).toBe(false);
  });
  it('p15: simmetria e tre valori dell’esempio sorgente',()=>{
    expect(scalarDistance(0,2)).toBe(2);expect(scalarDistance(2,2)).toBe(0);expect(scalarDistance(3,2)).toBe(.5);
    expect(scalarDistance(1,2)).toBe(scalarDistance(3,2));
  });
  it('p18: minimo libero, attivo e cambio di regime continuo',()=>{
    expect(constrainedDistance(2,1)).toMatchObject({decision:1,cost:.5,active:true,freeFeasible:false});
    expect(constrainedDistance(0,1)).toMatchObject({decision:0,cost:0,active:false});
    expect(constrainedDistance(1,1)).toMatchObject({decision:1,cost:0});
  });
  it('p19: residui indipendenti e candidato incoerente sulla superficie zero',()=>{
    expect(dynamicsResiduals(1,.5)).toEqual({first:0,second:0,valid:true});
    expect(dynamicsResiduals(1,.8).second).toBeCloseTo(-.3);
    expect(dynamicsResiduals(.5,0)).toEqual({first:.5,second:0,valid:false});
  });
});
