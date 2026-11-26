import type { Priority, Status } from './ticket';

/** Der Text, der für die Priorität eines Tickets auf der Karte steht. */
export const PRIORITY_LABEL: Record<Priority, string> = {
  1: 'Hoch',
  2: 'Mittel',
  3: 'Niedrig',
};

/** Der Text, der für den Stand eines Tickets in der Ansicht steht. */
export const STATUS_LABEL: Record<Status, string> = {
  offen: 'Offen',
  'in Arbeit': 'In Arbeit',
  erledigt: 'Erledigt',
};
