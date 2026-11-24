// Baut das Wireframe-Projekt "Ticket-Board" (Board mit drei Spalten) im Dateiformat von wireframe.heidelab.de (formatVersion 16).
// Ausführen: im Browser auf https://wireframe.heidelab.de/ in die Konsole einfügen und neu laden,
// oder mit Node (siehe export.mjs). Ergebnis: localStorage['wireframe.projekt'].
//
// Die Schlüssel der Dateien (elemente, beschriftung, interaktionen, wasPassiert, ziel, endpunkt, umrandung, textgroesse ...)
// gibt das Werkzeug vor und sind deutsch. Alle eigenen Namen in diesem Skript sind englisch.
(() => {
  let zOrder = 0;
  const element = (id, form, beschriftung, x, y, b, h, extra = {}) => ({ id, form, beschriftung, parent: null, x, y, b, h, z: ++zOrder, ...extra });
  const childElement = (parent, id, form, beschriftung, x, y, b, h, extra = {}) => ({ id, form, beschriftung, parent, x, y, b, h, z: ++zOrder, ...extra });
  const interaction = (id, elementId, wasPassiert, ziel = null) => ({ id, element: elementId, wasPassiert, ziel });

  // Eine Ticket-Kachel in einer Spalte. buttons: [{text, effect, target, width}] unten in der Kachel.
  function ticketCard(column, number, y, title, info, buttons) {
    const cardId = `k${number}`;
    const elements = [
      childElement(column, cardId, 'container', '', 16, y, 360, 160, { umrandung: 'sichtbar' }),
      childElement(cardId, `${cardId}_titel`, 'label', `#${number} ${title}`, 12, 12, 336, 32),
      childElement(cardId, `${cardId}_info`, 'label', info, 12, 52, 336, 32, { textgroesse: 'klein' }),
    ];
    const interactions = [];
    let x = 12;
    buttons.forEach((button, index) => {
      elements.push(childElement(cardId, `${cardId}_b${index}`, 'button', button.text, x, 108, button.width ?? 104, 36));
      interactions.push(interaction(`i_${cardId}_b${index}`, `${cardId}_b${index}`, button.effect, button.target ?? null));
      x += (button.width ?? 104) + 12;
    });
    return { elements, interactions };
  }

  // --- Screen 1: Board ---------------------------------------------------------
  zOrder = 0;
  const boardElements = [
    element('b_titel', 'label', 'Ticket-Board · HiTec GmbH Support', 32, 24, 800, 40, { textgroesse: 'gross' }),
    element('b_user', 'label', 'Angemeldet als Jonas Beck', 912, 24, 336, 40, { textgroesse: 'klein' }),
    element('b_dringend', 'checkbox', 'Nur dringende Tickets zeigen', 32, 88, 360, 40),
    element('b_nummer', 'textfeld', 'Ticketnummer', 704, 88, 300, 40),
    element('b_nummer_ok', 'button', 'Ticket öffnen', 1016, 88, 200, 40),
    element('sp_offen', 'container', '', 32, 152, 392, 600, { umrandung: 'sichtbar' }),
    childElement('sp_offen', 'sp_offen_kopf', 'label', 'Offen · 2', 16, 8, 360, 32, { textgroesse: 'gross' }),
    element('sp_arbeit', 'container', '', 444, 152, 392, 600, { umrandung: 'sichtbar' }),
    childElement('sp_arbeit', 'sp_arbeit_kopf', 'label', 'In Arbeit · 1', 16, 8, 360, 32, { textgroesse: 'gross' }),
    element('sp_erledigt', 'container', '', 856, 152, 392, 600, { umrandung: 'sichtbar' }),
    childElement('sp_erledigt', 'sp_erledigt_kopf', 'label', 'Erledigt · 0', 16, 8, 360, 32, { textgroesse: 'gross' }),
  ];
  const boardInteractions = [
    interaction('i_b_dringend', 'b_dringend', 'Zeigt nur dringende Tickets (Priorität hoch und noch nicht erledigt). Die Zähler in den Spalten passen sich an'),
    interaction('i_b_nummer_ok', 'b_nummer_ok', 'Öffnet das Ticket mit dieser Nummer. Beispiel: Nummer 99 gibt es nicht, deshalb erscheint „Ticket nicht gefunden“', 'screen_nicht_gefunden'),
  ];
  const card4 = ticketCard('sp_offen', 4, 56, 'E-Mail-Postfach der Geschäftsführung läuft voll', 'Hoch · dringend · Jonas Beck', [
    { text: 'Öffnen', effect: 'Öffnet das Ticket mit allen Angaben', target: 'screen_ticket' },
    { text: 'In Arbeit →', width: 140, effect: 'Das Ticket wechselt in die Spalte „In Arbeit“. Die Zähler ändern sich sofort' },
  ]);
  const card3 = ticketCard('sp_offen', 3, 232, 'Drucker im Büro 2 druckt nicht', 'Mittel · nicht zugewiesen', [
    { text: 'Öffnen', effect: 'Öffnet das Ticket mit allen Angaben', target: 'screen_ticket' },
    { text: 'In Arbeit →', width: 140, effect: 'Das Ticket wechselt in die Spalte „In Arbeit“. Die Zähler ändern sich sofort' },
  ]);
  const card7 = ticketCard('sp_arbeit', 7, 56, 'Software-Lizenz läuft ab', 'Hoch · dringend · Jonas Beck', [
    { text: 'Öffnen', width: 96, effect: 'Öffnet das Ticket mit allen Angaben', target: 'screen_ticket' },
    { text: '← Offen', width: 96, effect: 'Das Ticket wechselt zurück in die Spalte „Offen“. Die Zähler ändern sich sofort' },
    { text: 'Erledigt →', width: 112, effect: 'Das Ticket wechselt in die Spalte „Erledigt“. Die Zähler ändern sich sofort' },
  ]);
  const emptyColumnText = childElement('sp_erledigt', 'sp_erledigt_leer', 'label', 'Keine Tickets', 16, 64, 360, 40);
  const screenBoard = {
    id: 'screen_board', name: 'Board', endpunkt: false, x: 0, y: 180,
    elemente: [...boardElements, ...card4.elements, ...card3.elements, ...card7.elements, emptyColumnText],
    interaktionen: [...boardInteractions, ...card4.interactions, ...card3.interactions, ...card7.interactions],
  };

  // --- Screen 2: Ticket --------------------------------------------------------
  zOrder = 0;
  const screenTicket = {
    id: 'screen_ticket', name: 'Ticket', endpunkt: false, x: 560, y: 0,
    elemente: [
      element('t_titel', 'label', 'Ticket #4', 32, 24, 800, 40, { textgroesse: 'gross' }),
      element('t_zurueck', 'button', 'Zurück zum Board', 32, 88, 240, 40),
      element('t_angaben', 'container', 'Angaben', 32, 152, 800, 320),
      childElement('t_angaben', 't_a_titel', 'label', 'Titel: E-Mail-Postfach der Geschäftsführung läuft voll', 24, 24, 740, 40),
      childElement('t_angaben', 't_a_status', 'label', 'Stand: Offen', 24, 80, 740, 40),
      childElement('t_angaben', 't_a_prio', 'label', 'Priorität: Hoch · dringend', 24, 136, 740, 40),
      childElement('t_angaben', 't_a_wer', 'label', 'Bearbeiter: Jonas Beck', 24, 192, 740, 40),
      childElement('t_angaben', 't_a_datum', 'label', 'Gemeldet am: 04.11.2026', 24, 248, 740, 40),
    ],
    interaktionen: [interaction('i_t_zurueck', 't_zurueck', 'Zurück zum Board', 'screen_board')],
  };

  // --- Screen 3: Ticket nicht gefunden -------------------------------------------
  zOrder = 0;
  const screenNotFound = {
    id: 'screen_nicht_gefunden', name: 'Ticket nicht gefunden', endpunkt: false, x: 560, y: 540,
    elemente: [
      element('n_titel', 'label', 'Ticket nicht gefunden', 32, 24, 800, 40, { textgroesse: 'gross' }),
      element('n_text', 'label', 'Zu dieser Nummer gibt es kein Ticket.', 32, 88, 800, 40),
      element('n_zurueck', 'button', 'Zurück zum Board', 32, 152, 240, 40),
    ],
    interaktionen: [interaction('i_n_zurueck', 'n_zurueck', 'Zurück zum Board', 'screen_board')],
  };

  const project = {
    formatVersion: 16,
    name: 'Ticket-Board der HiTec GmbH',
    preset: 'desktop',
    startScreen: 'screen_board',
    screens: [screenBoard, screenTicket, screenNotFound],
    szenarien: [{
      titel: '',
      ausgangslage: 'Du bist Jonas Beck und arbeitest im Support der HiTec GmbH. Die Excel-Tabelle mit den Tickets wird durch das Ticket-Board ersetzt, und du probierst es zum ersten Mal aus.',
      aufgaben: [
        'Finde ein dringendes Ticket und sieh nach, wer sich darum kümmert.',
        'Du hast ein Ticket übernommen. Zeige allen im Team, dass es jetzt bearbeitet wird.',
        'Ein Kollege nennt dir die Ticketnummer 99. Öffne dieses Ticket.',
      ],
    }],
  };
  localStorage.setItem('wireframe.projekt', JSON.stringify(project));
  return JSON.stringify({ screens: project.screens.map((screen) => screen.name + ': ' + screen.elemente.length + ' Elemente, ' + screen.interaktionen.length + ' Interaktionen') });
})();
