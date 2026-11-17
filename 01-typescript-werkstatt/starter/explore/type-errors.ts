// AB 01 – Fehlermeldungen vorhersagen
//
// Dieser Code enthält vier Fehler. Bevor du etwas startest:
//   1. Lies jede Zeile mit einer Nummer und sage vorher, ob der Compiler meckert und was er melden wird.
//   2. Starte dann im Terminal:  npm run errors
//   3. Vergleiche deine Vorhersage mit den Meldungen.
//   4. Starte danach:  npm run errors:run   und beobachte, was das Programm trotz der Fehler tut.

const count: number = 'drei'; // (1)
console.log('count:', count);

const ticket = { id: 1, title: 'Drucker defekt' };
console.log('title:', ticket.tilte); // (2)

function double(value: number): number {
  return value * 2;
}
console.log('double("4"):', double('4')); // (3)

type Status = 'offen' | 'erledigt';
const status: Status = 'wartet'; // (4)
console.log('status:', status);

export {};
