import type { Priority, Status } from './ticket';

/** Die Texte, die auf dem Board für Priorität und Stand stehen. */
export const PRIORITY_LABEL: Record<Priority, string> = {
  1: 'Hoch',
  2: 'Mittel',
  3: 'Niedrig',
};

export const STATUS_LABEL: Record<Status, string> = {
  offen: 'Offen',
  'in Arbeit': 'In Arbeit',
  erledigt: 'Erledigt',
};
