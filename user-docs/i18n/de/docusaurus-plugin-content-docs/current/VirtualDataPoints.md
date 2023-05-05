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

| Name                | Typ            | Anzahl der Quellen | Ergebnis  |
| ------------------- | -------------- | ------------------ | --------- |
| Und                 | Logisch        | Mehrfach           | Boolesch  |
| Oder                | Logisch        | Mehrfach           | Boolesch  |
| Nicht               | Logisch        | Einfach            | Boolesch  |
| Zähler              | Zähler         | Einfach            | Zahl      |
| Schwellenwerte      | Schwellenwert  | Einfach            | Text/Zahl |
| Größer              | Vergleich      | Einzeln            | Boolesch  |
| Größer oder gleich  | Vergleich      | Einzeln            | Boolesch  |
| Kleiner             | Vergleich      | Einzeln            | Boolesch  |
| Kleiner oder gleich | Vergleich      | Einzeln            | Boolesch  |
| Gleich              | Vergleich      | Einzeln            | Boolesch  |
| Ungleich            | Vergleich      | Einzeln            | Boolesch  |
| Enumeration         | Enumeration    | Mehrfach           | Text/Zahl |
| Berechnung          | Mathematisch   | Mehrfach           | Zahl      |
| Blinkerkennung      | Blinkerkennung | Einzeln            | Zahl      |

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

##### BLINKERKENNUNG

Art: Blinkerkennung | Anzahl der Quellen: Einzeln | Ergebnis: Zahl (0, 1 oder 2)

Dieses VDP wird verwendet, um ein Blinkerkennungsverhalten für einen einzelnen Quellwert (aus einer Datenquelle oder einem anderen VDP) zu definieren. Mit den anpassbaren Einstellungen kann das gewünschte Verhalten für eine Blinkerkennung festgelegt werden.

###### Definition der Begriffe:

`Zeitrahmen`: Ein gleitendes Zeitfenster. Es wird verwendet, um steigende Flanken innerhalb dieses Zeitraums zu überprüfen, um den Blinkstatus zu bestimmen.
`Steigende Flanke`: Änderung eines Quellwertes von `falsch` auf `wahr`.
`Fallende Flanke`: Wechsel eines Quellwerts von `wahr` auf `falsch`.

###### Einstellbare Parameter:

Mit den folgenden einstellbaren Parametern können Sie das Verhalten der Blinzelerkennung anpassen. Die angegebenen Einstellungen gelten nur für diesen VDP, so dass verschiedene VDPs unterschiedliche Einstellungen haben können.

| Name                                   | Erlaubter Wertebereich      | Beschreibung                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zeitrahmen                             | 1000-120000 (Millisekunden) | Zeitspanne in Millisekunden, in der eine bestimmte Anzahl steigender Flanken auftreten muss, um den Blinkstatus des Quellwerts zu erkennen                                                                                                                                                                                                                                    |
| Steigende Flanken                      | 1-10 (Anzahl)               | Anzahl der steigenden Flanken, die erforderlich sind, um einen Blinkzustand innerhalb des definierten Zeitrahmens zu bestimmen                                                                                                                                                                                                                                                |
| Verknüpfte Blinkerkennungen (Optional) | -                           | Optional können Sie andere Signale als Abhängigkeit verknüpfen. Wenn der verknüpfte Eingang zu blinken beginnt, wird die Blinkerkennung dieses Signals zurückgesetzt, um die Ausgabe beider Signale zu synchronisieren. Für einige Anwendungsfälle ist es nützlich, dass beide Signale gleichzeitig blinken, obwohl der Blinkbeginn zu unterschiedlichen Zeitpunkten erfolgt. |

###### Ergebnis des VDP:

Das Ergebnis des VDPs zeigt den Status der angeschlossenen Quelle an. Mögliche Ergebnisse dieses VDPs sind:

- 0 = AUS
- 1 = AN
- 2 = BLINKEN

###### Logik und Beispiele für die Blinzelerkennung:

- Die Signale werden am Ausgang um die Länge des Zeitrahmens verzögert, auch wenn kein Blinken erkannt wird. Damit soll sichergestellt werden, dass alle Werte innerhalb des Zeitrahmens ausgewertet werden, um ein mögliches Blinkverhalten zu erkennen.
  > Beispiel: Angenommen, das Zeitfenster beträgt 10 Sekunden und die Anzahl der steigenden Flanken ist 3. Jeder Quellwert wird 10 Sekunden später am Ausgang angezeigt. Wenn innerhalb dieser 10 Sekunden 3 steigende Flanken erkannt werden, hat der Ausgang den Wert 2 (BLINKEN), andernfalls ist sein Wert 1 (AN) oder 0 (AUS), je nach dem Wert der Quelle.
- Wenn genügend steigende Flanken vorhanden sind, wird das Blinken am Ende des Zeitrahmens aktiviert, und die Zeitspanne wird ab der ersten steigenden Flanke innerhalb dieses Zeitrahmens gezählt. Selbst wenn also ein Blinken in der Mitte des Zeitrahmens erkannt wird, wird der Blinkstatus am Ende des Zeitrahmens angezeigt. Das Ergebnis von VDP ist dann 2 (BLINKEN).
  > Beispiel: Angenommen, das Zeitfenster beträgt 10 Sekunden und die Anzahl der steigenden Flanken ist 3. Wenn die Quelle 3 steigende Flanken in 6 Sekunden hat, wird das Ergebnis des Blinkens noch angezeigt, wenn 10 Sekunden nach der ersten steigenden Flanke vergangen sind. Der Wert danach hängt wieder von den Werten der Quelle und der Anzahl der erkannten steigenden Flanken ab.
- Nach Beendigung des Blinkens der Quelle wird der erste Wert für ein langes Zeitfenster beibehalten.
  > Beispiel: Angenommen, das Zeitfenster beträgt 10 Sekunden und der Wert der Quelle ändert sich zu false, wenn das Blinken endet. Dann wird der Ausgang 10 Sekunden lang als falsch angezeigt, auch wenn sich der Wert der Quelle innerhalb von 10 Sekunden ändert.
- Wenn ein verknüpftes Signal angeschlossen ist, setzt die ansteigende Flanke des verknüpften Signals das Blinkverhalten des Hauptsignals für eine bestimmte Zeitspanne zurück. Der letzte Wert des Hauptsignals vor dem Zurücksetzen wird während des Zeitrahmens als Ausgabe angezeigt. Dies wird verwendet, um den Blinkstatus von zwei oder mehr verbundenen Signalen zu synchronisieren.
  > Beispiel: Angenommen, der Zeitrahmen beträgt 10 Sekunden, die Anzahl der steigenden Flanken ist 3 und VDP2 hängt von VDP1 ab. Wenn VDP1 eine steigende Flanke hat, kann VDP2 10 Sekunden lang seit der steigenden Flanke von VDP1 keinen blinkenden Status haben. Außerdem wird während dieser Zeit der Ausgang von VDP2 10 Sekunden lang als letzter Wert vor dem Zurücksetzen angezeigt.

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
