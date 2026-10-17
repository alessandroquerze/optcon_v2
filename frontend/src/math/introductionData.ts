import type { AxisDefinition, CurveSeries, Point, ScalarGrid, SurfacePatch } from '../numeric-data/types';
import { diagonalQuadratic, linspace } from './numerics';
import { sampleCurve, sampleSurface } from './sampling';
import { continuousResponse, introductionFixtures as fixture, localVariation, pendulumEquilibrium,
  quadraticResidual, quadraticSetKind, verticalEuler } from './introduction';
const exactColor = '#176c98', linearColor = '#8057a5';
export const timeId = (time: number) => 'time:' + time.toFixed(6);
export const constraintProbePoints: Point[] = fixture.constraintProbes.map(([x, y], i) => ({ id: 'probe:' + i, x, y }));
export function continuousFamily(a: number, initial: number, axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition]) {
  return sampleSurface('Risposta x(t;u)', linspace(0, fixture.continuous.duration, 41), linspace(-1, 1, 33),
    (time, input) => continuousResponse(time, a, input, initial), axes);
}
export function continuousSection(a: number, input: number, initial: number) {
  const times = linspace(0, fixture.continuous.duration, 101);
  const state: CurveSeries = { id: 'state', label: 'x(t) = y(t)', color: exactColor,
    points: times.map(time => ({ id: timeId(time), x: time, y: continuousResponse(time, a, input, initial), z: continuousResponse(time, a, input, initial) })) };
  const control: CurveSeries = { id: 'input', label: 'u(t)', color: '#cf6b24', points: times.map(time => ({ id: timeId(time), x: time, y: input })) };
  const spatial: CurveSeries = { ...state, label: 'Sezione u corrente',
    points: state.points.map(p => ({ ...p, y: input, z: p.y })) };
  const values = spatial.points.map(p => p.z!);
  return { state, control, spatial, atOne: continuousResponse(fixture.continuous.sampleTime, a, input, initial),
    patch: verticalSectionPatch('u corrente', 0, fixture.continuous.duration, input, Math.min(...values), Math.max(...values)) };
}
export function linearizationFamily(axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition]) {
  const x = linspace(-.25, .25, 41), u = linspace(-.1, .1, 33);
  return {
    exact: sampleSurface('Variazione esatta', x, u, (dx, du) => localVariation(dx, du).exact, axes),
    tangent: sampleSurface('Piano tangente', x, u, (dx, du) => localVariation(dx, du).linear, axes),
  };
}
export function linearizationSection(dx: number, du: number) {
  const x = linspace(-.25, .25, 101), result = localVariation(dx, du);
  const exact = sampleCurve('exact-section', 'Esatta', x, v => localVariation(v, du).exact);
  const linear = { ...sampleCurve('linear-section', 'Lineare', x, v => localVariation(v, du).linear), color: linearColor, dashed: true };
  const errorSegment: CurveSeries = { id: 'error', label: 'Scarto assoluto', color: '#cf6b24',
    points: [{ id: 'exact', x: dx, y: du, z: result.exact }, { id: 'linear', x: dx, y: du, z: result.linear }] };
  return { result, exact: { ...exact, color: exactColor }, linear, errorSegment,
    spatialSection: { ...exact, color: exactColor, points: exact.points.map(p => ({ ...p, y: du, z: p.y })) },
    points: errorSegment.points,
    sectionPoints: [{ id: 'exact', x: dx, y: result.exact }, { id: 'linear', x: dx, y: result.linear }] };
}
export function weightedCostData(w1: number, w2: number, axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition]) {
  const grid = sampleSurface('Costo corretto ℓ', linspace(-3, 3, 49), linspace(-3, 3, 49),
    (x, y) => diagonalQuadratic([x, y], [w1, w2], .5).total, axes);
  const cost = diagonalQuadratic(fixture.weighted.error, [w1, w2], .5);
  return { grid, cost, points: [{ id: 'candidate', x: 1, y: 1, z: cost.total }] };
}
export function quadraticSetData(a: number, b: number, c: number, axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition]) {
  const grid = sampleSurface('Residuo g', linspace(-3, 3, 61), linspace(-3, 3, 61),
    (x, y) => quadraticResidual(x, y, a, b, c), axes);
  const kind = quadraticSetKind(a, b, c);
  const mask: ScalarGrid = { ...grid, id: 'Maschera g≤0', z: grid.z.map(row => row.map(z => kind !== 'insieme vuoto' && z! <= 1e-9 ? 1 : 0)) };
  const points = constraintProbePoints.map(p => ({ ...p, z: quadraticResidual(p.x, p.y, a, b, c) }));
  const zeroSet: CurveSeries[] = kind === 'solo origine' ? [{ id: 'zero', label: 'Solo origine', discrete: true, points: [{ id: 'zero-origin', x: 0, y: 0 }] }] :
    kind === 'retta non limitata' ? [{ id: 'zero', label: 'Retta ammissibile', color: '#25775b',
      points: a === 0 ? [{ id: 'zero-a', x: -3, y: 0 }, { id: 'zero-b', x: 3, y: 0 }] :
        [{ id: 'zero-a', x: 0, y: -3 }, { id: 'zero-b', x: 0, y: 3 }] }] : [];
  return { grid, mask, points, kind, zeroSet,
    hideMask: kind === 'solo origine' || kind === 'retta non limitata',
    hideContour: kind === 'solo origine' || kind === 'retta non limitata' || (a === 0 && b === 0),
    zero: sampleSurface('Piano g=0', grid.x, grid.y, () => 0, axes) };
}
export function eulerData(delta: number) {
  const simulation = verticalEuler(delta);
  const discrete: CurveSeries = { id: 'euler', label: 'Euler (campioni)', color: exactColor, discrete: true,
    points: simulation.states.map((state, k) => ({ id: timeId(simulation.times[k]), x: simulation.times[k], y: state[2], z: state[3] })) };
  const analytical: CurveSeries = { id: 'continuous', label: 'Riferimento continuo', color: '#8a929d', dashed: true,
    points: linspace(0, fixture.drone.duration, 101).map(time => ({ id: timeId(time), x: time, y: simulation.analytical(time).altitude, z: simulation.analytical(time).velocity })) };
  return { simulation, series: [discrete, analytical],
    altitude: [discrete, analytical],
    velocity: [discrete, analytical].map(c => ({ ...c, points: c.points.map(p => ({ ...p, y: p.z! })) })) };
}
export function pathConstraintFamily(maximum: number, axes: readonly [AxisDefinition, AxisDefinition, AxisDefinition]) {
  const grid = sampleSurface('Residuo massimo V', linspace(0, 4, 41), linspace(0, 4, 41),
    (altitude, minimum) => Math.max(minimum - altitude, altitude - maximum), axes);
  return { grid, zero: sampleSurface('Piano V=0', grid.x, grid.y, () => 0, axes) };
}
export function pathSection(minimum: number, maximum: number) {
  return { id: 'current-bound', label: 'Sezione del limite corrente', color: '#176c98',
    points: linspace(0, 4, 81).map(altitude => ({ id: 'altitude:' + altitude, x: altitude, y: minimum, z: Math.max(minimum - altitude, altitude - maximum) })) };
}
export function equilibriumLocus() {
  const curve: CurveSeries = { id: 'equilibria', label: 'Luogo degli equilibri (non è un moto)', color: '#78909e',
    points: linspace(-Math.PI / 2, Math.PI / 2, 101).map((angle, i) => ({ id: 'locus:' + i, x: angle, y: 0, z: pendulumEquilibrium(angle).torque })) };
  return curve;
}
export function verticalSectionPatch(id: string, minX: number, maxX: number, y: number, minZ: number, maxZ: number): SurfacePatch {
  return { id, label: id, x: [[minX, maxX], [minX, maxX]], y: [[y, y], [y, y]],
    z: [[minZ, minZ], [maxZ, maxZ]], opacity: .12 };
}
