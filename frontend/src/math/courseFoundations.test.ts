import { describe,it,expect } from 'vitest';
import { discreteSequence,obstaclePaths } from './courseFoundations';
describe('batch A: oracoli indipendenti',()=>{
  it('p9: sei transizioni, equilibrio e casi a=0 / a=1',()=>{
    expect(discreteSequence(.8,.2,1)).toEqual([1,1,1,1,1,1,1]);
    expect(discreteSequence(0,.7,2,2)).toEqual([2,.7,.7]);
    expect(discreteSequence(1,.2,0,3)).toEqual([0,.2,.4,.6000000000000001]);
    expect(discreteSequence(-1,0,1,2)).toEqual([1,-1,1]);
  });
  it('p6: ostacolo chiuso, quota sul tetto e percorsi distinti',()=>{
    expect(obstaclePaths(1).directIntersects).toBe(true);
    expect(obstaclePaths(2).directIntersects).toBe(true);
    expect(obstaclePaths(2.01).directIntersects).toBe(false);
    expect(obstaclePaths(1).detourIntersects).toBe(false);
    expect(obstaclePaths(3).roofClearance).toBe(1);
    expect(obstaclePaths(3).series[1].points.every(p=>p.z===3)).toBe(true);
  });
});
