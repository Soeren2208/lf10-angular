---
title: "Listen auswerten: Array-Methoden"
sidebar_label: "Array-Methoden"
slug: array-methoden
sidebar_position: 4
---

# Listen auswerten: Array-Methoden

Fast jede Anwendung arbeitet mit **Listen**: Tickets, Mitarbeiter, Qualifikationen. In TypeScript heißt eine Liste **Array**. Statt Schleifen zu schreiben, benutzt du **Array-Methoden**. Sie sagen, *was* du willst, und nicht, *wie* es Schritt für Schritt geht.

## 1. Pfeilfunktionen

Die Array-Methoden bekommen eine Funktion übergeben. Dafür gibt es eine kurze Schreibweise, die **Pfeilfunktion**:

```ts
const double = (n: number) => n * 2;
```

Vor dem Pfeil `=>` stehen die Parameter, dahinter der Rückgabewert. Hast du nur einen Ausdruck, entfallen `return` und die geschweiften Klammern. Mit mehreren Anweisungen schreibst du einen Block:

```ts
const describe = (ticket: Ticket) => {
  const id = ticket.id;
  return `#${id} ${ticket.title}`;
};
```

Wenn der Compiler den Parametertyp kennt, musst du ihn nicht hinschreiben. Bei Array-Methoden ist das der Fall:

```ts
tickets.filter((ticket) => ticket.priority === 1);
```

| Java | TypeScript |
|---|---|
| `ticket -> ticket.getPriority() == 1` | `(ticket) => ticket.priority === 1` |
| `(a, b) -> a.getId() - b.getId()` | `(a, b) => a.id - b.id` |

:::info `===` statt `==`
In TypeScript vergleichst du mit `===` (strikter Vergleich). Das einfache `==` wandelt Werte vorher um (`'4' == 4` ist wahr) und wird nicht benutzt.
:::

## 2. Welche Methode brauche ich?

Alle Beispiele benutzen diese Liste:

```ts
const priorities = [3, 1, 2];
```

| Ich will … | Methode | Beispiel | Ergebnis |
|---|---|---|---|
| nur manche Elemente behalten | `filter` | `priorities.filter((p) => p < 3)` | `[1, 2]` |
| aus jedem Element etwas anderes machen | `map` | `priorities.map((p) => p * 2)` | `[6, 2, 4]` |
| das **erste** passende Element | `find` | `priorities.find((p) => p > 5)` | `undefined` |
| wissen, ob **mindestens eins** passt | `some` | `priorities.some((p) => p === 1)` | `true` |
| wissen, ob **alle** passen | `every` | `priorities.every((p) => p > 0)` | `true` |
| aus allen Elementen **einen Wert** machen | `reduce` | `priorities.reduce((sum, p) => sum + p, 0)` | `6` |
| sortieren | `sort` | `[...priorities].sort((a, b) => a - b)` | `[1, 2, 3]` |
| zählen | `length` | `priorities.length` | `3` |

Die Merkhilfe lautet: **Wie viele Elemente kommen heraus?**

- `filter` liefert **gleich viele oder weniger** Elemente, aber unveränderte.
- `map` liefert **genau so viele** Elemente, aber verwandelte.
- `reduce` liefert **ein einziges** Ergebnis.
- `find` liefert **ein Element oder `undefined`**.

### Verketten

Die Methoden lassen sich hintereinander schreiben. Jede arbeitet mit dem Ergebnis der vorigen:

```ts
// Die Titel aller dringenden Tickets
tickets
  .filter((ticket) => ticket.priority === 1)
  .map((ticket) => ticket.title);
```

Für Java-Kenner: Das entspricht `stream().filter(...).map(...)`. Der Unterschied: In TypeScript brauchst du kein `stream()` am Anfang und kein `collect()` am Ende, du arbeitest direkt auf dem Array.

## 3. `find` kann ins Leere laufen

Gibt es kein passendes Element, liefert `find` den Wert `undefined`. Der Typ des Ergebnisses ist deshalb `Ticket | undefined`, und der Compiler zwingt dich, den Fall zu behandeln:

```ts
const ticket = tickets.find((t) => t.id === 99);

ticket.title;         // Fehler: Object is possibly 'undefined'
ticket?.title;        // erlaubt: undefined, wenn es das Ticket nicht gibt
ticket?.title ?? '–'; // mit Ersatzwert
```

## 4. `reduce` Schritt für Schritt

`reduce` geht die Liste Element für Element durch und trägt dabei einen **Zwischenstand** mit, den **Akkumulator**. Du gibst zwei Dinge an: eine Funktion, die aus dem bisherigen Zwischenstand und dem nächsten Element den **neuen Zwischenstand** macht, und den **Startwert**.

```ts
[3, 1, 2].reduce((sum, p) => sum + p, 0);
```

| Schritt | Zwischenstand vorher | Element | neuer Zwischenstand |
|---|---|---|---|
| Start | | | `0` (der Startwert) |
| 1 | `0` | `3` | `0 + 3 = 3` |
| 2 | `3` | `1` | `3 + 1 = 4` |
| 3 | `4` | `2` | `4 + 2 = 6` |

Am Ende ist der Zwischenstand das Ergebnis: `6`. Der Zwischenstand muss keine Zahl sein. Er kann auch ein Objekt oder eine Liste sein, zum Beispiel ein Objekt, das mitzählt, wie oft jeder Status vorkommt.

## 5. Sortieren

```ts
const priorities = [3, 1, 2];
[...priorities].sort((a, b) => a - b); // [1, 2, 3]
```

Die Funktion vergleicht zwei Elemente und liefert:

| Ergebnis | Bedeutung |
|---|---|
| kleiner als 0 | `a` kommt vor `b` |
| 0 | gleich, die Reihenfolge bleibt |
| größer als 0 | `b` kommt vor `a` |

:::warning Ohne Vergleichsfunktion sortiert `sort` als Text
`[10, 9, 1].sort()` liefert `[1, 10, 9]`, denn `'10'` kommt als Text vor `'9'`. Gib bei Zahlen immer eine Vergleichsfunktion an.
:::

:::warning `sort` verändert die Liste selbst
Anders als `filter` und `map` baut `sort` keine neue Liste, sondern ordnet die vorhandene um. Warum das ein Problem ist und wie du es vermeidest, steht im Infoblatt [Unveränderlich arbeiten](/infoblaetter/unveraenderlich).
:::
