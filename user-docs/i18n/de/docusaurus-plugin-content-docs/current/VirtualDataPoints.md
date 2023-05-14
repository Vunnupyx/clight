---
title: Virtuelle Datenpunkte
---

import Player from 'react-player/file';
import video from '../../../../static/video/vdp_calculation.mp4';

# Virtuelle Datenpunkte (VDPs)

## Einführung

Virtueller Datenpunkt (VDP) ist eine Funktion zur Erstellung eines berechneten Datenpunkts aus einem oder mehreren realen Datenpunkten oder einem zuvor definierten virtuellen Datenpunkt. Für die Berechnung des endgültigen Wertes stehen zahlreiche Operationen zur Verfügung.

**Wichtig:** Wenn ein VDP als Quelle eines anderen VDPs definiert ist, muss der Quell-VDP definiert sein, bevor er verwendet wird, und er sollte in der Liste der VDPs oben erscheinen! Andernfalls werden sie im Dropdown-Menü unter `Quellen` ausgegraut angezeigt.

#### Automatische Konvertierung von nicht-booleschen Werten in boolesche Werte

Wenn Ihre Quelle kein boolescher Wert ist und Sie eine logische, Vergleichs- oder Aufzählungsoperation verwenden, wird die Quelle bei der Auswertung für den VDP in einen booleschen Wert umgewandelt:

- Wenn der Quellwert eine Zahl ist: Jeder Wert über 0 wird als `wahr` interpretiert und 0 wird als `falsch` interpretiert.
- Wenn der Quellwert keine Zahl, sondern ein Text ist: Jede Textlänge über 0 Zeichen wird als `wahr` interpretiert, während leerer Text ("") als `falsch` interpretiert wird.

### Verfügbare Operatoren

Hinweis: Wenn Sie eine Kombination von Operationen benötigen, lesen Sie bitte den Abschnitt `Kombinieren von Operationen`.

#### Übersicht über die Operatoren:

| Name                  | Typ            | Anzahl der Quellen | Ergebnis  |
| --------------------- | -------------- | ------------------ | --------- |
| Und                   | Logisch        | Mehrfach           | Boolesch  |
| Oder                  | Logisch        | Mehrfach           | Boolesch  |
| Nicht                 | Logisch        | Einfach            | Boolesch  |
| Zähler                | Zähler         | Einfach            | Zahl      |
| Schwellenwerte        | Schwellenwert  | Einfach            | Text/Zahl |
| Größer                | Vergleich      | Einzeln            | Boolesch  |
| Größer oder gleich    | Vergleich      | Einzeln            | Boolesch  |
| Kleiner               | Vergleich      | Einzeln            | Boolesch  |
| Kleiner oder gleich   | Vergleich      | Einzeln            | Boolesch  |
| Gleich                | Vergleich      | Einzeln            | Boolesch  |
| Ungleich              | Vergleich      | Einzeln            | Boolesch  |
| Enumeration           | Enumeration    | Mehrfach           | Text/Zahl |
| Berechnung            | Mathematisch   | Mehrfach           | Zahl      |
| Energie Tariff Setzen | Enumeration    | Mehrfach           | Text      |
| Blinkerkennung        | Blinkerkennung | Einzeln            | Zahl      |

#### Operatoren:

##### Und

Art: Logisch | Anzahl der Quellen: Mehrfach | Ergebnis: Boolesch

Gibt wahr zurück, wenn alle ausgewählten Quelldatenpunktwerte wahr sind

##### Oder

Typ: Logisch | Anzahl der Quellen: Mehrfach | Ergebnis: Boolesch

Gibt wahr zurück, wenn mindestens ein ausgewählter Quelldatenpunktwert wahr ist

##### Nicht

Typ: Logisch | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt falsch zurück, wenn der Wert des Quelldatenpunkts wahr ist und vice versa

##### Zähler

Art: Zähler | Anzahl der Quellen: Einzeln | Ergebnis: Zahl

Zählt jede Zustandsänderung eines Datenpunktes (steigendes Flag der Quelle, d.h. von 0 auf 1 oder Erhöhung des Wertes) und zeigt die Gesamtzahl der Änderungen als Zahl an.

Die Zähler sind über Neustarts hinweg beständig. Zähler können auf zwei Arten zurückgesetzt werden:

- **Manuelles Zurücksetzen:** Sie können einen Zähler manuell über die Benutzeroberfläche mit der Schaltfläche `Zurücksetzen` zurücksetzen.

![Counter Manuelle Reset](/img/vdp/counter_manual_reset.png)

- **Planmäßige Rücksetzung:** Sie können einen Zähler zurücksetzen, indem Sie eine planmäßige Rücksetzungszeit einrichten. Sie können mehrere Zeitpläne eingeben und beim Hinzufügen den Monat, den Tag oder die Zeit als spezifisch oder als `Jede` auswählen. Der Zählerstand wird auf 0 zurückgesetzt, wenn die festgelegten Zeiten erreicht sind.

![Counter Schedule Reset Button](/img/vdp/counter_schedule_reset.png)

Beispiel für einen planmäßige Reset:
![Counter Schedule Example](/img/vdp/counter_scheduled_reset_example.png)

##### Schwellenwert

Typ: Schwellenwert | Anzahl der Quellen: Einzeln | Ergebnis: Text/Zahl

Gibt einen definierten Wert zurück, wenn der Schwellenwert überschritten wird. Es sind mehrere Schwellenwerte für einen Datenpunkt möglich.

Um die gewünschten Schwellenwerte einzustellen, wählen Sie die Schaltfläche Schwellenwert einstellen auf der rechten Seite, um das Dialogfenster zu öffnen:
![Schwellenwerte setzen](/img/vdp/set_threshold.png)
Geben Sie die gewünschten Schwellenwerte und den entsprechenden `Wert` ein, der der Wert des VDP sein wird, wenn der gegebene Schwellenwert überschritten wird. Die Schwellenwerte werden in aufsteigender Reihenfolge sortiert, um zu prüfen, welcher Schwellenwert von der Quelle überschritten wird, und der entsprechende `Wert` wird das Ergebnis des VDP sein.

**Beispiel**: Im folgenden Beispiel ist der virtuelle Datenpunkt mit der Bezeichnung `Tankstatus` mit der Datenquelle `AI Tank Level` verbunden, die derzeit den Wert 13,54 hat (dicke schwarze Linie im Diagramm). Es sind 3 Schwellenwerte angegeben: 5-NIEDRIG, 10-NORMAL, 20-HOCH. Da der aktuelle Wert 13,54 beträgt, ist der letzte überschrittene Schwellenwert 3-NORMAL, und daher wird der VDP-Wert `NORMAL` sein.
![Adding threshold](/img/vdp/add_threshold.png)

##### Größer

Art: Vergleich | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt wahr zurück, wenn der Datenpunktwert größer ist als der Vergleichswert.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### Größer Gleich

Typ: Vergleich | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt wahr zurück, wenn der Datenpunktwert größer oder gleich dem Vergleichswert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### Kleiner

Typ: Vergleich | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt wahr zurück, wenn der Datenpunktwert kleiner als der Vergleichswert ist.

Um den Vergleichswert bereitzustellen, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### Kleiner Gleich

Typ: Vergleich | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt wahr zurück, wenn der Datenpunktwert kleiner oder gleich dem Vergleichswert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### Gleich

Typ: Vergleich | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt wahr zurück, wenn der Datenpunktwert gleich dem Vergleichswert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### Ungleich

Typ: Vergleich | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt wahr zurück, wenn der Datenpunktwert _nicht_ gleich dem Vergleichswert ist.

Um den Vergleichswert anzugeben, verwenden Sie die Schaltfläche `Vergleichswert setzen` in der Spalte `Aktion` der Zeile.

##### Enumeration

Typ: Enumeration | Anzahl der Quellen: Einzeln | Ergebnis: Boolesch

Gibt einen Text zurück, der mit dem Wert der Quelle übereinstimmt. Diese werden über die Schaltfläche `Aufzählung setzen` in der Spalte `Aktion` bereitgestellt (siehe unten).
Schaltfläche `Aufzählung festlegen` (/img/vdp/vdp_set_enum_button.png)

In der Ansicht `Set Enumeration` können Sie einen Standardwert angeben, der angezeigt wird, wenn keine der definierten Bedingungen erfüllt ist.

![Aufzählung modal hinzufügen](/img/vdp/set_enum_default.png)

Wenn Sie auf das blaue Pluszeichen klicken, können Sie neue Bedingungen hinzufügen. Für jede dieser Bedingungen müssen Sie eine zu beobachtende Variable und den Text auswählen, der angezeigt werden soll, wenn der Quellwert `wahr` wird, indem Sie ihn in die Spalte `Wert, wenn links wahr` eingeben. Wenn die gewählte beobachtete Variable kein boolescher Wert ist, wird sie in einen booleschen Wert umgewandelt, wie in [`Automatische Umwandlung von nicht-booleschen Werten in boolesche Werte`](VirtualDataPoints.md#automatische-umwandlung-von-nicht-booleschen-Werten-zu-booleschen-Werten) erklärt.
Hinzufügen von Aufzählungen](/img/vdp/set_enum_row.png)

Hinweis: Sie können auch die Reihenfolge der Aufzählung ändern, indem Sie die Aufzählungen per Drag & Drop verschieben. Dies wirkt sich darauf aus, welcher Wert zuerst wahr ist und somit welche Aufzählung das Ergebnis des VDP ist.

**Beispiel:** Ein Beispiel mit bestimmten Werten ist im folgenden Bild zu sehen. Wenn der digitale Eingang, der das gelbe Licht repräsentiert, `wahr` ist, lautet das Aufzählungsergebnis `WARNUNG`. Wenn der digitale Eingang für grünes Licht `wahr` ist, lautet das Aufzählungsergebnis `GUT`. In allen anderen Fällen lautet das Standardergebnis `KEINE INFO`.
![Beispiel Enumerations](/img/vdp/set_enum_example.png)

##### Berechnung

Art: Mathematisch | Anzahl der Quellen: Mehrere | Ergebnis: Zahl

Benutzerdefinierter mathematischer Ausdruck unter Verwendung von Variablennamen und manueller Eingabe der mathematischen Gleichungen. Er ist nützlich, wenn mehrere Datenpunkte kombiniert werden müssen und bei komplexeren mathematischen Operationen.

**Wichtig**: Wenn Sie eine boolesche Quelle wählen, wird ihr Wert als 1 interpretiert, wenn sie wahr ist, und als 0, wenn sie falsch ist.

**Beispielvideo:**
<Player controls url={video}/>

### Hinzufügen eines virtuellen Datenpunkts

Hinzufügen neuer virtueller Datenpunkte](/img/vdp/add_vdp.png)

1. Klicken Sie auf die blaue Schaltfläche mit dem weißen Plus-Symbol. Eine neue Zeile wird der Liste der VDPs hinzugefügt.
2. Geben Sie einen Namen für Ihren neu erstellten VDP ein.
3. Wählen Sie einen Operator
4. Wählen Sie eine oder mehrere Quellen. Welcher Operator eine oder mehrere Quellen zulässt, entnehmen Sie bitte der obigen Tabelle.
   ![Auswahl der Quellen](/img/vdp/choose_source.png)
5. Betreiberspezifische Details und Einstellungen finden Sie in der obigen Beschreibung des jeweiligen Betreibers. Bei einigen Betreibern müssen Sie nach dem Speichern zusätzliche Informationen angeben.
6. Klicken Sie auf die grüne Schaltfläche rechts in der Spalte `Aktionen`, um zu speichern und die Bearbeitung zu beenden, oder klicken Sie auf das rote Kreuz, um Ihre Eingabe zu verwerfen.
7. Klicken Sie auf die Schaltfläche `Änderungen übernehmen` oben rechts auf der Seite, um Ihren neuen Datenpunkt an das Gerät zu senden.

### Kombinierte Vorgänge

Es gibt zwei Möglichkeiten, kombinierte Operationen zu erstellen, je nachdem, welche Art von Ergebnis Sie wünschen:

- Mit `Berechnung`: Wenn Sie ein numerisches Ergebnis mit einer mathematischen Operation wünschen, können Sie `Berechnung` verwenden, um mehrere Datenquellen zu kombinieren. Bitte beachten Sie die obige Erklärung.

- Erstellen Sie neue VDPs und kombinieren Sie diese: Wenn Sie ein boolesches Ergebnis aus mehreren Quellen wünschen, können Sie diese Schritt für Schritt durch mehrere VDPs kombinieren. Um zum Beispiel ein Ergebnis aus _DataPoint1 & DataPoint2 & !DataPoint3_ zu erstellen, führen Sie die folgenden 4 Schritte aus:

1. Erstellen Sie ein erstes VDP1 mit DP1 und DP2, UND-Operation
2. Erstellen Sie einen zweiten VDP2 mit DP3, NOT-Operation
3. Erstelle ein drittes endgültiges VDP3 mit VDP1, VDP2, UND-Verknüpfung
4. Das Ergebnis ist gleich dem VDP3-Wert

### So löschen Sie einen virtuellen Datenpunkt

1. Klicken Sie für den VDP, den Sie löschen möchten, auf das Müllsymbol rechts unter der Spalte `Aktionen`.
2. Wählen Sie Ja im Overlay-Dialog mit der Frage: `Sind Sie sicher, dass Sie einen Datenpunkt löschen wollen?`
3. Klicken Sie auf die Schaltfläche `Änderungen übenehmen`, um die Änderung an das Backend zu senden.
