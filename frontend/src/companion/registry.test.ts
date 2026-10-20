import { it,expect } from 'vitest';
import { companionRenderers } from './registry';
it('registro F07 completo per i batch implementati, senza perdere la vertical slice',()=>{
  const pages=Object.keys(companionRenderers).map(Number);
  expect(pages).toEqual(Array.from({length:36},(_,i)=>i+1));
  for(const page of [2,8,12,16,17,27,30,34]) expect(pages).toContain(page);
  expect(pages.every(n=>Number.isInteger(n)&&n>=1&&n<=36)).toBe(true);
});
