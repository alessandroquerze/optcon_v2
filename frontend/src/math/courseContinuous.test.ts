import { it,expect } from 'vitest';
import { droneTaskData,inspectDroneSample,droneStageCost,continuousCost,piecewiseState,pendulumSnapshot,desiredPendulum,desiredPendulumData,fixedPendulumCost,fixedPendulumData } from './courseContinuous';
const axes=[{label:'t',unit:'s'},{label:'error',unit:'rad'},{label:'cost',unit:'1'}] as const;
it('p28: stessa Euler di p27, posizione diversa dal continuo ma velocità uguale',()=>{
  const d=droneTaskData(),s=inspectDroneSample(d,10);
  expect(s.state[2]).toBeCloseTo(.9855);expect(s.errorPosition).toBeCloseTo(-.1095);
  expect(s.errorVelocity).toBeCloseTo(0);expect(inspectDroneSample(d,1).state[2]).toBe(0);
});
it('p29: otto contributi, ingressi rispetto a zero e nessun terminale inventato',()=>{
  const cost=droneStageCost(2,10,.5,.5);
  expect(cost.parts.map(p=>p.value)).toEqual([1,0,0,0,expect.closeTo(.05),0,1,1]);expect(cost.total).toBeCloseTo(3.05);
  expect(droneStageCost(0,0,.5,.5,0,0).total).toBe(2);
});
it('p31: integrale esatto più terminale, dipendenza dalla durata e costo nullo',()=>{
  expect(continuousCost(1,1).total).toBe(1);
  expect(continuousCost(-2,3).parts.map(p=>p.value)).toEqual([6,18]);expect(continuousCost(0,3).total).toBe(0);
});
it('p32: continuità al cambio, endpoint e due coefficienti distinti',()=>{
  expect(piecewiseState(1,1,-1)).toBe(1);expect(piecewiseState(2,1,-1)).toBe(0);
  expect(piecewiseState(1+1e-6,1,-1)).toBeCloseTo(1-1e-6,10);expect(piecewiseState(2,-1,-1)).toBe(-2);
});
it('p33: seno non linearizzato e coppia compensativa da p34',()=>{
  expect(pendulumSnapshot(Math.PI/6,0).acceleration).toBeCloseTo(-4.905);
  expect(pendulumSnapshot(Math.PI/6,4.905).acceleration).toBeCloseTo(0);
  expect(pendulumSnapshot(Math.PI/2,0).acceleration).toBeCloseTo(-9.81);
});
it('p35: secondo ramo al cambio, nessuna linea attraverso il salto, caso coincidente',()=>{
  const T=2,a=Math.PI/6;
  expect(desiredPendulum(1,T,0,a)).toMatchObject({angle:a,velocity:0,torque:expect.closeTo(4.905)});
  expect(desiredPendulum(1-1e-12,T,0,a).angle).toBe(0);
  const d=desiredPendulumData(0,a,T);expect(d.segments).toHaveLength(2);
  expect(d.segments[0].points.at(-1)!.x).toBeLessThan(1);expect(d.segments[1].points[0].x).toBe(1);
  expect(desiredPendulumData(a,a,T).constant).toBe(true);
});
it('p36: oracolo indipendente senza mezzo, separazione del terminale e taglio della mesh',()=>{
  const cost=fixedPendulumCost(1,.1,2);
  expect(cost.total).toBeCloseTo(3.228369533424113,8);
  expect(cost.parts.map(p=>p.value)).toEqual([expect.closeTo(.274155677808),expect.closeTo(2.4059025),expect.closeTo(.548311355616)]);
  const d=fixedPendulumData(1,.1,2,axes),other=fixedPendulumData(1,.1,0,axes);
  expect(d.grid.z).toEqual(other.grid.z);
  const seam=d.grid.z[0].findIndex(z=>z===null);expect(seam).toBeGreaterThan(0);
  expect(d.grid.z.every(row=>row[seam]===null)).toBe(true);expect(d.grid.x[seam+1]).toBe(1);
  expect(d.curves[0].points.every(p=>p.x<1)).toBe(true);expect(d.curves[1].points.every(p=>p.x>=1)).toBe(true);
});
