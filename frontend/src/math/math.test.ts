import { describe, expect, it } from 'vitest';
import { diagonalQuadratic, horizonIndices, intervalResidual, linearPrediction, linspace } from './numerics';
import { sampleSurface, projectPoints } from './sampling';
import { eulerStep, rollout } from '../simulations/core';
describe('matematica indipendente dalla UI', () => {
  it('usa ogni peso sulla coordinata corretta e richiede scala esplicita', () => {
    expect(diagonalQuadratic([1,1],[1,4],.5)).toEqual({contributions:[.5,2],total:2.5});
    expect(diagonalQuadratic([1,1],[1,4],1).total).toBe(5);
    expect(diagonalQuadratic([1,1],[0,0],.5).total).toBe(0);
  });
  it('rifiuta dimensioni o pesi non validi', () => {
    expect(() => diagonalQuadratic([1],[1,2],1)).toThrow();
    expect(() => diagonalQuadratic([1],[-1],1)).toThrow();
  });
  it('linearizza variazioni con Jacobiani forniti dal modello', () => {
    expect(linearPrediction([[2]],[.1],[[1]],[0])[0]).toBeCloseTo(.2);
    expect((1.1**2-1)-.2).toBeCloseTo(.01);
  });
  it('mantiene distinti ingressi e stati previsti', () => {
    expect(horizonIndices(1)).toEqual({states:[0,1],inputs:[0],predictedStates:[1]});
    expect(() => horizonIndices(0)).toThrow();
  });
  it('riconosce bordo, violazione e intervallo vuoto senza riordinare limiti', () => {
    expect(intervalResidual(3,1,3).feasible).toBe(true);
    expect(intervalResidual(3.2,1,3).maximum).toBeCloseTo(.2);
    expect(intervalResidual(2,3,1)).toMatchObject({empty:true,feasible:false});
  });
  it('Euler usa simultaneamente il vecchio stato', () => {
    const derivative=(x:readonly number[]) => [x[1],2.19];
    const first=eulerStep(derivative,[0,0],[],0,.1);
    expect(first).toEqual([0,.219]);
    expect(eulerStep(derivative,first,[],.1,.1)[0]).toBeCloseTo(.0219);
    const result=rollout(derivative,[0,0],Array.from({length:10},()=>[]),.1);
    expect(result.states[10][0]).toBeCloseTo(.9855);
    expect(result.states[10][1]).toBeCloseTo(2.19);
    expect(() => eulerStep(derivative,[0,0],[],0,0)).toThrow();
  });
  it('campiona superfici senza inventare valori in punti non definiti', () => {
    const grid=sampleSurface('f',[0,1],[0,1],(x,y)=>x===0&&y===0?Infinity:x+y,[{label:'x',unit:'1'},{label:'y',unit:'1'},{label:'f',unit:'1'}]);
    expect(grid.z).toEqual([[null,1],[1,2]]);
  });
  it('preserva ID e dimensioni nelle proiezioni', () => {
    expect(projectPoints([{id:'a',x:1,y:2,z:3}],p=>({x:p.x,y:p.z!}))).toEqual([{id:'a',x:1,y:3}]);
    expect(linspace(0,1,3)).toEqual([0,.5,1]);expect(() => linspace(0,1,1)).toThrow();
  });
});
