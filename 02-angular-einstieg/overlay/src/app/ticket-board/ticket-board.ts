import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isUrgent } from '../ticket';
import type { Status } from '../ticket';
import { sortedByPriority, ticketsWithStatus } from '../ticket-list';
import { TicketService } from '../ticket.service';
import { TicketCard } from '../ticket-card/ticket-card';

@Component({
  imports: [TicketCard],
  selector: 'app-ticket-board',
  styleUrl: './ticket-board.css',
  templateUrl: './ticket-board.html',
})
export class TicketBoard {
  private readonly service = inject(TicketService);
  private readonly router = inject(Router);

  protected readonly urgentOnly = signal(false);

  /** Die Tickets, die das Board zeigt: alle oder nur die dringenden. Ändert sich ein Signal, rechnet es neu. */
  private readonly visible = computed(() => (this.urgentOnly() ? this.service.tickets().filter(isUrgent) : this.service.tickets()));

  /** Die Tickets eines Standes, die dringendsten zuerst. */
  protected ticketsOf(status: Status) {
    return sortedByPriority(ticketsWithStatus(this.visible(), status));
  }

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
