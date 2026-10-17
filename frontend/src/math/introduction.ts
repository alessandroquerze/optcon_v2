import { finite, horizonIndices, intervalResidual, linearPrediction } from './numerics';
import { rollout } from '../simulations/core';

/** Added examples specified by F04, not additional claims of the PDF. */
export const introductionFixtures = Object.freeze({
  feedback: { target: 1, limit: .6 },
  continuous: { duration: 5, sampleTime: 1 },
  nominal: { state: 1, input: 0 },
  weighted: { error: [1, 1] as const, reference: [0, 0] as const },
  drone: { mass: 1, inertia: .02, arm: .4, gravity: 9.81, thrust: [6, 6] as const, duration: 1 },
  pendulum: { mass: 1, length: 1, gravity: 9.81 },
  constraintProbes: [[0, 0], [1, 0], [2, 0]] as const,
});
export function scalarConstrainedChoice(target: number, limit: number) {
  finite(target); finite(limit);
  if (limit < 0) throw new RangeError('Limite non negativo richiesto.');
  const decision = Math.max(-limit, Math.min(limit, target));
  return { decision, cost: (decision - target) ** 2,
    unconstrained: { decision: target, cost: (target - target) ** 2 } };
}

export function continuousResponse(time: number, a: number, input: number, initial: number) {
  [time, a, input, initial].forEach(v => finite(v));
  if (time < 0 || a < 0) throw new RangeError('Tempo e coefficiente non negativi richiesti.');
  return a === 0 ? initial + input * time :
    initial * Math.exp(-a * time) + input * (-Math.expm1(-a * time)) / a;
}
export function nonlinearStep(x: number, u: number) { return finite(x) ** 2 + finite(u); }
export function localVariation(dx: number, du: number) {
  finite(dx); finite(du);
  const { state, input } = introductionFixtures.nominal;
  const A = 2 * state, B = 1;
  const exact = nonlinearStep(state + dx, input + du) - nonlinearStep(state, input);
  const linear = linearPrediction([[A]], [dx], [[B]], [du])[0];
  return { A, B, exact, linear, error: exact - linear, nominalNext: nonlinearStep(state, input) };
}

export function quadraticResidual(x: number, y: number, a: number, b: number, c: number) {
  [x, y, a, b, c].forEach(v => finite(v));
  return a * x * x + b * y * y - c;
}
export type Feasibility = 'interno'|'bordo'|'non ammissibile';
export function residualClass(residual: number, tolerance = 1e-9): Feasibility {
  finite(residual);
  return Math.abs(residual) <= tolerance ? 'bordo' : residual < 0 ? 'interno' : 'non ammissibile';
}
export function quadraticSetKind(a: number, b: number, c: number) {
  [a, b, c].forEach(v => finite(v));
  if (a === 0 && b === 0) return c >= 0 ? 'tutto il piano' : 'insieme vuoto';
  if (a >= 0 && b >= 0) {
    if (c < 0) return 'insieme vuoto';
    if (a > 0 && b > 0) return c === 0 ? 'solo origine' : 'ellisse e interno';
    return c === 0 ? 'retta non limitata' : 'striscia non limitata';
  }
  if (a <= 0 && b <= 0 && c >= 0) return 'tutto il piano';
  return 'regione non limitata';
}
export function quadraticPointClass(residual: number, kind: string) {
  if (kind === 'insieme vuoto') return 'non ammissibile';
  // A zero residual is not a topological boundary when Z is the whole plane.
  return kind === 'tutto il piano' && Math.abs(residual) <= 1e-9 ? 'ammissibile (g=0)' : residualClass(residual);
}

export interface DroneParameters { mass: number; inertia: number; arm: number; gravity: number; }
export function planarDroneDynamics(state: readonly number[], input: readonly number[], p: DroneParameters) {
  if (state.length !== 6 || input.length !== 2 || !(p.mass > 0 && p.inertia > 0 && p.arm > 0))
    throw new RangeError('Modello planare: sei stati, due ingressi e parametri positivi.');
  [...state, ...input, p.mass, p.inertia, p.arm, p.gravity].forEach(v => finite(v));
  const sum = input[0] + input[1], angle = state[4];
  return [state[1], -sum * Math.sin(angle) / p.mass, state[3],
    sum * Math.cos(angle) / p.mass - p.gravity, state[5], p.arm * (input[0] - input[1]) / (2 * p.inertia)];
}
export function verticalEuler(delta: number) {
  const fixture = introductionFixtures.drone;
  finite(delta);
  const count = fixture.duration / delta;
  if (!(delta > 0) || Math.abs(count - Math.round(count)) > 1e-9 || count > 10000)
    throw new RangeError('Il passo positivo deve dividere la durata fisica.');
  const N = Math.round(count);
  const initial = [0, 0, 0, 0, 0, 0];
  const acceleration = planarDroneDynamics(initial, fixture.thrust, fixture)[3];
  const samples = rollout((x, u) => planarDroneDynamics(x, u, fixture), initial,
    Array.from({ length: N }, () => fixture.thrust), delta);
  const analytical = (time: number) => ({ altitude: .5 * acceleration * time * time, velocity: acceleration * time });
  const final = samples.states[N], exact = analytical(fixture.duration);
  return { ...samples, N, acceleration, analytical,
    finalAltitude: final[2], finalVelocity: final[3], error: exact.altitude - final[2], exact };
}
export function inspectPathConstraint(altitude: number, minimum: number, maximum: number, T = 1) {
  const interval = intervalResidual(altitude, minimum, maximum);
  const indices = horizonIndices(T);
  return { ...interval, indices, classification: interval.empty ? 'insieme vuoto' : residualClass(interval.maximum),
    violation: Math.max(0, interval.maximum) };
}
export interface PendulumParameters { mass: number; length: number; gravity: number; }
export function pendulumDynamics(angle: number, velocity: number, torque: number, p: PendulumParameters) {
  [angle, velocity, torque, p.mass, p.length, p.gravity].forEach(v => finite(v));
  if (!(p.mass > 0 && p.length > 0)) throw new RangeError('Massa e lunghezza positive richieste.');
  return [velocity, -p.gravity / p.length * Math.sin(angle) + torque / (p.mass * p.length ** 2)] as const;
}
export function pendulumEquilibrium(angle: number, p = introductionFixtures.pendulum) {
  finite(angle);
  const torque = p.mass * p.gravity * p.length * Math.sin(angle);
  return { angle, velocity: 0, torque, residual: pendulumDynamics(angle, 0, torque, p) };
}
