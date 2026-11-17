---
title: "Was ist TypeScript – und warum gibt es das?"
sidebar_label: "Warum TypeScript?"
slug: warum-typescript
sidebar_position: 2
---

# Was ist TypeScript – und warum gibt es das?

Angular-Projekte schreibt man in TypeScript. Warum eigentlich nicht gleich in JavaScript? Die Antwort steckt in der Geschichte beider Sprachen und in einem Problem, das mit der Größe der Programme gewachsen ist.

## 1. Ausgangspunkt: JavaScript

JavaScript entstand **1995** bei Netscape (entwickelt von Brendan Eich), für **kleine Skripte im Browser**: ein Formular prüfen, ein Menü aufklappen. **1997** wurde die Sprache unter dem Namen *ECMAScript* standardisiert. Bis heute ist sie die einzige Programmiersprache, die jeder Browser direkt ausführt.

JavaScript ist **dynamisch typisiert**: Den Typ hat der **Wert**, nicht die Variable, und er wird erst geprüft, wenn der Code läuft. Wo ein Typ nicht passt, rät JavaScript und wandelt um:

```js
console.log('4' + 4);   // "44"  der Text wird mit der Zahl zusammengeklebt
console.log('4' * 2);   // 8     der Text wird zur Zahl
console.log('3' - 1);   // 2
```

Dieselbe Schreibweise ergibt einmal einen Text und einmal eine Zahl. Für ein kurzes Skript ist das bequem.

## 2. Das Problem: Die Programme wurden groß

Aus den kleinen Skripten wurden **komplette Anwendungen** im Browser (Webmail, Kartendienste, Verwaltungsprogramme wie dein EMS). Sie umfassen zehntausende Zeilen und werden von Teams über Jahre gepflegt. Dann zeigen sich die Schwächen der dynamischen Typen:

| Problem | Beispiel |
|---|---|
| **Fehler erst beim Ausführen** | Ein Tippfehler wie `ticket.titel` meldet nichts, das Ergebnis ist einfach `undefined`. Den Fehler bemerkt erst der Nutzer. |
| **Schwer zu ändern** | Du benennst ein Feld um. Wo wird es überall benutzt? Kein Werkzeug kann es sicher sagen. |
| **Editor kann wenig helfen** | Ohne bekannte Typen gibt es keine verlässlichen Vorschläge und keine Warnungen. |
| **Code schwer zu lesen** | Welche Felder hat dieses Objekt? Was darf ich dieser Funktion übergeben? Man muss raten oder den ganzen Code lesen. |

Java kennt dieses Problem nicht in dieser Form, weil dort der Compiler die Typen **vor** dem Start prüft. JavaScript hat keinen solchen Prüfer.

## 3. Die Antwort: TypeScript

Eine neue Sprache für den Browser war keine Lösung, denn die Browser sprechen nur JavaScript. Also entstand eine **Schicht darüber**:

- **TypeScript** wurde bei **Microsoft** entwickelt, unter der Leitung von Anders Hejlsberg (der auch Turbo Pascal, Delphi und C# entworfen hat). Es wurde im **Oktober 2012** öffentlich vorgestellt, die Version **1.0** erschien im **April 2014**. Es ist Open Source.
- Das Prinzip: Du schreibst JavaScript und ergänzt **Typen**. Ein **Compiler** prüft sie und erzeugt daraus gewöhnliches JavaScript. Die Typen sind danach wieder verschwunden.
- TypeScript baut auf JavaScript auf. Alles, was du aus JavaScript kennst, funktioniert weiter. Das erlaubt, Typen **schrittweise** einzuführen.

## 4. Der Durchbruch und der Stand heute

Verbreitet hat sich TypeScript vor allem durch **Angular**: Das Angular-Team entschied **2015**, die nächste Version (Angular 2, erschienen im September 2016) in TypeScript zu schreiben. Seitdem ist TypeScript die Sprache der Angular-Entwicklung. Auch viele andere große Webprojekte nutzen es, zum Beispiel mit Node.js.

Die Sprache entwickelt sich weiter. Im **Juli 2026** erschien TypeScript 7: Der Compiler wurde komplett neu geschrieben und läuft deutlich schneller, die Sprache selbst ist dieselbe geblieben. Angular 22 verlangt noch TypeScript 6.0, deshalb arbeitet dieser Kurs mit dieser Version.

## 5. Was dir TypeScript bringt

- **Fehler früh:** Tippfehler und falsche Werte findet der Compiler beim Schreiben, nicht der Nutzer beim Benutzen.
- **Hilfe im Editor:** WebStorm kennt die Typen. Es schlägt dir Felder und erlaubte Werte vor und kann Namen sicher umbenennen.
- **Lesbarer Code:** Ein Typ ist ein Vertrag: „Diese Funktion bekommt ein Ticket und liefert einen Text.“ Das steht im Code, du musst es nicht raten.

## 6. Was TypeScript nicht kann

TypeScript prüft **nur beim Schreiben**. Zur Laufzeit gibt es keine Typen mehr. Besonders wichtig: Daten, die von außen kommen (zum Beispiel eine JSON-Antwort einer Schnittstelle), prüft TypeScript nicht. Ein Interface *behauptet*, wie die Daten aussehen. Ob die Schnittstelle sich daran hält, weiß erst das laufende Programm. Wie du damit umgehst, kommt in AB 03.

Weiter geht es mit dem Infoblatt [Typen: Daten beschreiben](/infoblaetter/typen).

Die offizielle Dokumentation findest du unter [typescriptlang.org](https://www.typescriptlang.org/docs/).
