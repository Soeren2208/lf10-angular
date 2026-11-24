/**
 * Erzeugt die Musterlösungen für die Arbeitsblätter.
 *
 * Der Quelltext wird NICHT von Hand in die Arbeitsblätter kopiert, sondern
 * direkt aus den getesteten Projekten gelesen. Damit kann die Lösung gar nicht
 * mehr vom lauffähigen Projekt abweichen:
 *
 *     node scripts/generate-solutions.mjs
 *
 * Eintrag in `files`:
 *   - ein Dateipfad (ganze Datei)
 *   - `{path, symbol}`  nur die Funktion `symbol` aus dieser Datei, mit ihrem Kommentar darüber
 *   - `{path, as}`      ganze Datei, im Arbeitsblatt unter dem Pfad `as` gezeigt
 *   - `{path, as, append}`  wie `{path, as}`, mit einer weiteren Datei (Pfad ab Repository-Wurzel) darunter angehängt
 *   - `{dir}`           alle Dateien unter diesem Ordner (für CodeFile: Dateien zum Abtippen oder Kopieren)
 *
 * Das Ergebnis liegt in src/data/ (nicht im Repository, wird beim Bauen erzeugt).
 */

import {readFileSync, readdirSync, statSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const workshop = '01-typescript-werkstatt/solution';
const stageAb01 = '02-angular-einstieg/stages/ab01';
const stageAb02 = '02-angular-einstieg/stages/ab02';
const stageAb03 = '02-angular-einstieg/stages/ab03';

/** Was für welches Arbeitsblatt zusammengestellt wird. */
const worksheets = [
  // Tutorial 01 (TypeScript-Werkstatt)
  {target: 'src/data/solution-ab01.json', project: workshop, files: ['src/ticket.ts']},
  {target: 'src/data/solution-ab01-a4.json', project: workshop, files: [{path: 'src/ticket.ts', symbol: 'isUrgent'}]},
  {target: 'src/data/solution-ab01-a5.json', project: workshop, files: [{path: 'src/ticket.ts', symbol: 'assigneeName'}]},
  {target: 'src/data/solution-ab02.json', project: workshop, files: ['src/ticket-list.ts']},
  {target: 'src/data/solution-ab03.json', project: workshop, files: ['src/ticket-store.ts']},

  // Tutorial 02 (Ticket-Board)
  // Fallback für die, die die Werkstatt nicht fertig haben: Dateien, die sie ins neue Projekt kopieren.
  {
    target: 'src/data/t2-workshop-modell.json',
    project: workshop,
    files: [
      {path: 'src/ticket.ts', as: 'src/app/ticket.ts'},
      {path: 'src/sample-data.ts', as: 'src/app/sample-data.ts'},
    ],
  },
  // Alle Quelltexte, die die Schüler in AB 01 schreiben oder kopieren (für CodeFile).
  {target: 'src/data/t2-stage-ab01.json', project: stageAb01, files: [{dir: 'src'}]},
  // Die fertige Karte als ausklappbare Musterlösung.
  {
    target: 'src/data/t2-ab01-karte.json',
    project: stageAb01,
    files: ['src/app/ticket-card/ticket-card.ts', 'src/app/ticket-card/ticket-card.html'],
  },
  // AB 02: alle Quelltexte des Stands (ohne die Datei, die aus Werkstatt und Ergänzung zusammengesetzt wird) ...
  {target: 'src/data/t2-stage-ab02.json', project: stageAb02, files: [{dir: 'src'}]},
  // AB 03: alle Quelltexte des Stands.
  {target: 'src/data/t2-stage-ab03.json', project: stageAb03, files: [{dir: 'src'}]},
  // AB 04: der Endstand (alle Quelltexte; die Datei ticket-list.append.ts gehört nicht zum Endstand der Schüler).
  {target: 'src/data/t2-stage-ab04.json', project: '02-angular-einstieg/overlay', files: [{dir: 'src'}]},
  // Fallback: die Listenfunktionen der Werkstatt, wie sie vor AB 02 sind.
  {
    target: 'src/data/t2-workshop-liste.json',
    project: workshop,
    files: [{path: 'src/ticket-list.ts', as: 'src/app/ticket-list.ts'}],
  },
  // ... und die Listenfunktionen der Werkstatt samt der neuen Funktion, so wie die Schüler die Datei am Ende haben.
  {
    target: 'src/data/t2-ab02-ticket-list.json',
    project: workshop,
    files: [{path: 'src/ticket-list.ts', as: 'src/app/ticket-list.ts', append: `${stageAb02}/src/app/ticket-list.append.ts`}],
  },
];

const languages = {'.ts': 'typescript', '.json': 'json', '.md': 'markdown', '.css': 'css', '.html': 'html'};

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

/** Alle Dateien unter `dir` (relativ zum Projekt), sortiert, mit Pfaden relativ zum Projekt. */
function listFiles(projectDir, dir) {
  const result = [];
  for (const entry of readdirSync(join(projectDir, dir)).sort()) {
    const relative = `${dir}/${entry}`;
    if (statSync(join(projectDir, relative)).isDirectory()) result.push(...listFiles(projectDir, relative));
    else result.push(relative);
  }
  return result;
}

for (const worksheet of worksheets) {
  const projectDir = resolve(repoRoot, worksheet.project);
  const expanded = worksheet.files.flatMap((entry) => (typeof entry === 'object' && entry.dir ? listFiles(projectDir, entry.dir) : [entry]));
  // Die Struktur {dateien: [{pfad, sprache, inhalt}]} erwarten die Komponenten Solution und CodeFile.
  const dateien = expanded.map((entry) => {
    const path = typeof entry === 'string' ? entry : entry.path;
    const shown = typeof entry === 'object' && entry.as ? entry.as : path;
    const extension = path.slice(path.lastIndexOf('.'));
    let source = readFileSync(join(projectDir, path), 'utf8').replace(/\r\n/g, '\n').trimEnd();
    if (typeof entry === 'object' && entry.append) {
      source += '\n\n' + readFileSync(join(repoRoot, entry.append), 'utf8').replace(/\r\n/g, '\n').trimEnd();
    }
    return {
      pfad: shown,
      sprache: languages[extension] ?? 'text',
      inhalt: typeof entry === 'object' && entry.symbol ? extractFunction(source, entry.symbol, path) : source,
    };
  });
  const target = resolve(here, '..', worksheet.target);
  mkdirSync(dirname(target), {recursive: true});
  writeFileSync(target, JSON.stringify({dateien}, null, 2) + '\n');
  console.log(`[solutions] ${worksheet.target}: ${dateien.length} Datei(en)`);
}
