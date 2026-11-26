// AB 03 – Speicher und Daten laden
import type { Status, Ticket } from './ticket';

/** Entweder hat das Laden geklappt (`ok: true`, mit Daten) oder nicht (`ok: false`, mit Fehlertext). */
export type Result<T> = any; // TODO C4

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

/** Lädt Tickets von `url`. Bei einer Fehlerantwort (z. B. 404) wird ein Fehler `HTTP 404` geworfen. */
export async function loadTickets(url: string): Promise<Ticket[]> {
  throw new Error('TODO C3: loadTickets');
}

/** Wie `loadTickets`, wirft aber nie, sondern liefert ein `Result`. */
export async function loadTicketsSafe(url: string): Promise<Result<Ticket[]>> {
  throw new Error('TODO C4: loadTicketsSafe');
}
