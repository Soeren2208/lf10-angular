// AB 03 – Ein Speicher, der Änderungen meldet
import type { Status, Ticket } from './ticket';

/** Eine Funktion, die der Speicher aufruft, wenn sich die Tickets geändert haben. */
export type Listener = (tickets: readonly Ticket[]) => void;

export class TicketStore {
  // TODO C1: Der Speicher soll die Tickets in einem Attribut halten.
  constructor(tickets: readonly Ticket[] = []) {}

  all(): readonly Ticket[] {
    throw new Error('TODO C1: all');
  }

  add(ticket: Ticket): void {
    throw new Error('TODO C1: add');
  }

  setStatus(id: number, status: Status): void {
    throw new Error('TODO C1: setStatus');
  }

  replaceAll(tickets: readonly Ticket[]): void {
    throw new Error('TODO C1: replaceAll');
  }

  /** Meldet `listener` an. Das Ergebnis ist eine Funktion, die ihn wieder abmeldet. */
  onChange(listener: Listener): () => void {
    throw new Error('TODO C2: onChange');
  }
}
