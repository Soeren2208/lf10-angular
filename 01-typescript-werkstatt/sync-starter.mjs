// Kopiert die gemeinsamen Dateien aus `solution/` in `starter/`.
//   node sync-starter.mjs
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sharedFiles } from './shared-files.mjs';

const here = dirname(fileURLToPath(import.meta.url));

for (const file of sharedFiles) {
  const target = join(here, 'starter', file);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(here, 'solution', file), target);
}
console.log(`${sharedFiles.length} Dateien in den Starter kopiert.`);
