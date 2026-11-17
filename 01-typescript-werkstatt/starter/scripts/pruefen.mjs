// Führt beide Prüfungen nacheinander aus und fasst das Ergebnis zusammen:
//   1. Typen  – tsc --noEmit  (prüft, ob der Compiler mit deinem Code zufrieden ist)
//   2. Tests  – vitest run    (prüft, ob dein Code das Richtige tut)
import { spawnSync } from 'node:child_process';

function lauf(titel, befehl) {
  console.log(`\n=== ${titel} ===`);
  const ergebnis = spawnSync(befehl, { stdio: 'inherit', shell: true });
  return ergebnis.status === 0;
}

const typenOk = lauf('Typen prüfen (tsc)', 'npx tsc --noEmit');
const testsOk = lauf('Tests ausführen (vitest)', 'npx vitest run');

console.log('\n=== Ergebnis ===');
console.log(`Typen: ${typenOk ? 'grün' : 'ROT'}`);
console.log(`Tests: ${testsOk ? 'grün' : 'ROT'}`);
process.exit(typenOk && testsOk ? 0 : 1);
