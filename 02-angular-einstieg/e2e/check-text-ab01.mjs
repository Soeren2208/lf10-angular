// Läuft über build-solution.mjs --stage=ab01 (und check-text.mjs ab01).
// Prüft, ob die im Arbeitsblatt von Hand geschriebenen, vollständigen Dateien (Zustände nach den Aufgaben 4, 5 und 6) genau
// den Dateien entsprechen, die sich aus dem getesteten Endstand von AB 01 durch Weglassen der späteren Teile ergeben, und ob
// die hervorgehobenen Zeilen (Aufträge „Ergänze“) genau die Zeilen sind, die sich gegenüber dem vorigen Stand ändern.
// Mit --print werden die erwarteten Hervorhebungen ausgegeben (zum Eintragen ins Arbeitsblatt).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\/g, '/');
const mdx = fs.readFileSync(root + 'website/docs-tutorial-02/01-die-ticketkarte.mdx', 'utf8').replace(/\r\n/g, '\n');
const stageFile = (name) => fs.readFileSync(root + '02-angular-einstieg/stages/ab01/src/app/' + name, 'utf8').replace(/\r\n/g, '\n');
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

// --- Karte: Endstand rückwärts ------------------------------------------------------------------
const finalTs = stageFile('ticket-card/ticket-card.ts');
const finalHtml = stageFile('ticket-card/ticket-card.html');

const withoutAssignee = {
  ts: cut(
    cut(finalTs, "import { assigneeName, isUrgent } from '../ticket';", "import { isUrgent } from '../ticket';"),
    '\n  protected assignee(): string {\n    return assigneeName(this.ticket());\n  }\n',
  ),
  html: cut(finalHtml, '    <span class="assignee">{{ assignee() }}</span>\n'),
};
const withoutUrgent = {
  ts: cut(
    cut(withoutAssignee.ts, "import { isUrgent } from '../ticket';\n"),
    '  protected urgent(): boolean {\n    return isUrgent(this.ticket());\n  }\n\n',
  ),
  html: cut(
    cut(withoutAssignee.html, ' [class.urgent]="urgent()"'),
    '    @if (urgent()) {\n      <span class="tag-urgent">dringend</span>\n    }\n',
  ),
};
// So legt die Angular-CLI die Komponente an (Aufgabe 4):
const cliCardTs = [
  "import { Component } from '@angular/core';",
  '',
  '@Component({',
  '  imports: [],',
  "  selector: 'app-ticket-card',",
  "  styleUrl: './ticket-card.css',",
  "  templateUrl: './ticket-card.html',",
  '})',
  'export class TicketCard {}',
].join('\n');

// --- App: Endstand (drei Karten) und der Zustand nach Aufgabe 4 -----------------------------------
const finalAppTs = stageFile('app.ts');
const finalAppHtml = stageFile('app.html');
let appTsBefore = cut(finalAppTs, "import { sampleTickets } from './sample-data';\n");
appTsBefore = cut(appTsBefore, 'export class App {\n  protected readonly tickets = sampleTickets;\n}', 'export class App {}');
const appHtmlBefore = cut(
  finalAppHtml,
  [
    '  <div class="preview">',
    '    <app-ticket-card [ticket]="tickets[3]" />',
    '    <app-ticket-card [ticket]="tickets[2]" />',
    '    <app-ticket-card [ticket]="tickets[5]" />',
    '  </div>',
    '',
  ].join('\n'),
  '  <app-ticket-card />\n',
);

// --- Blöcke des Arbeitsblatts ---------------------------------------------------------------------
const blocks = [...mdx.matchAll(/```(\w+) title="([^"]+)"([^\n]*)\n([\s\S]*?)```/g)].map((match) => ({
  title: match[2],
  meta: (match[3].match(/\{([^}]*)\}/) ?? ['', ''])[1].replace(/\s/g, ''),
  code: match[4],
}));
const expectations = [
  // [Titel, Nummer des Blocks, erwarteter Text, vorheriger Stand (null = keine Hervorhebung), Beschreibung]
  ['src/app/app.ts', 0, appTsBefore, null, 'app.ts nach Aufgabe 4'],
  ['src/app/app.html', 0, appHtmlBefore, null, 'app.html nach Aufgabe 4 (Tippe ab)'],
  ['src/app/ticket-card/ticket-card.ts', 0, cliCardTs, null, 'ticket-card.ts, von der CLI erzeugt'],
  ['src/app/ticket-card/ticket-card.ts', 1, withoutUrgent.ts, cliCardTs, 'ticket-card.ts nach Aufgabe 5 (Ergänze)'],
  ['src/app/ticket-card/ticket-card.html', 0, withoutUrgent.html, null, 'ticket-card.html nach Aufgabe 5 (Tippe ab)'],
  ['src/app/app.ts', 1, finalAppTs, appTsBefore, 'app.ts nach Aufgabe 5 (Ergänze)'],
  ['src/app/app.html', 1, finalAppHtml, appHtmlBefore, 'app.html nach Aufgabe 5 (Ergänze)'],
  ['src/app/ticket-card/ticket-card.ts', 2, withoutAssignee.ts, null, 'ticket-card.ts nach Aufgabe 6 (Lösung)'],
  ['src/app/ticket-card/ticket-card.html', 1, withoutAssignee.html, withoutUrgent.html, 'ticket-card.html nach Aufgabe 6 (Ergänze)'],
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
  console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Dateien im Arbeitsblatt stimmen mit den geprüften Zuständen von AB 01 überein.');
  process.exit(problems.length ? 1 : 0);
} else if (problems.length) {
  console.log('\n' + problems.join('\n\n'));
}
