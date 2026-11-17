/**
 * Packt das Starter-Projekt der TypeScript-Werkstatt zu einer ZIP-Datei, die
 * die Schüler von der Webseite herunterladen:
 *
 *     node scripts/starter-zip.mjs
 *
 * Quelle ist 01-typescript-werkstatt/starter. Das Ergebnis liegt in
 * static/downloads/ (nicht im Repository, wird beim Bauen erzeugt).
 */

import {mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {zipSync} from 'fflate';

const hier = dirname(fileURLToPath(import.meta.url));
const quelle = resolve(hier, '..', '..', '01-typescript-werkstatt', 'starter');
const ziel = resolve(hier, '..', 'static', 'downloads', 'typescript-werkstatt-starter.zip');

// Was nicht ins Paket gehört: installierte Pakete und Zwischenergebnisse.
const ausgeschlossen = new Set(['node_modules', '.vitest', 'dist', '.idea']);

function sammeln(ordner, dateien = {}) {
  for (const name of readdirSync(ordner)) {
    if (ausgeschlossen.has(name)) continue;
    const pfad = join(ordner, name);
    if (statSync(pfad).isDirectory()) {
      sammeln(pfad, dateien);
    } else {
      const innerhalb = relative(quelle, pfad).split(sep).join('/');
      dateien[`typescript-werkstatt/${innerhalb}`] = new Uint8Array(readFileSync(pfad));
    }
  }
  return dateien;
}

const dateien = sammeln(quelle);
mkdirSync(dirname(ziel), {recursive: true});
writeFileSync(ziel, zipSync(dateien, {level: 9}));
console.log(`[starter-zip] ${Object.keys(dateien).length} Dateien -> static/downloads/typescript-werkstatt-starter.zip`);
