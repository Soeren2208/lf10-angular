// Welche Dateien in `loesung/` und `starter/` identisch sind.
// Die Lösung ist die Quelle: `node sync-starter.mjs` kopiert diese Dateien in den Starter,
// `node pruefen-beide.mjs` prüft, dass sie dort unverändert sind.
export const gemeinsam = [
  'package.json',
  'tsconfig.json',
  'tsconfig.fehler.json',
  'vitest.config.ts',
  '.gitignore',
  'scripts/pruefen.mjs',
  'src/sample-data.ts',
  'src/test-hilfen.ts',
  'src/typen.check.ts',
  'src/ticket.test.ts',
  'src/ticket-list.test.ts',
  'src/ticket-store.test.ts',
  'explore/fehler-01.ts',
  'explore/anzeige.ts',
  'explore/laden.ts',
];

// Nur im Starter (Platzhalter statt Lösung) bzw. nur in der Lösung:
export const nurUnterschiedlich = ['src/ticket.ts', 'src/ticket-list.ts', 'src/ticket-store.ts'];
