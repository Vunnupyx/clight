---
title: NETservice
---

# NETservice

## Einleitung

Der DMG MORI NETservice ermöglicht den Remote Service direkt an der Maschine. Die Komponenten kommunizieren über eine verschlüsselte Verbindung miteinander. Bediener, Service Experts und andere Mitarbeiter können im Kommunikationsverbund agieren. Im Chat werden per Instant-Messaging alle Textnachrichten umgehend an die Konferenzteilnehmer gesendet. Das Whiteboard ist das digitale Skizzenpapier der Kon- ferenzteilnehmer. Gemeinsam können sie Fotos, Screenshots und Schaltpläne teilen und bearbeiten.

Auf dieser Seite von IoTconnector flex haben Sie den Zugang zum NETservice mit dem Schaltfläche "Start NETservice", Status Anzeige rechts oben sowie die Einstellungen für den DMG MORI Service.

![NETservice Seite](/img/netservice/overview.png)

### Start NETservice

Wenn Sie auf die Schaltfläche "Start NETservice" klicken, wird eine neue Seite geöffnet, auf der Sie sich bei der NETservice anmelden können.

### Einstellungen

Die Daten können nur mit ServiceKey in der Settings App geändert werden und sind ausschließlich für den DMG MORI Service gedacht. Hier wird konfiguriert, mit welchem NETservice Central Communications Server sich das Gerät verbindet.

### Status Anzeige

Der aktuelle Status des NETservice wird über ein Symbol rechts oben angezeigt.
![NETservice Status Anzeige](/img/netservice/statusicon.png)

Die Symbole haben folgende Bedeutung:

| Symbol                                                                                        | Erklärung                                                                                                                                                          |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![Symbol not connected](/img/netservice/notconnected.png)                                     | Der NETservice Connector ist nicht mit dem Central Communications Server verbunden.                                                                                |
| ![Symbol connected without active request](/img/netservice/connectedwithoutactiverequest.png) | Der NETservice Connector ist mit dem Central Communications Server verbunden – es besteht kein aktiver Service Request.                                            |
| ![Symbol connected with active request](/img/netservice/connectedwithservicerequest.png)      | Der NETservice Connector ist mit dem Central Communications Server verbunden – es besteht mindestens ein aktiver Service Request.                                  |
| ![Symbol request for access](/img/netservice/requestforaccess.png)                            | Es existiert eine Verbindungsanfrage für einen aktiven Service Request. Der Zugriff kann in der NETservice Machine App genehmigt oder abgelehnt werden.            |
| ![Symbol expert connected to machine](/img/netservice/expertconnectedtomachine.png)           | Der NETservice Connector ist mit dem Central Communications Server verbunden – ein Service Expert ist mit der Maschine verbunden.                                  |
| ![Symbol new message](/img/netservice/newmessage.png)                                         | Der NETservice Connector ist mit dem Central Communications Server verbunden – es existiert eine neue Nachricht im Konferenzzentrum oder an einem Service Request. |
