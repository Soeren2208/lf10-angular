// Fotografiert die Musterlösung (für Prüfung des Designs und für Bilder im Tutorial).
//   node screenshots.mjs [--node26] [Zielordner]
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = dirname(fileURLToPath(import.meta.url));
const solution = join(here, '..', 'solution');
const prefix = process.argv.includes('--node26') ? 'npx -y -p node@26 ' : '';
const target = process.argv.slice(2).find((arg) => !arg.startsWith('--')) ?? join(here, 'bilder');
mkdirSync(target, { recursive: true });
const PORT = 4312;
const BASE = `http://127.0.0.1:${PORT}`;
const channel = process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : 'chrome');

const server = spawn(`${prefix}npm start -- --port ${PORT} --host 127.0.0.1`, { cwd: solution, shell: true, stdio: 'ignore' });
const stop = () => (process.platform === 'win32' ? spawnSync(`taskkill /pid ${server.pid} /T /F`, { shell: true, stdio: 'ignore' }) : server.kill('SIGTERM'));
process.on('exit', stop);
for (let i = 0; i < 120; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {
    /* noch nicht bereit */
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

const browser = await chromium.launch({ channel, headless: true });
const desktop = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
await desktop.goto(BASE);
await desktop.waitForSelector('.column');
await desktop.screenshot({ path: join(target, 'board.png') });
await desktop.getByLabel('Nur dringende Tickets zeigen').check();
await desktop.waitForTimeout(300);
await desktop.screenshot({ path: join(target, 'board-dringend.png') });
await desktop.goto(`${BASE}/tickets/4`);
await desktop.waitForSelector('.facts');
await desktop.screenshot({ path: join(target, 'ticket.png') });
await desktop.goto(`${BASE}/tickets/99`);
await desktop.waitForSelector('.not-found');
await desktop.screenshot({ path: join(target, 'nicht-gefunden.png') });

const mobile = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
await mobile.goto(BASE);
await mobile.waitForSelector('.column');
await mobile.screenshot({ path: join(target, 'board-mobil.png'), fullPage: true });

await browser.close();
stop();
console.log('Bilder in ' + target);
