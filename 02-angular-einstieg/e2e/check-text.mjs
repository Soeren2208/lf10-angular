// Prüft, ob die Code-Teile eines Arbeitsblatts mit dem getesteten Stand übereinstimmen.
// Aufruf: node check-text.mjs ab01   (läuft über build-solution.mjs --stage=ab01)
// Jede Stufe hat ihr eigenes Skript check-text-<stufe>.mjs.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const stage = process.argv[2];
const url = new URL(`./check-text-${stage}.mjs`, import.meta.url);
if (!stage || !existsSync(fileURLToPath(url))) {
  console.error(`Kein Textabgleich für die Stufe „${stage}“ vorhanden (check-text-${stage}.mjs).`);
  process.exit(1);
}
await import(url.href);
