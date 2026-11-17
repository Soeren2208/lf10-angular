// Prüft Lösung und Starter gegeneinander. Ergebnis: eine Tabelle, Exit-Code 1 bei jeder Abweichung.
//
//   node pruefen-beide.mjs
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
import { gemeinsam } from './gemeinsam.mjs';

const hier = dirname(fileURLToPath(import.meta.url));
const loesung = join(hier, 'loesung');
const starter = join(hier, 'starter');
let fehler = 0;
const melde = (ok, text) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${text}`);
  if (!ok) fehler++;
};

function sh(befehl, cwd) {
  const r = spawnSync(befehl, { cwd, shell: true, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout ?? '') + (r.stderr ?? ''), stdout: r.stdout ?? '' };
}

function tests(cwd) {
  // Vitest schreibt den JSON-Bericht in eine Datei, nicht auf die Konsole.
  const bericht = join(tmpdir(), `vitest-bericht-${process.pid}.json`);
  const r = sh(`npx vitest run --reporter=json --outputFile="${bericht}"`, cwd);
  if (!existsSync(bericht)) return { gesamt: 0, gruen: 0, rot: 0, code: r.code, out: r.out };
  const j = JSON.parse(readFileSync(bericht, 'utf8'));
  rmSync(bericht);
  return { gesamt: j.numTotalTests, gruen: j.numPassedTests, rot: j.numFailedTests, code: r.code, out: r.out };
}

function typen(cwd) {
  const r = sh('npx tsc --noEmit', cwd);
  const zeilen = r.out.split('\n').filter((z) => /error TS\d+/.test(z));
  return { code: r.code, anzahl: zeilen.length, ungenutzt: zeilen.filter((z) => z.includes('TS2578')).length, out: r.out };
}

console.log('1. Gemeinsame Dateien');
for (const datei of gemeinsam) {
  const a = readFileSync(join(loesung, datei));
  const pfad = join(starter, datei);
  melde(existsSync(pfad) && a.equals(readFileSync(pfad)), datei);
}

for (const dir of [loesung, starter]) {
  if (!existsSync(join(dir, 'node_modules'))) {
    console.log(`npm install in ${dir} …`);
    sh('npm install --no-audit --no-fund', dir);
  }
}

console.log('\n2. Lösung');
const lt = typen(loesung);
melde(lt.code === 0, `Typen grün (Compiler-Fehler: ${lt.anzahl})`);
if (lt.code !== 0) console.log(lt.out);
const ltests = tests(loesung);
melde(ltests.code === 0 && ltests.rot === 0 && ltests.gesamt > 0, `Tests grün (${ltests.gruen} von ${ltests.gesamt})`);

console.log('\n3. Starter');
const st = typen(starter);
const erwartet = (readFileSync(join(starter, 'src/typen.check.ts'), 'utf8').match(/^\/\/ @ts-expect-error/gm) ?? []).length;
melde(st.code !== 0 && st.anzahl === st.ungenutzt, `Typen rot, nur "Unused @ts-expect-error" (${st.ungenutzt} von ${st.anzahl} Meldungen)`);
melde(st.ungenutzt === erwartet, `Alle ${erwartet} Typ-Prüfungen sind im Starter offen (gemeldet: ${st.ungenutzt})`);
if (st.anzahl !== st.ungenutzt) console.log(st.out);
const stests = tests(starter);
melde(stests.gesamt === ltests.gesamt, `Gleiche Testanzahl wie in der Lösung (${stests.gesamt})`);
melde(stests.gruen === 0, `Alle Tests rot (grün: ${stests.gruen}, rot: ${stests.rot})`);

console.log('\n4. Fehlerhafte Lösungen (Mutanten) – jede muss auffallen');
const mutanten = [
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
for (const [datei, von, nach, name] of mutanten) {
  const pfad = join(loesung, 'src', datei);
  const original = readFileSync(pfad, 'utf8');
  const lf = original.replace(/\r\n/g, '\n');
  if (!lf.includes(von)) {
    melde(false, `Mutant "${name}": Stelle nicht gefunden`);
    continue;
  }
  try {
    writeFileSync(pfad, lf.replace(von, nach));
    const t = typen(loesung);
    const r = tests(loesung);
    const erkannt = t.code !== 0 || r.code !== 0;
    melde(erkannt, `${name} → erkannt von ${[t.code !== 0 ? 'Compiler' : '', r.rot > 0 ? `${r.rot} Test(s)` : ''].filter(Boolean).join(' und ') || 'NIEMANDEM'}`);
  } finally {
    writeFileSync(pfad, original);
  }
}

console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Abweichung(en).`);
process.exit(fehler === 0 ? 0 : 1);
