import { Component, computed, input, output } from '@angular/core';
import { assigneeName, isUrgent } from '../ticket';
import type { Status, Ticket } from '../ticket';
import { PRIORITY_LABEL } from '../ticket-labels';

/** Wohin ein Ticket von seinem Stand aus wechseln kann, und wie der Knopf heißt. */
const MOVES: Record<Status, { to: Status; label: string }[]> = {
  offen: [{ to: 'in Arbeit', label: 'In Arbeit →' }],
  'in Arbeit': [
    { to: 'offen', label: '← Offen' },
    { to: 'erledigt', label: 'Erledigt →' },
  ],
  erledigt: [{ to: 'in Arbeit', label: '← In Arbeit' }],
};

@Component({
  selector: 'app-ticket-card',
  imports: [],
  templateUrl: './ticket-card.html',
  styleUrl: './ticket-card.css',
})
export class TicketCard {
  readonly ticket = input.required<Ticket>();
  readonly statusChange = output<Status>();

  protected readonly urgent = computed(() => isUrgent(this.ticket()));
  protected readonly priorityText = computed(() => PRIORITY_LABEL[this.ticket().priority]);
  protected readonly assignee = computed(() => assigneeName(this.ticket()));
  protected readonly moves = computed(() => MOVES[this.ticket().status]);
}
