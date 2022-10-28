---
title: Verbindung zu DMG MORI Messenger
---

Sie können Ihre Maschine mit dem DMG MORI Messenger verbinden und für die Überwachung registrieren, indem Sie entweder die automatische oder die manuelle Methode verwenden.

Hinweis: Für beide Methoden benötigen Sie eine DMG MORI Messenger-Lizenz für Ihre Maschinen.

## Automatische Registrierung

Voraussetzungen für die automatische Registrierung:

- Sie müssen die Seriennummer der Maschine unter `Geräte Informationen` auf der Seite `General` des IoTconnector flex eingeben.
- Auf dem DMG MORI Messenger müssen die Organisationseinheit und das Maschinenmodell konfiguriert sein.

**Schritt 1:** Klicken Sie auf die Schaltfläche `DMG MORI Messenger Verbinden`, um den Dialog für die automatische Registrierung zu öffnen.
![DMG MORI Messenger Schaltfläche](/img/applicationinterface/messenger_button.png)

**Schritt 2:** In dem sich öffnenden Dialog geben Sie den Hostnamen (oder die IP-Adresse) Ihres DMG MORI Messenger-Servers, den Benutzernamen und das Passwort ein. Klicken Sie dann auf die Schaltfläche `Serverkonfiguration speichern`. Danach wird DMG MORI Messenger verbunden und der `Server Status` sollte `Server ist verfügbar` anzeigen. Siehe Beispielfoto unten.

![DMG MORI Messenger Server Konfiguration](/img/applicationinterface/messenger_server_configuration.png)

**Schritt 3:** Sobald der Server verfügbar ist, klicken Sie auf die Schaltfläche `Registrieren`. Es öffnet sich ein Dialog zum Ausfüllen der Registrierungsinformationen. Vergeben Sie einen Namen für Ihren Rechner, der im DMG MORI Messenger sichtbar sein wird. Wählen Sie dann Ihr Maschinenmodell, die Organisationseinheit und die Zeitzone. Sobald Sie auf Speichern klicken, wird die automatische Registrierung durchgeführt und Sie können Ihre Maschine in DMG MORI Messenger sehen.
![DMG MORI Messenger Server Registrierung](/img/applicationinterface/messenger_server_registration.png)

## Manuelle Registrierung

**Schritt 1:** Vergewissern Sie sich auf der IoTconnector flex-Seite `Application Interface`, dass der Schalter `Aktiviert` unter MTConnect aktiviert ist:

![MTConnect](/img/applicationinterface/mtconnect_enable_stream.png)

Sie können auf `MTConnect Stream öffnen` klicken, um zu überprüfen, ob der Stream funktioniert.

**Schritt 2:** Gehen Sie innerhalb von DMG MORI Messenger zu Einstellungen -> Maschinen und klicken Sie auf die Schaltfläche "Hinzufügen". Geben Sie nun die Details Ihres Rechners wie erforderlich ein.

Für `MTConnect Agent` wählen Sie `MTConnect Agent 1.3.0 (Standard)` und für `MTConnect Stream URL` geben Sie `http://<iot-connector-device-ip>:15404` ein, zum Beispiel `http://192.168.178.150:15404`. Um Ihre IP-Adresse herauszufinden, können Sie die Seite [`Network`](Network.md) in der IoTConnector flex UI aufrufen.

![DMG MORI Messenger](/img/DMGMessenger.png)

Nachdem Sie den Rechner konfiguriert haben, sollten die Daten nach ein paar Minuten auf dem Messenger-Dashboard angezeigt werden.
