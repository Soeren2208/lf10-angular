// Läuft über build-solution.mjs (Endstand, ohne --stage) und check-text.mjs ab04.
// Prüft, ob die im Arbeitsblatt von Hand geschriebenen, vollständigen Dateien genau den Dateien entsprechen, die sich aus
// dem getesteten Endstand (overlay/) durch Weglassen der späteren Teile ergeben, und ob die hervorgehobenen Zeilen genau
// die Zeilen sind, die sich gegenüber dem vorigen Stand ändern. Mit --print werden die erwarteten Hervorhebungen ausgegeben.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\/g, '/');
const mdx = fs.readFileSync(root + 'website/docs-tutorial-02/04-ein-ticket-aufrufen.mdx', 'utf8').replace(/\r\n/g, '\n');
const readFile = (path) => fs.readFileSync(root + path, 'utf8').replace(/\r\n/g, '\n');
const final = (name) => readFile('02-angular-einstieg/overlay/src/app/' + name);
const stageAb03 = (name) => readFile('02-angular-einstieg/stages/ab03/src/app/' + name);
// Die von der CLI erzeugten Dateien stehen im gebauten Projekt von AB 03 (nach build-solution.mjs --stage=ab03).
const generated = (name) => {
  const path = root + '02-angular-einstieg/solution-ab03/src/app/' + name;
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : null;
};
const normalize = (text) => text.replace(/[ \t]+$/gm, '').trim();
const print = process.argv.includes('--print');

const problems = [];
const cut = (text, from, to = '') => {
  if (!text.includes(from)) {
    problems.push(`Ableitung nicht möglich, Text nicht gefunden:\n${from}`);
    return text;
  }
  return text.replace(from, to);
};

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

// --- Ticket-Ansicht ---------------------------------------------------------------------------------
const detailTsFinal = final('ticket-detail/ticket-detail.ts');
let detailTsService = cut(detailTsFinal, 'imports: [DatePipe, RouterLink],', 'imports: [DatePipe],');
detailTsService = cut(detailTsService, "import { RouterLink } from '@angular/router';\n");

let detailTsOwn = cut(detailTsService, "import { Component, computed, inject, input } from '@angular/core';", "import { Component, computed, input } from '@angular/core';");
detailTsOwn = cut(detailTsOwn, "import { assigneeName, isUrgent } from '../ticket';\n", "import { sampleTickets } from '../sample-data';\nimport { assigneeName, isUrgent } from '../ticket';\n");
detailTsOwn = cut(detailTsOwn, "import { TicketService } from '../ticket.service';\n", "import { findTicket } from '../ticket-list';\n");
detailTsOwn = cut(detailTsOwn, '  private readonly service = inject(TicketService);\n\n');
detailTsOwn = cut(detailTsOwn, 'this.service.find(number)', 'findTicket(sampleTickets, number)');

const detailHtmlFinal = final('ticket-detail/ticket-detail.html');
let detailHtmlFacts = cut(detailHtmlFinal, '    <a class="back" routerLink="/">← Zurück zum Board</a>\n');
const elseAt = detailHtmlFacts.indexOf('} @else {');
if (elseAt < 0) problems.push('Ableitung nicht möglich: @else im Endstand der Ticket-Ansicht nicht gefunden.');
detailHtmlFacts = detailHtmlFacts.slice(0, elseAt) + '}\n';

// So legt die Angular-CLI die Komponente an (Aufgabe 1):
const cliDetailTs = [
  "import { Component } from '@angular/core';",
  '',
  '@Component({',
  '  imports: [],',
  "  selector: 'app-ticket-detail',",
  "  styleUrl: './ticket-detail.css',",
  "  templateUrl: './ticket-detail.html',",
  '})',
  'export class TicketDetail {}',
].join('\n');

// --- Board ----------------------------------------------------------------------------------------
const boardTsFinal = final('ticket-board/ticket-board.ts');
let boardTsService = cut(boardTsFinal, "import { Router } from '@angular/router';\n");
boardTsService = cut(boardTsService, '  private readonly router = inject(Router);\n');
boardTsService = cut(
  boardTsService,
  [
    '',
    '  protected openTicket(input: string): void {',
    '    const number = input.trim();',
    "    if (number !== '') {",
    "      void this.router.navigate(['/tickets', number]);",
    '    }',
    '  }',
    '',
  ].join('\n'),
);

// --- Blöcke des Arbeitsblatts -----------------------------------------------------------------------
const blocks = [...mdx.matchAll(/```(\w+) title="([^"]+)"([^\n]*)\n([\s\S]*?)```/g)].map((match) => ({
  title: match[2],
  meta: (match[3].match(/\{([^}]*)\}/) ?? ['', ''])[1].replace(/\s/g, ''),
  code: match[4],
}));
const expectations = [
  // [Titel, Nummer des Blocks, erwarteter Text, vorheriger Stand (null = keine Hervorhebung prüfen), Beschreibung]
  ['src/app/app.routes.ts', 0, final('app.routes.ts'), null,'app.routes.ts (Aufgabe 1)'],
  ['src/app/app.ts', 0, final('app.ts'), stageAb03('app.ts'), 'app.ts (Aufgabe 1)'],
  ['src/app/app.html', 0, final('app.html'), stageAb03('app.html'), 'app.html (Aufgabe 1)'],
  ['src/app/app.config.ts', 0, final('app.config.ts'), generated('app.config.ts'), 'app.config.ts (Aufgabe 2)'],
  ['src/app/ticket-detail/ticket-detail.ts', 0, detailTsOwn, cliDetailTs, 'ticket-detail.ts nach Aufgabe 2'],
  ['src/app/ticket-detail/ticket-detail.html', 0, detailHtmlFacts, null, 'ticket-detail.html nach Aufgabe 2'],
  ['src/app/ticket-card/ticket-card.ts', 0, final('ticket-card/ticket-card.ts'), stageAb03('ticket-card/ticket-card.ts'), 'ticket-card.ts (Aufgabe 3)'],
  ['src/app/ticket-card/ticket-card.html', 0, final('ticket-card/ticket-card.html'), stageAb03('ticket-card/ticket-card.html'), 'ticket-card.html (Aufgabe 3)'],
  ['src/app/ticket.service.ts', 0, final('ticket.service.ts'), null, 'ticket.service.ts (Aufgabe 4)'],
  ['src/app/ticket-board/ticket-board.ts', 0, boardTsService, stageAb03('ticket-board/ticket-board.ts'), 'ticket-board.ts nach Aufgabe 4'],
  ['src/app/ticket-detail/ticket-detail.ts', 1, detailTsService, detailTsOwn, 'ticket-detail.ts nach Aufgabe 4'],
  ['src/app/ticket-detail/ticket-detail.ts', 2, detailTsFinal, detailTsService, 'ticket-detail.ts nach Aufgabe 5'],
  ['src/app/ticket-detail/ticket-detail.html', 1, detailHtmlFinal, detailHtmlFacts, 'ticket-detail.html nach Aufgabe 5'],
  ['src/app/ticket-board/ticket-board.ts', 1, boardTsFinal, boardTsService, 'ticket-board.ts nach Aufgabe 6'],
  ['src/app/ticket-board/ticket-board.html', 0, final('ticket-board/ticket-board.html'), stageAb03('ticket-board/ticket-board.html'), 'ticket-board.html (Aufgabe 6)'],
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
  } else if (!print && block.meta !== '') {
    problems.push(`${description}: Dieser Block soll keine Hervorhebung haben.`);
  }
}

if (!print) {
  console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Dateien im Arbeitsblatt stimmen mit den geprüften Zuständen von AB 04 überein.');
  process.exit(problems.length ? 1 : 0);
} else if (problems.length) {
  console.log('\n' + problems.join('\n\n'));
}
