import { finite } from '../math/numerics';
export type Dynamics = (state: readonly number[], input: readonly number[], time: number) => readonly number[];
export function eulerStep(f: Dynamics, state: readonly number[], input: readonly number[], time: number, delta: number): number[] {
  if (!(delta > 0)) throw new RangeError('Passo positivo richiesto.');
  finite(delta); finite(time);
  const slope = f([...state], [...input], time);
  if (slope.length !== state.length) throw new RangeError('Dimensione della derivata incompatibile.');
  return state.map((value, i) => finite(value + delta * finite(slope[i])));
}
export function rollout(f: Dynamics, initial: readonly number[], inputs: readonly (readonly number[])[], delta: number) {
  const states = [[...initial]];
  inputs.forEach((input, i) => states.push(eulerStep(f, states[i], input, i * delta, delta)));
  return { states, times: states.map((_, i) => i * delta) };
}
