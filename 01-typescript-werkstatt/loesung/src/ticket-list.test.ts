// Tests zu AB 02 – Mit Ticketlisten arbeiten
import { describe, expect, it } from 'vitest';
import { sampleTickets } from './sample-data';
import { countByStatus, findTicket, openTickets, sortedByPriority, titles, withStatus } from './ticket-list';
import { deepFreeze } from './test-hilfen';

// Die Eingabe wird eingefroren: Wer sie ändert, bekommt einen Fehler.
const eingefroren = () => deepFreeze(structuredClone(sampleTickets));

describe('B1 openTickets', () => {
  it('liefert nur Tickets mit dem Status "offen"', () => {
    expect(openTickets(sampleTickets).map((t) => t.id)).toEqual([3, 4, 5, 8]);
  });

  it('liefert bei einer leeren Liste eine leere Liste', () => {
    expect(openTickets([])).toEqual([]);
  });
});

describe('B2 titles', () => {
  it('liefert die Titel in der Reihenfolge der Tickets', () => {
    expect(titles(sampleTickets.slice(0, 3))).toEqual([
      'VPN-Zugang für neue Mitarbeiterin einrichten',
      'Server im Rack 3 meldet Temperaturwarnung',
      'Drucker im Büro 2 druckt nicht',
    ]);
  });
});

describe('B3 findTicket', () => {
  it('findet das Ticket mit der gesuchten Nummer', () => {
    expect(findTicket(sampleTickets, 4)?.title).toBe('E-Mail-Postfach der Geschäftsführung läuft voll');
  });

  it('liefert undefined, wenn es die Nummer nicht gibt', () => {
    expect(findTicket(sampleTickets, 99)).toBeUndefined();
  });
});

describe('B4 countByStatus', () => {
  it('zählt die Tickets je Status', () => {
    expect(countByStatus(sampleTickets)).toEqual({ offen: 4, 'in Arbeit': 2, erledigt: 2 });
  });

  it('nennt auch Status ohne Tickets mit 0', () => {
    expect(countByStatus([])).toEqual({ offen: 0, 'in Arbeit': 0, erledigt: 0 });
  });
});

describe('B5 sortedByPriority', () => {
  it('sortiert die dringendsten zuerst, bei Gleichstand nach Nummer', () => {
    expect(sortedByPriority(sampleTickets).map((t) => t.id)).toEqual([2, 4, 6, 3, 7, 8, 1, 5]);
  });

  it('lässt die Eingabeliste unverändert', () => {
    const liste = eingefroren();
    expect(() => sortedByPriority(liste)).not.toThrow();
    expect(liste.map((t) => t.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('B6 withStatus', () => {
  it('ändert den Status des gewünschten Tickets', () => {
    const neu = withStatus(sampleTickets, 3, 'erledigt');
    expect(findTicket(neu, 3)?.status).toBe('erledigt');
  });

  it('lässt die Eingabeliste und ihre Tickets unverändert', () => {
    const liste = eingefroren();
    expect(() => withStatus(liste, 3, 'erledigt')).not.toThrow();
    expect(findTicket(liste, 3)?.status).toBe('offen');
  });

  it('liefert eine neue Liste und ein neues Ticket, die anderen Tickets bleiben dieselben Objekte', () => {
    const neu = withStatus(sampleTickets, 3, 'erledigt');
    expect(neu).not.toBe(sampleTickets);
    expect(findTicket(neu, 3)).not.toBe(findTicket(sampleTickets, 3));
    expect(findTicket(neu, 4)).toBe(findTicket(sampleTickets, 4));
  });

  it('liefert bei einer unbekannten Nummer eine Liste mit demselben Inhalt', () => {
    expect(withStatus(sampleTickets, 99, 'erledigt')).toEqual(sampleTickets);
  });
});
