// Baut die Musterlösung von Tutorial 02 neu auf und prüft sie.
//
//   node build-solution.mjs                 Endstand (AB 04): solution/ neu anlegen, bauen, im Browser prüfen
//   node build-solution.mjs --stage=ab01    Stand am Ende von AB 01: solution-ab01/ (Quelltexte aus stages/ab01/)
//   node build-solution.mjs --keep          vorhandenes Projekt behalten, nur die Quelltexte neu kopieren
//   node build-solution.mjs --no-e2e        ohne den Browser-Test
//
// Gedacht auch als Jahresprüfung: Mit der dann aktuellen Angular-CLI entsteht das Projekt frisch. Bricht eine neue
// Version etwas, zeigt es sich hier (Build-Fehler oder Fehler im Browser-Test) und nicht erst im Unterricht.
//
// Die Schüler bekommen kein Starter-Projekt. Sie legen ihr Projekt selbst an. Dieses Skript ist nur für die Lehrkraft.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const stageArg = process.argv.find((arg) => arg.startsWith('--stage='));
const stage = stageArg ? stageArg.slice('--stage='.length) : null;
const solution = join(here, stage ? `solution-${stage}` : 'solution');
const overlay = join(here, stage ? join('stages', stage) : 'overlay');
const workshop = join(here, '..', '01-typescript-werkstatt', 'solution', 'src');
const keep = process.argv.includes('--keep');
const withE2e = !process.argv.includes('--no-e2e');

if (!existsSync(overlay)) {
  console.error(`Quelltexte nicht gefunden: ${overlay}`);
  process.exit(1);
}

// Angular 22 verlangt Node ^22.22.3 || ^24.15.0 || >=26. Ist die installierte Version zu alt, hilft ein vorgeschaltetes Node 26.
function nodeOk() {
  const [major, minor, patch] = process.versions.node.split('.').map(Number);
  if (major >= 26) return true;
  if (major === 24) return minor >= 15;
  if (major === 22) return minor > 22 || (minor === 22 && patch >= 3);
  return false;
}
const prefix = nodeOk() ? '' : 'npx -y -p node@26 ';
if (prefix) console.log('Installiertes Node ist für Angular 22 zu alt, nutze npx -p node@26.');

function run(command, cwd) {
  console.log(`\n$ ${command}   (in ${cwd.replace(here, '.')})`);
  const result = spawnSync(command, { cwd, shell: true, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`Fehlgeschlagen: ${command}`);
    process.exit(result.status ?? 1);
  }
}

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const source = join(from, entry);
    const target = join(to, entry);
    if (statSync(source).isDirectory()) copyTree(source, target);
    else cpSync(source, target);
  }
}

// 1. Projekt anlegen, wie es die Schüler tun: ng new mit festen Optionen
if (!keep || !existsSync(solution)) {
  rmSync(solution, { recursive: true, force: true });
  run(
    `${prefix}npx -y @angular/cli@latest new ticket-board --directory ${solution.split(/[\\/]/).pop()} --defaults --skip-git --skip-tests --package-manager npm`,
    here,
  );
}

// 2. Quelltexte der Lösung darüberlegen
copyTree(overlay, solution);
rmSync(join(solution, 'src', 'app', 'app.spec.ts'), { force: true });

// 2b. Seitentitel und Sprache (Aufgabe 1 der Schüler): lang="de" und <title>Ticket-Board</title>
const indexHtml = join(solution, 'src', 'index.html');
writeFileSync(
  indexHtml,
  readFileSync(indexHtml, 'utf8').replace('lang="en"', 'lang="de"').replace(/<title>.*<\/title>/, '<title>Ticket-Board</title>'),
);

// 3. Dateien aus der TypeScript-Werkstatt (Quelle: deren Lösung, damit sie nicht auseinanderlaufen)
const app = join(solution, 'src', 'app');
for (const file of ['ticket.ts', 'sample-data.ts']) cpSync(join(workshop, file), join(app, file));
const append = join(overlay, 'src', 'app', 'ticket-list.append.ts');
if (existsSync(append)) {
  // ticket-list.ts gibt es erst ab AB 02; die Funktion ticketsWithStatus schreiben die Schüler selbst dazu.
  const list = readFileSync(join(workshop, 'ticket-list.ts'), 'utf8').replace(/\r\n/g, '\n').trimEnd();
  writeFileSync(join(app, 'ticket-list.ts'), list + '\n' + readFileSync(append, 'utf8').replace(/\r\n/g, '\n'));
}
rmSync(join(app, 'ticket-list.append.ts'), { force: true });

// 4. Bauen
run(`${prefix}npm run build`, solution);

// 5. Browser-Test der Abläufe aus den Arbeitsblättern
if (withE2e) {
  if (!existsSync(join(here, 'e2e', 'node_modules'))) run('npm install --no-audit --no-fund', join(here, 'e2e'));
  run(`node verify.mjs ${stage ? `--stage=${stage}` : ''} ${prefix ? '--node26' : ''}`, join(here, 'e2e'));
  // Stimmen die Code-Teile im Arbeitsblatt mit der getesteten Stufe überein?
  run(`node check-text.mjs ${stage ?? 'ab04'}`, join(here, 'e2e'));
}
console.log('\nMusterlösung gebaut' + (withE2e ? ' und geprüft.' : '.'));
