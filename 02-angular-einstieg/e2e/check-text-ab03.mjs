// Läuft über build-solution.mjs --stage=ab03 (und check-text.mjs ab03).
// Prüft, ob die im Arbeitsblatt von Hand geschriebenen, vollständigen Dateien (Karte und Board nach den Aufgaben 1 bis 5)
// genau den Dateien entsprechen, die sich aus dem getesteten Endstand von AB 03 durch Weglassen der späteren Teile ergeben,
// und ob die hervorgehobenen Zeilen genau die Zeilen sind, die sich gegenüber dem vorigen Stand ändern.
// Mit --print werden die erwarteten Hervorhebungen ausgegeben (zum Eintragen ins Arbeitsblatt).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\/g, '/');
const mdx = fs.readFileSync(root + 'website/docs-tutorial-02/03-status-und-zahlen.mdx', 'utf8').replace(/\r\n/g, '\n');
const read = (stage, name) => fs.readFileSync(`${root}02-angular-einstieg/stages/${stage}/src/app/${name}`, 'utf8').replace(/\r\n/g, '\n');
const normalize = (text) => text.replace(/[ \t]+$/gm, '').trim();
const print = process.argv.includes('--print');

const problems = [];
// Ersetzt `from` durch `to` und meldet, wenn `from` nicht vorkommt (dann hat sich der Endstand geändert).
const cut = (text, from, to = '') => {
  if (!text.includes(from)) {
    problems.push(`Ableitung nicht möglich, Text nicht gefunden:\n${from}`);
    return text;
  }
  return text.replace(from, to);
};

// --- Hervorhebung: Zeilen, die gegenüber dem vorigen Stand neu oder geändert sind (längste gemeinsame Teilfolge) ------
function changedLines(before, after) {
  const a = normalize(before).split('\n');
  const b = normalize(after).split('\n');
  const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const changed = [];
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      i++;
      j++;
    } else if (i < a.length && table[i + 1][j] >= table[i][j + 1]) {
      i++;
    } else {
      if (b[j].trim() !== '') changed.push(j + 1);
      j++;
    }
  }
  return changed;
}
function toRanges(lines, text) {
  const all = normalize(text).split('\n');
  // Liegen zwischen zwei geänderten Zeilen (1-basiert) nur Leerzeilen, gehören sie zu einem Bereich.
  const onlyBlankBetween = (first, second) => all.slice(first, second - 1).every((line) => line.trim() === '');
  const parts = [];
  for (let k = 0; k < lines.length; ) {
    let end = k;
    while (end + 1 < lines.length && onlyBlankBetween(lines[end], lines[end + 1])) end++;
    parts.push(lines[k] === lines[end] ? `${lines[k]}` : `${lines[k]}-${lines[end]}`);
    k = end + 1;
  }
  return parts.join(',');
}

// --- Karte ----------------------------------------------------------------------------------------
const cardTsFinal = read('ab03', 'ticket-card/ticket-card.ts');
let cardTsMethods = cut(cardTsFinal, "import { Component, computed, input, output } from '@angular/core';", "import { Component, input, output } from '@angular/core';");
cardTsMethods = cut(
  cardTsMethods,
  [
    '  protected readonly urgent = computed(() => isUrgent(this.ticket()));',
    '  protected readonly priorityText = computed(() => PRIORITY_LABEL[this.ticket().priority]);',
    '  protected readonly assignee = computed(() => assigneeName(this.ticket()));',
  ].join('\n'),
  [
    '  protected urgent(): boolean {',
    '    return isUrgent(this.ticket());',
    '  }',
    '',
    '  protected priorityText(): string {',
    '    return PRIORITY_LABEL[this.ticket().priority];',
    '  }',
    '',
    '  protected assignee(): string {',
    '    return assigneeName(this.ticket());',
    '  }',
  ].join('\n'),
);

// --- Board ----------------------------------------------------------------------------------------
const boardTsFinal = read('ab03', 'ticket-board/ticket-board.ts');
const timer = [
  '',
  '  constructor() {',
  '    // Ein Kollege übernimmt nach fünf Sekunden das Ticket 3.',
  "    setTimeout(() => this.changeStatus(3, 'in Arbeit'), 5000);",
  '  }',
].join('\n');

// Zustand nach Aufgabe 4: Signale, aber noch ohne computed. Die Auswahl „alle oder nur die dringenden“ steht in ticketsOf.
let boardSignals = cut(boardTsFinal, "import { Component, computed, signal } from '@angular/core';", "import { Component, signal } from '@angular/core';");
boardSignals = cut(
  boardSignals,
  [
    '  /** Die Tickets, die das Board zeigt: alle oder nur die dringenden. Ändert sich ein Signal, rechnet es neu. */',
    '  private readonly visible = computed(() => (this.urgentOnly() ? this.tickets().filter(isUrgent) : this.tickets()));',
    '',
    '',
  ].join('\n'),
);
boardSignals = cut(
  boardSignals,
  '    return sortedByPriority(ticketsWithStatus(this.visible(), status));',
  '    const tickets = this.urgentOnly() ? this.tickets().filter(isUrgent) : this.tickets();\n    return sortedByPriority(ticketsWithStatus(tickets, status));',
);
boardSignals = cut(boardSignals, '  protected readonly urgentOnly = signal(false);\n', '  protected readonly urgentOnly = signal(false);\n' + timer + '\n');

let boardPlainTimer = cut(boardSignals, "import { Component, signal } from '@angular/core';", "import { Component } from '@angular/core';");
boardPlainTimer = cut(boardPlainTimer, 'protected readonly tickets = signal(sampleTickets);', 'protected tickets = sampleTickets;');
boardPlainTimer = cut(boardPlainTimer, 'protected readonly urgentOnly = signal(false);', 'protected urgentOnly = false;');
boardPlainTimer = cut(boardPlainTimer, 'this.urgentOnly() ? this.tickets().filter(isUrgent) : this.tickets();', 'this.urgentOnly ? this.tickets.filter(isUrgent) : this.tickets;');
boardPlainTimer = cut(boardPlainTimer, 'this.urgentOnly.update((value) => !value);', 'this.urgentOnly = !this.urgentOnly;');
boardPlainTimer = cut(boardPlainTimer, 'this.tickets.update((tickets) => withStatus(tickets, id, status));', 'this.tickets = withStatus(this.tickets, id, status);');
const boardPlain = cut(boardPlainTimer, timer + '\n', '');

const boardHtmlFinal = read('ab03', 'ticket-board/ticket-board.html');
const countLine = /      <span class="count">\{\{ ticketsOf\('[^']+'\)\.length \}\}<\/span>\n/g;
if ((boardHtmlFinal.match(countLine) ?? []).length !== 3) problems.push('Ableitung nicht möglich: Die Zähler stehen nicht dreimal im Endstand.');
let boardHtmlPlain = boardHtmlFinal.replace(countLine, '');
boardHtmlPlain = cut(boardHtmlPlain, '[checked]="urgentOnly()"', '[checked]="urgentOnly"');
const boardHtmlSignals = cut(boardHtmlPlain, '[checked]="urgentOnly"', '[checked]="urgentOnly()"');

// --- Erwartungen an die Blöcke des Arbeitsblatts -----------------------------------------------------
const blocks = [...mdx.matchAll(/```(\w+) title="([^"]+)"([^\n]*)\n([\s\S]*?)```/g)].map((match) => ({
  title: match[2],
  meta: (match[3].match(/\{([^}]*)\}/) ?? ['', ''])[1].replace(/\s/g, ''),
  code: match[4],
}));
const expectations = [
  // [Titel, Nummer des Blocks mit diesem Titel, erwarteter Text, vorheriger Stand (null = keine Hervorhebung prüfen), Beschreibung]
  ['src/app/ticket-card/ticket-card.ts', 0, cardTsMethods, read('ab02', 'ticket-card/ticket-card.ts'), 'ticket-card.ts nach Aufgabe 1'],
  ['src/app/ticket-card/ticket-card.html', 0, read('ab03', 'ticket-card/ticket-card.html'), read('ab02', 'ticket-card/ticket-card.html'), 'ticket-card.html nach Aufgabe 1'],
  ['src/app/ticket-board/ticket-board.ts', 0, boardPlain, read('ab02', 'ticket-board/ticket-board.ts'), 'ticket-board.ts nach Aufgabe 2'],
  ['src/app/ticket-board/ticket-board.html', 0, boardHtmlPlain, read('ab02', 'ticket-board/ticket-board.html'), 'ticket-board.html nach Aufgabe 2'],
  ['src/app/ticket-board/ticket-board.ts', 1, boardPlainTimer, boardPlain, 'ticket-board.ts nach Aufgabe 3 (Experiment)'],
  ['src/app/ticket-board/ticket-board.ts', 2, boardSignals, boardPlainTimer, 'ticket-board.ts nach Aufgabe 4 (Signals)'],
  ['src/app/ticket-board/ticket-board.html', 1, boardHtmlSignals, null, 'ticket-board.html nach Aufgabe 4 (Lösung)'],
  ['src/app/ticket-board/ticket-board.ts', 3, boardTsFinal, boardSignals, 'ticket-board.ts nach Aufgabe 5 (computed)'],
  ['src/app/ticket-card/ticket-card.ts', 1, cardTsFinal, null, 'ticket-card.ts nach Aufgabe 5 (Lösung)'],
];

for (const [title, index, expected, previous, description] of expectations) {
  const block = blocks.filter((candidate) => candidate.title === title)[index];
  if (!block) {
    problems.push(`${description}: Block Nr. ${index + 1} mit dem Titel ${title} fehlt im Arbeitsblatt.`);
    continue;
  }
  if (normalize(block.code) !== normalize(expected)) {
    problems.push(`${description}: Der Block entspricht nicht dem erwarteten Zustand.\n--- erwartet:\n${expected}`);
  }
  if (previous !== null) {
    const expectedMeta = toRanges(changedLines(previous, expected), expected);
    if (print) console.log(`${description}: {${expectedMeta}}`);
    else if (block.meta !== expectedMeta) problems.push(`${description}: Hervorhebung {${block.meta}} statt {${expectedMeta}}.`);
  }
}

// --- CSS-Ergänzungen: stehen am Ende der Dateien im Endstand ---------------------------------------
const cssBlocks = [...mdx.matchAll(/```css\n([\s\S]*?)```/g)].map((match) => normalize(match[1]));
for (const [file, label] of [
  ['ticket-card/ticket-card.css', 'ticket-card.css'],
  ['ticket-board/ticket-board.css', 'ticket-board.css'],
]) {
  const css = normalize(read('ab03', file));
  if (!cssBlocks.some((block) => css.endsWith(block))) problems.push(`${label}: Kein CSS-Block im Arbeitsblatt entspricht dem Ende der Datei im Endstand.`);
}

if (!print) {
  console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Dateien im Arbeitsblatt stimmen mit den geprüften Zuständen von AB 03 überein.');
  process.exit(problems.length ? 1 : 0);
} else if (problems.length) {
  console.log('\n' + problems.join('\n\n'));
}
