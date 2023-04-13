---
title: 'Data source: MTConnect'
---

## Einführung

Mit dieser Datenquelle können Sie Datenpunkte von anderen Maschinen mit MTConnect Agent oder Adapter in Ihr IoTconnector flex einlesen. Derzeit wird nur der Agent unterstützt.

Oben links auf der Seite finden Sie die wichtigsten Einstellungen für die Datenquelle: Aktiviert, Maschinenname, Hostname, Port und Typ.

- Aktiviert: Zum Aktivieren und Deaktivieren der Verbindung mit der Datenquelle MTConnect.
- Maschinenname: Die Verwendung dieses Feldes ist optional. Wenn Sie den Namen der Maschine eingeben, werden nur deren Datenpunkte gelesen, andernfalls werden die Datenpunkte aller Maschinen vom MTConnect Agent/Adapter gelesen.
- Hostname: Hostname oder IP-Adresse des Rechners, auf dem der MTConnect Agent/Adapter läuft.
- Anschluss: Port für den Rechner, auf dem der MTConnect Agent/Adapter läuft.
- Typ: Agent oder Adapter. (Derzeit wird nur der Agent unterstützt)

Oben rechts auf der Seite finden Sie die Schaltflächen `MTConnect Stream öffnen` (nur wenn der Typ `Agent` ist) und `Verbindung testen`.

- MTConnect-Stream öffnen: Dies ist nur aktiv, wenn der Typ auf Agent eingestellt ist und der XML-Stream vom Host-Rechner geöffnet wird. Wenn der Maschinenname eingegeben wird, zeigt der Stream nur Datenpunkte dieser Maschine an.
- Verbindung testen: Pingt den Hostnamen an, um die Erreichbarkeit zu testen.

## Hinzufügen von Datenpunkten

Um einen Datenpunkt hinzuzufügen, klicken Sie auf die blaue Schaltfläche ![`Datenpunkt hinzufügen`](/img/datasource/addbutton.png).

Neu hinzugefügte Datenpunkte werden am unteren Rand der Tabelle angezeigt. Sie müssen einen Namen vergeben, den Typ auswählen ([siehe Abschnitt Datenpunkttypen](MTConnectDataSource.md#datenpunkttypen)) und schließlich die Adresse des Datenpunkts eingeben. Die angegebene Adresse muss mit der `dataItemId` im XML-Stream des MTConnect Agent übereinstimmen, damit ihr Wert gelesen werden kann.

Wenn Sie fertig sind, klicken Sie auf das grüne Häkchensymbol, um Ihre Änderungen zu speichern. Nachdem Sie alle Änderungen vorgenommen haben, klicken Sie bitte auf `Änderungen speichern` oben rechts auf der Seite.

Eine Beispielliste von Datenpunkten ist im folgenden Screenshot zu sehen:
![MTConnect Datenpunktliste Beispiel](/img/datasource/mtconnect_datapoints_example.png)

Nach dem Hinzufügen der Datenpunkte werden ihre aktuellen Werte gelesen und in der Tabelle angezeigt. Diese Datenpunkte können dann wie üblich in [Virtuelle Datenpunkte](VirtualDataPoints.md) und [Mapping](Mapping.md) für [Anwendungsschnittstellen](ApplicationInterface.md) verwendet werden.

### Datenpunkttypen

Es gibt zwei unterstützte Arten von Datenpunkten:

- Event
- Sample

##### Auswahl des richtigen Typs:

_Für MTConnect Agent:_
Bitte überprüfen Sie den /probe-Endpunkt Ihres XML-Streams, um die `category` des Datenpunkts zu finden, den Sie eingeben möchten. `category` kann einen der folgenden Werte haben: `EVENT`, `SAMPLE` und `CONDITION`. Sie können dann den Typ im IoTconnector flex entsprechend auswählen.

Für den MTConnect-Adapter:\_
Wenn der Datenpunkt eine Zeitreihe oder eine Zahl ist, wählen Sie bitte `Event`. Wenn es sich um einen anderen Typ handelt, wählen Sie bitte `Sample`. Wenn es sich um eine `Condition` handelt, wählen Sie bitte `Condition` (derzeit nicht unterstützt).
