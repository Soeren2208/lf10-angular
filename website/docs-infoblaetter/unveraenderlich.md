---
title: "Unveränderlich arbeiten"
sidebar_label: "Unveränderlich arbeiten"
slug: unveraenderlich
sidebar_position: 5
---

# Unveränderlich arbeiten

Ein **unveränderlicher** (immutabler) Umgang mit Daten bedeutet: Du änderst eine Liste oder ein Objekt nicht an Ort und Stelle, sondern baust eine **neue Fassung**. Das klingt umständlich, vermeidet aber eine ganze Klasse von Fehlern und ist in Angular wichtig. Dieses Infoblatt erklärt die Technik.

## 1. Das Problem: zwei Namen, eine Liste

Listen und Objekte werden nicht kopiert, wenn du sie einer anderen Variablen zuweist. Beide Namen zeigen dann auf **dasselbe** Objekt:

```ts
const a = [1, 2];
const b = a;     // keine Kopie!
b.push(3);

console.log(a);  // [1, 2, 3]  ← a hat sich mitverändert
```

Wenn eine Funktion eine Liste verändert, die du ihr übergeben hast, verändert sie **deine** Liste. Das merkst du oft erst viel später, an ganz anderer Stelle.

## 2. Verändernde und nicht verändernde Methoden

| Verändert die Liste | Liefert eine neue Liste |
|---|---|
| `push`, `pop`, `shift`, `unshift` | `filter`, `map` |
| `splice` | `slice`, `concat` |
| `sort`, `reverse` | `toSorted`, `toReversed` |

Besonders tückisch ist `sort`: Es sieht aus wie eine Abfrage („gib mir die sortierte Liste“), ordnet aber die vorhandene Liste um.

## 3. Eine Kopie mit dem Spread-Operator

Die drei Punkte `...` („Spread“) verteilen den Inhalt einer Liste oder eines Objekts in eine neue:

```ts
const a = [1, 2];

const b = [...a];          // Kopie von a
const c = [...a, 3];       // Kopie mit einem Element mehr
const d = [0, ...a];       // Kopie mit einem Element vorn
```

Bei Objekten kopierst du die Felder und überschreibst einzelne:

```ts
const ticket = { id: 3, title: 'Drucker', status: 'offen' };

const erledigt = { ...ticket, status: 'erledigt' };
// { id: 3, title: 'Drucker', status: 'erledigt' }
// ticket selbst bleibt unverändert
```

Wichtig ist die **Reihenfolge**: Was **später** steht, überschreibt, was früher kam. Deshalb steht `...ticket` zuerst und das geänderte Feld danach.

Damit schreibst du Funktionen, die ihre Eingabe in Ruhe lassen:

```ts
function withStatus(tickets: readonly Ticket[], id: number, status: Status): Ticket[] {
  return tickets.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket));
}
```

`map` baut eine neue Liste. Das geänderte Ticket ist ein **neues Objekt**, alle anderen bleiben dieselben Objekte.

:::info Die Kopie ist flach
Der Spread kopiert nur die **oberste Ebene**. Steckt in einem Feld wieder ein Objekt oder eine Liste, teilen sich Original und Kopie dieses innere Objekt. Bei den Tickets in diesem Kurs ist das kein Problem, weil ihre Felder nur Zahlen und Texte enthalten.
:::

## 4. `readonly`: Das Verbot im Typ

Mit `readonly` sagst du dem Compiler, dass eine Liste nicht verändert werden darf:

```ts
function titles(tickets: readonly Ticket[]): string[] {
  tickets.push(neu);   // Fehler: Property 'push' does not exist on type 'readonly Ticket[]'
  return tickets.map((ticket) => ticket.title);
}
```

Das ist ein **Versprechen**: „Ich verändere deine Liste nicht.“ Der Compiler hält dich daran. Die Methoden, die die Liste verändern würden (`push`, `sort`, …), gibt es auf einem `readonly`-Array gar nicht, nur die lesenden (`map`, `filter`, `find` …).

Das Wort bezieht sich nur auf die Liste selbst. Die einzelnen Tickets darin sind nicht automatisch geschützt, dafür gibt es `readonly` bei den Feldern des Interfaces.

## 5. Wozu das alles?

- **Keine Überraschungen:** Eine Funktion, die ihre Eingabe nicht ändert, ist leichter zu verstehen und zu testen.
- **Änderungen erkennbar:** Ein neues Objekt hat eine neue Identität. Ob sich etwas geändert hat, siehst du am Vergleich `alt === neu`. Wenn sich nichts geändert hat, ist es dasselbe Objekt.
- **Angular:** Signals und viele andere Mechanismen in Angular erkennen Änderungen daran, dass ein **neuer Wert** gesetzt wird. Wer eine Liste an Ort und Stelle verändert, setzt keinen neuen Wert, und die Oberfläche bleibt stehen. Dazu kommst du in AB 03.

| Java | TypeScript |
|---|---|
| `List.of(...)`, `Collections.unmodifiableList(...)` | `readonly Ticket[]` (nur im Typ, nicht zur Laufzeit) |
| `record` mit `final`-Feldern | `readonly`-Felder im Interface |
| neue Liste bauen mit `new ArrayList<>(alt)` | `[...alt]` |
