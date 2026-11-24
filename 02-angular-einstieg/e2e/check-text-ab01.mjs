// Läuft über build-solution.mjs --stage=ab01.
// Prüft, ob die im Arbeitsblatt von Hand geschriebenen, vollständigen Dateien (Zustand nach Aufgabe 5 und nach Aufgabe 6)
// genau den Dateien entsprechen, die sich aus dem getesteten Endstand von AB 01 durch Weglassen der späteren Teile ergeben.
// Der Endstand selbst (Aufgabe 7) kommt direkt aus dem Projekt und braucht keinen Vergleich.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url)).replace(/\\/g, '/');
const mdx = fs.readFileSync(root + 'website/docs-tutorial-02/01-die-ticketkarte.mdx', 'utf8').replace(/\r\n/g, '\n');
const stageFile = (name) => fs.readFileSync(root + '02-angular-einstieg/stages/ab01/src/app/' + name, 'utf8').replace(/\r\n/g, '\n');
const normalize = (text) => text.replace(/[ \t]+$/gm, '').trim();

// Alle Code-Blöcke des Arbeitsblatts mit Titel
const blocks = [...mdx.matchAll(/```(\w+) title="([^"]+)"\n([\s\S]*?)```/g)].map((match) => ({ title: match[2], code: match[3] }));
const inline = (title) => blocks.filter((block) => block.title === title).map((block) => block.code);

// --- Erwartete Zustände, abgeleitet aus dem Endstand ------------------------------------------------
const finalTs = stageFile('ticket-card/ticket-card.ts');
const finalHtml = stageFile('ticket-card/ticket-card.html');

const withoutAssignee = {
  ts: finalTs
    .replace("import { assigneeName, isUrgent } from '../ticket';", "import { isUrgent } from '../ticket';")
    .replace('\n  protected assignee(): string {\n    return assigneeName(this.ticket());\n  }\n', ''),
  html: finalHtml.replace('    <span class="assignee">{{ assignee() }}</span>\n', ''),
};
const withoutUrgent = {
  ts: withoutAssignee.ts
    .replace("import { isUrgent } from '../ticket';\n", '')
    .replace('  protected urgent(): boolean {\n    return isUrgent(this.ticket());\n  }\n\n', ''),
  html: withoutAssignee.html
    .replace(' [class.urgent]="urgent()"', '')
    .replace('    @if (urgent()) {\n      <span class="tag-urgent">dringend</span>\n    }\n', ''),
};

const problems = [];
const expectBlock = (description, candidates, expected) => {
  const hit = candidates.find((code) => normalize(code) === normalize(expected));
  if (!hit) problems.push(`${description}: Kein Block im Arbeitsblatt entspricht dem erwarteten Zustand.\n--- erwartet:\n${expected}`);
};

const tsBlocks = inline('src/app/ticket-card/ticket-card.ts');
const htmlBlocks = inline('src/app/ticket-card/ticket-card.html');
expectBlock('ticket-card.ts nach Aufgabe 5', tsBlocks, withoutUrgent.ts);
expectBlock('ticket-card.ts nach Aufgabe 6', tsBlocks, withoutAssignee.ts);
expectBlock('ticket-card.html nach Aufgabe 5', htmlBlocks, withoutUrgent.html);
expectBlock('ticket-card.html nach Aufgabe 6', htmlBlocks, withoutAssignee.html);

// Aufgabe 4: die minimale App
const appBlocks = inline('src/app/app.ts');
if (!appBlocks.some((code) => code.includes('imports: [TicketCard]'))) problems.push('Aufgabe 4: app.ts ohne imports: [TicketCard]');

console.log(problems.length ? problems.join('\n\n') : 'Alle vollständigen Dateien im Arbeitsblatt stimmen mit den geprüften Zuständen von AB 01 überein.');
process.exit(problems.length ? 1 : 0);
