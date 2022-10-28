---
title: Netzwerk
---

Die Netzwerkseite hat 4 verschiedene Abschnitte (Registerkarten) zum Konfigurieren: `Ethernet X1 P1`, `Ethernet X1 P2`, `Proxy` und `Zeit`

![Netzwerk Seite](/img/network_page.png)

## Ethernet X1 P1 & Ethernet X1 P2

Auf den Registerkarten `Ethernet X1 P1` & `Ethernet X1 P2` können Sie die entsprechenden Ethernet-Schnittstellen konfigurieren. Im Allgemeinen sollte X1 P1 für das Firmennetzwerk und X1 P2 für das Maschinennetzwerk verwendet werden. Wenn die Eingabekarte die einzige Datenquelle ist, kann X1 P2 unbenutzt bleiben.

Im Abschnitt `Adaptereinstellungen` können Sie den Schalter `IP-Adresse manuell zuweisen (kein DHCP verwenden)` verwenden, um die manuelle Konfiguration dieser speziellen Netzwerkschnittstelle zu aktivieren. Wenn der Schalter aktiviert ist, müssen Sie in den entsprechenden Feldern Angaben zur Netzwerkkonfiguration machen.

Nachdem Sie eine Netzwerkschnittstelle konfiguriert haben, verwenden Sie die Schaltfläche `Anwenden`, um die Änderungen für das Gerät zu übernehmen.

#### Automatischer Modus:

![Netzwerkseite](/img/network_auto.png)
Wenn der Schalter auf `Aus` steht, verwendet das Gerät DHCP für die Netzwerkkonfiguration, sofern ein DHCP-Server verfügbar ist. Sobald der DHCP-Server eine Netzwerkkonfiguration bereitstellt, wird diese in den entsprechenden Feldern (`IP-Adresse`, `Netzmaske`, `Standard-Gateway` & `DNS-Server`) angezeigt.

#### Manueller Modus:

![Netzwerkseite](/img/network_manual.png)
Wenn der Schalter auf on steht, können Sie die folgenden Felder eingeben:

- **IP-Adresse** - IP-Adresse des Rechners
- **Netzmaske** - Netzmaske des Rechners
- **Standard-Gateway** - (optional) Zu verwendendes Standard-Gateway
- **DNS-Server** - (optional) DNS-Server

## Proxy

Wenn das Netzwerk Ihres Unternehmens einen Proxy für den Internetzugang benötigt, können Sie ihn auf der Registerkarte `Proxy` konfigurieren.

Mit dem Schalter `Proxy verwenden` können Sie die Proxy-Einstellungen ein- und ausschalten - wenn er auf `Ein` gesetzt ist, können Sie den Proxy-Server mit den angegebenen Feldern konfigurieren

- **Typ** - Wählen Sie den Proxy-Typ, den Ihr Unternehmen verwendet. Sie können zwischen `http` und `socks5` wählen.
- Host\*\* - Geben Sie die IP-Adresse oder den Hostnamen Ihres Proxyservers ein.
- **Port** - Geben Sie den Port Ihres Proxy-Servers ein
- Benutzername\*\* - (optional) Geben Sie einen Benutzernamen für die Authentifizierung beim Proxyserver ein.
- **Passwort** - (optional) Geben Sie ein Passwort für die Authentifizierung beim Proxy-Server ein.

## Zeit (NTP)

Auf der Registerkarte `Zeit` können Sie den Server für die Zeitsynchronisation konfigurieren. Es ist erforderlich, dass die Zeitsynchronisation immer korrekt funktioniert, damit alle Dienste des IoTconnector flex einwandfrei funktionieren.

Mit dem Schalter `NTP Server verwenden` können Sie die NTP-Synchronisation aktivieren oder deaktivieren.

#### NTP-Server verwenden

Wenn der Schalter auf aktiv steht, können Sie einen NTP-Server angeben. Geben Sie die IP-Adresse oder den Hostnamen Ihres NTP-Servers ein.

![NTP-Server verwenden](/img/time_ntpserver.png)

#### Manuelles Einstellen der Uhrzeit

Alternativ können Sie die Zeit auch manuell einstellen.
![Zeit manuell einstellen](/img/time_manual.png)
