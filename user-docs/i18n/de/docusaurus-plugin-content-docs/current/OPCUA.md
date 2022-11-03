---
title: Verbindung zu OPC UA
---

- Der OPC UA Server Endpunkt ist auf Port `4840` auf beiden Netzwerkschnittstellen verfügbar
- Sehen Sie auf der Seite [`Network`](Network.md) nach, welche IP Adressen für Ihr Gerät konfiguriert sind
- Sie können die kostenlose Software [`uaExpert`](https://www.unified-automation.com/products/development-tools/uaexpert.html) verwenden, um die Werte auf dem OPC UA Server zu überprüfen

Sie können den OPC UA Server mit dem Schalter `Aktiviert` aktivieren oder deaktivieren.
![OPC UA Übersicht](/img/applicationinterface/opcua_overview.png)

## Authentifizierung

Die OPC UA Schnittstelle verfügt über ein Dropdown-Menü zur Auswahl der gewünschten Authentifizierungseinstellung. Der Benutzer kann wählen:

- Anonym (Keine Authentifizierung erforderlich)
- User/Password (Nur der eingegebene Benutzername und das Passwort erlauben den Zugriff auf den OPC UA Server)
  ![OPC UA Auth Optionen](/img/applicationinterface/opcua_auth.png)

## Verschlüsselung

Der OPC UA Server unterstützt auch verschiedene Sicherheitsrichtlinien und Modi. Der OPC UA Client kann diese Richtlinien und Modi für den Zugriff auf OPC UA Datenpunkte verwenden.

Sicherheitsrichtlinien:

- Keine
- Basic128Rsa15
- Basic256
- Basic256Sha256

Sicherheitsmodi:

- Keine
- Signieren
- Signieren & Verschlüsseln

## Benutzerdefinierte OPC UA-Variablen

Die OPC UA Schnittstelle erlaubt auch benutzerdefinierte OPC UA Variablen. Folgen Sie diesen Schritten, um eine benutzerdefinierte OPC UA Variable hinzuzufügen:

- Wenn Sie den Dialog für OPC UA Variablen öffnen, klicken Sie auf die blaue Schaltfläche `Eigene OPC UA Variablen hinzufügen`, wie auf dem Foto unten zu sehen.
  OPC UA eigene Variablen](/img/applicationinterface/opcua_custom.png)

- Geben Sie einen `Namen` für die OPC UA Variable ein, eine `Knoten-ID` und wählen Sie den `Datentyp` und klicken Sie auf `Speichern`.
  Dialogfenster für benutzerdefinierte OPC UA Variable](/img/applicationinterface/add_opcua_custom.png)

- Sie werden die gespeicherte Variable oben sehen, ähnlich wie im folgenden Beispiel.
  ![OPC UA Benutzerdefinierte Variable hinzugefügt](/img/applicationinterface/added_new_opcua_variable.png)

- Sie können dann auf die Schaltfläche `Variable auswählen` am rechten Ende der Variable klicken, um sie der Tabelle hinzuzufügen.
- Um dieser Variablen einen Wert zuzuordnen, folgen Sie den normalen Zuordnungsanweisungen, wie sie auf der Seite [`Application Interface`](ApplicationInterface.md) und [`Mapping`](Mapping.md) erläutert werden.
