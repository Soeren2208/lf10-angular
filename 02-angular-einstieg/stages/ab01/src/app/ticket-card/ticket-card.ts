import { Component, input } from '@angular/core';
import { assigneeName, isUrgent } from '../ticket';
import type { Ticket } from '../ticket';
import { PRIORITY_LABEL } from '../ticket-labels';

@Component({
  imports: [],
  selector: 'app-ticket-card',
  styleUrl: './ticket-card.css',
  templateUrl: './ticket-card.html',
})
export class TicketCard {
  readonly ticket = input.required<Ticket>();

  protected urgent(): boolean {
    return isUrgent(this.ticket());
  }

  protected priorityText(): string {
    return PRIORITY_LABEL[this.ticket().priority];
  }

  protected assignee(): string {
    return assigneeName(this.ticket());
  }
}
