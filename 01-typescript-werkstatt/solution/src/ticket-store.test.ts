// Tests zu AB 03 – Ein Speicher, der Änderungen meldet
import { describe, expect, it, vi } from 'vitest';
import { sampleTickets } from './sample-data';
import { TicketStore } from './ticket-store';
import type { Ticket } from './ticket';

const newTicket: Ticket = { id: 9, title: 'Beamer startet nicht', status: 'offen', priority: 2, createdAt: '2026-11-10' };

describe('C1 TicketStore: Inhalt', () => {
  it('ist ohne Angabe leer', () => {
    expect(new TicketStore().all()).toEqual([]);
  });

  it('enthält die Tickets, mit denen er erzeugt wurde', () => {
    expect(new TicketStore(sampleTickets).all()).toEqual(sampleTickets);
  });

  it('add hängt ein Ticket an, ohne die Liste von vorher zu verändern', () => {
    const store = new TicketStore(sampleTickets);
    const before = store.all();
    store.add(newTicket);
    expect(store.all()).toHaveLength(9);
    expect(store.all().at(-1)).toEqual(newTicket);
    expect(before).toHaveLength(8);
    expect(store.all()).not.toBe(before);
  });

  it('setStatus ändert den Status des Tickets', () => {
    const store = new TicketStore(sampleTickets);
    store.setStatus(3, 'erledigt');
    expect(store.all().find((t) => t.id === 3)?.status).toBe('erledigt');
  });

  it('replaceAll ersetzt alle Tickets', () => {
    const store = new TicketStore(sampleTickets);
    store.replaceAll([newTicket]);
    expect(store.all()).toEqual([newTicket]);
  });
});

describe('C2 TicketStore: Änderungen melden', () => {
  it('meldet eine Änderung mit der neuen Liste, aber nicht schon beim Anmelden', () => {
    const store = new TicketStore(sampleTickets);
    const listener = vi.fn();
    store.onChange(listener);
    expect(listener).not.toHaveBeenCalled();
    store.add(newTicket);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(store.all());
  });

  it('meldet auch setStatus und replaceAll', () => {
    const store = new TicketStore(sampleTickets);
    const listener = vi.fn();
    store.onChange(listener);
    store.setStatus(3, 'in Arbeit');
    store.replaceAll([]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('meldet nichts, wenn setStatus eine unbekannte Nummer bekommt', () => {
    const store = new TicketStore(sampleTickets);
    const listener = vi.fn();
    store.onChange(listener);
    store.setStatus(99, 'erledigt');
    expect(listener).not.toHaveBeenCalled();
    expect(store.all()).toEqual(sampleTickets);
  });

  it('meldet an alle angemeldeten Funktionen', () => {
    const store = new TicketStore();
    const first = vi.fn();
    const second = vi.fn();
    store.onChange(first);
    store.onChange(second);
    store.add(newTicket);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('onChange liefert eine Funktion, die wieder abmeldet', () => {
    const store = new TicketStore();
    const listener = vi.fn();
    const unsubscribe = store.onChange(listener);
    store.add(newTicket);
    unsubscribe();
    store.add({ ...newTicket, id: 10 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
