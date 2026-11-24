import { Component } from '@angular/core';
import { sampleTickets } from '../sample-data';
import { isUrgent } from '../ticket';
import type { Status } from '../ticket';
import { sortedByPriority, ticketsWithStatus } from '../ticket-list';
import { TicketCard } from '../ticket-card/ticket-card';
import { STATUS_LABEL } from '../ticket-labels';

/** Die drei Spalten des Boards, von links nach rechts. */
const COLUMNS: { status: Status; css: string }[] = [
  { status: 'offen', css: 'open' },
  { status: 'in Arbeit', css: 'progress' },
  { status: 'erledigt', css: 'done' },
];

@Component({
  selector: 'app-ticket-board',
  imports: [TicketCard],
  templateUrl: './ticket-board.html',
  styleUrl: './ticket-board.css',
})
export class TicketBoard {
  protected readonly tickets = sampleTickets;
  protected urgentOnly = false;

  /** Je Spalte die Tickets, die dringendsten zuerst. */
  protected columns() {
    const tickets = this.urgentOnly ? this.tickets.filter(isUrgent) : this.tickets;
    return COLUMNS.map((column) => ({
      css: column.css,
      label: STATUS_LABEL[column.status],
      tickets: sortedByPriority(ticketsWithStatus(tickets, column.status)),
    }));
  }

  protected toggleUrgent(): void {
    this.urgentOnly = !this.urgentOnly;
  }
}
