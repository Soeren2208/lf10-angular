import React from 'react';
import CodeBlock from '@theme/CodeBlock';

/**
 * CodeFile — zeigt eine Datei aus einem getesteten Projekt, immer sichtbar (zum Abtippen oder Kopieren).
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   import stage from '@site/src/data/t2-stage-ab01.json';
 *
 *   <CodeFile data={stage} file="src/app/ticket-card/ticket-card.ts" />
 *
 * `data` wird von scripts/generate-solutions.mjs erzeugt (dasselbe Format wie bei Solution:
 * {dateien: [{pfad, sprache, inhalt}]}). Der Quelltext steht dadurch nur an einer Stelle,
 * im Projekt, und der Browser-Test prüft genau ihn.
 *
 * Optional: `title` (sonst der Dateipfad).
 */
export default function CodeFile({data, file, title}) {
  const entry = data?.dateien?.find((d) => d.pfad === file);
  if (!entry) {
    throw new Error(`CodeFile: Datei "${file}" nicht in den Daten gefunden.`);
  }
  return (
    <CodeBlock language={entry.sprache} title={title ?? entry.pfad}>
      {entry.inhalt}
    </CodeBlock>
  );
}
