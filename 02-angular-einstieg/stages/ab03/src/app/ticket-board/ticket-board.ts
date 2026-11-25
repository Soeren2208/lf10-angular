import { Component, computed, signal } from '@angular/core';
import { sampleTickets } from '../sample-data';
import { isUrgent } from '../ticket';
import type { Status } from '../ticket';
import { sortedByPriority, ticketsWithStatus, withStatus } from '../ticket-list';
import { TicketCard } from '../ticket-card/ticket-card';
import { STATUS_LABEL } from '../ticket-labels';

/** Die drei Spalten des Boards, von links nach rechts. */
const COLUMNS: { status: Status; css: string }[] = [
  { status: 'offen', css: 'open' },
  { status: 'in Arbeit', css: 'progress' },
  { status: 'erledigt', css: 'done' },
];

@Component({
  imports: [TicketCard],
  selector: 'app-ticket-board',
  styleUrl: './ticket-board.css',
  templateUrl: './ticket-board.html',
})
export class TicketBoard {
  protected readonly tickets = signal(sampleTickets);
  protected readonly urgentOnly = signal(false);

  /** Je Spalte die Tickets, die dringendsten zuerst. Ändert sich ein Signal, rechnet das Board neu. */
  protected readonly columns = computed(() => {
    const tickets = this.urgentOnly() ? this.tickets().filter(isUrgent) : this.tickets();
    return COLUMNS.map((column) => ({
      css: column.css,
      label: STATUS_LABEL[column.status],
      tickets: sortedByPriority(ticketsWithStatus(tickets, column.status)),
    }));
  });

  protected toggleUrgent(): void {
    this.urgentOnly.update((value) => !value);
  }

  protected changeStatus(id: number, status: Status): void {
    this.tickets.update((tickets) => withStatus(tickets, id, status));
  }
}
