# TypeScript-Werkstatt – Starter

Dieses Projekt gehört zum Tutorial **TypeScript-Werkstatt** (Angular mit TypeScript, LF10).
Die Arbeitsblätter findest du auf der Kurs-Webseite. Hier steht nur, wie du das Projekt bedienst.

## Einmal einrichten

Voraussetzung ist eine installierte Node.js-Version (LTS). Öffne das Projekt in WebStorm, öffne das Terminal (**Alt + F12**) und gib ein:

```bash
npm install
```

## Arbeiten

Du arbeitest in den drei Dateien im Ordner `src`:

| Datei | Arbeitsblatt |
|---|---|
| `ticket.ts` | AB 01 – Ein Ticket beschreiben |
| `ticket-list.ts` | AB 02 – Mit Ticketlisten arbeiten |
| `ticket-store.ts` | AB 03 – Speicher und Daten laden |

Überall, wo `TODO` steht, bist du dran. Die Dateien mit `.test.ts` im Namen, `typen.check.ts` und `sample-data.ts` brauchst du **nicht zu ändern**.

## Prüfen

| Befehl | Was er tut |
|---|---|
| `npm test` | Führt alle Tests aus. Jeder Test steht mit Namen in der Liste, rote Tests sind deine offenen Aufgaben. |
| `npm run test:watch` | Wie `npm test`, wiederholt sich aber bei jeder Änderung von selbst. |
| `npm run check` | Lässt den Compiler die Typen prüfen. |
| `npm run pruefen` | Beide Prüfungen nacheinander mit einer Zusammenfassung. |
| `npm run fehler` | Zeigt die Compiler-Fehler aus `explore/fehler-01.ts` (AB 01). |
| `npm run fehler:laufen` | Startet `explore/fehler-01.ts` trotz der Fehler (AB 01). |
| `npm run anzeige` | Startet das Experiment aus AB 03. |
| `npm run laden` | Lädt echte Tickets aus dem Netz (Zusatz in AB 03). |

Am Anfang sind alle Tests rot. Das ist richtig so. Du bist fertig, wenn `npm run pruefen` am Ende „Typen: grün“ und „Tests: grün“ meldet.
