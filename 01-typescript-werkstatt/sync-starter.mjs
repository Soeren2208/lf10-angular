// Kopiert die gemeinsamen Dateien aus `loesung/` in `starter/`.
//   node sync-starter.mjs
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gemeinsam } from './gemeinsam.mjs';

const hier = dirname(fileURLToPath(import.meta.url));

for (const datei of gemeinsam) {
  const ziel = join(hier, 'starter', datei);
  mkdirSync(dirname(ziel), { recursive: true });
  copyFileSync(join(hier, 'loesung', datei), ziel);
}
console.log(`${gemeinsam.length} Dateien in den Starter kopiert.`);
