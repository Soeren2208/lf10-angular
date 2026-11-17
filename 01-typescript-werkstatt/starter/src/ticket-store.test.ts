// Tests zu AB 03 – Speicher und Daten laden
import { afterEach, describe, expect, it, vi } from 'vitest';
import { sampleTickets } from './sample-data';
import { loadTickets, loadTicketsSafe, TicketStore } from './ticket-store';
import type { Ticket } from './ticket';

const neuesTicket: Ticket = { id: 9, title: 'Beamer startet nicht', status: 'offen', priority: 2, createdAt: '2026-11-10' };

describe('C1 TicketStore: Inhalt', () => {
  it('ist ohne Angabe leer', () => {
    expect(new TicketStore().all()).toEqual([]);
  });

  it('enthält die Tickets, mit denen er erzeugt wurde', () => {
    expect(new TicketStore(sampleTickets).all()).toEqual(sampleTickets);
  });

  it('add hängt ein Ticket an, ohne die Liste von vorher zu verändern', () => {
    const store = new TicketStore(sampleTickets);
    const vorher = store.all();
    store.add(neuesTicket);
    expect(store.all()).toHaveLength(9);
    expect(store.all().at(-1)).toEqual(neuesTicket);
    expect(vorher).toHaveLength(8);
    expect(store.all()).not.toBe(vorher);
  });

  it('setStatus ändert den Status des Tickets', () => {
    const store = new TicketStore(sampleTickets);
    store.setStatus(3, 'erledigt');
    expect(store.all().find((t) => t.id === 3)?.status).toBe('erledigt');
  });

  it('replaceAll ersetzt alle Tickets', () => {
    const store = new TicketStore(sampleTickets);
    store.replaceAll([neuesTicket]);
    expect(store.all()).toEqual([neuesTicket]);
  });
});

describe('C2 TicketStore: Änderungen melden', () => {
  it('meldet eine Änderung mit der neuen Liste, aber nicht schon beim Anmelden', () => {
    const store = new TicketStore(sampleTickets);
    const listener = vi.fn();
    store.onChange(listener);
    expect(listener).not.toHaveBeenCalled();
    store.add(neuesTicket);
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
    const erste = vi.fn();
    const zweite = vi.fn();
    store.onChange(erste);
    store.onChange(zweite);
    store.add(neuesTicket);
    expect(erste).toHaveBeenCalledTimes(1);
    expect(zweite).toHaveBeenCalledTimes(1);
  });

  it('onChange liefert eine Funktion, die wieder abmeldet', () => {
    const store = new TicketStore();
    const listener = vi.fn();
    const abmelden = store.onChange(listener);
    store.add(neuesTicket);
    abmelden();
    store.add({ ...neuesTicket, id: 10 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('C3 Daten laden', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const antwort = (status: number, daten: unknown) => new Response(JSON.stringify(daten), { status });

  it('loadTickets ruft die Adresse ab und liefert die Tickets', async () => {
    const fetchMock = vi.fn().mockResolvedValue(antwort(200, sampleTickets));
    vi.stubGlobal('fetch', fetchMock);
    await expect(loadTickets('https://beispiel.test/tickets.json')).resolves.toEqual(sampleTickets);
    expect(fetchMock).toHaveBeenCalledWith('https://beispiel.test/tickets.json');
  });

  it('loadTickets wirft bei einer Fehlerantwort den Fehler "HTTP <status>"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(antwort(404, {})));
    await expect(loadTickets('https://beispiel.test/fehlt.json')).rejects.toThrow('HTTP 404');
  });

  it('loadTicketsSafe liefert bei Erfolg ok: true mit den Tickets', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(antwort(200, sampleTickets)));
    await expect(loadTicketsSafe('https://beispiel.test/tickets.json')).resolves.toEqual({ ok: true, data: sampleTickets });
  });

  it('loadTicketsSafe liefert bei einer Fehlerantwort ok: false mit dem Fehlertext', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(antwort(500, {})));
    await expect(loadTicketsSafe('https://beispiel.test/tickets.json')).resolves.toEqual({ ok: false, error: 'HTTP 500' });
  });

  it('loadTicketsSafe liefert bei einem Netzwerkfehler ok: false mit dem Fehlertext', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(loadTicketsSafe('https://beispiel.test/tickets.json')).resolves.toEqual({ ok: false, error: 'Failed to fetch' });
  });

  it('loadTicketsSafe macht auch aus einem Wert, der kein Error ist, einen Text', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('kaputt'));
    await expect(loadTicketsSafe('https://beispiel.test/tickets.json')).resolves.toEqual({ ok: false, error: 'kaputt' });
  });
});
