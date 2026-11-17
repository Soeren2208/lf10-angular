// Tests zu AB 01 – Ein Ticket beschreiben
import { describe, expect, it } from 'vitest';
import { sampleTickets } from './sample-data';
import { assigneeName, describeTicket, isUrgent } from './ticket';
import type { Ticket } from './ticket';

const ticket = (overrides: Partial<Ticket> = {}): Ticket => ({
  id: 7,
  title: 'Drucker defekt',
  status: 'offen',
  priority: 2,
  createdAt: '2026-11-02',
  ...overrides,
});

describe('A3 describeTicket', () => {
  it('beschreibt ein Ticket als "#<id> <title> [<status>]"', () => {
    expect(describeTicket(ticket())).toBe('#7 Drucker defekt [offen]');
  });

  it('nimmt Titel und Status des übergebenen Tickets', () => {
    expect(describeTicket(sampleTickets[1])).toBe('#2 Server im Rack 3 meldet Temperaturwarnung [in Arbeit]');
  });
});

describe('A4 isUrgent', () => {
  it('ein offenes Ticket mit Priorität 1 ist dringend', () => {
    expect(isUrgent(ticket({ priority: 1, status: 'offen' }))).toBe(true);
  });

  it('ein Ticket in Arbeit mit Priorität 1 ist dringend', () => {
    expect(isUrgent(ticket({ priority: 1, status: 'in Arbeit' }))).toBe(true);
  });

  it('ein erledigtes Ticket ist nie dringend', () => {
    expect(isUrgent(ticket({ priority: 1, status: 'erledigt' }))).toBe(false);
  });

  it('ein Ticket mit Priorität 2 oder 3 ist nicht dringend', () => {
    expect(isUrgent(ticket({ priority: 2 }))).toBe(false);
    expect(isUrgent(ticket({ priority: 3 }))).toBe(false);
  });
});

describe('A5 assigneeName', () => {
  it('liefert den Namen der bearbeitenden Person', () => {
    expect(assigneeName(ticket({ assignee: 'Mara Voss' }))).toBe('Mara Voss');
  });

  it('liefert "nicht zugewiesen", wenn es keine Person gibt', () => {
    expect(assigneeName(ticket())).toBe('nicht zugewiesen');
  });

  it('ein leerer Name ist ein Name und wird nicht ersetzt (?? statt ||)', () => {
    expect(assigneeName(ticket({ assignee: '' }))).toBe('');
  });
});
