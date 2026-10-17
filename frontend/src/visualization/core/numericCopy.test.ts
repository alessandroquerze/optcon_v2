import { expect, it } from 'vitest';
import { numericCopy } from './numericCopy';
it('una mutazione del backend non raggiunge i dati matematici', () => {
  const source = { z: [[1,2],[3,4]], marker: { size: 5 } };
  const output = numericCopy(source, new WeakMap());
  output.z[0][0] = 999; output.marker.size = 100;
  expect(source.z[0][0]).toBe(1); expect(source.marker.size).toBe(5);
});
it('un punto aggiornato non invalida il buffer di una superficie invariata', () => {
  const cache = new WeakMap<object, unknown>(), z = [[1,2],[3,4]];
  const first = numericCopy({ z, point: [1,1,2] }, cache);
  const second = numericCopy({ z, point: [2,2,3] }, cache);
  expect(second.z).toBe(first.z); expect(second.point).not.toBe(first.point);
  expect(second.z).not.toBe(z);
});
