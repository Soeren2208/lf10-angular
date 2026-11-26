import { Component, computed, input, output } from '@angular/core';
import { assigneeName, isUrgent } from '../ticket';
import type { Status, Ticket } from '../ticket';
import { PRIORITY_LABEL } from '../ticket-labels';

@Component({
  imports: [],
  selector: 'app-ticket-card',
  styleUrl: './ticket-card.css',
  templateUrl: './ticket-card.html',
})
export class TicketCard {
  readonly ticket = input.required<Ticket>();
  readonly statusChange = output<Status>();

  protected readonly urgent = computed(() => isUrgent(this.ticket()));
  protected readonly priorityText = computed(() => PRIORITY_LABEL[this.ticket().priority]);
  protected readonly assignee = computed(() => assigneeName(this.ticket()));
}
