// Browser-Test für die Musterlösung von Tutorial 02: führt die Abläufe aus den Arbeitsblättern durch.
// Aufruf über build-solution.mjs. Allein: node verify.mjs [--stage=ab01] [--node26]
// (das Projekt in ../solution bzw. ../solution-<stage> muss gebaut sein)
import { spawn, spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = dirname(fileURLToPath(import.meta.url));
const stageArg = process.argv.find((arg) => arg.startsWith('--stage='));
const stage = stageArg ? stageArg.slice('--stage='.length) : 'final';
const solution = join(here, '..', stage === 'final' ? 'solution' : `solution-${stage}`);
const prefix = process.argv.includes('--node26') ? 'npx -y -p node@26 ' : '';
const PORT = stage === 'final' ? 4311 : 4320;
const BASE = `http://127.0.0.1:${PORT}`;
// Windows: Edge ist vorhanden. Anderswo: BROWSER_CHANNEL=chrome setzen.
const channel = process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : 'chrome');

let failures = 0;
const check = (ok, text) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${text}`);
  if (!ok) failures++;
};

// --- Entwicklungsserver starten --------------------------------------------------------------
const server = spawn(`${prefix}npm start -- --port ${PORT} --host 127.0.0.1`, { cwd: solution, shell: true, stdio: 'ignore' });
function stopServer() {
  if (process.platform === 'win32') spawnSync(`taskkill /pid ${server.pid} /T /F`, { shell: true, stdio: 'ignore' });
  else server.kill('SIGTERM');
}
process.on('exit', stopServer);

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      const response = await fetch(BASE);
      if (response.ok) return;
    } catch {
      /* noch nicht bereit */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error('Der Entwicklungsserver ist nicht angesprungen.');
}
await waitForServer();

const browser = await chromium.launch({ channel, headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const problems = [];
page.on('pageerror', (error) => problems.push('Seitenfehler: ' + error.message));
page.on('console', (message) => {
  if (message.type() === 'error') problems.push('Konsole: ' + message.text());
});

// Die Anzeige aktualisiert sich über den Scheduler von Angular, nicht synchron: kurz warten, dann lesen.
const settle = () => page.waitForTimeout(200);
const card = (nr) => page.locator(`app-ticket-card:has(.ticket-id:text-is("#${nr}"))`);

// =================================================================================================
//  Stand am Ende von AB 01: drei Karten ohne Board
// =================================================================================================
async function checksAb01() {
  console.log('\nAB 01: Die Ticketkarte');
  await page.goto(BASE);
  await page.waitForSelector('app-ticket-card');
  check((await page.title()) === 'Ticket-Board', 'Der Seitentitel lautet „Ticket-Board“');
  check((await page.locator('html').getAttribute('lang')) === 'de', 'Die Seitensprache ist Deutsch');
  check((await page.locator('app-ticket-card').count()) === 3, 'Die Karte wird dreimal benutzt (drei Tickets)');
  // A_1 Nummer und Titel
  check((await card(4).locator('.card-title').innerText()) === 'E-Mail-Postfach der Geschäftsführung läuft voll', 'A_1: Nummer #4 und Titel stehen da');
  // A_2 Priorität
  check((await card(4).locator('.prio').innerText()) === 'Hoch', 'A_2: Priorität #4 ist „Hoch“');
  check((await card(3).locator('.prio').innerText()) === 'Mittel', 'A_2: Priorität #3 ist „Mittel“');
  // A_3 dringend
  check((await card(4).locator('.tag-urgent').count()) === 1, 'A_3: #4 (hoch, offen) trägt die Marke „dringend“');
  check((await card(4).locator('.card.urgent').count()) === 1, 'A_3: #4 hat die hervorgehobene Kachel');
  check((await card(3).locator('.tag-urgent').count()) === 0, 'A_3: #3 (mittel) ist nicht dringend');
  check((await card(6).locator('.prio').innerText()) === 'Hoch' && (await card(6).locator('.tag-urgent').count()) === 0, 'A_3: #6 (hoch, aber erledigt) ist nicht dringend');
  // A_4 / A_5 Bearbeiter
  check((await card(4).locator('.assignee').innerText()) === 'Jonas Beck', 'A_4: Bearbeiter von #4 ist „Jonas Beck“');
  check((await card(3).locator('.assignee').innerText()) === 'nicht zugewiesen', 'A_5: #3 ohne Bearbeiter zeigt „nicht zugewiesen“');
}

// =================================================================================================
//  Stand am Ende von AB 02: das Board mit drei Spalten, noch ohne Knöpfe und Zähler
// =================================================================================================
const column = (css) => page.locator(`.column.${css}`);
const idsIn = async (css) => (await column(css).locator('.ticket-id').allInnerTexts()).map((text) => text.replace('#', '')).join(',');

async function checksAb02() {
  console.log('\nAB 02: Das Board');
  await page.goto(BASE);
  await page.waitForSelector('.column');
  check((await page.locator('.column').count()) === 3, 'A_1: Drei Spalten');
  const titles = (await page.locator('.column-title').allInnerTexts()).map((text) => text.trim());
  check(titles.join('|') === 'Offen|In Arbeit|Erledigt', `A_1: Überschriften „Offen“, „In Arbeit“, „Erledigt“ (${titles.join('|')})`);
  check((await idsIn('open')) === '4,3,8,5', `A_2/A_3: Offen: #4, #3, #8, #5, dringendstes zuerst (${await idsIn('open')})`);
  check((await idsIn('progress')) === '2,7', `A_2/A_3: In Arbeit: #2, #7 (${await idsIn('progress')})`);
  check((await idsIn('done')) === '6,1', `A_2/A_3: Erledigt: #6, #1 (${await idsIn('done')})`);
  check((await page.locator('app-ticket-card').count()) === 8, 'Alle acht Tickets stehen auf dem Board');
  check((await page.locator('.tag-urgent').count()) === 2, 'Die Karten aus AB 01 funktionieren weiter: zwei dringende Tickets');
  check((await page.locator('.empty').count()) === 0, 'Ohne Auswahl ist keine Spalte leer');

  // A_4 nur dringende
  await page.getByLabel('Nur dringende Tickets zeigen').check();
  await settle();
  check((await idsIn('open')) === '4' && (await idsIn('progress')) === '2' && (await idsIn('done')) === '', 'A_4: Mit dem Schalter bleiben nur #4 und #2');
  // A_6 leere Spalte
  check((await column('done').locator('.empty').innerText()) === 'Keine Tickets', 'A_6: Die leere Spalte „Erledigt“ meldet „Keine Tickets“');
  check((await page.locator('.empty').count()) === 1, 'A_6: Nur die leere Spalte meldet es');
  // A_5 zurücknehmen
  await page.getByLabel('Nur dringende Tickets zeigen').uncheck();
  await settle();
  check((await idsIn('open')) === '4,3,8,5' && (await idsIn('done')) === '6,1', 'A_5: Ohne Schalter stehen wieder alle Tickets da');
  check((await page.locator('.empty').count()) === 0, 'A_5: Die Meldung „Keine Tickets“ ist wieder weg');
}

// =================================================================================================
//  Stand am Ende von AB 03: Stand ändern und Zahlen über den Spalten
// =================================================================================================
const countOf = async (css) => (await column(css).locator('.count').innerText()).trim();
const counts = async () => [await countOf('open'), await countOf('progress'), await countOf('done')].join('/');

async function checksAb03() {
  console.log('\nAB 03: Status und Zahlen');
  await page.goto(BASE);
  await page.waitForSelector('.column');
  // A_1 Knöpfe je Stand
  const labels = async (nr) => (await card(nr).getByRole('button').allInnerTexts()).join('|');
  check((await labels(3)) === 'In Arbeit →', `A_1: Ticket in „Offen“ hat einen Knopf (${await labels(3)})`);
  check((await labels(2)) === '← Offen|Erledigt →', `A_1: Ticket in „In Arbeit“ hat zwei Knöpfe (${await labels(2)})`);
  check((await labels(6)) === '← In Arbeit', `A_1: Ticket in „Erledigt“ hat einen Knopf (${await labels(6)})`);
  // A_3 Zahlen
  check((await counts()) === '4/2/2', `A_3: Zähler je Spalte 4/2/2 (${await counts()})`);
  // A_2 Stand ändern
  await card(3).getByRole('button', { name: 'In Arbeit →' }).click();
  await settle();
  check((await idsIn('progress')) === '2,3,7', `A_2: #3 steht sofort in „In Arbeit“, einsortiert nach Priorität (${await idsIn('progress')})`);
  check((await idsIn('open')) === '4,8,5', `A_2: #3 steht nicht mehr in „Offen“ (${await idsIn('open')})`);
  // A_4 Zahlen passen
  check((await counts()) === '3/3/2', `A_4: Zähler passen sich sofort an (${await counts()})`);
  await card(3).getByRole('button', { name: '← Offen' }).click();
  await settle();
  check((await idsIn('open')) === '4,3,8,5' && (await counts()) === '4/2/2', 'A_2/A_4: Zurück nach „Offen“, Zähler wieder 4/2/2');
  // A_5 nur dringende
  await page.getByLabel('Nur dringende Tickets zeigen').check();
  await settle();
  check((await counts()) === '1/1/0', `A_5: Mit dem Schalter zählen die Zähler, was zu sehen ist (${await counts()})`);
  await card(2).getByRole('button', { name: 'Erledigt →' }).click();
  await settle();
  check((await counts()) === '1/0/0' && (await idsIn('progress')) === '', `A_2/A_5: #2 wird erledigt, verschwindet bei aktivem Schalter, Zähler 1/0/0 (${await counts()})`);
  check((await page.locator('.empty').count()) === 2, 'Zwei leere Spalten melden „Keine Tickets“');
  await page.getByLabel('Nur dringende Tickets zeigen').uncheck();
  await settle();
  check((await idsIn('done')) === '2,6,1' && (await counts()) === '4/1/3', `Ohne Schalter steht #2 in „Erledigt“ (${await idsIn('done')}, ${await counts()})`);
}

// =================================================================================================
//  Endstand (AB 04)
// =================================================================================================
async function checksFinal() {
  console.log('\nBoard');
  await page.goto(BASE);
  await page.waitForSelector('.column');
  check((await page.title()) === 'Ticket-Board', 'Der Seitentitel lautet „Ticket-Board“');
  check((await page.locator('.column').count()) === 3, 'Drei Spalten');
  check((await column('open').locator('.column-title').innerText()).includes('Offen'), 'Spalte „Offen“ ist beschriftet');
  check((await counts()) === '4/2/2', `Zähler je Spalte 4/2/2 (gefunden: ${await counts()})`);
  check((await idsIn('open')) === '4,3,8,5', `Offen: dringendste zuerst, bei Gleichstand nach Nummer (${await idsIn('open')})`);
  check((await idsIn('progress')) === '2,7', `In Arbeit sortiert (${await idsIn('progress')})`);
  check((await idsIn('done')) === '6,1', `Erledigt sortiert (${await idsIn('done')})`);
  check((await page.locator('.tag-urgent').count()) === 2, 'Genau zwei Tickets sind dringend (#4 und #2)');
  check((await card(4).locator('.tag-urgent').count()) === 1 && (await card(2).locator('.tag-urgent').count()) === 1, 'Dringend sind #4 und #2');
  check((await card(6).locator('.tag-urgent').count()) === 0, 'Ein erledigtes Ticket mit Priorität hoch (#6) ist nicht dringend');
  check((await card(3).innerText()).includes('nicht zugewiesen'), 'Ein Ticket ohne Bearbeiter zeigt „nicht zugewiesen“ (#3)');
  check((await card(4).innerText()).includes('Jonas Beck'), 'Ein Ticket mit Bearbeiter zeigt den Namen (#4)');
  check((await card(4).locator('.prio').innerText()) === 'Hoch', 'Die Priorität steht als Text (#4: Hoch)');

  console.log('\nStatus ändern');
  await card(3).getByRole('button', { name: 'In Arbeit →' }).click();
  await settle();
  check((await idsIn('progress')) === '2,3,7', `#3 steht nach dem Klick sofort in „In Arbeit“ (${await idsIn('progress')})`);
  check((await counts()) === '3/3/2', `Zähler passen sich sofort an (${await counts()})`);
  check((await card(3).getByRole('button').count()) === 2, 'Eine Karte in „In Arbeit“ bietet zwei Wechsel (zurück, weiter)');
  await card(3).getByRole('button', { name: '← Offen' }).click();
  await settle();
  check((await idsIn('open')) === '4,3,8,5', 'Zurück nach „Offen“ funktioniert');

  console.log('\nNur dringende');
  await page.getByLabel('Nur dringende Tickets zeigen').check();
  await settle();
  check((await idsIn('open')) === '4' && (await idsIn('progress')) === '2' && (await idsIn('done')) === '', 'Mit dem Schalter bleiben nur #4 und #2');
  check((await counts()) === '1/1/0', `Die Zähler zählen, was zu sehen ist (${await counts()})`);
  check((await column('done').locator('.empty').innerText()) === 'Keine Tickets', 'Eine leere Spalte meldet „Keine Tickets“');
  await card(2).getByRole('button', { name: 'Erledigt →' }).click();
  await settle();
  check((await idsIn('progress')) === '', '#2 wird erledigt und verschwindet bei aktivem Schalter sofort');
  check((await counts()) === '1/0/0', `Zähler danach (${await counts()})`);
  await page.getByLabel('Nur dringende Tickets zeigen').uncheck();
  await settle();
  check((await idsIn('done')) === '2,6,1', `Ohne Schalter steht #2 in „Erledigt“ (${await idsIn('done')})`);

  console.log('\nTicket aufrufen');
  await card(4).getByRole('link', { name: 'Öffnen' }).click();
  await page.waitForURL('**/tickets/4');
  check((await page.locator('h1').innerText()) === 'Ticket #4', 'Das Ticket hat eine eigene Adresse (/tickets/4)');
  const facts = await page.locator('.facts').innerText();
  check(facts.includes('E-Mail-Postfach der Geschäftsführung läuft voll'), 'Titel steht da');
  check(facts.includes('Offen'), 'Stand steht da');
  check(facts.includes('Hoch') && facts.toLowerCase().includes('dringend'), 'Priorität und „dringend“ stehen da');
  check(facts.includes('Jonas Beck'), 'Bearbeiter steht da');
  check(facts.includes('04.11.2026'), 'Das Meldedatum steht als 04.11.2026 da');
  await page.getByRole('link', { name: '← Zurück zum Board' }).click();
  await page.waitForSelector('.column');
  check((await idsIn('done')) === '2,6,1', 'Zurück auf dem Board ist der Stand erhalten (der Service hält die Tickets)');

  await page.goto(`${BASE}/tickets/3`);
  await page.waitForSelector('.facts');
  const facts3 = await page.locator('.facts').innerText();
  check(facts3.includes('nicht zugewiesen') && facts3.includes('Drucker im Büro 2'), 'Die Adresse allein genügt (neu geladen, /tickets/3)');

  console.log('\nTicket nicht gefunden');
  await page.goto(BASE);
  await page.waitForSelector('.column');
  await page.getByLabel('Ticketnummer').fill('99');
  await page.getByRole('button', { name: 'Ticket öffnen' }).click();
  await page.waitForURL('**/tickets/99');
  check((await page.locator('h1').innerText()) === 'Ticket nicht gefunden', 'Nummer 99 gibt es nicht: „Ticket nicht gefunden“');
  await page.getByRole('link', { name: 'Zurück zum Board' }).click();
  await page.waitForSelector('.column');
  await page.getByLabel('Ticketnummer').fill('7');
  await page.getByLabel('Ticketnummer').press('Enter');
  await page.waitForURL('**/tickets/7');
  check((await page.locator('h1').innerText()) === 'Ticket #7', 'Nummer eingeben und Enter öffnet das Ticket');
  await page.goto(`${BASE}/tickets/abc`);
  check((await page.locator('h1').innerText()) === 'Ticket nicht gefunden', 'Eine Adresse mit Buchstaben statt Nummer ergibt „Ticket nicht gefunden“');
  await page.goto(`${BASE}/irgendwas`);
  await page.waitForSelector('.column');
  check(page.url() === `${BASE}/`, 'Eine unbekannte Adresse führt zum Board');
}

const stages = { ab01: checksAb01, ab02: checksAb02, ab03: checksAb03, final: checksFinal };
if (!stages[stage]) throw new Error(`Unbekannter Stand: ${stage}`);
await stages[stage]();

check(problems.length === 0, `Keine Fehler im Browser (${problems.length ? problems.join(' | ') : 'sauber'})`);

await browser.close();
stopServer();
console.log(failures === 0 ? '\nAlle Abläufe in Ordnung.' : `\n${failures} Abweichung(en).`);
process.exit(failures === 0 ? 0 : 1);
