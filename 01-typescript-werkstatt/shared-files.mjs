// Welche Dateien in `solution/` und `starter/` identisch sind.
// Die Lösung ist die Quelle: `node sync-starter.mjs` kopiert diese Dateien in den Starter,
// `node verify-both.mjs` prüft, dass sie dort unverändert sind.
export const sharedFiles = [
  'package.json',
  'tsconfig.json',
  'tsconfig.errors.json',
  'vitest.config.ts',
  '.gitignore',
  'scripts/verify.mjs',
  'src/sample-data.ts',
  'src/test-helpers.ts',
  'src/types.check.ts',
  'src/ticket.test.ts',
  'src/ticket-list.test.ts',
  'src/ticket-store.test.ts',
  'explore/type-errors.ts',
  'explore/display.ts',
  'explore/load.ts',
];

// Nur im Starter (Platzhalter statt Lösung) bzw. nur in der Lösung:
export const differingFiles = ['src/ticket.ts', 'src/ticket-list.ts', 'src/ticket-store.ts'];
