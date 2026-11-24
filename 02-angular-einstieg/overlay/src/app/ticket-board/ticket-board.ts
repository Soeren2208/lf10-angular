import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isUrgent } from '../ticket';
import type { Status } from '../ticket';
import { sortedByPriority, ticketsWithStatus } from '../ticket-list';
import { TicketService } from '../ticket.service';
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
  private readonly service = inject(TicketService);
  private readonly router = inject(Router);

  protected readonly urgentOnly = signal(false);

  /** Je Spalte die Tickets, die dringendsten zuerst. Ändert sich ein Signal, rechnet das Board neu. */
  protected readonly columns = computed(() => {
    const tickets = this.urgentOnly() ? this.service.tickets().filter(isUrgent) : this.service.tickets();
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
    this.service.setStatus(id, status);
  }

  protected openTicket(input: string): void {
    const number = input.trim();
    if (number !== '') {
      void this.router.navigate(['/tickets', number]);
    }
  }
}
