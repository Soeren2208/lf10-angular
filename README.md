# Angular mit TypeScript – Lernsituationen LF10

Unterrichtsmaterial für Fachinformatiker/-innen Anwendungsentwicklung (Schulzentrum Utbremen). Es besteht aus Tutorials mit Arbeitsblättern und Infoblättern und wird als Webseite veröffentlicht.

| Tutorial | Thema |
|---|---|
| 01 TypeScript-Werkstatt | TypeScript für Angular, Support-Tickets der HiTec GmbH (in Arbeit) |

## Aufbau des Repositorys

| Ordner | Inhalt |
|---|---|
| `website/` | Die Webseite (Docusaurus): Arbeitsblätter, Infoblätter, Komponenten |
| `01-typescript-werkstatt/` | Starter-Projekt mit Tests und Musterlösung (in Arbeit) |

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
