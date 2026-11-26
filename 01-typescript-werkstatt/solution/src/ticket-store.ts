// AB 03 – Ein Speicher, der Änderungen meldet
import type { Status, Ticket } from './ticket';
import { withStatus } from './ticket-list';

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
