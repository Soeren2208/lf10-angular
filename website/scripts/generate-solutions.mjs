/**
 * Erzeugt die Musterlösungen für die Arbeitsblätter.
 *
 * Der Quelltext wird NICHT von Hand in die Arbeitsblätter kopiert, sondern
 * direkt aus dem Lösungsprojekt gelesen. Damit kann die Lösung gar nicht
 * mehr vom getesteten Projekt abweichen:
 *
 *     node scripts/generate-solutions.mjs
 *
 * Das Ergebnis liegt in src/data/ (nicht im Repository, wird beim Bauen erzeugt).
 */

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');

/** Was für welches Arbeitsblatt zusammengestellt wird. */
const worksheets = [
  {
    target: 'src/data/solution-ab01.json',
    project: '01-typescript-werkstatt/solution',
    files: ['src/ticket.ts'],
  },
  {
    target: 'src/data/solution-ab02.json',
    project: '01-typescript-werkstatt/solution',
    files: ['src/ticket-list.ts'],
  },
  {
    target: 'src/data/solution-ab03.json',
    project: '01-typescript-werkstatt/solution',
    files: ['src/ticket-store.ts'],
  },
];

const languages = {'.ts': 'typescript', '.json': 'json', '.md': 'markdown'};

for (const worksheet of worksheets) {
  // Die Struktur {dateien: [{pfad, sprache, inhalt}]} erwartet die Komponente Solution.
  const dateien = worksheet.files.map((path) => {
    const extension = path.slice(path.lastIndexOf('.'));
    return {
      pfad: path,
      sprache: languages[extension] ?? 'text',
      inhalt: readFileSync(resolve(repoRoot, worksheet.project, path), 'utf8').replace(/\r\n/g, '\n').trimEnd(),
    };
  });
  const target = resolve(here, '..', worksheet.target);
  mkdirSync(dirname(target), {recursive: true});
  writeFileSync(target, JSON.stringify({dateien}, null, 2) + '\n');
  console.log(`[solutions] ${worksheet.target}: ${dateien.length} Datei(en)`);
}
