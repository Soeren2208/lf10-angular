// Prüft Lösung und Starter gegeneinander. Ergebnis: eine Tabelle, Exit-Code 1 bei jeder Abweichung.
//
//   node verify-both.mjs
//
// Geprüft wird:
//   1. Die gemeinsamen Dateien sind in Lösung und Starter byte-gleich.
//   2. Lösung: Typen grün, alle Tests grün.
//   3. Starter: Alle Tests rot, die Typ-Prüfung meldet genau die erwarteten Lücken.
//   4. Fehlerhafte Lösungen (Mutanten) werden von den Tests oder vom Compiler erkannt.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sharedFiles } from './shared-files.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const solution = join(here, 'solution');
const starter = join(here, 'starter');
let failures = 0;
const report = (ok, text) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${text}`);
  if (!ok) failures++;
};

function sh(command, cwd) {
  const r = spawnSync(command, { cwd, shell: true, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout ?? '') + (r.stderr ?? ''), stdout: r.stdout ?? '' };
}

function runTests(cwd) {
  // Vitest schreibt den JSON-Bericht in eine Datei, nicht auf die Konsole.
  const reportFile = join(tmpdir(), `vitest-report-${process.pid}.json`);
  const r = sh(`npx vitest run --reporter=json --outputFile="${reportFile}"`, cwd);
  if (!existsSync(reportFile)) return { total: 0, passed: 0, failed: 0, code: r.code, out: r.out };
  const j = JSON.parse(readFileSync(reportFile, 'utf8'));
  rmSync(reportFile);
  return { total: j.numTotalTests, passed: j.numPassedTests, failed: j.numFailedTests, code: r.code, out: r.out };
}

function runTypes(cwd) {
  const r = sh('npx tsc --noEmit', cwd);
  const lines = r.out.split('\n').filter((line) => /error TS\d+/.test(line));
  return { code: r.code, count: lines.length, unused: lines.filter((line) => line.includes('TS2578')).length, out: r.out };
}

console.log('1. Gemeinsame Dateien');
for (const file of sharedFiles) {
  const source = readFileSync(join(solution, file));
  const copy = join(starter, file);
  report(existsSync(copy) && source.equals(readFileSync(copy)), file);
}

for (const dir of [solution, starter]) {
  if (!existsSync(join(dir, 'node_modules'))) {
    console.log(`npm install in ${dir} …`);
    sh('npm install --no-audit --no-fund', dir);
  }
}

console.log('\n2. Lösung');
const solutionTypes = runTypes(solution);
report(solutionTypes.code === 0, `Typen grün (Compiler-Fehler: ${solutionTypes.count})`);
if (solutionTypes.code !== 0) console.log(solutionTypes.out);
const solutionTests = runTests(solution);
report(solutionTests.code === 0 && solutionTests.failed === 0 && solutionTests.total > 0, `Tests grün (${solutionTests.passed} von ${solutionTests.total})`);

console.log('\n3. Starter');
const starterTypes = runTypes(starter);
const expected = (readFileSync(join(starter, 'src/types.check.ts'), 'utf8').match(/^\/\/ @ts-expect-error/gm) ?? []).length;
report(starterTypes.code !== 0 && starterTypes.count === starterTypes.unused, `Typen rot, nur "Unused @ts-expect-error" (${starterTypes.unused} von ${starterTypes.count} Meldungen)`);
report(starterTypes.unused === expected, `Alle ${expected} Typ-Prüfungen sind im Starter offen (gemeldet: ${starterTypes.unused})`);
if (starterTypes.count !== starterTypes.unused) console.log(starterTypes.out);
const starterTests = runTests(starter);
report(starterTests.total === solutionTests.total, `Gleiche Testanzahl wie in der Lösung (${starterTests.total})`);
report(starterTests.passed === 0, `Alle Tests rot (grün: ${starterTests.passed}, rot: ${starterTests.failed})`);

console.log('\n4. Fehlerhafte Lösungen (Mutanten) – jede muss auffallen');
const mutants = [
  ['ticket.ts', "return ticket.assignee ?? 'nicht zugewiesen';", "return ticket.assignee || 'nicht zugewiesen';", '?? durch || ersetzt'],
  ['ticket.ts', "return ticket.priority === 1 && ticket.status !== 'erledigt';", 'return ticket.priority === 1;', 'isUrgent ignoriert erledigt'],
  ['ticket-list.ts', 'return [...tickets].sort(', 'return (tickets as Ticket[]).sort(', 'sortedByPriority sortiert die Eingabe selbst'],
  ['ticket-list.ts', 'ticket.id === id ? { ...ticket, status } : ticket', 'ticket.id === id ? Object.assign(ticket, { status }) : ticket', 'withStatus ändert das Ticket selbst'],
  ['ticket-list.ts', "    { offen: 0, 'in Arbeit': 0, erledigt: 0 },", "    { offen: 0, 'in Arbeit': 0, erledigt: 1 },", 'countByStatus mit falschem Startwert'],
  ['ticket-store.ts', 'this.tickets = [...this.tickets, ticket];', '(this.tickets as Ticket[]).push(ticket);', 'add ändert die alte Liste'],
  ['ticket-store.ts', 'this.tickets = [...this.tickets, ticket];\n    this.notify();', 'this.tickets = [...this.tickets, ticket];', 'add meldet nichts'],
  ['ticket-store.ts', "    if (!this.tickets.some((ticket) => ticket.id === id)) {\n      return;\n    }\n", '', 'setStatus meldet auch bei unbekannter Nummer'],
  ['ticket-store.ts', 'return () => {\n      this.listeners.delete(listener);\n    };', 'return () => {};', 'Abmelden tut nichts'],
  ['ticket-store.ts', "  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}`);\n  }\n", '', 'loadTickets prüft die Antwort nicht'],
  ['ticket-store.ts', 'error: error instanceof Error ? error.message : String(error)', 'error: String(error)', 'loadTicketsSafe liefert "Error: …" statt des Textes'],
];
for (const [file, from, to, name] of mutants) {
  const path = join(solution, 'src', file);
  const original = readFileSync(path, 'utf8');
  const lf = original.replace(/\r\n/g, '\n');
  if (!lf.includes(from)) {
    report(false, `Mutant "${name}": Stelle nicht gefunden`);
    continue;
  }
  try {
    writeFileSync(path, lf.replace(from, to));
    const types = runTypes(solution);
    const tests = runTests(solution);
    const detected = types.code !== 0 || tests.code !== 0;
    report(detected, `${name} → erkannt von ${[types.code !== 0 ? 'Compiler' : '', tests.failed > 0 ? `${tests.failed} Test(s)` : ''].filter(Boolean).join(' und ') || 'NIEMANDEM'}`);
  } finally {
    writeFileSync(path, original);
  }
}

console.log(failures === 0 ? '\nAlles in Ordnung.' : `\n${failures} Abweichung(en).`);
process.exit(failures === 0 ? 0 : 1);
