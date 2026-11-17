/**
 * Erzeugt die Musterlösungen für die Arbeitsblätter.
 *
 * Der Quelltext wird NICHT von Hand in die Arbeitsblätter kopiert, sondern
 * direkt aus dem Lösungsprojekt gelesen. Damit kann die Lösung gar nicht
 * mehr vom getesteten Projekt abweichen:
 *
 *     node scripts/loesung-generieren.mjs
 *
 * Das Ergebnis liegt in src/data/ (nicht im Repository, wird beim Bauen erzeugt).
 */

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, '..', '..');

/** Was für welches Arbeitsblatt zusammengestellt wird. */
const aufgaben = [
  {
    ziel: 'src/data/loesung-ab01.json',
    projekt: '01-typescript-werkstatt/loesung',
    dateien: ['src/ticket.ts'],
  },
  {
    ziel: 'src/data/loesung-ab02.json',
    projekt: '01-typescript-werkstatt/loesung',
    dateien: ['src/ticket-list.ts'],
  },
  {
    ziel: 'src/data/loesung-ab03.json',
    projekt: '01-typescript-werkstatt/loesung',
    dateien: ['src/ticket-store.ts'],
  },
];

const sprachen = {'.ts': 'typescript', '.json': 'json', '.md': 'markdown'};

for (const aufgabe of aufgaben) {
  const dateien = aufgabe.dateien.map((pfad) => {
    const endung = pfad.slice(pfad.lastIndexOf('.'));
    return {
      pfad,
      sprache: sprachen[endung] ?? 'text',
      inhalt: readFileSync(resolve(wurzel, aufgabe.projekt, pfad), 'utf8').replace(/\r\n/g, '\n').trimEnd(),
    };
  });
  const ziel = resolve(hier, '..', aufgabe.ziel);
  mkdirSync(dirname(ziel), {recursive: true});
  writeFileSync(ziel, JSON.stringify({dateien}, null, 2) + '\n');
  console.log(`[loesung] ${aufgabe.ziel}: ${dateien.length} Datei(en)`);
}
