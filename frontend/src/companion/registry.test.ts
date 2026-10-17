import { it,expect } from 'vitest';
import { companionRenderers } from './registry';
it('F06 registra soltanto le otto pagine autorizzate; le altre 28 restano placeholder',()=>{
  expect(Object.keys(companionRenderers).map(Number)).toEqual([2,8,12,16,17,27,30,34]);
});
