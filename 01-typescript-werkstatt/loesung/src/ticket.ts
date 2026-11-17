// AB 01 – Ein Ticket beschreiben

/** Der Bearbeitungsstand eines Tickets. Nur diese drei Wörter sind erlaubt. */
export type Status = 'offen' | 'in Arbeit' | 'erledigt';

/** 1 = hoch, 2 = mittel, 3 = niedrig. */
export type Priority = 1 | 2 | 3;

export interface Ticket {
  readonly id: number;
  title: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  createdAt: string;
}

/** Eine Zeile Text für die Anzeige, zum Beispiel: `#3 Drucker defekt [offen]`. */
export function describeTicket(ticket: Ticket): string {
  return `#${ticket.id} ${ticket.title} [${ticket.status}]`;
}

/** Dringend ist ein Ticket mit hoher Priorität, das noch nicht erledigt ist. */
export function isUrgent(ticket: Ticket): boolean {
  return ticket.priority === 1 && ticket.status !== 'erledigt';
}

/** Name der bearbeitenden Person oder `nicht zugewiesen`, wenn es keine gibt. */
export function assigneeName(ticket: Ticket): string {
  return ticket.assignee ?? 'nicht zugewiesen';
}
