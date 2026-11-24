import { Injectable, signal } from '@angular/core';
import { sampleTickets } from './sample-data';
import type { Status, Ticket } from './ticket';
import { findTicket, withStatus } from './ticket-list';

/** Hält die Tickets für alle Seiten. Wer sie ändert, ändert sie überall. */
@Injectable({ providedIn: 'root' })
export class TicketService {
  readonly tickets = signal<readonly Ticket[]>(sampleTickets);

  /** Das Ticket mit der Nummer `id`, oder `undefined`. Liest das Signal, ist also reaktiv. */
  find(id: number): Ticket | undefined {
    return findTicket(this.tickets(), id);
  }

  setStatus(id: number, status: Status): void {
    this.tickets.update((tickets) => withStatus(tickets, id, status));
  }
}
