// ===========================================================================
//  WELCHE TUTORIALS VERÖFFENTLICHT WERDEN
// ===========================================================================
//
//  In dieser Datei steht NICHT, was freigeschaltet ist — hier stehen nur die
//  Tutorials, die es überhaupt gibt.
//
//  Freigeschaltet wird über die Variable TUTORIALS:
//
//    Auf GitHub:  Settings → Secrets and variables → Actions → Variables
//                 Name: TUTORIALS
//                 Wert: tutorial-01            (ein oder mehrere, mit Komma)
//                       keine                  (nur die Infoblätter)
//                 Danach unter "Actions" den Workflow von Hand starten
//                 ("Run workflow") — fertig, kein Commit nötig.
//
//    Lokal:       gar nicht. Beim Entwickeln auf dem eigenen Rechner sind
//                 IMMER alle Tutorials sichtbar, damit man sehen kann,
//                 woran man arbeitet.
//
//  Ein nicht freigeschaltetes Tutorial wird gar nicht erst gebaut. Seine
//  Adresse liefert einen 404 — auch für jemanden, der sie errät.
//
//  Die Infoblätter sind nie geschaltet: Sie sind Nachschlagematerial und
//  immer erreichbar.
// ===========================================================================

const tutorials = [
  {
    id: 'tutorial-01',
    nummer: '01',
    titel: 'TypeScript-Werkstatt',
    stichworte: 'Typen · Interfaces · Array-Methoden · Klassen · async/await',
    beschreibung:
      'TypeScript für Angular: Die Support-Tickets der HiTec GmbH bekommen ' +
      'ein Datenmodell, eine Logik und einen Speicher – geprüft von Tests, ' +
      'die zuerst rot sind.',
  },
  {
    id: 'tutorial-02',
    nummer: '02',
    titel: 'Das Ticket-Board',
    stichworte: 'Komponenten · Control Flow · Signals · Service · Routing',
    beschreibung:
      'Der Angular-Einstieg: Aus Personas, Nutzungsanforderungen und einem ' +
      'Wireframe wird ein Board für die Support-Tickets der HiTec GmbH.',
  },
];

// GitHub Actions setzt CI=true. Daran erkennen wir eine Veröffentlichung.
const veroeffentlichung = process.env.CI === 'true';
const angefordert = (process.env.TUTORIALS || '').trim();

if (veroeffentlichung && !angefordert) {
  throw new Error(
    'Die Variable TUTORIALS ist nicht gesetzt.\n' +
      'Ohne sie ist nicht entscheidbar, was veröffentlicht werden soll —\n' +
      'und alles zu veröffentlichen wäre die falsche Vermutung.\n' +
      'Anlegen unter: Settings → Secrets and variables → Actions → Variables\n' +
      'Wert "keine" veröffentlicht nur die Infoblätter.',
  );
}

// "keine" ist ein eigener, ausdrücklicher Wert: nur die Infoblätter.
const keine = angefordert.toLowerCase() === 'keine';

const gewuenscht = keine
  ? []
  : angefordert
      .split(',')
      .map((eintrag) => eintrag.trim())
      .filter(Boolean);

// Unbekannte Ids sind fast immer Tippfehler und würden sonst still verpuffen.
const unbekannt = gewuenscht.filter(
  (id) => !tutorials.some((t) => t.id === id),
);
if (unbekannt.length > 0) {
  throw new Error(
    `TUTORIALS nennt unbekannte Ids: ${unbekannt.join(', ')}\n` +
      `Bekannt sind: ${tutorials.map((t) => t.id).join(', ')}`,
  );
}

// Lokal alles, in der Veröffentlichung genau das Angeforderte.
const freigegeben = keine
  ? []
  : angefordert
      ? tutorials.filter((t) => gewuenscht.includes(t.id))
      : tutorials;

// Manche Tutorials verweisen auf ihre Vorgänger. Ein Verweis auf ein nicht
// freigeschaltetes Tutorial bricht den Build ab — allerdings mit einer
// Meldung über "broken links", der man die Ursache nicht ansieht. Deshalb
// hier vorher die verständliche Fassung.
const fehlend = freigegeben.flatMap((t) =>
  (t.verweistAuf || [])
    .filter((id) => !freigegeben.some((f) => f.id === id))
    .map((id) => `${t.id} verweist auf ${id}`),
);
if (fehlend.length > 0) {
  throw new Error(
    'Es fehlen vorausgesetzte Tutorials:\n  ' +
      fehlend.join('\n  ') +
      '\n\nDie Tutorials bauen aufeinander auf und verlinken einander.\n' +
      'Schalte die genannten Vorgänger mit frei — sonst zeigen die\n' +
      'Verweise ins Leere und der Build bricht ab.',
  );
}

console.log(
  veroeffentlichung
    ? `[tutorials] Veröffentlichung: ${freigegeben.map((t) => t.id).join(', ') || '(nur Infoblätter)'}`
    : `[tutorials] Lokal — alle ${freigegeben.length} Tutorials sichtbar`,
);

module.exports = { tutorials, freigegeben };
