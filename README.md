# Angular mit TypeScript – Lernsituationen LF10

Unterrichtsmaterial für Fachinformatiker/-innen Anwendungsentwicklung (Schulzentrum Utbremen). Es besteht aus Tutorials mit Arbeitsblättern und Infoblättern und wird als Webseite veröffentlicht.

| Tutorial | Thema |
|---|---|
| 01 TypeScript-Werkstatt | TypeScript für Angular, Support-Tickets der HiTec GmbH |

## Aufbau des Repositorys

| Ordner | Inhalt |
|---|---|
| `website/` | Die Webseite (Docusaurus): Arbeitsblätter, Infoblätter, Komponenten |
| `01-typescript-werkstatt/starter/` | Das Projekt, das die Schüler bekommen: Platzhalter (`TODO`), fertige Tests. Wird als eigenes Repository veröffentlicht (siehe unten) |
| `01-typescript-werkstatt/solution/` | Die Musterlösung, gegen dieselben Tests grün |

## TypeScript-Werkstatt: Lösung und Starter pflegen

Die **Lösung ist die Quelle**. Die Tests, die Beispieldaten und die Konfiguration stehen nur dort und werden in den Starter kopiert. Im Starter geändert werden nur `src/ticket.ts`, `src/ticket-list.ts`, `src/ticket-store.ts` und die `README.md`.

```bash
cd 01-typescript-werkstatt
node sync-starter.mjs     # gemeinsame Dateien aus der Lösung in den Starter kopieren
node verify-both.mjs      # Lösung und Starter gegeneinander prüfen
```

`verify-both.mjs` stellt sicher, dass

- die gemeinsamen Dateien in beiden Projekten identisch sind,
- in der Lösung alle Tests und die Typ-Prüfung grün sind,
- im Starter alle Tests rot sind und alle Typ-Prüfungen offen,
- bewusst eingebaute Fehler in der Lösung (Mutanten) von den Tests oder vom Compiler erkannt werden.

Es braucht Node.js ab Version 22.12 und installiert die Abhängigkeiten selbst (`npm install`).

### Den Starter für die Schüler veröffentlichen

Die Schüler **klonen** den Starter aus einem eigenen Repository: [Soeren2208/lf10-typescript-werkstatt](https://github.com/Soeren2208/lf10-typescript-werkstatt). Der Ordner `starter/` hier ist die einzige Quelle, in dem Repository wird nie von Hand gearbeitet. Nach jeder Änderung an Lösung oder Starter:

```bash
cd 01-typescript-werkstatt
node verify-both.mjs                 # alles in Ordnung?
node publish-starter.mjs             # Starter in den lokalen Klon ../lf10-typescript-werkstatt kopieren und committen
node publish-starter.mjs --push      # ... und nach GitHub schieben
```

Der lokale Klon wird beim ersten Aufruf neben diesem Repository angelegt.

### Namenskonvention

Bezeichner im Code (Variablen, Funktionen, Dateien, npm-Skripte) sind **englisch**. Deutsch sind Zeichenketten-Inhalte (z. B. Status `'offen'`), Kommentare, Testbeschreibungen und die Arbeitsblätter. Die Komponenten der Webseite (`website/src/components`) stammen aus der Spring-Seite und haben teils deutsche Namen; sie sind Webseiten-Technik und nicht Teil des Schülercodes.

## Webseite lokal ansehen

```bash
cd website
npm install
npm start
```

Lokal sind **alle** Tutorials sichtbar, auch die noch nicht freigeschalteten.

## Tutorials freischalten

Welche Tutorials veröffentlicht werden, steuert die Repository-Variable `TUTORIALS`
(Settings → Secrets and variables → Actions → Variables):

| Wert | Wirkung |
|---|---|
| `keine` | nur die Infoblätter |
| `tutorial-01` | Tutorial 01 und die Infoblätter |
| `tutorial-01,tutorial-02` | mehrere Tutorials |

Danach unter **Actions** den Workflow „Website bauen und veröffentlichen“ mit *Run workflow* starten. Es ist kein Commit nötig. Ein nicht freigeschaltetes Tutorial wird nicht gebaut und ist unter seiner Adresse nicht erreichbar.

## Für Kollegen: eigene Kopie

Der Quelltext leitet seine Adresse aus dem Repository ab. Ein Fork veröffentlicht deshalb ohne Änderung unter dem eigenen Konto: Fork anlegen, Pages (Quelle *GitHub Actions*) aktivieren, Variable `TUTORIALS` setzen, Workflow starten.
