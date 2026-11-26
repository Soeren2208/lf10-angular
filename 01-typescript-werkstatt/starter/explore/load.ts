// AB 03 (Zusatz) – Echte Daten aus dem Netz laden
//
// Starten: npm run load   (dafür brauchst du eine Internetverbindung)
//
// Die Tickets liegen als JSON-Datei auf der Webseite zu diesem Kurs.
import { describeTicket } from '../src/ticket';
import type { Ticket } from '../src/ticket';
import { loadTicketsSafe } from '../src/ticket-store';

const TICKETS_URL = 'https://soeren2208.github.io/lf10-angular/data/tickets.json';

// Auf oberster Ebene einer Datei (einem Modul) darf `await` ohne `async` stehen. Innerhalb einer Funktion brauchst du `async`.
const result = await loadTicketsSafe(TICKETS_URL);

if (result.ok) {
  console.log(`${result.data.length} Tickets geladen:`);
  result.data.forEach((ticket: Ticket) => console.log(describeTicket(ticket)));
} else {
  console.log(`Laden fehlgeschlagen: ${result.error}`);
}
