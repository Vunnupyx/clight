---
title: 'Datenquelle: Input Board'
---

## Einführung

Mit dieser Datenquelle können Sie elektrische Signale an Ihr IoTconnector flex Gerät anschließen. Die Signale können entweder digital (Sink oder Source, 0V/24V) oder analog (0-10V oder 0-20mA) sein. Dies ist besonders nützlich, wenn Sie ältere Geräte ohne digitale Steuerung anschließen wollen oder eine Maschine, bei der der Zugriff auf die Steuerung nicht möglich ist.

Oben auf der Seite finden Sie die wichtigsten Einstellungen für die Datenquelle: Aktivieren und Auswählen des Typs.

## Ändern des Typs der Eingabekarte

Über das Dropdown-Menü Typ oben auf der Seite können Sie auswählen, welchen Typ von Eingabekarte Sie verwenden.

![Input Board Typen](/img/datasource/inputboard_types.png)

## Standardmäßige Konfiguration

Standardmäßig ist die Datenquelle wie folgt konfiguriert:

- DI0 - Not-Aus
- DI1 - Stapelleuchte: Rot
- DI2 - Stack-Licht: Gelb
- DI3 - Stack-Leuchte: Grün
- DI4 - Stack-Leuchte: Blau
- AI0 - Stromsensor
- AI1 - Nicht verwendet

## Analoge Eingänge

Bei Analogeingängen müssen Sie die richtige Konfiguration von 100A- oder 150A-Sensoren wählen, damit die Skalierung korrekt auf den Wert erfolgt.

#### Jumper-Einstellungen für Analogeingänge

Bei SIEMENS SIMATIC IOT2050 müssen Sie die Jumper richtig setzen, um die Analogeingänge zu aktivieren. Bitte schauen Sie im Benutzerhandbuch von SIEMENS SIMATIC IOT2050 nach, um Details zu erfahren.

## Hinzufügen von Datenpunkten

![Eingangskarte Datenpunkt hinzufügen](/img/datasource/inputboard_add.png)

Um einen Datenpunkt hinzuzufügen, klicken Sie auf den blauen `Datenpunkt Hinzufügen` Button ![Add data point button](/img/datasource/addbutton.png).

Neu hinzugefügte Datenpunkte werden am unteren Rand der Tabelle angezeigt. Sie müssen einen Namen vergeben und die Adresse des Datenpunkts auswählen (siehe Foto unten). Wenn Sie fertig sind, klicken Sie auf das grüne Häkchen, um Ihre Änderungen zu speichern. Wenn Sie alle Änderungen vorgenommen haben, klicken Sie bitte auf `Änderungen übernehmen` oben rechts auf der Seite.

![Eingangskarte Neuer Datenpunkt](/img/datasource/inputboard_newdatapoint.png)

## Blinkender Zustand der digitalen Eingänge

Digitaleingänge haben einen speziellen Blinkstatus (Wert=2), wenn ihr Eingang innerhalb von 10 Sekunden dreimal von 0 auf 1 (steigende Flags) wechselt. Dieser Zustand wird als Wert = 2 angesehen (im Vergleich zu 0=falsch und 1=wahr). Dieser Status wird zurückgesetzt, wenn die Flags innerhalb von 10 Sekunden weniger als dreimal aufsteigen.
