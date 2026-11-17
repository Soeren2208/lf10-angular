// AB 03 – Speicher und Daten laden
import type { Status, Ticket } from './ticket';
import { withStatus } from './ticket-list';

/** Entweder hat das Laden geklappt (`ok: true`, mit Daten) oder nicht (`ok: false`, mit Fehlertext). */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Eine Funktion, die der Speicher aufruft, wenn sich die Tickets geändert haben. */
export type Listener = (tickets: readonly Ticket[]) => void;

export class TicketStore {
  private readonly listeners = new Set<Listener>();

  constructor(private tickets: readonly Ticket[] = []) {}

  all(): readonly Ticket[] {
    return this.tickets;
  }

  add(ticket: Ticket): void {
    this.tickets = [...this.tickets, ticket];
    this.notify();
  }

  setStatus(id: number, status: Status): void {
    if (!this.tickets.some((ticket) => ticket.id === id)) {
      return;
    }
    this.tickets = withStatus(this.tickets, id, status);
    this.notify();
  }

  replaceAll(tickets: readonly Ticket[]): void {
    this.tickets = [...tickets];
    this.notify();
  }

  /** Meldet `listener` an. Das Ergebnis ist eine Funktion, die ihn wieder abmeldet. */
  onChange(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.tickets);
    }
  }
}

/** Lädt Tickets von `url`. Bei einer Fehlerantwort (z. B. 404) wird ein Fehler `HTTP 404` geworfen. */
export async function loadTickets(url: string): Promise<Ticket[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Ticket[];
}

/** Wie `loadTickets`, wirft aber nie, sondern liefert ein `Result`. */
export async function loadTicketsSafe(url: string): Promise<Result<Ticket[]>> {
  try {
    return { ok: true, data: await loadTickets(url) };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
