import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../../', import.meta.url);
const baseline = JSON.parse(await readFile(new URL('Data/reviews/f05_source_baseline.json', root), 'utf8'));
const errors = [];
for (const [name, expected] of Object.entries(baseline.protected_files)) {
  const value = createHash('sha256').update(await readFile(new URL(name, root))).digest('hex');
  if (value !== expected) errors.push(name);
}
if (errors.length) throw new Error('File protetti modificati: '+errors.join(', '));
console.log(Object.keys(baseline.protected_files).length+' file protetti identici alla baseline F05.');
