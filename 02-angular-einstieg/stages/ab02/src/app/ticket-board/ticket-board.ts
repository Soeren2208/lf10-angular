import { Component } from '@angular/core';
import { sampleTickets } from '../sample-data';
import { isUrgent } from '../ticket';
import type { Status } from '../ticket';
import { sortedByPriority, ticketsWithStatus } from '../ticket-list';
import { TicketCard } from '../ticket-card/ticket-card';

@Component({
  imports: [TicketCard],
  selector: 'app-ticket-board',
  styleUrl: './ticket-board.css',
  templateUrl: './ticket-board.html',
})
export class TicketBoard {
  protected readonly tickets = sampleTickets;
  protected urgentOnly = false;

  /** Die Tickets eines Standes, die dringendsten zuerst. */
  protected ticketsOf(status: Status) {
    const tickets = this.urgentOnly ? this.tickets.filter(isUrgent) : this.tickets;
    return sortedByPriority(ticketsWithStatus(tickets, status));
  }

  protected toggleUrgent(): void {
    this.urgentOnly = !this.urgentOnly;
  }
}
