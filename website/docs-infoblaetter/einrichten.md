---
title: "Entwicklungsumgebung einrichten"
sidebar_label: "Einrichten"
slug: einrichten
sidebar_position: 1
---

# Entwicklungsumgebung einrichten

Bevor es losgeht, brauchst du auf deinem Rechner zwei Programme: **Node.js** und die Entwicklungsumgebung **WebStorm**. Unter Windows kommt eine kleine Einstellung für die PowerShell dazu. Das dauert etwa eine Viertelstunde. Am Ende prüfst du, ob alles funktioniert.

| Schritt | Was | Wofür |
|---|---|---|
| 1 | Node.js installieren | führt TypeScript-Programme und die Angular-Werkzeuge aus |
| 2 | WebStorm installieren | der Editor, in dem du den Code schreibst |
| 3 | PowerShell einstellen (nur Windows) | damit Befehle wie `ng` im Terminal laufen dürfen |
| 4 | Prüfen | Kontrolle, dass alles zusammenpasst |

## 1. Node.js installieren

Node.js ist eine Laufzeitumgebung für JavaScript. Mit ihr laufen deine Tests, und Angular nutzt sie für den Bau der Anwendung.

1. Öffne [nodejs.org](https://nodejs.org) in deinem Browser.
2. Lade den Installer für dein Betriebssystem herunter. **Wähle die Version mit dem Zusatz „LTS“** (*Long Term Support*, zurzeit Version 26).
3. Starte den Installer und klicke dich mit den voreingestellten Werten durch.

:::warning LTS, nicht „Current"
Auf der Seite gibt es manchmal auch eine Version mit dem Zusatz „Current". Nimm sie nicht: Angular unterstützt nur die LTS-Versionen. Eine falsche Version zeigt später beim Starten eine Warnung, und manche Befehle laufen dann nicht.
:::

:::tip Hast du Node.js schon?
Dann öffne ein Terminal und gib `node -v` ein. Installiere trotzdem die aktuelle LTS-Version: Sie ersetzt die alte, und Angular unterstützt ältere Versionen nicht mehr.
:::

## 2. WebStorm installieren

WebStorm ist die Entwicklungsumgebung für Webprojekte. Sie zeigt dir Fehler schon beim Tippen an und hat ein eigenes Terminal.

1. Lade WebStorm von [jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download/) herunter und installiere es.
2. Starte WebStorm und melde dich mit deinem **JetBrains-Account** an, dem die Schullizenz zugeordnet ist. Wie du an die Lizenz kommst, hat deine Lehrkraft dir mitgeteilt.

:::tip Falls die Lizenz noch nicht da ist
WebStorm ist für nicht-kommerzielle Nutzung wie das Lernen kostenlos. Melde dich mit deinem JetBrains-Account an und wähle **Start Non-Commercial Use**. Später kannst du auf die Schullizenz wechseln.
:::

## 3. PowerShell einstellen (nur Windows)

Das Terminal in WebStorm benutzt unter Windows die PowerShell. Sie lässt standardmäßig keine Skripte laufen, und genau solche Skripte brauchen die Angular-Werkzeuge. Ohne die Einstellung erscheint später eine Fehlermeldung wie diese:

```text
ng.ps1 kann nicht geladen werden, da die Ausführung von Skripts auf diesem System deaktiviert ist.
```

So stellst du es einmalig ein. **Du brauchst dafür keine Administratorrechte.**

1. Öffne die Windows-**PowerShell** wie ein normales Programm (Startmenü, „PowerShell" eintippen). Starte sie *nicht* als Administrator.
2. Gib diesen Befehl ein und drücke Enter:

   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

3. Bestätige die Rückfrage mit **J** (bei englischer Oberfläche **Y**) und Enter.
4. Kontrolle: Gib `Get-ExecutionPolicy -List` ein. In der Zeile `CurrentUser` muss `RemoteSigned` stehen.

:::info Was bewirkt das?
`RemoteSigned` erlaubt Skripte, die auf deinem Rechner liegen, und blockiert unsignierte Skripte, die du aus dem Internet geladen hast. Die Einstellung gilt nur für dein Benutzerkonto (`-Scope CurrentUser`). Eine Änderung für den ganzen Rechner ist nicht nötig.
:::

Unter macOS und Linux entfällt dieser Schritt.

## 4. Prüfen, ob alles funktioniert

1. Starte WebStorm **neu**, wenn es während der Installation schon offen war.
2. Öffne in WebStorm das Terminal (**Alt + F12**) oder ein beliebiges Terminal.
3. Gib diese beiden Befehle ein:

   ```bash
   node -v
   npm -v
   ```

Beide müssen eine Versionsnummer anzeigen, zum Beispiel `v26.13.1` und `11.11.0`. Die genauen Zahlen unterscheiden sich, wichtig ist, dass keine Fehlermeldung kommt.

## Wenn etwas nicht klappt

| Meldung oder Problem | Ursache | Lösung |
|---|---|---|
| `node` wird nicht erkannt | Das Terminal kennt die neue Installation noch nicht | WebStorm und das Terminal schließen und neu öffnen, notfalls den Rechner neu starten |
| `Ausführung von Skripts … deaktiviert` | Die PowerShell-Einstellung fehlt | Schritt 3 durchführen und WebStorm neu starten |
| `node -v` zeigt eine ungerade Zahl (z. B. `v25`) | Es ist eine „Current"-Version installiert | Die LTS-Version von [nodejs.org](https://nodejs.org) installieren |
| `node -v` zeigt eine kleinere Nummer als die LTS-Version | Eine alte Version ist installiert | Die aktuelle LTS-Version installieren, sie ersetzt die alte |

## Später für das Projekt: Git

Für das Gruppenprojekt brauchst du außerdem **Git**, um den Quelltext vom GitHub-Konto deiner Gruppe zu laden. Das ist für die ersten Tutorials noch nicht nötig. Die Anleitung dazu kommt, wenn das Projekt startet.
