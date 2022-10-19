---
title: Änderungsliste
---

# Änderungsliste

## [2.3.0]

### Behoben

- [DIGMDCLGHT-187](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-187) Reconnecting zu Sinumeriks funktioniert nun auch, wenn keine PLC angeschlossen ist und verhindert Laufzeitabsturz, wenn NC-Variablen gelesen werden, wenn nur eine Verbindung zur PLC besteht
- [DIGMDCLGHT-178](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-178) und [DIGMDCLGHT-189](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-189) IP-Adressen konnten nicht gesetzt werden, wenn das Gerät keine IP-Adresse gesetzt hat
- [DIGMDCLGHT-188](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-188) Enum virtual data point konnte manchmal nicht gesetzt werden
- MTConnect-IDs korrigiert

### Hinzugefügt

- [DIGMDCLGHT-197](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-197) Benutzerdokumentation unterstützt die Sprachen Deutsch und Japanisch
- [DIGMDCLGHT-129](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-129) Unterstützung für benutzerdefinierte Datenpunkte wurde hinzugefügt.
- [DIGMDCLGHT-175](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-175) Unterstützung für OPC UA Schema Version 2.0.18 wurde hinzugefügt. Unterstützt die Verwendung der Konfigurationsdatei zwischen verschiedenen Rechnern. Ignoriert, wenn die benutzerdefinierte Knoten-ID mit einer bestehenden übereinstimmt.
- [DIGMDCLGHT-103](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-103) Unterstützung für benutzerdefinierte mathematische Ausdrücke für virtuelle Datenpunkte wurde hinzugefügt.

### Geändert

- [DIGMDCLGHT-190](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-190) Aktualisierte Benutzerdokumentation

## [2.2.1]

### Hinzugefügt

- [DIGMDCLGHT-5](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-5) Neue virtuelle Datenpunkttypen hinzugefügt. Vergleichsoperationen wurden bereits vorher hinzugefügt. Die Planung von Zählerrückstellungen wurde hinzugefügt.
- [DIGMDCLGHT-170](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-170) Neue benutzerdefinierte Datenpunkte zur opc ua Schnittstelle hinzugefügt.

### Geändert

- [DIGMDCLGHT-77](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-77) UX überarbeitet. System-Update" zu den Systeminformationen verschoben und Schaltflächen auf der allgemeinen Seite geändert
- [DIGMDCLGHT-76](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-76) Ikonen aktualisiert

### Behoben

- [DIGMDCLGHT-177](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-177) Einige falsch konfigurierte NC-Adressen behoben

## [2.1.3]

### Behoben

- [DIGMDCLGHT-130](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-130) Ein falsch konfigurierter nck-Datenpunkt brachte den MTconnect-Agenten wegen eines ungültigen Zeichens zum Absturz
- [DIGMDCLGHT-131](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-131) DNS-Lookup-Fehler beim Testen von ntp-Servern führten zum Absturz der Runtime
- [DIGMDCLGHT-122](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-122) Kleines Problem, bei dem das Drücken von "ESC" innerhalb des Menüs dazu führte, dass das Menü für immer verschwand

## [2.1.2]

### Behoben

- [DIGMDCLGHT-124](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-124) Gerät behält jetzt nur noch eine IPv4-Adresse, wenn dhcp aktiviert ist
- [DIGMDCLGHT-127](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-127) Speicherleck beim Lesen von SPS-Variablen behoben
- Es war nicht möglich, mehrere Eingangsquellen zum Schwellwert vdp hinzuzufügen
- [DIGMDCLGHT-125] Bei Netzwerkeinstellungen wird die Zeiteinstellung korrekt übertragen und angezeigt
- DIGMDCLGHT-126] Die Uhr in der Kopfzeile wird jetzt aktualisiert, wenn der Benutzer die Zeiteinstellungen ändert
- [DIGMDCLGHT-72](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-72) Tabellenspalten können nun in der Grösse angepasst werden
- [DIGMDCLGHT-94](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-94) Beim Erstellen einer Datenquelle sind bereits verwendete Adressen deaktiviert und ausgegraut.

## [2.1.1]

### Hinzugefügt

- [DIGMDCLGHT-4](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-4) Enum virtueller Datenpunkt hinzugefügt
- Verbesserte Protokolle: Drucken von Protokollen bei der Verarbeitung von Datenpunkten nur noch einmal in 15min

### Behoben

- [DIGMDCLGHT-99](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-99) Timeserver wird nun korrekt gesetzt
- [DIGMDCLGHT-93](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-93) Verbindungsprobleme von Zeit zu Zeit behoben
- [DIGMDCLGHT-98](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-98) Automatisches Bumping von Versionen in der Pipeline, die in der UI angezeigt werden
- [DIGMDCLGHT-87](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-87) Das Gerät startete nach einem Factory Reset nicht neu

## [2.1.0]

## Hinzugefügt

- [DIGMDCLGHT-18](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-18) Zähler kann jetzt über die Web-UI zurückgesetzt werden
- [DIGMDCLGHT-9](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-9) Ping NC von UI zur Überprüfung der Verbindungskonfiguration
- [DIGMDCLGHT-24](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-24) Ntp-Server-Verbindungsstatus zu den Ntp-Einstellungen hinzugefügt

### Behoben

- [DIGMDCLGHT-3](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-15) Das Ziehen von aktualisierten Containern ist manchmal fehlgeschlagen.

### Geändert

- [MDCL-217](https://codestryke.atlassian.net/browse/MDCL-217) Umbenennung von IoTconnector Light in IoTconnector Lite
- [MDCL-218](https://codestryke.atlassian.net/browse/MDCL-217) Das CELOS-Logo wurde durch das DMG Connectivity-Logo ersetzt.
- [MDCL-217](https://codestryke.atlassian.net/browse/MDCL-217) Schritt 3 und 4 wurden aus dem Konfigurationsassistenten entfernt. Das "enabled"-Flag von Datenquellen und Datensenken wird jetzt nur noch von den Templates gesteuert
- [DIGMDCLGHT-27](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-27) Hinzufügen einer Funktion zum Ändern der aktuellen Staging-Umgebung. **EINSCHRÄNKUNG:** Zurückschalten auf _prod_ von _stag_ oder _dev_ ist nicht möglich, wenn es kein neueres _prod_ Image in der Registry gibt.
- [DIGMDCLGHT-2](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-2) Angepasste Benennung der Logdatei in DM{MAC}-{YYYY}-{MM}-{DD}-{HH}-{mm}-{ss}
- [DIGMDCLGHT-11](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-11) NC-Variablensatz aktualisieren
- [DIGMDCLGHT-15](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-15) Umbenennung des IoT-Anschlusses light in IoT-Anschluss flex

## [1.7.4]

### Hinzugefügt

- Unterstützung für SINUMERIK 840D pl mit einer statischen Lesefrequenz von 5 Sekunden
- Verbesserte Datenquellenprotokolle

### Behoben

- Speicherleck behoben, das zum Absturz einiger Container führte

## [1.7.3]

### Hinzugefügt

- Aktualisierte Dokumentation für Benutzer

### Behoben

- LED-Status von USER1 und USER2 korrigiert und Dokumentation hinzugefügt
- Fehler behoben, bei dem alte Log-Archive nach Fehlern nicht gelöscht wurden
- Flash-Dienst korrigiert und Dokumentation verbessert
- IoTConnector lite Software Version wird nun korrekt in opc ua angezeigt
- Ungültige NTP-Server-Konfiguration gibt nur noch einmal einen Fehler zurück, was einen Fehler beim Speichern auf anderen Netzwerk-Tabs verhindert, wenn ein falscher NTP-Server eingestellt ist

## [1.7.2]

### Hinzugefügt

- Automatisches Einbinden der aktuellen Version in die Runtime (Anzeige im UI oder OPC UA)
- Änderungsprotokoll in Dokusaurus eingefügt
- Erste Version der japanischen Übersetzung hinzugefügt (einige Texte sind noch englisch)

### Behoben

- Die Warnung "Zeitdifferenz" bei einer erfolglosen Anfrage wurde entfernt
- Ungültige NTP-Server-Konfiguration wird nur noch einmal als Fehler gemeldet.

## [1.7.1]

### Hinzugefügt

- Verbindungsstatus "Zeitfehler" hinzugefügt
- [MDCL-186](https://codestryke.atlassian.net/browse/MDCL-186) Standard MTConnect Element hinzugefügt, das nicht gelöscht werden kann
- Allgemeine Geräteinformationen innerhalb des OPC UA Servers zur Verfügung gestellt

### Behoben

- Fehler behoben, bei dem das Löschen eines Mappings das Mapping innerhalb der Laufzeit bis zum nächsten Neustart nicht löscht
- Verbesserte Fehlerbehandlung, die einen Fehler behebt, bei dem Datensenken nach der Anwendung einer neuen Konfiguration nicht gestartet werden

## [1.7.0]

### Hinzugefügt

- [MDCL-152](https://codestryke.atlassian.net/browse/MDCL-152) Setzt den Geräte-Hostnamen beim Start auf "DM{MAC_ADDRESS}". Beispiel: DM8CF3191EBD22
- Eine Zusammenfassung der gelesenen Datenpunkte pro Datenquelle wird periodisch protokolliert
- [MDCL-163](https://codestryke.atlassian.net/browse/MDCL-163) Status-LEDs hinzugefügt
- [MDCL-133](https://codestryke.atlassian.net/browse/MDCL-133) Zeitkonfiguration hinzugefügt
- Healthchecks und ein Autoheal-Mechanismus zum Neustart ungesunder Container wurden hinzugefügt
- [MDCL-149](https://codestryke.atlassian.net/browse/MDCL-149) Unterstützung für opcua-Verschlüsselung hinzugefügt

## [1.6.2]

### Hinzugefügt

- [MDCL-187](https://codestryke.atlassian.net/browse/MDCL-187) Export von Protokolldateien hinzugefügt
- [MDCL-185](https://codestryke.atlassian.net/browse/MDCL-185) Grünes Häkchen für Datenpunkte von Datensenken hinzugefügt, wenn diese bereits zugeordnet sind

### Geändert

- Verbesserung der Stabilität des s7- und nck-Anschlusses
- Änderung des Loglevels auf Debug und Entfernung unnötiger Logs

### Behoben

- [MDCL-198](https://codestryke.atlassian.net/browse/MDCL-198) Die Verwendung einer falschen IP-Adresse für SPS-Verbindungen wurde korrigiert.
- [MDCL-200](https://codestryke.atlassian.net/browse/MDCL-200) Fehler behoben, der zum Absturz der Runtime führte, wenn Daten in den mtconnect-Agenten geschrieben wurden, während dieser heruntergefahren wurde.

## [1.6.1]

### Hinzugefügt

- [MDCL-154](https://codestryke.atlassian.net/browse/MDCL-154) Werksreset über "USER"-Taste inkl. Dokumentation hinzugefügt

### Geändert

- Aktualisierung des Timeout-Verhaltens bei der Datenhub-Bereitstellung und Entfernung des Timeouts nach 10 Sekunden

### Behoben

- [MDCL-197](https://codestryke.atlassian.net/browse/MDCL-197) Fehler behoben, der es unmöglich machte, die allgemeinen Geräteinformationen zu aktualisieren

## [1.6.0]

### Hinzugefügt

- Changelog hinzugefügt
- [MDCL-96](https://codestryke.atlassian.net/browse/MDCL-96) io shield Vorlagen für di10 und ai2+di5 Boards hinzugefügt
- [MDCL-52](https://codestryke.atlassian.net/browse/MDCL-52) Datenhub-Implementierung fertiggestellt
  - Anzeige des Adapterstatus in der Benutzeroberfläche
  - Datenpunkt-Enums hinzugefügt
- [MDCL-177](https://codestryke.atlassian.net/browse/MDCL-177) Es ist nun erforderlich, agb's im Konfigurationsassistenten zu bestätigen, um die süd- und nordgerichteten Adapter zu starten
- [MDCL-176](https://codestryke.atlassian.net/browse/MDCL-176) Link "Passwort vergessen" auf Login-Seite hinzugefügt (Dokumentationsseite fehlt noch)

### Geändert

- [MDCL-194](https://codestryke.atlassian.net/browse/MDCL-194) Verhinderung doppelter Zuordnungen von Konnektoren in nördlicher Richtung
- [MDCL-183](https://codestryke.atlassian.net/browse/MDCL-183) Verhinderung der Erstellung von doppelten virtuellen Datenpunkten
- [MDCL-184](https://codestryke.atlassian.net/browse/MDCL-184) Verhinderung der Erstellung von südlichen Datenpunkten mit doppeltem Namen oder Adresse
- [MDCL-181](https://codestryke.atlassian.net/browse/MDCL-181) Ausblenden von Zuordnungen von deaktivierten Datenquellen
- [MDCL-166](https://codestryke.atlassian.net/browse/MDCL-166) Der Datenquellenstatus wird nun alle 2 Sekunden aktualisiert
- [MDCL-172](https://codestryke.atlassian.net/browse/MDCL-166) [MDCL-173](https://codestryke.atlassian.net/browse/MDCL-166) [MDCL-174](https://codestryke.atlassian.net/browse/MDCL-166) Layout-Anpassungen auf der Login-Seite
- [MDCL-155](https://codestryke.atlassian.net/browse/MDCL-155) Der Benutzer kann nun den Typ des Siemens-Geräts auswählen, mit dem er sich verbinden möchte
- [MDCL-169](https://codestryke.atlassian.net/browse/MDCL-169) Der Benutzer kann nun den Typ der Eingangskarte auswählen, die er anschließen möchte
- [MDCL-157](https://codestryke.atlassian.net/browse/MDCL-157) Der Vorlagenassistent zeigt nun mehr Kontextinformationen zu jedem einzelnen Schritt an
- [MDCL-139](https://codestryke.atlassian.net/browse/MDCL-139) Es gibt jetzt schnelle Links, um auf die Dokumentation zuzugreifen, wenn der Benutzer Informationen darüber benötigt, was er zu tun hat. Weitere Links sollen hinzugefügt werden.
- [MDCL-179](https://codestryke.atlassian.net/browse/MDCL-179) Die Standardabtastrate der io shield Datenpunkte wurde erhöht, um ein Schwellwertdiagramm mit höherer Auflösung zu erhalten.
- [MDCL-180](https://codestryke.atlassian.net/browse/MDCL-180) Die Diagrammdatenreihe wurde von 30 Sekunden auf 5 Minuten erhöht.
- Die Produktionsprotokollebene wurde von Debug auf Info geändert.
- Die Anmeldedokumentation wurde an das neue Benutzer- und Passwortformat angepasst (Benutzername: Benutzer, Passwort: {Mac-Adresse})

### Behoben

- [MDCL-129](https://codestryke.atlassian.net/browse/MDCL-129) Behebung von digitalen Io-Shield-Eingängen, die nicht von Blinken auf Ein schalten konnten
- [MDCL-156](https://codestryke.atlassian.net/browse/MDCL-156) Kleinere Korrekturen der Frontend-Verantwortung behoben
- [MDCL-178](https://codestryke.atlassian.net/browse/MDCL-178) Fehler behoben, bei dem sich der Konfigurationsassistent nach dem ersten Login nicht automatisch öffnete
- [MDCL-168](https://codestryke.atlassian.net/browse/MDCL-168) Live-Reloading unterbricht den mtconnect-Anschluss nicht mehr
