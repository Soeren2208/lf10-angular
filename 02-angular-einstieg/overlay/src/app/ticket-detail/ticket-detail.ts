import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { assigneeName, isUrgent } from '../ticket';
import { TicketService } from '../ticket.service';
import { PRIORITY_LABEL, STATUS_LABEL } from '../ticket-labels';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-ticket-detail',
  styleUrl: './ticket-detail.css',
  templateUrl: './ticket-detail.html',
})
export class TicketDetail {
  private readonly service = inject(TicketService);

  /** Die Nummer aus der Adresse (`/tickets/:id`). Der Router liefert sie als Text. */
  readonly id = input.required<string>();

  /** Alles, was die Seite zeigt. `undefined`, wenn es das Ticket nicht gibt. */
  protected readonly view = computed(() => {
    const number = Number(this.id());
    const ticket = Number.isInteger(number) ? this.service.find(number) : undefined;
    if (!ticket) {
      return undefined;
    }
    return {
      ticket,
      statusText: STATUS_LABEL[ticket.status],
      priorityText: PRIORITY_LABEL[ticket.priority],
      urgent: isUrgent(ticket),
      assignee: assigneeName(ticket),
    };
  });
}
