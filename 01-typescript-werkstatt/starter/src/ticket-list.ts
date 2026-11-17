// AB 02 – Mit Ticketlisten arbeiten
import type { Status, Ticket } from './ticket';

/** Alle Tickets mit dem Status `offen`. */
export function openTickets(tickets: readonly Ticket[]): Ticket[] {
  throw new Error('TODO B1: openTickets');
}

/** Nur die Titel, in derselben Reihenfolge. */
export function titles(tickets: readonly Ticket[]): string[] {
  throw new Error('TODO B2: titles');
}

/** Das Ticket mit der Nummer `id`. Gibt es keins, ist das Ergebnis `undefined`. */
export function findTicket(tickets: readonly Ticket[], id: number): Ticket | undefined {
  throw new Error('TODO B3: findTicket');
}

/** Wie viele Tickets es je Status gibt. Auch ein Status ohne Tickets steht drin (mit 0). */
export function countByStatus(tickets: readonly Ticket[]): Record<Status, number> {
  throw new Error('TODO B4: countByStatus');
}

/** Die dringendsten zuerst (Priorität 1 vor 2 vor 3), bei Gleichstand das kleinere `id` zuerst. */
export function sortedByPriority(tickets: readonly Ticket[]): Ticket[] {
  throw new Error('TODO B5: sortedByPriority');
}

/** Dieselbe Liste, nur mit anderem Status bei Ticket `id`. Die Eingabe bleibt unverändert. */
export function withStatus(tickets: readonly Ticket[], id: number, status: Status): Ticket[] {
  throw new Error('TODO B6: withStatus');
}
