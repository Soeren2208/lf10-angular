---
title: "Daten laden: async und await"
sidebar_label: "async und await"
slug: async-await
sidebar_position: 7
---

# Daten laden: `async` und `await`

Daten aus dem Netz brauchen Zeit: Die Anfrage geht los, die Antwort kommt irgendwann. Das Programm darf in der Zwischenzeit nicht stehen bleiben, sonst friert die Oberfläche ein. Dieses Infoblatt erklärt, wie TypeScript damit umgeht.

## 1. Das Problem: Warten

Im Browser läuft dein Code in **einem** Ablauf. Wenn eine Funktion auf das Netz wartet und nichts anderes erledigt wird, reagiert die Seite nicht mehr. Deshalb gibt es Funktionen, die ihr Ergebnis **nicht sofort** liefern, sondern eine **Zusage** darauf.

## 2. Promise: die Zusage

Ein **`Promise<T>`** ist die Zusage auf einen Wert vom Typ `T`, der später da sein wird. Es kann drei Zustände haben:

| Zustand | Bedeutung |
|---|---|
| wartend (*pending*) | Das Ergebnis ist noch nicht da |
| erfüllt (*fulfilled*) | Das Ergebnis ist da, der Wert ist verfügbar |
| abgelehnt (*rejected*) | Es ist etwas schiefgegangen, ein Fehler steht bereit |

Die Funktion `fetch(url)` ruft eine Adresse ab und liefert ein `Promise<Response>`.

## 3. `async` und `await`

Mit **`await`** wartest du auf eine Zusage und bekommst den Wert, ohne dass das Programm blockiert. `await` darfst du nur in einer Funktion benutzen, die mit **`async`** gekennzeichnet ist. Eine solche Funktion liefert selbst immer ein `Promise`.

```ts
async function loadTickets(url: string): Promise<Ticket[]> {
  const response = await fetch(url);          // wartet auf die Antwort
  return (await response.json()) as Ticket[]; // wartet auf das Auslesen
}
```

Der Rückgabetyp ist `Promise<Ticket[]>`, obwohl du im Code `Ticket[]` zurückgibst. TypeScript packt den Wert für dich in ein `Promise`. Wer die Funktion aufruft, benutzt wieder `await`:

```ts
const tickets = await loadTickets('https://…/tickets.json');
```

Der Code liest sich wie ein gewöhnliches Programm von oben nach unten, auch wenn dazwischen gewartet wird.

## 4. `fetch` und die Fehlerantwort

Eine Falle, die fast jeder einmal erlebt: `fetch` meldet einen **Fehler nur dann, wenn das Netz selbst scheitert** (kein Internet, Adresse unbekannt). Antwortet der Server mit `404` oder `500`, ist das für `fetch` **kein Fehler**: Du bekommst eine ganz normale Antwort. Du musst sie selbst prüfen:

| Eigenschaft von `response` | Bedeutung |
|---|---|
| `response.ok` | `true` bei einem Status von 200 bis 299 |
| `response.status` | der Statuscode, zum Beispiel `404` |
| `response.json()` | liest den Inhalt als JSON (liefert wieder ein `Promise`) |

```ts
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```

## 5. Fehler abfangen

Mit `throw` löst du einen Fehler aus, mit `try` und `catch` fängst du ihn ab. Bei einem `await` auf eine abgelehnte Zusage wird der Fehler an der Stelle des `await` ausgelöst, genau wie ein `throw`:

```ts
try {
  const tickets = await loadTickets(url);
} catch (error: unknown) {
  // hier landen alle Fehler aus dem try-Block
}
```

Der Fehler im `catch` hat den Typ `unknown`: Man kann in JavaScript **alles** werfen, nicht nur Fehlerobjekte. Deshalb prüfst du, was es ist, bevor du es benutzt:

```ts
const text = error instanceof Error ? error.message : String(error);
```

## 6. `Result`: das Scheitern als Ergebnis

Mit `throw` und `try/catch` entscheidet der Aufrufer, ob er den Fehler behandelt. Der Compiler zwingt ihn nicht dazu. Eine Alternative: Die Funktion wirft **nie**, sondern liefert ein Ergebnis, das **entweder** die Daten **oder** den Fehler enthält. Dafür nimmst du einen Union-Typ:

```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: string };
```

Weil das Feld `ok` bei den beiden Möglichkeiten verschieden ist, kann der Compiler anhand einer Prüfung erkennen, welche vorliegt (*Narrowing*):

```ts
const result = await loadTicketsSafe(url);

if (result.ok) {
  console.log(result.data.length);   // hier gibt es data
} else {
  console.log(result.error);         // hier gibt es error
}

result.data;   // Fehler: Property 'data' does not exist on type 'Result<Ticket[]>'
```

Wer das Ergebnis benutzt, **muss** zuerst `ok` prüfen, sonst lässt der Compiler es nicht zu. Genau diese Form (laden, Fehler, Erfolg) brauchst du in der Oberfläche später immer wieder.

## 7. Der Compiler glaubt dir: Daten von außen

`response.json()` liefert die Daten, ohne dass sie jemand prüft. Mit `as Ticket[]` **behauptest** du, dass sie die Form eines Tickets haben:

```ts
return (await response.json()) as Ticket[];
```

Der Compiler glaubt dir. Ob die Schnittstelle sich wirklich daran hält, weiß er nicht, und zur Laufzeit gibt es keine Typen mehr, die es prüfen könnten. Liefert der Server ein Ticket ohne `title`, merkst du das erst, wenn dein Code darauf zugreift. Deshalb gilt: **Typen am Rand der Anwendung sind Behauptungen.** Mehr dazu steht im Infoblatt [Was ist TypeScript – und warum gibt es das?](/infoblaetter/warum-typescript).

## 8. Von Java nach TypeScript

| Java | TypeScript |
|---|---|
| `Future<T>`, `CompletableFuture<T>` | `Promise<T>` |
| `future.get()` blockiert | `await promise` blockiert nicht, nur die Funktion pausiert |
| geprüfte Ausnahmen (`throws`) | keine, jeder Fehler kann geworfen werden |
| `catch (Exception e)` | `catch (error: unknown)`, danach prüfen |

:::info Ausblick: Angular
Die Anfragen in Angular (`HttpClient`) liefern kein `Promise`, sondern ein **Observable**. Es ist verwandt: ein Wert, der sich über die Zeit ändert, und jemand, der Bescheid bekommt. In AB 03 baust du dafür eine einfache Fassung selbst.
:::
