# TypeScript-Werkstatt – Starter

Dieses Projekt gehört zum Tutorial **TypeScript-Werkstatt** (Angular mit TypeScript, LF10, Schulzentrum Utbremen).
Die Arbeitsblätter findest du auf der Kurs-Webseite: <https://soeren2208.github.io/lf10-angular/>. Hier steht nur, wie du das Projekt bedienst.

## Projekt holen und einrichten

Voraussetzungen sind Node.js (LTS) und Git, siehe das Infoblatt „Entwicklungsumgebung einrichten“ auf der Kurs-Webseite.

```bash
git clone https://github.com/Soeren2208/lf10-typescript-werkstatt.git
cd lf10-typescript-werkstatt
npm install
```

In WebStorm geht das Klonen auch über **Clone Repository** auf dem Startbildschirm. Das Terminal öffnest du mit **Alt + F12**.

## Arbeiten

Du arbeitest in den drei Dateien im Ordner `src`:

| Datei | Arbeitsblatt |
|---|---|
| `ticket.ts` | AB 01 – Ein Ticket beschreiben |
| `ticket-list.ts` | AB 02 – Mit Ticketlisten arbeiten |
| `ticket-store.ts` | AB 03 – Speicher und Daten laden |

Überall, wo `TODO` steht, bist du dran. Die Dateien mit `.test.ts` im Namen, `types.check.ts` und `sample-data.ts` brauchst du **nicht zu ändern**.

## Prüfen

| Befehl | Was er tut |
|---|---|
| `npm run test:ab01` | Führt nur die Tests von AB 01 aus. Jeder Test steht mit Namen in der Liste, rote Tests sind deine offenen Aufgaben. |
| `npm run test:ab02` | Nur die Tests von AB 02. |
| `npm run test:ab03` | Nur die Tests von AB 03. |
| `npm test` | Führt alle Tests aus (die Ausgabe ist lang). |
| `npm run test:watch` | Wie `npm test`, wiederholt sich aber bei jeder Änderung von selbst. |
| `npm run check` | Lässt den Compiler die Typen prüfen. |
| `npm run verify` | Beide Prüfungen nacheinander mit einer Zusammenfassung. |
| `npm run errors` | Zeigt die Compiler-Fehler aus `explore/type-errors.ts` (AB 01). |
| `npm run errors:run` | Startet `explore/type-errors.ts` trotz der Fehler (AB 01). |
| `npm run display` | Startet das Experiment aus AB 03. |
| `npm run load` | Lädt echte Tickets aus dem Netz (Zusatz in AB 03). |

Am Anfang sind alle Tests rot, ein Arbeitsblatt macht jeweils seine eigenen grün. Das ist richtig so. Du bist fertig, wenn `npm run verify` am Ende „Typen: grün“ und „Tests: grün“ meldet.

## Deinen Stand sichern

Du hast auf dieses Repository nur Leserechte, ein `git push` wird abgelehnt. Wenn du deine Lösungen sichern willst, lege auf GitHub ein **eigenes, leeres Repository** an und zeige dein Projekt darauf:

```bash
git remote set-url origin https://github.com/<dein-name>/<dein-repository>.git
git add -A
git commit -m "Meine Lösungen"
git push -u origin main
```

Neue Fassungen dieses Starters holst du dann nicht mehr automatisch. Sag deiner Lehrkraft Bescheid, falls ein Fehler im Starter korrigiert wurde.
