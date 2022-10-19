---
title: Virtual Data Points
---

# Virtuelle Datenpunkte (VDPs)

## Introduction

## Einführung

Virtueller Datenpunkt (VDP) ist eine Funktion zur Erstellung eines berechneten Datenpunkts aus einem oder mehreren realen Datenpunkten. Ein zuvor definierter virtueller Datenpunkt kann auch als Eingabe für einen VDP verwendet werden. Es sind viele Verknüpfungsoperationen möglich.

Wichtig: Wenn ein virtueller Datenpunkt als Quelle eines anderen virtuellen Datenpunkts definiert wird, muss der virtuelle Quelldatenpunkt definiert werden, bevor er verwendet wird!

Hinweis: Alle Operationen außer `Berechnung` wandeln den Quellwert in wahr/falsch (boolesch) um, während sie für den VDP ausgewertet werden:

- Wenn der Quellwert eine Zahl ist: Jeder Wert über 0 wird als `wahr` und der Wert 0 wird als `falsch` interpretiert.
- Wenn der Quellwert keine Zahl, sondern ein Text ist: Jede Textlänge über 0 Zeichen wird als `wahr` interpretiert, während ein leerer Text "" zu `falsch` wird.

### Hinzufügen eines virtuellen Datenpunkts

![ Hinzufügen eines virtuellen Datenpunkts](/img/vdp/add_vdp.png)

1. Klicken Sie auf die blaue Schaltfläche mit dem weißen Plus-Symbol. Eine neue Zeile wird in der Liste der virtuellen Datenpunkte hinzugefügt.
2. Geben Sie einen Namen für Ihren neu erzeugten VDP ein.
3. Wählen Sie einen Operator
4. Wählen Sie eine oder mehrere Quellen
   ![Auswahl der Quellen](/img/vdp/choose_source.png)
5. Spezifische Details und Einstellungen zu den Betreibern finden Sie in der Beschreibung des jeweiligen Betreibers weiter unten. Bei einigen Betreibern müssen Sie zusätzliche Informationen angeben, um speichern zu können.
6. Klicken Sie auf die grüne Schaltfläche rechts in der Spalte `Aktionen`, um zu speichern und die Bearbeitung zu beenden, oder klicken Sie auf das rote Kreuz, um Ihre Eingabe zu verwerfen.
7. Klicken Sie auf die Schaltfläche `Änderungen übernehmen` oben rechts auf der Seite, um Ihren neuen Datenpunkt an das Gerät zu senden.

### Verfügbare Operatoren

Hinweis: Wenn Sie eine Kombination von Operationen benötigen, lesen Sie bitte den Abschnitt `Kombinieren von Operationen`.

##### UND

_Logisches UND:_ gibt wahr zurück, wenn alle ausgewählten Datenpunktwerte wahr sind
Eine Mehrfachauswahl von Quellen ist möglich.

##### ODER

_Logisches ODER:_ Gibt wahr zurück, wenn mindestens ein ausgewählter Datenpunktwert wahr ist.
Eine Mehrfachauswahl von Quellen ist möglich.

##### NICHT

_Logische NICHT:_ Gibt falsch zurück, wenn der Datenpunktwert true ist und umgekehrt
Es kann nur eine Quelle ausgewählt werden.

##### ZÄHLER

Zählt jede Zustandsänderung (steigende Flagge der Quelle) eines Datenpunkts und zeigt sie als Zahl an.

Die Zähler bleiben über Neustarts hinweg bestehen. Wenn Sie die Zähler zurücksetzen müssen, müssen Sie die Datei, in der sie gespeichert sind, löschen.

Es kann nur eine Quelle für die Zählung ausgewählt werden.

##### Schwellwerte

Gibt den definierten Wert zurück, wenn der Schwellenwert überschritten wird. Es sind mehrere Schwellenwerte für einen Datenpunkt möglich.

Wählen Sie beim Hinzufügen der Variablen die Schaltfläche Schwellenwert setzen auf der rechten Seite, um Schwellenwerte hinzuzufügen:
![Schwellenwerte setzen](/img/vdp/set_threshold.png)
Geben Sie die gewünschten Schwellenwerte und den entsprechenden `Wert` ein, der der Wert des VDP sein wird, wenn der gegebene Schwellenwert überschritten wird.
![Schwellenwert hinzufügen](/img/vdp/add_threshold.png)
Im obigen Beispiel ist der virtuelle Datenpunkt mit der Bezeichnung `Tankstatus` mit der Datenquelle `[AI] Tankstatus` verbunden, die derzeit den Wert 8,23 hat, und mit den angegebenen Schwellenwerten wird der Wert des virtuellen Datenpunkts `NORMAL´ sein.

##### ENUMERATION

Gibt einen Text zurück, der mit dem Wert der Quelle übereinstimmt. Diese werden über die Schaltfläche `Enumeration festlegen` in der Spalte `Aktion` bereitgestellt (siehe unten).

In der Ansicht "Set Enumeration" können Sie einen Standardwert angeben, der angezeigt wird, wenn keine der definierten Bedingungen erfüllt ist
![Enumeration modal hinzufügen](/img/vdp/set_enum_default.png)

Wenn Sie auf das blaue Pluszeichen klicken, können Sie neue Bedingungen hinzufügen. Für jede dieser Bedingungen müssen Sie eine Variable wählen, die beobachtet werden soll, und den Text, der angezeigt werden soll, wenn der Quellwert `wahr` wird, indem Sie ihn in die Spalte "Wert, wenn die linke Seite wahr ist" eingeben.
[Enumeration hinzufügen](/img/vdp/set_enum_row.png)

Ein Beispiel mit bestimmten Werten ist hier zu sehen:
![Beispiel für das Hinzufügen von Enumeration](/img/vdp/set_enum_example.png)

##### GRÖSSER

Gibt wahr zurück, wenn der Datenpunktwert größer ist als der andere verglichene Datenpunktwert.

Wenn Sie wahr benötigen, wenn er auch gleich ist, verwenden Sie bitte den Operator `Größer Gleich`.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### GRÖSSER GLEICH

Gibt wahr zurück, wenn der Datenpunktwert größer oder gleich dem anderen verglichenen Datenpunktwert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### KLEINER

Gibt wahr zurück, wenn der Datenpunktwert kleiner ist als der andere verglichene Datenpunktwert.

Wenn Sie wahr brauchen, wenn er auch gleich ist, verwenden Sie bitte den Operator `Kleiner Gleich`.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### KLEINER GLEICH

Gibt wahr zurück, wenn der Datenpunktwert kleiner oder gleich dem anderen verglichenen Datenpunktwert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### GLEICH

Gibt wahr zurück, wenn der Datenpunktwert gleich dem anderen verglichenen Datenpunktwert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### UNGLEICH

Gibt wahr zurück, wenn der Datenpunktwert _nicht_ gleich dem anderen verglichenen Datenpunktwert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### KALKULATION

Benutzerdefinierter mathematischer Ausdruck unter Verwendung von Variablennamen und manueller Eingabe der mathematischen Gleichungen. Es ist nützlich, wenn mehrere Datenpunkte kombiniert werden müssen und bei komplexeren mathematischen Operationen.

Ein Beispiel ist zu folgen.

### Kombinieren von Operationen

Es gibt zwei Möglichkeiten, kombinierte Operationen zu erstellen:

- Mit `Kalkulation`:

Bitte beachten Sie die obige Erklärung.

- Erstellen neuer VDPs und Kombinieren dieser:

Zum Beispiel, um die folgende Gleichung mit mehreren VDPs zu erstellen: _DP1 & DP2 & !DP3_

1. Erstellen Sie einen ersten VDP1 mit DP1 und DP2, UND-Verknüpfung
2. Erstellen Sie ein zweites VDP2 mit DP3, NOT-Operation
3. Erstelle ein drittes endgültiges VDP3 mit VDP1, VDP2, UND-Verknüpfung
4. Das Ergebnis ist gleich dem VDP3-Wert

### So löschen Sie einen virtuellen Datenpunkt

1. Klicken Sie auf der rechten Seite des zu löschenden Eintrags in der Spalte `Aktionen` auf das Müllsymbol
2. Wählen Sie "Ja" in dem sich öffnenden Overlay mit der Frage: "Sind Sie sicher, dass Sie den Datenpunkt [Datenpunktname] löschen möchten?"
3. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um die Änderung an das Backend zu senden.
