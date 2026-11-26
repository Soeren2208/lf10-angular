import type { Priority } from './ticket';

/** Der Text, der für die Priorität eines Tickets auf der Karte steht. */
export const PRIORITY_LABEL: Record<Priority, string> = {
  1: 'Hoch',
  2: 'Mittel',
  3: 'Niedrig',
};
