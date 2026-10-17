export function finite(value: number, label = 'valore'): number {
  if (!Number.isFinite(value)) throw new RangeError(label + ' deve essere finito.');
  return value;
}
export function linspace(min: number, max: number, count: number): number[] {
  finite(min); finite(max);
  if (!Number.isInteger(count) || count < 2 || count > 10001 || min > max) throw new RangeError('Griglia non valida.');
  return Array.from({ length: count }, (_, i) => min + (max - min) * i / (count - 1));
}
export function diagonalQuadratic(error: readonly number[], weights: readonly number[], scale: number) {
  if (error.length !== weights.length) throw new RangeError('Dimensioni del costo incompatibili.');
  finite(scale);
  const contributions = error.map((e, i) => {
    finite(e); finite(weights[i]);
    if (weights[i] < 0) throw new RangeError('Peso negativo in un costo semidefinito.');
    return scale * weights[i] * e * e;
  });
  return { contributions, total: contributions.reduce((a, b) => a + b, 0) };
}
export function linearPrediction(A: readonly number[][], dx: readonly number[], B: readonly number[][], du: readonly number[]) {
  if (A.length !== B.length) throw new RangeError('Dimensione di uscita incompatibile.');
  return A.map((row, i) => {
    if (row.length !== dx.length || B[i].length !== du.length) throw new RangeError('Jacobiano incompatibile.');
    return row.reduce((s, a, j) => s + finite(a) * finite(dx[j]), 0) +
      B[i].reduce((s, b, j) => s + finite(b) * finite(du[j]), 0);
  });
}
export function classifyResidual(value: number, kind: 'equality'|'inequality', tolerance = 1e-9) {
  finite(value); finite(tolerance);
  if (tolerance < 0) throw new RangeError('Tolleranza negativa.');
  return kind === 'equality' ? Math.abs(value) <= tolerance : value <= tolerance;
}
export function intervalResidual(value: number, min: number, max: number) {
  [value, min, max].forEach(x => finite(x));
  const residuals = [min - value, value - max];
  return { residuals, maximum: Math.max(...residuals), empty: min > max, feasible: min <= max && residuals.every(x => x <= 1e-9) };
}
export function horizonIndices(T: number) {
  if (!Number.isInteger(T) || T < 1 || T > 10000) throw new RangeError('Orizzonte intero positivo richiesto.');
  return {
    states: Array.from({ length: T + 1 }, (_, i) => i),
    inputs: Array.from({ length: T }, (_, i) => i),
    predictedStates: Array.from({ length: T }, (_, i) => i + 1),
  };
}
