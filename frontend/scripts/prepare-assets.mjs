import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const frontend = path.join(root, 'frontend');
const target = path.join(frontend, 'public/course-assets');
await mkdir(target, { recursive: true });
for(const [source,destination] of [['introduction_companion_manifest.json','manifest.json'],['optimization_companion_manifest.json','optimization-manifest.json']]) {
const manifestBytes = await readFile(path.join(root, 'Data',source));
const manifest = JSON.parse(manifestBytes.toString('utf8'));
const pdfPath = path.resolve(root, manifest.source_pdf.path);
if (path.dirname(pdfPath) !== root || path.basename(pdfPath) !== manifest.source_pdf.filename) {
  throw new Error('Percorso PDF esterno al contratto locale.');
}
const pdf = await readFile(pdfPath);
const hash = createHash('sha256').update(pdf).digest('hex');
if (hash !== manifest.source_pdf.sha256) throw new Error('SHA-256 PDF diverso dal manifest.');
await writeFile(path.join(target,destination),manifestBytes);
await writeFile(path.join(target, manifest.source_pdf.filename), pdf);
}
async function copyLocalTree(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name), to = path.join(destination, entry.name);
    if (entry.isDirectory()) await copyLocalTree(from, to);
    else if (entry.isFile()) await writeFile(to, await readFile(from));
    else throw new Error('Asset PDF.js inatteso: '+entry.name);
  }
}
for (const name of ['cmaps', 'standard_fonts', 'wasm']) {
  await copyLocalTree(path.join(frontend, 'node_modules/pdfjs-dist', name), path.join(frontend, 'public/pdfjs', name));
}
console.log('Asset locali preparati: manifest e PDF originali verificati, font/CMap/WASM PDF.js.');
