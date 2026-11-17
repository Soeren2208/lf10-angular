// AB 03 (Zusatz) – Echte Daten aus dem Netz laden
//
// Starten: npm run laden   (dafür brauchst du eine Internetverbindung)
//
// Die Tickets liegen als JSON-Datei auf der Webseite zu diesem Kurs.
import { describeTicket } from '../src/ticket';
import type { Ticket } from '../src/ticket';
import { loadTicketsSafe } from '../src/ticket-store';

const ADRESSE = 'https://soeren2208.github.io/lf10-angular/data/tickets.json';

const ergebnis = await loadTicketsSafe(ADRESSE);

if (ergebnis.ok) {
  console.log(`${ergebnis.data.length} Tickets geladen:`);
  ergebnis.data.forEach((ticket: Ticket) => console.log(describeTicket(ticket)));
} else {
  console.log(`Laden fehlgeschlagen: ${ergebnis.error}`);
}
