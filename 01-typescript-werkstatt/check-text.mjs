// Prüft, ob die vollständigen Lösungen und Beispiele in den Arbeitsblättern (docs-tutorial-01) im getesteten Lösungsprojekt vorkommen
// und ob die Beispielcode-Blöcke ohne Platzhalter übersetzbar sind.
//   node check-text.mjs
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docs = join(here, '..', 'website', 'docs-tutorial-01');
const solutionFile = (name) => fs.readFileSync(join(here, 'solution', 'src', name), 'utf8').replace(/\r\n/g, '\n');
const squash = (text) => text.replace(/\s+/g, ' ').trim();

const sources = squash(['ticket.ts', 'ticket-list.ts', 'ticket-store.ts'].map(solutionFile).join('\n'));
const problems = [];

// Alle Blöcke mit dem Titel src/ticket*.ts müssen im Lösungsprojekt vorkommen (Leerraum egal),
// es sei denn, sie sind als Gerüst oder fehlerhafte Zwischenstufe gedacht (enthalten Platzhalter wie "// Wenn" oder "/* hier").
for (const file of fs.readdirSync(docs).filter((name) => name.endsWith('.mdx'))) {
  const text = fs.readFileSync(join(docs, file), 'utf8').replace(/\r\n/g, '\n');
  for (const match of text.matchAll(/```ts title="src\/(ticket[\w-]*\.ts)"\n([\s\S]*?)```/g)) {
    const code = match[2];
    if (/\/\/ Wenn|\/\* hier|\/\/ Ergänze|…|ticket\.status = status/.test(code)) continue;
    // Auszug aus mehreren Stellen der Datei: dann muss wenigstens jede Zeile einzeln vorkommen.
    const everyLine = code.split('\n').map(squash).filter(Boolean).every((line) => sources.includes(line));
    if (!sources.includes(squash(code)) && !everyLine) problems.push(`${file}: Block aus ${match[1]} steht nicht im Lösungsprojekt:\n${code}`);
  }
}

console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Blöcke mit Titel src/ticket*.ts stehen so im getesteten Lösungsprojekt.');
process.exit(problems.length ? 1 : 0);
