---
title: Anwendungsschnittstellen
---

## Einleitung

`Anwendungsschnittstellen` bieten die Möglichkeit, Daten aus dem IoTconnector flex an externe Anwendungen zu exportieren. Die aus den Datenquellen ausgelesenen und aufbereiteten Daten können so von externen Anwendungen, wie z.B. dem DMG MORI Messenger, oder Cloud-Plattformen weiterverarbeitet werden.

Die aktuell unterstützten Schnittstellen/Protokolle sind:

- `MTConnect` (Schnittstelle für DMG MORI Messenger, andere Applikationen)
- `OPC UA` (Schnittstelle für andere Anwendungen, wie z.B. UA Expert)
- `CELOS Xchange` (Schnittstelle für DMG MORI Cloud-Anwendungen, wie z.B. Tulip)

## Allgemeine Verwendung

![](/img/applicationinterface/overview.png)

Im ersten Setup-Prozess können Sie die gewünschten `Anwendungsschnittstellen` auswählen. Abhängig von den gewählten Templates sind auf jedem Schnittstellen-Reiter vorgewählte `Datenpunkte` verfügbar.

Für jedes Protokoll mit Ausnahme von `CELOS Xchange` können Sie einen `Datenpunkt` in der Liste hinzufügen, löschen oder bearbeiten. Für `OPC UA` können Sie Ihre eigenen benutzerdefinierten Variablen erstellen. Es ist auch möglich, die Schnittstelle komplett zu aktivieren oder zu deaktivieren.

Für protokollspezifische Einstellungen, lesen Sie bitte den entsprechenden Abschnitt.

### Zuordnung eines Datenpunkts zu den Anwendungsschnittstellen

Sie können nur Datenpunkte auf `MTConnect` und `OPC UA` zuordnen. Sobald Sie den gewünschten Datenpunkt in der Liste der Anwendungsschnittstelle Ihrer Wahl haben, wird er über die Seite [`Mapping`](Mapping.md) zugeordnet. Hier sehen Sie, wie Sie ihn der erforderlichen Quelle zuordnen:

- Haben Sie Ihre Datenquelle oder den gewünschten virtuellen Datenpunkt fertig konfiguriert.
- Gehen Sie auf die Seite [`Mapping`](Mapping.md) und erstellen Sie ein neues Mapping.
- Wählen Sie Ihren Quelldatenpunkt.
- In der Spalte `Ziel` werden die Datenpunkte in der Anwendungsschnittstelle angezeigt. Wählen Sie den Punkt aus, den Sie zuordnen möchten.
- Sobald Sie die Änderungen gespeichert und übernommen haben, ist die Zuordnung abgeschlossen und Sie können auf der Seite `Anwendungsschnittstelle` sehen, dass dieser Datenpunkt ein grünes Häkchen vor seinem Namen hat, wie auf dem Beispielfoto unten gezeigt. Der Wert ist dann für die betreffende Anwendung sichtbar.

![Zugeordneter Datenpunkt](/img/applicationinterface/mapped_application_interface_datapoint.png)

### Einen neuen Datenpunkt hinzufügen

Sie können nur Datenpunkte zu `MTConnect` und `OPC UA` hinzufügen. Folgen Sie diesen Schritten, um einen neuen Datenpunkt hinzuzufügen:

1. Klicken Sie auf die blaue Schaltfläche mit dem weißen Plus-Symbol
2. Wählen Sie den gewünschten Datenquellenpunkt aus dem eingeblendeten Overlay aus und klicken Sie auf die Pfeilschaltfläche
3. Das Overlay verschwindet, und in der Liste erscheint ein neuer bearbeitbarer Eintrag.
4. Geben Sie den gewünschten Namen für diesen Datenpunkt ein. Der aktuelle Text ist nur ein Platzhalter.
5. (optional) Ändern Sie den Typ des Datenpunktes wie gewünscht.
6. (optional) Geben Sie einen Anfangswert für Ihren Datenpunkt ein.
7. (optional) Fügen Sie ein Mapping für die empfangenen Werte hinzu. Diese Zuordnung ähnelt der `Enumeration` in virtuellen Datenpunkten und ordnet den endgültigen Wert einem anderen Text/einer anderen Zahl zu, die Sie eingeben. Siehe Beispielfoto unten.
8. Klicken Sie auf die grüne Schaltfläche zum Speichern oder auf das rote Kreuz, um Ihre Eingabe zu verwerfen.
9. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um Ihren neuen Datenpunkt an das Gerät zu senden.

Hinweis: Das grüne Häkchen neben dem Datenpunkt (Beispiel auf dem Foto unten) ist nur sichtbar, wenn für diesen Datenpunkt ein [Mapping (siehe oben)](ApplicationInterface.md#mapping-a-data-point-to-the-application-interfaces) vorgenommen wurde.
![Hinzugefügte Datenpunkte](/img/applicationinterface/applicationinterface_added_datapoint.png)

### Löschen eines neuen Datenpunktes

Sie können nur Datenpunkte zu `MTConnect` und `OPC UA` löschen. Folgen Sie diesen Schritten, um einen Datenpunkt zu löschen:

1. Klicken Sie auf der rechten Seite des Eintrags, den Sie löschen möchten, im Abschnitt `Aktionen` auf das Müllsymbol
2. Wählen Sie Ja in dem sich öffnenden Overlay mit der Frage: "Sind Sie sicher, dass Sie den Datenpunkt löschen wollen?"
3. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um die Änderung an das Backend zu senden.

### Einen Datenpunkt bearbeiten

Sie können nur Datenpunkte zu `MTConnect` und `OPC UA` bearbeiten. Gehen Sie wie folgt vor, um einen Datenpunkt zu bearbeiten:

1. Klicken Sie auf der rechten Seite des Eintrags, den Sie löschen möchten, im Abschnitt `Aktionen` auf das Bleistiftsymbol
2. Der Listeneintrag kann nun wie ein neu erstellter Datenpunkt bearbeitet werden (siehe: Einen neuen Datenpunkt hinzufügen: Schritt 4 und weiter).
3. Nach den letzten Änderungen klicken Sie auf die grüne Schaltfläche zum Speichern oder auf das rote Kreuz, um den Eintrag zu verwerfen.
4. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um Ihren neuen Datenpunkt an das Gerät zu senden.
