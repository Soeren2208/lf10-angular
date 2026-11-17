// AB 01 – Ein Ticket beschreiben
//
// Vorerst steht hier überall `any`. Das heißt: Der Compiler prüft nichts.
// Deine Aufgabe in AB 01 ist es, diese drei Typen durch echte zu ersetzen (A1, A2)
// und die drei Funktionen zu schreiben (A3, A4, A5).

export type Status = any; // TODO A2
export type Priority = any; // TODO A2
export type Ticket = any; // TODO A1

/** Eine Zeile Text für die Anzeige, zum Beispiel: `#3 Drucker defekt [offen]`. */
export function describeTicket(ticket: Ticket): string {
  throw new Error('TODO A3: describeTicket');
}

/** Dringend ist ein Ticket mit hoher Priorität, das noch nicht erledigt ist. */
export function isUrgent(ticket: Ticket): boolean {
  throw new Error('TODO A4: isUrgent');
}

/** Name der bearbeitenden Person oder `nicht zugewiesen`, wenn es keine gibt. */
export function assigneeName(ticket: Ticket): string {
  throw new Error('TODO A5: assigneeName');
}
