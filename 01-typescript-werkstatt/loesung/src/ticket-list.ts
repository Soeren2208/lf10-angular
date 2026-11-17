// AB 02 – Mit Ticketlisten arbeiten
import type { Status, Ticket } from './ticket';

/** Alle Tickets mit dem Status `offen`. */
export function openTickets(tickets: readonly Ticket[]): Ticket[] {
  return tickets.filter((ticket) => ticket.status === 'offen');
}

/** Nur die Titel, in derselben Reihenfolge. */
export function titles(tickets: readonly Ticket[]): string[] {
  return tickets.map((ticket) => ticket.title);
}

/** Das Ticket mit der Nummer `id`. Gibt es keins, ist das Ergebnis `undefined`. */
export function findTicket(tickets: readonly Ticket[], id: number): Ticket | undefined {
  return tickets.find((ticket) => ticket.id === id);
}

/** Wie viele Tickets es je Status gibt. Auch ein Status ohne Tickets steht drin (mit 0). */
export function countByStatus(tickets: readonly Ticket[]): Record<Status, number> {
  return tickets.reduce<Record<Status, number>>(
    (count, ticket) => ({ ...count, [ticket.status]: count[ticket.status] + 1 }),
    { offen: 0, 'in Arbeit': 0, erledigt: 0 },
  );
}

/** Die dringendsten zuerst (Priorität 1 vor 2 vor 3), bei Gleichstand das kleinere `id` zuerst. */
export function sortedByPriority(tickets: readonly Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => a.priority - b.priority || a.id - b.id);
}

/** Dieselbe Liste, nur mit anderem Status bei Ticket `id`. Die Eingabe bleibt unverändert. */
export function withStatus(tickets: readonly Ticket[], id: number, status: Status): Ticket[] {
  return tickets.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket));
}
