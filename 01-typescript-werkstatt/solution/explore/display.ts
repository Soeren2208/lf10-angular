// AB 03 – Das Experiment: Wer erfährt von der Änderung?
//
// Starten: npm run display
//
// Die Funktion showTickets gibt die Liste einmal aus. Danach ändert sich der Speicher.
// Beobachte, was auf der Konsole passiert, und löse dann die Aufgabe im Arbeitsblatt.
import { sampleTickets } from '../src/sample-data';
import { describeTicket } from '../src/ticket';
import type { Ticket } from '../src/ticket';
import { TicketStore } from '../src/ticket-store';

function showTickets(tickets: readonly Ticket[]): void {
  console.log('--- Tickets ---');
  for (const ticket of tickets) {
    console.log(describeTicket(ticket));
  }
}

const store = new TicketStore(sampleTickets);

showTickets(store.all());

store.add({ id: 9, title: 'Beamer startet nicht', status: 'offen', priority: 2, createdAt: '2026-11-10' });
console.log('\nEin neues Ticket wurde gespeichert. Was zeigt die Anzeige jetzt?');
