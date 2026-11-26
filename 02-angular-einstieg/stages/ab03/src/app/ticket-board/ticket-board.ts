import { Component, computed, signal } from '@angular/core';
import { sampleTickets } from '../sample-data';
import { isUrgent } from '../ticket';
import type { Status } from '../ticket';
import { sortedByPriority, ticketsWithStatus, withStatus } from '../ticket-list';
import { TicketCard } from '../ticket-card/ticket-card';

@Component({
  imports: [TicketCard],
  selector: 'app-ticket-board',
  styleUrl: './ticket-board.css',
  templateUrl: './ticket-board.html',
})
export class TicketBoard {
  protected readonly tickets = signal(sampleTickets);
  protected readonly urgentOnly = signal(false);

  /** Die Tickets, die das Board zeigt: alle oder nur die dringenden. Ändert sich ein Signal, rechnet es neu. */
  private readonly visible = computed(() => (this.urgentOnly() ? this.tickets().filter(isUrgent) : this.tickets()));

  /** Die Tickets eines Standes, die dringendsten zuerst. */
  protected ticketsOf(status: Status) {
    return sortedByPriority(ticketsWithStatus(this.visible(), status));
  }

  protected toggleUrgent(): void {
    this.urgentOnly.update((value) => !value);
  }

  protected changeStatus(id: number, status: Status): void {
    this.tickets.update((tickets) => withStatus(tickets, id, status));
  }
}
