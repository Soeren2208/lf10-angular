// Veröffentlicht den Starter als eigenes Repository, das die Schüler klonen.
//
//   node publish-starter.mjs            kopiert den Starter in den lokalen Klon und committet
//   node publish-starter.mjs --push     ... und schiebt den Commit nach GitHub
//
// Der lokale Klon liegt neben diesem Repository (../lf10-typescript-werkstatt) und wird bei Bedarf angelegt.
// Der Ordner `starter/` hier bleibt die einzige Quelle: Im Klon wird nie von Hand gearbeitet.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REMOTE = 'https://github.com/Soeren2208/lf10-typescript-werkstatt.git';
const here = dirname(fileURLToPath(import.meta.url));
const courseRepo = resolve(here, '..');
const starter = join(here, 'starter');
const target = resolve(courseRepo, '..', 'lf10-typescript-werkstatt');
const push = process.argv.includes('--push');

function git(args, cwd = target) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(`git ${args.join(' ')} fehlgeschlagen:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
    process.exit(1);
  }
  return (r.stdout ?? '').trim();
}

// 1. Gemeinsame Dateien aus der Lösung in den Starter übernehmen.
const sync = spawnSync('node', [join(here, 'sync-starter.mjs')], { stdio: 'inherit' });
if (sync.status !== 0) process.exit(1);

// 2. Klon anlegen, falls es ihn noch nicht gibt.
if (!existsSync(join(target, '.git'))) {
  console.log(`Klone ${REMOTE} nach ${target} …`);
  const r = spawnSync('git', ['clone', REMOTE, target], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
}
if (spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: target }).status === 0) {
  git(['checkout', 'main']);
} else {
  // Frisch angelegtes, noch leeres Repository: den ersten Zweig main nennen.
  git(['symbolic-ref', 'HEAD', 'refs/heads/main']);
}

// 3. Inhalt des Klons durch den Starter ersetzen (ohne node_modules und Testberichte).
for (const entry of readdirSync(target)) {
  if (entry !== '.git') rmSync(join(target, entry), { recursive: true, force: true });
}
cpSync(starter, target, {
  recursive: true,
  filter: (source) => !/[\\/](node_modules|\.vitest)([\\/]|$)/.test(source),
});

// 4. Committen, wenn sich etwas geändert hat.
git(['add', '-A']);
if (git(['status', '--porcelain']) === '') {
  console.log('Keine Änderung am Starter, nichts zu committen.');
} else {
  const messageFile = join(mkdtempSync(join(tmpdir(), 'publish-')), 'message.txt');
  writeFileSync(messageFile, 'Starter aktualisiert\n');
  git(['commit', '-F', messageFile]);
  console.log('Commit angelegt.');
}

if (push) {
  git(['push', '-u', 'origin', 'main']);
  console.log(`Veröffentlicht: ${REMOTE}`);
} else {
  console.log(`Nicht gepusht. Zum Veröffentlichen: node publish-starter.mjs --push`);
}
