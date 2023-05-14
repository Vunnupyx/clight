---
title: 'Datenquelle: Energie'
---

## Einführung

Mit dieser Datenquelle können Sie einen Energiezähler an Ihr IoTconnector flex Gerät anschließen. Sie können dann die Datenpunkte aus dem Energiezähler auslesen und sie in IoTconnector flex weiterverarbeiten und einem Datenpunkt der Anwendungsschnittstelle zuordnen.

Hinweis: Derzeit werden nur Phoenix Contact EMpro Energiezähler unterstützt.

Oben links auf der Seite finden Sie die wichtigsten Einstellungen für die Datenquelle: Aktivieren, Host für den Energiezähler und Auswahl des Typs. Unten sehen Sie den [`Current Tariff`](Energy.md#tarif), der weiter unten erklärt wird.

Oben rechts auf der Seite sehen Sie den Verbindungsstatus zum Energiezähler und die Schaltfläche `Verbindung Testen`, um die Erreichbarkeit des Zählers zu prüfen.

## Hinzufügen von Datenpunkten

Die möglichen Datenpunkte sind unten aufgelistet und können über die blaue Schaltfläche "Datenpunkt hinzufügen" und dann über die Schaltfläche "Auswählen" innerhalb der Zeile hinzugefügt werden.

| Adresse          | Typ     | Beschreibung                                                                                                                         |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| IN               | Messung | Effektivwert Strom IN                                                                                                                |
| P                | Messung | Summe der Wirkleistung nach DIN EN 61557-12 mit Vorzeichen. >0: Bedarf <0: Lieferung IN                                              |
| Q                | Messung | Vektorielle Gesamtblindleistung nach DIN EN 61557-12 mit Vorzeichen als Summe der Einzelblindleistungen. >0: Bedarf <0: Lieferung IN |
| S                | Messung | Vektorielle Gesamtscheinleistung nach DIN EN 61557-12 IN                                                                             |
| PF               | Messung | Vektorieller Gesamtleistungsfaktor mit Vorzeichen nach IEEE. >0: induktiv <0: kapazitiv                                              |
| Ea+              | Zähler  | Gesamtwirkenergiebedarf                                                                                                              |
| Ea-              | Zähler  | Gesamte Wirkenergieabgabe                                                                                                            |
| Er+              | Zähler  | Gesamter Blindenergiebedarf                                                                                                          |
| Ea-              | Zähler  | Gesamte Blindenergielieferung                                                                                                        |
| T`X` Ea+         | Zähler  | Wirkenergiebedarf seit letzter Rückstellung im Tarif `X`                                                                             |
| T`X` Ea-         | Zähler  | Wirkenergieabgabe seit der letzten Rückstellung im Tarif `X`                                                                         |
| T`X` Er+         | Zähler  | Blindenergiebedarf seit der letzten Rückstellung im Tarif `X`                                                                        |
| T`X` Er-         | Zähler  | Blindenergieabgabe seit der letzten Rückstellung im Tarif `X`                                                                        |
| T`X` Es          | Zähler  | Scheinenergie seit der letzten Rückstellung im Tarif `X`                                                                             |
| T`X` Er          | Zähler  | Blindenergie ohne Vorzeichen seit der letzten Rückstellung im Tarif `X`                                                              |
| T`X` Laufzeit    | Zähler  | Laufzeit seit der letzten Rückstellung im Tarif `X`                                                                                  |
| Tarif            | Gerät   | Auswahl eines Tarifs, 0: kein Tarifzähler aktiv, 1: Tarif 1, 2: Tarif 2, 3: Tarif 3, 4: Tarif 4                                      |
| Firmware-Version | Gerät   | Firmware-Revisionsnummer                                                                                                             |
| Hardware-Version | Gerät   | Hardware-Revisionsnummer                                                                                                             |
| Seriennummer     | Gerät   | Seriennummer                                                                                                                         |
| MAC-Adresse      | Gerät   | Geräte-MAC-Adresse                                                                                                                   |
| Artikelnummer    | Gerät   | Artikelnummer                                                                                                                        |

## Tarif

Der Tarif wird auf dem Energiezähler verwendet, um den Energieverbrauch zur besseren Analyse zu kategorisieren. Diese werden als Tarife bezeichnet, und es sind 4 Tarife verfügbar:

- Tarif 1 (T1): Bereit (STANDBY)
- Tarif 2 (T2): Bereit zur Verarbeitung (READY_FOR_PROCESSING)
- Tarif 3 (T3): Warmlauf (WARM_UP)
- Tarif 4 (T4): Verarbeitung (PROCESSING)

Durch die Zuordnung der Energiezählung zu diesen Tarifen können Sie klar erkennen, wie jeder Maschinenstatus Energie verbraucht. In der Datenpunktliste können Sie sehen, dass einige Datenpunkte T1, T2, T3 oder T4 in ihrem Namen haben. Dies sind die vier oben genannten Tarife, so dass der Energieverbrauch für jeden Tarif entsprechend beobachtet werden kann.

### Wie wird der aktuelle Tarif angezeigt?

Damit der aktuelle Tarif oben links auf der Datenquellenseite korrekt angezeigt wird, müssen Sie den Datenpunkt `tariff-number` in die Tabelle der Datenpunkte aufnehmen. Dies ist über zwei Optionen möglich: Manuelles Hinzufügen des Datenpunkts mit der Methode `Datenpunkt hinzufügen` oder durch Auswahl der EEM-Kit-Vorlage aus dem [`Konfigurationsassistenten`](GettingStarted.md#configuration-wizard).

Nachdem der Datenpunkt `tariff-number` hinzugefügt wurde, sieht er ähnlich aus wie in der folgenden Abbildung, und der aktuelle Tarif zeigt den entsprechenden Wert an.

Hinweis: `tariff-number` ist ein obligatorischer Datenpunkt und kann daher nicht gelöscht werden.

![Datenpunkt Energietarifnummer](/img/datasource/EnergyTariffNumberDatapoint.png)

### Wie wird der Tarif automatisch gesetzt?

Der Tarif kann automatisch auf einen der oben genannten Tarife eingestellt werden, indem der erforderliche virtuelle Datenpunkt (VDP) eingerichtet wird.

Dieser VDP dient dazu, eine gewünschte Quelle einem bestimmten Tarif zuzuordnen, so dass der Tarif automatisch aktiviert wird, wenn diese Bedingung erfüllt ist.

Um den VDP hinzuzufügen, gehen Sie bitte zur Seite `Virtuelle Datenpunkte` und fügen Sie den VDP mit dem Typ `Set Energy Tariff` hinzu. Geben Sie ihm dann einen Namen und speichern Sie ihn. Das Ergebnis sieht dann so aus wie auf dem folgenden Screenshot:

![Energietarif festlegen VDP](/img/datasource/EnergyTariffVdp.png)

Hinweis: Dieser VDP kann nur einmal hinzugefügt werden.

Nachdem Sie den VDP hinzugefügt haben, bearbeiten Sie ihn, um einige `Quellen` auszuwählen, die als Grundlage für die Aktivierung der entsprechenden Tarifnummer verwendet werden sollen. Diese Quellen können aus Datenpunkten der `Datenquelle` oder aus anderen VDPs stammen, die eine eigene Logik haben.

Nachdem Sie die Quellen ausgewählt haben, klicken Sie bitte auf die Schaltfläche "Aufzählung einstellen" auf der rechten Seite und der folgende Dialog wird geöffnet.

![VDP-Dialog Energietarif festlegen](/img/datasource/EnergyTariffVdpDialog.png)

Hier können Sie die gewünschte Quelle der gewünschten Tarifnummer zuordnen. Immer wenn der Wert der Quelle `true` ist (boolesch wahr, oder einen positiven ganzzahligen Wert oder einen Text hat), dann wird der Tarif aktiv. Wenn mehrere Bedingungen für die Tarifnummer erfüllt sind, wird das Ergebnis in der Prioritätsreihenfolge der im Dialog angezeigten Tarife ausgewählt. Sie können die Prioritätsreihenfolge der Tarifnummern per Drag&Drop umstellen.

Die resultierende Tarifnummer wird dann auf dem Energiezähler aktiviert und der Zähler ordnet den Energieverbrauch von diesem Moment an diesem Tarif zu und Sie können den aktiven Tarif auch auf der Seite Energiedatenquelle sehen.

Weitere Informationen über die Verwendung dieser VDP-Aufzählung finden Sie [`hier`](VirtualDataPoints.md#enumeration).
