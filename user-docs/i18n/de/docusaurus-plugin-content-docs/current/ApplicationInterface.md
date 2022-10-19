---
title: Anwendungsschnittstellen
---

## Einführung

`Anwendungsschnittstellen` stellen die Schnittstellenprotokolle im IoT-Connector flex bereit. Die aus den Datenquellen ausgelesenen Prozessdaten können so von externen Applikationen, wie z.B. DMG MORI MONITORING, oder Cloud-Plattformen weiterverarbeitet werden.

Die aktuell unterstützten Schnittstellen/Protokolle sind:

- `MTConnect` (Schnittstelle für DMG MORI MONITORING, andere Anwendungen)
- `OPC UA` (Schnittstelle für andere Anwendungen, z. B. UA Expert)
- `CELOS Xchange` (Schnittstelle für DMG MORI Cloud-Anwendungen, wie z.B. Tulip)

## Allgemeine Verwendung

![](/img/applicationinterface/overview.png)

Im ersten Setup-Prozess können Sie die gewünschten `Anwendungsschnittstellen` auswählen. Abhängig von den gewählten Templates sind auf jeder Registerkarte `Datenpunkte` vorgewählt.

Für jedes Protokoll mit Ausnahme von `CELOS Xchange` ist es möglich, einen `Datenpunkt` in der Liste hinzuzufügen, zu löschen oder zu bearbeiten. Es ist auch möglich, die Schnittstelle komplett zu aktivieren oder zu deaktivieren.

Für protokollspezifische Einstellungen lesen Sie bitte den entsprechenden Abschnitt.

### Hinzufügen eines neuen Datenpunkts

Das Hinzufügen eines neuen Datenpunkts zur Datenpunktliste ist sehr einfach und unkompliziert.

1. Klicken Sie auf die blaue Schaltfläche mit dem weißen Plus-Symbol
2. Wählen Sie den gewünschten Datenquellenpunkt aus dem eingeblendeten Overlay aus und klicken Sie auf die Pfeilschaltfläche
3. Das Overlay verschwindet, und in der Liste erscheint ein neuer bearbeitbarer Eintrag.
4. Geben Sie den gewünschten Namen für diesen Datenpunkt ein. Der aktuelle Text ist nur ein Platzhalter.
5. (optional) Ändern Sie den Typ des Datenpunktes wie gewünscht.
6. (optional) Geben Sie einen Anfangswert für Ihren Datenpunkt ein.
7. (optional) Fügen Sie eine Zuordnung für die empfangenen Werte hinzu
8. Klicken Sie auf die grüne Schaltfläche, um den Bearbeitungsstatus zu verlassen, oder klicken Sie auf das rote Kreuz, um Ihre Eingabe zu verwerfen.
9. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um Ihren neuen Datenpunkt an das Gerät zu senden.

### Löschen eines neuen Datenpunktes

Auch das Löschen eines neuen Datenpunktes ist ein einfacher Vorgang.

1. Klicken Sie auf der rechten Seite des Eintrags, den Sie löschen möchten, im Abschnitt `Aktionen` auf das Müllsymbol
2. Wählen Sie in dem sich öffnenden Fenster mit der Frage Ja: "Sind Sie sicher, dass Sie den Datenpunkt [Datenpunktname] löschen möchten?"
3. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um die Änderung an das Backend zu senden.

### Datenpunkt bearbeiten

Ebenso wie beim Löschen eines neuen Datenpunktes ändern Sie die Eingaben für einen Datenpunkt

1. Klicken Sie auf der rechten Seite des zu löschenden Eintrags im Abschnitt `Aktionen` auf das Bleistiftsymbol
2. Der Listeneintrag ist nun wie ein neu erstellter Datenpunkt editierbar (siehe: Neuen Datenpunkt hinzufügen: Schritt 4 und weiter).
3. Nach den letzten Änderungen klicken Sie auf den grünen Haken, um den Bearbeitungsstatus zu verlassen oder klicken Sie auf das rote Kreuz, um Ihren Eintrag zu verwerfen.
4. Klicken Sie auf die Schaltfläche `Änderungen übernehmen`, um Ihren neuen Datenpunkt an das Gerät zu senden.

### MTConnect-spezifische Konfigurationen und Optionen

Die Registerkarte MTConnect-Schnittstelle verfügt über eine zusätzliche Schaltfläche `MTConnect-Stream öffnen` unter dem Verbindungsstatus, um den aktuellen MTConnect-Datenstrom in einer neuen Browser-Registerkarte anzuzeigen.

![Schaltfläche MTConnect-Stream öffnen](/img/applicationinterface/mtconnectstream.png)

### OPC UA

Die Registerkarte OPC UA Schnittstelle verfügt über ein Dropdown-Menü zur Auswahl der gewünschten Authentifizierungseinstellung für diese Schnittstelle. Der Benutzer kann wählen:

- Anonym (Keine Authentifizierung erforderlich)
- Benutzer/Passwort (Nur der eingegebene Benutzername und das Passwort erlauben den Zugriff auf die Schnittstelle)

![OPC UA Autorisierungsoptionen](/img/applicationinterface/opcuaauth.png)

### CELOS Xchange

Wenn Sie die `CELOS Xchange`-Schnittstelle verwenden, ist keine zusätzliche Konfiguration erforderlich. Alle vorkonfigurierten Datenpunkte werden automatisch an die `CELOS Xchange`-Cloud-Instanz gesendet, sofern sie im Abschnitt "Mapping" korrekt zugeordnet wurden.
