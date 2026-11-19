/**
 * Erzeugt die Musterlösungen für die Arbeitsblätter.
 *
 * Der Quelltext wird NICHT von Hand in die Arbeitsblätter kopiert, sondern
 * direkt aus dem Lösungsprojekt gelesen. Damit kann die Lösung gar nicht
 * mehr vom getesteten Projekt abweichen:
 *
 *     node scripts/generate-solutions.mjs
 *
 * Eintrag in `files`: entweder ein Dateipfad (ganze Datei) oder
 * `{path, symbol}` (nur die Funktion `symbol` aus dieser Datei, mit ihrem
 * Kommentar darüber).
 *
 * Das Ergebnis liegt in src/data/ (nicht im Repository, wird beim Bauen erzeugt).
 */

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const project = '01-typescript-werkstatt/solution';

/** Was für welches Arbeitsblatt zusammengestellt wird. */
const worksheets = [
  {target: 'src/data/solution-ab01.json', project, files: ['src/ticket.ts']},
  {target: 'src/data/solution-ab01-a4.json', project, files: [{path: 'src/ticket.ts', symbol: 'isUrgent'}]},
  {target: 'src/data/solution-ab01-a5.json', project, files: [{path: 'src/ticket.ts', symbol: 'assigneeName'}]},
  {target: 'src/data/solution-ab02.json', project, files: ['src/ticket-list.ts']},
  {target: 'src/data/solution-ab03.json', project, files: ['src/ticket-store.ts']},
];

const languages = {'.ts': 'typescript', '.json': 'json', '.md': 'markdown'};

/** Schneidet eine Funktion samt Kommentar darüber aus dem Quelltext. */
function extractFunction(source, symbol, path) {
  const lines = source.split('\n');
  const head = lines.findIndex((line) => new RegExp(`^export (async )?function ${symbol}\\b`).test(line));
  if (head < 0) throw new Error(`Funktion ${symbol} nicht gefunden in ${path}`);
  let start = head;
  // Kommentar direkt über der Funktion (/** ... */ oder //) gehört dazu.
  while (start > 0 && /^(\/\*\*|\s\*|\/\/)/.test(lines[start - 1])) start--;
  let end = head;
  while (end < lines.length && lines[end] !== '}') end++;
  if (end >= lines.length) throw new Error(`Ende der Funktion ${symbol} nicht gefunden in ${path}`);
  return lines.slice(start, end + 1).join('\n');
}

for (const worksheet of worksheets) {
  // Die Struktur {dateien: [{pfad, sprache, inhalt}]} erwartet die Komponente Solution.
  const dateien = worksheet.files.map((entry) => {
    const path = typeof entry === 'string' ? entry : entry.path;
    const extension = path.slice(path.lastIndexOf('.'));
    const source = readFileSync(resolve(repoRoot, worksheet.project, path), 'utf8').replace(/\r\n/g, '\n').trimEnd();
    return {
      pfad: path,
      sprache: languages[extension] ?? 'text',
      inhalt: typeof entry === 'string' ? source : extractFunction(source, entry.symbol, path),
    };
  });
  const target = resolve(here, '..', worksheet.target);
  mkdirSync(dirname(target), {recursive: true});
  writeFileSync(target, JSON.stringify({dateien}, null, 2) + '\n');
  console.log(`[solutions] ${worksheet.target}: ${dateien.length} Datei(en)`);
}
