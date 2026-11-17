// Typ-Prüfungen. Diese Datei wird nicht ausgeführt, nur vom Compiler gelesen: `npm run check`.
//
// Jede Zeile mit `@ts-expect-error` sagt: "Hier MUSS der Compiler einen Fehler melden."
// Sind deine Typen richtig, meldet der Compiler genau diese Fehler und ist zufrieden.
// Fehlt ein Fehler, steht dort "Unused '@ts-expect-error' directive". Dann sind deine Typen noch zu locker.
//
// Du musst in dieser Datei nichts ändern.
import { sampleTickets } from './sample-data';
import type { Status, Ticket } from './ticket';
import { findTicket } from './ticket-list';
import type { Result } from './ticket-store';

// A1: ein gültiges Ticket – assignee darf fehlen
const gueltig: Ticket = { id: 1, title: 'Test', status: 'offen', priority: 1, createdAt: '2026-11-02' };

// @ts-expect-error A2: Als Status ist nur "offen", "in Arbeit" oder "erledigt" erlaubt
const falscherStatus: Ticket = { ...gueltig, status: 'wartet' };

// @ts-expect-error A2: Als Priorität ist nur 1, 2 oder 3 erlaubt
const falschePrioritaet: Ticket = { ...gueltig, priority: 4 };

// @ts-expect-error A1: Der Titel muss ein Text sein
const falscherTitel: Ticket = { ...gueltig, title: 42 };

// @ts-expect-error A1: Ohne Titel ist es kein Ticket
const ohneTitel: Ticket = { id: 2, status: 'offen', priority: 1, createdAt: '2026-11-02' };

// @ts-expect-error A1: Es gibt kein Feld "prio" (Tippfehler werden erkannt)
const tippfehler: Ticket = { ...gueltig, prio: 1 };

// @ts-expect-error A2: Ein Status ist keine beliebige Zahl
const statusAlsZahl: Status = 3;

// @ts-expect-error A1: Die Nummer eines Tickets darf nachträglich nicht geändert werden (readonly)
gueltig.id = 2;

// @ts-expect-error B3: findTicket kann undefined liefern, deshalb darf man nicht einfach .title lesen
const titel = findTicket(sampleTickets, 1).title;

// C4: Erst wenn "ok" geprüft ist, weiß der Compiler, ob es data oder error gibt
export function ausgabe(ergebnis: Result<Ticket[]>): string {
  if (ergebnis.ok) {
    return `${ergebnis.data.length} Tickets`;
  }
  return ergebnis.error;
}

// @ts-expect-error C4: Ohne Prüfung von "ok" darf man nicht auf data zugreifen
export const ohnePruefung = (ergebnis: Result<Ticket[]>) => ergebnis.data;

export { falscherStatus, falschePrioritaet, falscherTitel, ohneTitel, tippfehler, statusAlsZahl, titel };
