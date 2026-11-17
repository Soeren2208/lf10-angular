// Führt beide Prüfungen nacheinander aus und fasst das Ergebnis zusammen:
//   1. Typen  – tsc --noEmit  (prüft, ob der Compiler mit deinem Code zufrieden ist)
//   2. Tests  – vitest run    (prüft, ob dein Code das Richtige tut)
import { spawnSync } from 'node:child_process';

function run(title, command) {
  console.log(`\n=== ${title} ===`);
  const result = spawnSync(command, { stdio: 'inherit', shell: true });
  return result.status === 0;
}

const typesOk = run('Typen prüfen (tsc)', 'npx tsc --noEmit');
const testsOk = run('Tests ausführen (vitest)', 'npx vitest run');

console.log('\n=== Ergebnis ===');
console.log(`Typen: ${typesOk ? 'grün' : 'ROT'}`);
console.log(`Tests: ${testsOk ? 'grün' : 'ROT'}`);
process.exit(typesOk && testsOk ? 0 : 1);
