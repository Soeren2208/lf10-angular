// AB 01 – Fehlermeldungen vorhersagen
//
// Dieser Code enthält vier Fehler. Bevor du etwas startest:
//   1. Lies jede Zeile mit einer Nummer und sage vorher, ob der Compiler meckert und was er melden wird.
//   2. Starte dann im Terminal:  npm run fehler
//   3. Vergleiche deine Vorhersage mit den Meldungen.

const anzahl: number = 'drei'; // (1)

const ticket = { id: 1, title: 'Drucker defekt' };
console.log(ticket.titel); // (2)

function verdopple(wert: number): number {
  return wert * 2;
}
verdopple('4'); // (3)

type Status = 'offen' | 'erledigt';
const status: Status = 'wartet'; // (4)

export { anzahl, status };
