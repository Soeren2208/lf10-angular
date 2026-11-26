// Läuft über build-solution.mjs --stage=ab02 (und check-text.mjs ab02).
// Prüft, ob die im Arbeitsblatt von Hand geschriebenen, vollständigen Dateien (ticket-board.ts und ticket-board.html
// nach den Aufgaben 3 bis 7) genau den Dateien entsprechen, die sich aus dem getesteten Endstand von AB 02 durch
// Weglassen der späteren Teile ergeben, und ob die hervorgehobenen Zeilen (Aufträge „Ergänze“) genau die Zeilen sind,
// die sich gegenüber dem vorigen Stand ändern. Mit --print werden die erwarteten Hervorhebungen ausgegeben.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\/g, '/');
const mdx = fs.readFileSync(root + 'website/docs-tutorial-02/02-das-board.mdx', 'utf8').replace(/\r\n/g, '\n');
const stageFile = (name) => fs.readFileSync(root + '02-angular-einstieg/stages/ab02/src/app/' + name, 'utf8').replace(/\r\n/g, '\n');
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

// --- ticket-board.ts: Endstand (Aufgabe 6) rückwärts ------------------------------------------------
const tsFinal = stageFile('ticket-board/ticket-board.ts');

let tsSorted = tsFinal; // Zustand nach Aufgabe 5: sortiert, noch ohne Schalter
tsSorted = cut(tsSorted, "import { isUrgent } from '../ticket';\n");
tsSorted = cut(tsSorted, '  protected urgentOnly = false;\n');
tsSorted = cut(
  tsSorted,
  '    const tickets = this.urgentOnly ? this.tickets.filter(isUrgent) : this.tickets;\n    return sortedByPriority(ticketsWithStatus(tickets, status));',
  '    return sortedByPriority(ticketsWithStatus(this.tickets, status));',
);
tsSorted = cut(tsSorted, '\n  protected toggleUrgent(): void {\n    this.urgentOnly = !this.urgentOnly;\n  }\n');

let tsUnsorted = tsSorted; // Zustand nach Aufgabe 4: drei Spalten, noch ohne Sortierung
tsUnsorted = cut(tsUnsorted, "import { sortedByPriority, ticketsWithStatus } from '../ticket-list';", "import { ticketsWithStatus } from '../ticket-list';");
tsUnsorted = cut(tsUnsorted, 'sortedByPriority(ticketsWithStatus(this.tickets, status))', 'ticketsWithStatus(this.tickets, status)');
tsUnsorted = cut(tsUnsorted, '/** Die Tickets eines Standes, die dringendsten zuerst. */', '/** Die Tickets mit dem passenden Stand. */');

let tsPlain = tsUnsorted; // Zustand nach Aufgabe 3: alle Tickets in einer Spalte
tsPlain = cut(tsPlain, "import type { Status } from '../ticket';\n");
tsPlain = cut(tsPlain, "import { ticketsWithStatus } from '../ticket-list';\n");
tsPlain = tsPlain.replace(/\n  \/\*\* Die Tickets mit[\s\S]*?\n  }\n/, '');

// So legt die Angular-CLI die Komponente an (Aufgabe 1):
const cliBoardTs = [
  "import { Component } from '@angular/core';",
  '',
  '@Component({',
  '  imports: [],',
  "  selector: 'app-ticket-board',",
  "  styleUrl: './ticket-board.css',",
  "  templateUrl: './ticket-board.html',",
  '})',
  'export class TicketBoard {}',
].join('\n');

// --- ticket-board.html ------------------------------------------------------------------------------
const htmlFinal = stageFile('ticket-board/ticket-board.html');
const emptyBlock = '    } @empty {\n      <p class="empty">Keine Tickets</p>\n    }\n';
if (htmlFinal.split(emptyBlock).length !== 4) problems.push('Ableitung nicht möglich: Der @empty-Block steht nicht dreimal im Endstand.');
const htmlSwitch = htmlFinal.split(emptyBlock).join('    }\n');
const toolbar = htmlSwitch.slice(0, htmlSwitch.indexOf('<div class="columns">'));
const htmlColumns = htmlSwitch.replace(toolbar, ''); // Aufgabe 4: drei Spalten, noch ohne Schalter
const secondSection = htmlColumns.indexOf('\n  <section class="column progress">');
if (secondSection < 0) problems.push('Ableitung nicht möglich: Die zweite Spalte steht nicht im Endstand.');
const htmlOne = htmlColumns.slice(0, secondSection).trimEnd() + '\n</div>\n'; // Aufgabe 4, erster Schritt: nur die Spalte „Offen“
const htmlPlain = ['<div class="column">', '  @for (ticket of tickets; track ticket.id) {', '    <app-ticket-card [ticket]="ticket" />', '  }', '</div>'].join('\n');

// --- Blöcke des Arbeitsblatts -----------------------------------------------------------------------
const blocks = [...mdx.matchAll(/```(\w+) title="([^"]+)"([^\n]*)\n([\s\S]*?)```/g)].map((match) => ({
  title: match[2],
  meta: (match[3].match(/\{([^}]*)\}/) ?? ['', ''])[1].replace(/\s/g, ''),
  code: match[4],
}));
const T = 'src/app/ticket-board/ticket-board.ts';
const H = 'src/app/ticket-board/ticket-board.html';
const expectations = [
  // [Titel, Nummer des Blocks, erwarteter Text, vorheriger Stand (null = keine Hervorhebung), Beschreibung]
  [T, 0, tsPlain, cliBoardTs, 'ticket-board.ts nach Aufgabe 3 (Ergänze)'],
  [H, 0, htmlPlain, null, 'ticket-board.html nach Aufgabe 3 (Tippe ab)'],
  [T, 1, tsUnsorted, tsPlain, 'ticket-board.ts nach Aufgabe 4 (Ergänze)'],
  [H, 1, htmlOne, htmlPlain, 'ticket-board.html nach Aufgabe 4, Schritt 1: eine Spalte (Ergänze)'],
  [H, 2, htmlColumns, null, 'ticket-board.html nach Aufgabe 4, Schritt 2: drei Spalten (Lösung)'],
  [T, 2, tsSorted, null, 'ticket-board.ts nach Aufgabe 5 (Lösung)'],
  [T, 3, tsFinal, tsSorted, 'ticket-board.ts nach Aufgabe 6 (Ergänze)'],
  [H, 3, htmlSwitch, htmlColumns, 'ticket-board.html nach Aufgabe 6 (Ergänze)'],
  [H, 4, htmlFinal, htmlSwitch, 'ticket-board.html nach Aufgabe 7 (Ergänze)'],
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
  console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Dateien im Arbeitsblatt stimmen mit den geprüften Zuständen von AB 02 überein.');
  process.exit(problems.length ? 1 : 0);
} else if (problems.length) {
  console.log('\n' + problems.join('\n\n'));
}
