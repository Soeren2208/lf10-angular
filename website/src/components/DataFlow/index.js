import React from 'react';
import styles from './styles.module.css';

/**
 * DataFlow — zeigt, wie ein Wert zwischen zwei Komponenten wandert: echter Code, farbig verbunden.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <DataFlow variant="input" />    Eingang: Die App gibt der Karte ein Ticket (AB 01)
 *   <DataFlow variant="output" />   Ausgang: Die Karte meldet dem Board einen neuen Stand (AB 03)
 *
 * Farben: orange = ein Name, der auf beiden Seiten gleich sein muss; blau = der Wert, der wandert.
 * Die Zeichenbreite ist fest (CW); jedes Textstück wird mit textLength auf seine Breite gesetzt,
 * damit die Linien in jeder Monospace-Schrift an den richtigen Stellen enden.
 */

const CW = 8.4; // Breite eines Zeichens im Code
const LEFT = 10;
const RIGHT = 510;
const PANEL_W = 480;
const PANEL_TOP = 40;
const PANEL_H = 295;
const CODE_INDENT = 56; // Abstand von Kasten-Rand zum Code (Platz für die Nummer)
const ROW_Y = [150, 270]; // Grundlinie der beiden Codezeilen

const VARIANTS = {
  input: {
    title: 'Der Weg des Tickets',
    description:
      'Die App hält die Tickets in tickets. In app.html gibt sie mit [ticket]="tickets[3]" das vierte Ticket an den Eingang ticket der Karte. Der Name in den eckigen Klammern ist derselbe wie der des Eingangs. Die Karte liest den Wert mit ticket().',
    left: {caption: 'App (Eltern)'},
    right: {caption: 'Karte (Kind)'},
    rows: [
      // [Seite, Zeile, Nummer, Dateiname, Teile]
      ['left', 0, 2, 'app.html', ['<app-ticket-card ', {id: 'nameL', text: '[ticket]', mark: 'name'}, '="', {id: 'valL', text: 'tickets[3]', mark: 'value'}, '" />']],
      ['left', 1, 1, 'app.ts', ['protected readonly ', {id: 'valSrc', text: 'tickets', mark: 'value'}, ' = sampleTickets;']],
      ['right', 0, 3, 'ticket-card.ts', ['readonly ', {id: 'nameR', text: 'ticket', mark: 'name'}, ' = input.required<Ticket>();']],
      ['right', 1, 4, 'ticket-card.html', ['<h3>{{ ', {id: 'read', text: 'ticket()', mark: 'name'}, '.title }}</h3>']],
    ],
    links: [
      {type: 'bracket', from: 'nameL', to: 'nameR', label: 'gleicher Name', mark: 'name'},
      {type: 'arrow', from: 'valSrc', fromAnchor: 'top', to: 'valL', toAnchor: 'bottom', label: 'aus der Klasse', mark: 'value', side: 'left', offset: -7},
      {type: 'arrow', from: 'valL', fromAnchor: 'bottom', to: 'read', toAnchor: 'top', label: 'wird übergeben', mark: 'value', side: 'right', offset: 7},
    ],
  },
  output: {
    title: 'Der Weg der Meldung',
    description:
      'Die Karte schickt mit statusChange.emit(move.to) den neuen Stand über ihren Ausgang statusChange ab. Das Board hört mit (statusChange) auf diesen Ausgang, bekommt den Wert als $event und gibt ihn an changeStatus weiter. Der Name statusChange ist auf beiden Seiten derselbe.',
    left: {caption: 'Board (Eltern)'},
    right: {caption: 'Karte (Kind)'},
    rows: [
      ['left', 0, 3, 'ticket-board.html', [{id: 'nameL', text: '(statusChange)', mark: 'name'}, '="changeStatus(ticket.id, ', {id: 'event', text: '$event', mark: 'value'}, ')"']],
      ['left', 1, 4, 'ticket-board.ts', ['changeStatus(id: number, ', {id: 'param', text: 'status', mark: 'value'}, ': Status)']],
      ['right', 0, 2, 'ticket-card.ts', ['readonly ', {id: 'nameR', text: 'statusChange', mark: 'name'}, ' = output<Status>();']],
      ['right', 1, 1, 'ticket-card.html', ['(click)="statusChange.emit(', {id: 'emit', text: 'move.to', mark: 'value'}, ')"']],
    ],
    links: [
      {type: 'bracket', from: 'nameL', to: 'nameR', label: 'gleicher Name', mark: 'name'},
      {type: 'arrow', from: 'emit', fromAnchor: 'top', to: 'event', toAnchor: 'bottom', label: 'der neue Stand', mark: 'value', side: 'right', offset: 8},
      {type: 'arrow', from: 'event', fromAnchor: 'bottom', to: 'param', toAnchor: 'top', label: 'wird weitergereicht', mark: 'value', side: 'left', offset: -8},
    ],
  },
};

/** Legt die Codezeilen aus: Position und Breite jedes Teils. */
function layoutRows(rows) {
  const tokens = {};
  const lines = rows.map(([side, rowIndex, badge, file, parts]) => {
    const panelX = side === 'left' ? LEFT : RIGHT;
    const y = ROW_Y[rowIndex];
    let x = panelX + CODE_INDENT;
    const items = parts.map((part) => {
      const item = typeof part === 'string' ? {text: part} : {...part};
      item.x = x;
      item.y = y;
      item.w = item.text.length * CW;
      x += item.w;
      if (item.id) tokens[item.id] = item;
      return item;
    });
    return {side, panelX, y, badge, file, items};
  });
  return {tokens, lines};
}

const anchor = (token, where) => ({x: token.x + token.w / 2, y: where === 'top' ? token.y - 21 : token.y + 10});

export default function DataFlow({variant = 'input'}) {
  const config = VARIANTS[variant];
  if (!config) throw new Error(`DataFlow: unbekannte Variante "${variant}"`);
  const {tokens, lines} = layoutRows(config.rows);
  const uid = `flow-${variant}`;

  return (
    <figure className={styles.figure}>
      <div className={styles.scroll}>
        <svg
          className={styles.svg}
          viewBox="0 0 1000 350"
          role="img"
          aria-labelledby={`${uid}-title ${uid}-desc`}
          fontFamily="var(--ifm-font-family-monospace)"
        >
          <title id={`${uid}-title`}>{config.title}</title>
          <desc id={`${uid}-desc`}>{config.description}</desc>
          <defs>
            {['name', 'value'].map((mark) => (
              <marker key={mark} id={`${uid}-arrow-${mark}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className={styles[`${mark}Fill`]} />
              </marker>
            ))}
          </defs>

          {/* Die beiden Komponenten und die Wand dazwischen */}
          {[
            [LEFT, config.left.caption, 'start'],
            [RIGHT, config.right.caption, 'start'],
          ].map(([x, caption]) => (
            <g key={x}>
              <rect x={x} y={PANEL_TOP} width={PANEL_W} height={PANEL_H} rx="12" className={styles.panel} />
              <text x={x + 20} y={PANEL_TOP + PANEL_H - 16} className={styles.caption}>
                {caption}
              </text>
            </g>
          ))}
          <line x1="500" y1={PANEL_TOP} x2="500" y2={PANEL_TOP + PANEL_H} className={styles.wall} />

          {/* Codezeilen */}
          {lines.map((line) => (
            <g key={`${line.side}${line.y}`}>
              <circle cx={line.panelX + 26} cy={line.y - 5} r="12" className={styles.badge} />
              <text x={line.panelX + 26} y={line.y - 0.5} textAnchor="middle" className={styles.badgeText}>
                {line.badge}
              </text>
              <text x={line.panelX + PANEL_W - 18} y={line.y - 32} textAnchor="end" className={styles.file}>
                {line.file}
              </text>
              {line.items.map((item, index) => (
                <g key={index}>
                  {item.mark && <rect x={item.x - 1} y={item.y - 16} width={item.w + 2} height="22" rx="5" className={styles[`${item.mark}Box`]} />}
                  <text x={item.x} y={item.y} textLength={item.w} lengthAdjust="spacingAndGlyphs" className={styles.code} style={{whiteSpace: 'pre'}}>
                    {item.text}
                  </text>
                </g>
              ))}
            </g>
          ))}

          {/* Verbindungen */}
          {config.links.filter((link) => !link.hidden).map((link, index) => {
            const a = tokens[link.from];
            const b = tokens[link.to];
            if (link.type === 'bracket') {
              const ax = a.x + a.w / 2;
              const bx = b.x + b.w / 2;
              const top = 74;
              const r = 12;
              const startY = a.y - 21;
              return (
                <g key={index} className={styles[`${link.mark}Stroke`]}>
                  <path d={`M${ax} ${startY} V${top + r} Q${ax} ${top} ${ax + r} ${top} H${bx - r} Q${bx} ${top} ${bx} ${top + r} V${startY}`} fill="none" strokeWidth="2.5" markerStart={`url(#${uid}-arrow-${link.mark})`} markerEnd={`url(#${uid}-arrow-${link.mark})`} />
                  <text x={(ax + bx) / 2} y={top - 8} textAnchor="middle" className={styles[`${link.mark}Label`]}>
                    {link.label}
                  </text>
                </g>
              );
            }
            const from = anchor(a, link.fromAnchor);
            const to = anchor(b, link.toAnchor);
            const dx = link.offset ?? 0;
            const midY = (from.y + to.y) / 2;
            const path = `M${from.x + dx} ${from.y} C${from.x + dx} ${midY} ${to.x + dx} ${midY} ${to.x + dx} ${to.y}`;
            const labelX = (from.x + to.x) / 2 + dx + (link.side === 'right' ? 12 : -12);
            return (
              <g key={index} className={styles[`${link.mark}Stroke`]}>
                <path d={path} fill="none" strokeWidth="2.5" markerEnd={`url(#${uid}-arrow-${link.mark})`} />
                {link.label && (
                  <text x={labelX} y={midY + 4} textAnchor={link.side === 'right' ? 'start' : 'end'} className={styles[`${link.mark}Label`]}>
                    {link.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
