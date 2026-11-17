// AB 01 – Fehlermeldungen vorhersagen
//
// Dieser Code enthält vier Fehler. Bevor du etwas startest:
//   1. Lies jede Zeile mit einer Nummer und sage vorher, ob der Compiler meckert und was er melden wird.
//   2. Starte dann im Terminal:  npm run fehler
//   3. Vergleiche deine Vorhersage mit den Meldungen.
//   4. Starte danach:  npm run fehler:laufen   und beobachte, was das Programm trotz der Fehler tut.

const anzahl: number = 'drei'; // (1)
console.log('anzahl:', anzahl);

const ticket = { id: 1, title: 'Drucker defekt' };
console.log('titel:', ticket.titel); // (2)

function verdopple(wert: number): number {
  return wert * 2;
}
console.log('verdopple("4"):', verdopple('4')); // (3)

type Status = 'offen' | 'erledigt';
const status: Status = 'wartet'; // (4)
console.log('status:', status);

export {};
