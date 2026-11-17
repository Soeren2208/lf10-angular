---
title: "Klassen in TypeScript"
sidebar_label: "Klassen"
slug: klassen
sidebar_position: 6
---

# Klassen in TypeScript

Klassen kennst du aus Java. In TypeScript sehen sie ähnlich aus, haben aber einige Eigenheiten. Dieses Infoblatt zeigt, was gleich ist und was anders.

## 1. Wann eine Klasse, wann ein Interface?

| Du willst … | Dann nimm … |
|---|---|
| die **Form von Daten** beschreiben, zum Beispiel ein Ticket aus einer JSON-Antwort | ein `interface` |
| **Zustand und Verhalten zusammenhalten**, zum Beispiel einen Speicher, der Tickets hält und verändern kann | eine `class` |

Ein Interface verschwindet beim Kompilieren, eine Klasse bleibt als Code erhalten. Daten brauchen selten eine Klasse. Dinge mit eigenem Zustand und eigenen Methoden schon. Die Bausteine, die du in Angular schreibst (Komponenten und Services), sind Klassen.

## 2. Aufbau

```ts
export class TicketStore {
  private readonly listeners = new Set<Listener>();   // Feld mit Anfangswert

  constructor(private tickets: readonly Ticket[] = []) {}   // Konstruktor

  all(): readonly Ticket[] {                              // Methode
    return this.tickets;
  }
}
```

- **Felder** stehen am Anfang der Klasse. Sie haben einen Typ, und oft auch gleich einen Anfangswert.
- Der **Konstruktor** heißt immer `constructor`.
- **Methoden** schreibst du ohne das Wort `function`. Der Rückgabetyp steht hinter den Klammern.
- Auf Felder und Methoden der eigenen Klasse greifst du mit `this.` zu. Das Wort ist **immer nötig**, anders als in Java.
- **Sichtbarkeit:** `public` (Voreinstellung, das Wort kannst du weglassen), `protected` und `private`.

## 3. Konstruktor-Attribute

In Java schreibst du ein Feld, einen Konstruktor-Parameter und die Zuweisung. In TypeScript geht es in einem Schritt: Ein **Modifizierer** vor dem Konstruktor-Parameter (`private`, `public`, `protected` oder `readonly`) macht aus dem Parameter gleichzeitig ein **Feld** und weist es zu.

```ts
// ausführlich
class TicketStore {
  private tickets: readonly Ticket[];
  constructor(tickets: readonly Ticket[] = []) {
    this.tickets = tickets;
  }
}

// kurz: dasselbe
class TicketStore {
  constructor(private tickets: readonly Ticket[] = []) {}
}
```

Der Konstruktor bekommt dann einen leeren Körper `{}`. Diese Kurzschreibweise ist in TypeScript und in Angular verbreitet.

## 4. `private` gibt es nur beim Schreiben

Wie alle Typinformationen verschwindet `private` beim Kompilieren. Der Compiler verbietet den Zugriff von außen, aber im laufenden JavaScript wäre er möglich. Echte Zugriffssperren gibt es mit `#`: `#tickets` ist auch zur Laufzeit nicht erreichbar. Für die meisten Programme genügt `private`.

## 5. Die Falle: `this` geht verloren

`this` bedeutet „das Objekt, auf dem die Methode aufgerufen wurde“. Gibst du eine Methode **ohne** ihr Objekt weiter, weiß sie nicht mehr, zu wem sie gehört:

```ts
sampleTickets.forEach(store.add);
// TypeError: Cannot read properties of undefined (reading 'tickets')
```

Zwei Auswege:

```ts
sampleTickets.forEach((ticket) => store.add(ticket));   // Pfeilfunktion drumherum
sampleTickets.forEach(store.add.bind(store));           // oder fest an das Objekt binden
```

Der Compiler meldet diesen Fehler nicht, er zeigt sich erst beim Ausführen. Die Pfeilfunktion drumherum ist der übliche Weg.

## 6. Von Java nach TypeScript

| Java | TypeScript |
|---|---|
| Felder mit Gettern und Settern | oft öffentliche Felder, geschützt mit `readonly` |
| Feld, Parameter und Zuweisung im Konstruktor | Konstruktor-Attribut: `constructor(private x: X) {}` |
| `this` ist optional | `this.` ist immer nötig |
| Methode weitergeben behält ihr Objekt | Methode weitergeben verliert `this` |
| Methoden überladen (gleicher Name, mehrere Implementierungen) | pro Name nur **eine** Implementierung, dafür optionale Parameter oder Union-Typen |
| `private` auch zur Laufzeit wirksam | `private` nur beim Schreiben, `#` auch zur Laufzeit |
| `implements` ist Pflicht | nicht nötig, die passende Form genügt (nur auf Wunsch zur Absicherung) |
