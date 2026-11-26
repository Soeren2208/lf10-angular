import React from 'react';
import styles from './styles.module.css';

/**
 * ClassDiagram — eine Klasse in UML-Schreibweise (Name, Attribute, Methoden), hell und dunkel lesbar.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <ClassDiagram
 *     name="TicketStore"
 *     attributes={[
 *       {text: '- tickets: readonly Ticket[]'},
 *       {text: '- listeners: Set<Listener>', later: 'Aufgabe 4'},
 *     ]}
 *     methods={[
 *       {text: '+ constructor(tickets?: readonly Ticket[])'},
 *       {text: '+ onChange(listener: Listener): () => void', later: 'Aufgabe 4'},
 *     ]}
 *   />
 *
 * Mit `later` markierte Zeilen erscheinen grau mit dem Hinweis, wann sie dazukommen.
 * Die Zeichenbreite ist fest (CW), jedes Textstück bekommt textLength, damit das Bild in jeder Monospace-Schrift gleich aussieht.
 */

const CW = 8.4; // Breite eines Zeichens
const ROW = 26; // Höhe einer Zeile
const PAD = 16;

export default function ClassDiagram({name, attributes = [], methods = []}) {
  const all = [...attributes, ...methods];
  const longest = Math.max(name.length, ...all.map((row) => row.text.length));
  const hasLater = all.some((row) => row.later);
  const textWidth = longest * CW;
  const noteWidth = hasLater ? 110 : 0;
  const width = PAD * 2 + textWidth + noteWidth;
  const nameHeight = 40;
  const attributesHeight = Math.max(attributes.length, 1) * ROW + PAD;
  const methodsHeight = Math.max(methods.length, 1) * ROW + PAD;
  const height = nameHeight + attributesHeight + methodsHeight;

  const rows = (list, top) =>
    list.map((row, index) => {
      const y = top + PAD / 2 + index * ROW + 18;
      const cls = row.later ? styles.later : styles.member;
      return (
        <g key={row.text}>
          <text x={PAD} y={y} textLength={row.text.length * CW} lengthAdjust="spacingAndGlyphs" className={cls} style={{whiteSpace: 'pre'}}>
            {row.text}
          </text>
          {row.later && (
            <text x={width - PAD} y={y} textAnchor="end" className={styles.note}>
              {row.later}
            </text>
          )}
        </g>
      );
    });

  const description = [
    `Klasse ${name}.`,
    attributes.length ? `Attribute: ${attributes.map((a) => a.text).join('; ')}.` : '',
    methods.length ? `Methoden: ${methods.map((m) => m.text).join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure className={styles.figure}>
      <div className={styles.scroll}>
        <svg className={styles.svg} style={{maxWidth: width}} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={description}>
          <rect x="1" y="1" width={width - 2} height={height - 2} rx="6" className={styles.box} />
          <text x={width / 2} y="26" textAnchor="middle" className={styles.name}>
            {name}
          </text>
          <line x1="1" y1={nameHeight} x2={width - 1} y2={nameHeight} className={styles.divider} />
          {rows(attributes, nameHeight)}
          <line x1="1" y1={nameHeight + attributesHeight} x2={width - 1} y2={nameHeight + attributesHeight} className={styles.divider} />
          {rows(methods, nameHeight + attributesHeight)}
        </svg>
      </div>
    </figure>
  );
}
