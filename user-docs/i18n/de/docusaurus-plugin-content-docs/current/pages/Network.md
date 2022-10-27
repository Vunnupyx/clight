---
title: Netzwerk
---

## Ethernet X1 P1 & X1 P2

Auf den Registerkarten "Ethernet X1" & "Ethernet X2" können Sie die entsprechenden Ethernet-Schnittstellen konfigurieren. Im Allgemeinen sollte X1 P1 für das Firmennetzwerk und X1 P2 für das Maschinennetzwerk verwendet werden. Wenn die Input Board die einzige Datenquelle ist, kann X1 P2 unbenutzt bleiben.

Im Abschnitt "Adaptereinstellungen" können Sie den Schalter "IP-Adresse manuell zuweisen (kein DHCP verwenden)" verwenden, um die manuelle Konfiguration dieser speziellen Netzwerkschnittstelle zu aktivieren.
Ist der Schalter ausgeschaltet, verwendet das Gerät DHCP für die Netzwerkkonfiguration, wenn ein DHCP-Server verfügbar ist. Sobald der DHCP-Server eine Netzwerkkonfiguration bereitstellt, wird diese in den entsprechenden Feldern ("IP-Adresse", "Netzmaske", "Standard-Gateway" & "DNS-Server") angezeigt.
Wenn der Schalter auf on steht, können Sie die "IP-Adresse", "Netzmaske", "Standard-Gateway" und "DNS-Server" manuell eingeben.

Nachdem Sie eine Netzwerkschnittstelle konfiguriert haben, verwenden Sie die Schaltfläche "Übernehmen", um die Änderungen für das Gerät zu übernehmen.

## Proxy

Wenn das Netzwerk Ihres Unternehmens einen Proxy für den Internetzugang erfordert, können Sie ihn auf der Registerkarte "Proxy" konfigurieren.

Mit dem Schalter "Proxy verwenden" können Sie die Proxy-Einstellungen ein- und ausschalten - wenn er auf "Ein" gesetzt ist, können Sie den Proxy-Server konfigurieren

- **Typ** - Wählen Sie den Proxy-Typ, den Ihr Unternehmen verwendet. Sie können zwischen "http" und "socks5" wählen.
- **Host** - Geben Sie die IP-Adresse oder den Hostnamen Ihres Proxyservers ein
- **Port** - Geben Sie den Port Ihres Proxy-Servers ein
- **Benutzername** - (optional) Geben Sie einen Benutzernamen für die Authentifizierung beim Proxy-Server ein
- **Passwort** - (optional) Geben Sie ein Passwort für die Authentifizierung beim Proxyserver ein

## Zeit (NTP)

Auf der Registerkarte "Zeit" können Sie den Server für die Zeitsynchronisation konfigurieren. Es ist erforderlich, dass die Zeitsynchronisation immer korrekt funktioniert, damit alle Dienste des IoT Connectors flex ordnungsgemäß funktionieren.

Mit dem Schalter "NTP-Server verwenden" können Sie die NTP-Synchronisation aktivieren oder deaktivieren. Wenn der Schalter auf aktiv gesetzt ist, können Sie einen NTP-Server angeben.
Geben Sie die IP-Adresse oder den Hostnamen Ihres NTP-Servers ein.
