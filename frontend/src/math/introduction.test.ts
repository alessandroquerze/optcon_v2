import { describe, expect, it } from 'vitest';
import { diagonalQuadratic } from './numerics';
import { continuousResponse, introductionFixtures, localVariation, nonlinearStep, pendulumDynamics,
  pendulumEquilibrium, planarDroneDynamics, quadraticResidual, quadraticSetKind, residualClass,
  inspectPathConstraint, verticalEuler } from './introduction';

describe('oracoli indipendenti della vertical slice', () => {
  it('p8: soluzione esatta, condizione iniziale, integratore ed equilibrio', () => {
    expect(continuousResponse(1, 1, 1, 0)).toBeCloseTo(1 - Math.exp(-1), 12);
    expect(continuousResponse(0, 2, .5, -1)).toBe(-1);
    expect(continuousResponse(3, 0, .5, 2)).toBe(3.5);
    expect(continuousResponse(5, 2, 1, .5)).toBeCloseTo(.5, 12);
    expect(continuousResponse(1, 1e-12, 1, 0)).toBeCloseTo(1, 10);
  });
  it('p12: nominale coerente, Jacobiani e oracle .21/.2/.01', () => {
    expect(nonlinearStep(1, 0)).toBe(1);
    expect(localVariation(.1, 0)).toMatchObject({ A: 2, B: 1, linear: .2, nominalNext: 1 });
    expect(localVariation(.1, 0).exact).toBeCloseTo(.21, 12);
    expect(localVariation(.1, 0).error).toBeCloseTo(.01, 12);
    const epsilon = 1e-5;
    expect((nonlinearStep(1 + epsilon, 0) - nonlinearStep(1 - epsilon, 0)) / (2 * epsilon)).toBeCloseTo(2, 8);
  });
  it.each([[-.25, -.1], [0, .1], [.25, .1]])('p12: perturbazioni (%s,%s), errore quadratico', (dx, du) => {
    const result = localVariation(dx, du);
    expect(result.exact).toBeCloseTo((1 + dx) ** 2 + du - 1, 12);
    expect(result.error).toBeCloseTo(dx ** 2, 12);
  });
  it('p16: secondo contributo w2, pesi degeneri e simmetria', () => {
    expect(diagonalQuadratic([1, 1], [1, 4], .5)).toEqual({ contributions: [.5, 2], total: 2.5 });
    expect(diagonalQuadratic([1, 1], [1, 0], .5).total).toBe(.5);
    expect(diagonalQuadratic([3, -2], [0, 0], .5).total).toBe(0);
    expect(diagonalQuadratic([-1, -1], [1, 4], .5).total).toBe(2.5);
  });
  it('p17: i tre punti testano interno, bordo ed esterno', () => {
    const residuals = [[0, 0], [1, 0], [2, 0]].map(([x, y]) => quadraticResidual(x, y, 1, 1, 1));
    expect(residuals).toEqual([-1, 0, 3]);
    expect(residuals.map(v => residualClass(v))).toEqual(['interno', 'bordo', 'non ammissibile']);
  });
  it('p17: casi degeneri e non limitati non etichettati come ellissi', () => {
    expect(quadraticSetKind(1, 1, 0)).toBe('solo origine');
    expect(quadraticSetKind(1, 1, -1)).toBe('insieme vuoto');
    expect(quadraticSetKind(0, 0, 0)).toBe('tutto il piano');
    expect(quadraticSetKind(0, 0, -1)).toBe('insieme vuoto');
    expect(quadraticSetKind(1, -1, 1)).toBe('regione non limitata');
    expect(quadraticSetKind(0, 1, 0)).toBe('retta non limitata');
  });
  it('p27: dinamica planare, hover e segni delle accelerazioni', () => {
    const p = introductionFixtures.drone;
    expect(planarDroneDynamics([0, 0, 0, 0, 0, 0], [4.905, 4.905], p)).toEqual([0, -0, 0, 0, 0, 0]);
    const result = planarDroneDynamics([0, 0, 0, 0, 0, 0], [5, 4], p);
    expect(result[3]).toBeCloseTo(-.81, 12); expect(result[5]).toBeCloseTo(10, 12);
    expect(planarDroneDynamics([0, 0, 0, 0, Math.PI / 2, 0], [5, 4], p)[1]).toBeCloseTo(-9, 12);
  });
  it('p27: Euler simultaneo e confronto analitico a durata fissa', () => {
    const r = verticalEuler(.1);
    expect(r.states[1][2]).toBe(0); expect(r.states[1][3]).toBeCloseTo(.219, 12);
    expect(r.states[2][2]).toBeCloseTo(.0219, 12); expect(r.states[2][3]).toBeCloseTo(.438, 12);
    expect(r.finalAltitude).toBeCloseTo(.9855, 12); expect(r.finalVelocity).toBeCloseTo(2.19, 12);
    expect(r.exact.altitude).toBeCloseTo(1.095, 12);
    expect(verticalEuler(.05).error).toBeCloseTo(r.error / 2, 12);
    expect(verticalEuler(.01).N).toBe(100);
    expect(() => verticalEuler(0)).toThrow(); expect(() => verticalEuler(.3)).toThrow();
  });
  it('p30: T=1 non crea u1; residui, bordo e insieme vuoto', () => {
    const r = inspectPathConstraint(3.2, 1, 3, 1);
    expect(r.indices.inputs).toEqual([0]); expect(r.indices.predictedStates).toEqual([1]);
    expect(r.maximum).toBeCloseTo(.2, 12); expect(r.violation).toBeCloseTo(.2, 12);
    expect(inspectPathConstraint(3, 1, 3).classification).toBe('bordo');
    expect(inspectPathConstraint(2, 1, 3).feasible).toBe(true);
    expect(inspectPathConstraint(2, 3, 1).empty).toBe(true);
    expect(inspectPathConstraint(2, 2, 2).feasible).toBe(true);
  });
  it.each([0, Math.PI / 6, -Math.PI / 2])('p34: equilibrio %s, velocità nulla e residui nulli', angle => {
    const r = pendulumEquilibrium(angle);
    expect(r.velocity).toBe(0);
    expect(r.residual[0]).toBe(0); expect(r.residual[1]).toBeCloseTo(0, 12);
    expect(r.torque).toBeCloseTo(9.81 * Math.sin(angle), 12);
  });
  it('p34: π/6 richiede 4.905; senza coppia non è equilibrio', () => {
    expect(pendulumEquilibrium(Math.PI / 6).torque).toBeCloseTo(4.905, 12);
    expect(pendulumDynamics(Math.PI / 6, 0, 0, introductionFixtures.pendulum)[1]).toBeCloseTo(-4.905, 12);
  });
});
