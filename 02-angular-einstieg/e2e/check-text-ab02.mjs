// Läuft über build-solution.mjs --stage=ab02 (und check-text.mjs ab02).
// Prüft, ob die im Arbeitsblatt von Hand geschriebenen, vollständigen Dateien (ticket-board.ts und ticket-board.html
// nach Aufgabe 3, 4, 5 und 6) genau den Dateien entsprechen, die sich aus dem getesteten Endstand von AB 02 durch
// Weglassen der späteren Teile ergeben. Der Endstand selbst kommt direkt aus dem Projekt (CodeFile).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\/g, '/');
const mdx = fs.readFileSync(root + 'website/docs-tutorial-02/02-das-board.mdx', 'utf8').replace(/\r\n/g, '\n');
const stageFile = (name) => fs.readFileSync(root + '02-angular-einstieg/stages/ab02/src/app/' + name, 'utf8').replace(/\r\n/g, '\n');
const normalize = (text) => text.replace(/[ \t]+$/gm, '').trim();

const problems = [];
// Ersetzt `from` durch `to` und meldet, wenn `from` nicht vorkommt (dann hat sich der Endstand geändert).
const cut = (text, from, to = '') => {
  if (!text.includes(from)) {
    problems.push(`Ableitung nicht möglich, Text nicht gefunden:\n${from}`);
    return text;
  }
  return text.replace(from, to);
};

const blocks = [...mdx.matchAll(/```(\w+) title="([^"]+)"\n([\s\S]*?)```/g)].map((match) => ({ title: match[2], code: match[3] }));
const inline = (title) => blocks.filter((block) => block.title === title).map((block) => block.code);
const expectBlock = (description, candidates, expected) => {
  if (!candidates.some((code) => normalize(code) === normalize(expected))) {
    problems.push(`${description}: Kein Block im Arbeitsblatt entspricht dem erwarteten Zustand.\n--- erwartet:\n${expected}`);
  }
};

// --- ticket-board.ts: Endstand (Aufgabe 6) rückwärts ------------------------------------------------
const tsFinal = stageFile('ticket-board/ticket-board.ts');

let tsSorted = tsFinal; // Zustand nach Aufgabe 5: sortiert, noch ohne Schalter
tsSorted = cut(tsSorted, "import { isUrgent } from '../ticket';\n");
tsSorted = cut(tsSorted, '  protected urgentOnly = false;\n');
tsSorted = cut(tsSorted, '    const tickets = this.urgentOnly ? this.tickets.filter(isUrgent) : this.tickets;\n');
tsSorted = cut(tsSorted, 'ticketsWithStatus(tickets, column.status)', 'ticketsWithStatus(this.tickets, column.status)');
tsSorted = cut(tsSorted, '\n  protected toggleUrgent(): void {\n    this.urgentOnly = !this.urgentOnly;\n  }\n');

let tsUnsorted = tsSorted; // Zustand nach Aufgabe 4: drei Spalten, noch ohne Sortierung
tsUnsorted = cut(tsUnsorted, "import { sortedByPriority, ticketsWithStatus } from '../ticket-list';", "import { ticketsWithStatus } from '../ticket-list';");
tsUnsorted = cut(tsUnsorted, 'sortedByPriority(ticketsWithStatus(this.tickets, column.status))', 'ticketsWithStatus(this.tickets, column.status)');
tsUnsorted = cut(tsUnsorted, '/** Je Spalte die Tickets, die dringendsten zuerst. */', '/** Je Spalte die Tickets mit dem passenden Stand. */');

let tsPlain = tsUnsorted; // Zustand nach Aufgabe 3: alle Tickets in einer Spalte
tsPlain = cut(tsPlain, "import type { Status } from '../ticket';\n");
tsPlain = cut(tsPlain, "import { ticketsWithStatus } from '../ticket-list';\n");
tsPlain = cut(tsPlain, "import { STATUS_LABEL } from '../ticket-labels';\n");
tsPlain = tsPlain.replace(/\/\*\* Die drei Spalten[\s\S]*?\];\n\n/, '');
tsPlain = tsPlain.replace(/\n  \/\*\* Je Spalte[\s\S]*?\n  }\n/, '');

const tsBlocks = inline('src/app/ticket-board/ticket-board.ts');
expectBlock('ticket-board.ts nach Aufgabe 3', tsBlocks, tsPlain);
expectBlock('ticket-board.ts nach Aufgabe 4', tsBlocks, tsUnsorted);
expectBlock('ticket-board.ts nach Aufgabe 5', tsBlocks, tsSorted);

// --- ticket-board.html -----------------------------------------------------------------------------
const htmlFinal = stageFile('ticket-board/ticket-board.html');
let htmlSwitch = cut(htmlFinal, '      } @empty {\n        <p class="empty">Keine Tickets</p>\n      }\n', '      }\n');
const toolbar = htmlSwitch.slice(0, htmlSwitch.indexOf('<div class="columns">'));
const htmlColumns = htmlSwitch.replace(toolbar, '');
const htmlBlocks = inline('src/app/ticket-board/ticket-board.html');
expectBlock('ticket-board.html nach Aufgabe 4', htmlBlocks, htmlColumns);
expectBlock('ticket-board.html nach Aufgabe 6', htmlBlocks, htmlSwitch);
if (!htmlBlocks.some((code) => code.includes('@for (ticket of tickets; track ticket.id)'))) {
  problems.push('ticket-board.html nach Aufgabe 3: Block mit @for über tickets fehlt.');
}

console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Dateien im Arbeitsblatt stimmen mit den geprüften Zuständen von AB 02 überein.');
process.exit(problems.length ? 1 : 0);
