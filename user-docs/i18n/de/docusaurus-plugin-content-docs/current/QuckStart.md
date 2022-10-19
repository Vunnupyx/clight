---
title: Erste Schritte - Installation des Betriebssystems und Inbetriebnahme des IoT connector flex
---

## SD-Karte vorbereiten

Das aktuelle Golden Image für das IoT2050 Advanced können Sie hier herunterladen:

_[Download IoT connector flex OS](https://codestryke-artifacts.s3.eu-central-1.amazonaws.com/dmg-mdclight/6nGDr9SZEvhN9qTLOuzMBK61mMb96OmJVf4d/Z9DGRRrFEX87Axzyq0aSxB6sB3LqFWCnW1tk/iot-connector-light-os-v1.2.0.zip)_

Entpacken Sie das Image und verwenden Sie dd, um das Betriebssystem auf eine SD-Karte zu kopieren. Es werden industrielle SD-Karten empfohlen.

Befehl:
`sudo dd if=<path to image> of=<your device> bs=4M oflag=sync`

Beispiel:
`sudo dd if=mdclight-iot2050.img of=/dev/sdb bs=4M oflag=sync`

Sie können auch balena Etcher verwenden, um das Bild auf sichere Weise zu flashen: [Download Balena Etcher](https://www.balena.io/etcher/)

Nachdem das Kommando oder der Balena Etcher beendet ist, ist Ihre SD-Karte bereit.

## IoT2050 einrichten & Bootreihenfolge ändern

Standardmäßig (bei neueren IoT2050 Advanced Geräten) ist das Siemens Industrial OS 2.x auf dem internen MMC Speicher installiert. Außerdem ist die Boot-Priorität
auf den internen Speicher vor dem SD-Karten-Slot gesetzt. Das bedeutet, dass Sie in das Industrial OS booten, den Setup-Assistenten abschließen und die Bootreihenfolge ändern müssen, bevor Sie das "IoT connector flex OS" verwenden können.

1. Zuerst müssen Sie den Einrichtungsassistenten für Industrial OS abschließen. Dazu müssen Sie eine Tastatur und einen Monitor an Ihr IoT2050-Gerät anschließen. Denken Sie daran, dass Sie, wenn Sie
   Wenn Sie einen "Display Port" zu HDMI Adapter verwenden möchten, müssen Sie einen aktiven Adapter verwenden.
2. Nachdem Sie Monitor und Tastatur angeschlossen haben, verbinden Sie das IoT2050 mit einer Stromquelle.
3. Nach dem Hochfahren sollte der Einrichtungsassistent angezeigt werden. Sie können größtenteils die Standardkonfigurationen verwenden, aber stellen Sie sicher, dass Sie eine bekannte IP-Adresse für mindestens eine Netzwerkschnittstelle konfigurieren, da diese später für den SSH-Zugang verwendet wird. Wenn der Assistent nicht startet und Sie beim "localhost"-Login feststecken, können Sie einen Neustart versuchen. Wenn das nicht
   funktioniert, müssen Sie einen USB->UART-Adapter verwenden, um auf die Konsole zuzugreifen: [Siemens Dokumentation](https://support.industry.siemens.com/tf/ww/en/posts/how-to-setup-pre-installed-industrial-os-on-iot2050-advanced/266090/?page=0&pageSize=10)
4. Verbinden Sie sich per SSH mit dem Gerät, indem Sie die konfigurierte IP-Adresse, den Benutzernamen und das Passwort verwenden.

Erstellen Sie `/etc/fw_env.config`, zum Beispiel über die Kommandozeile:

```
cat <<EOT >> /etc/fw_env.config
# MTD-Gerätename     Geräteoffset     Umgebungsgröße  Flash-Sektorgröße     Anzahl der Sektoren
/dev/mtd3               0x0000          0x20000         0x10000
/dev/mtd4               0x0000          0x20000         0x10000
EOT
```

Führen Sie dann `fw_setenv boot_targets usb0 usb1 usb2 mmc0 mmc1` aus, um die SD-Karte auf die erste Boot-Priorität zu setzen

## Setup OS & Config

Nun können Sie das IoT2050 von der Stromversorgung trennen und die SD-Karte einlegen. Nachdem Sie die Stromversorgung wiederhergestellt haben, bootet das Gerät mit
das neue Betriebssystem, das auf der SD-Karte gespeichert ist.

Der Zugriff auf das Gerät kann über Tastatur und Monitor oder per SSH über das Netzwerk erfolgen. Die Standard-IP-Adresse der eth0-Schnittstelle ist `192.168.214.165`, eth1 ist standardmäßig auf
DHCP voreingestellt. VORSICHT! Stellen Sie sicher, dass kein Gerät in Ihrem Netzwerk die Adresse 192.168.214.165 hat, bevor Sie Ihr Netzwerk mit eth0 verbinden!

Der Standardbenutzer ist `root` und das Standardpasswort ist `mdclight`.

Sobald Sie in der Shell sind, können Sie die Netzwerkschnittstellen mit den folgenden Befehlen konfigurieren:

Für X1 P1 - eth0 (Maschinennetz - Standard-IP: 192.168.214.165):
`nmcli con mod 'eth0-default' ipv4.method auto` - Für DHCP
`nmcli con mod 'eth0-default' ipv4.addresses 192.168.214.231/24 ipv4.method manual` - Für statische IP
`nmcli con up eth0-default` - Nachdem Sie einen der oben genannten Befehle eingegeben haben, können Sie die Änderungen aktivieren

Für X1 P2 - eth1 (Unternehmensnetzwerk - Standardeinstellung: DHCP):
`nmcli con mod 'eth1-default' ipv4.method auto`
`nmcli con mod 'eth1-default' ipv4.addresses 192.168.185.181/24 ipv4.gateway 192.168.185.1 ipv4.dns 192.168.185.1 ipv4.method manual`
`nmcli con up eth1-default` - Nachdem Sie einen der oben genannten Befehle eingegeben haben, können Sie die Änderungen aktivieren

## Konfiguration Web-Schnittstelle

- Der IoT-Connector flex kann über das Webinterface konfiguriert werden (erreichbar über Port 80 auf beiden Netzwerkschnittstellen)
- Nach der Änderung der Konfiguration muss der IoT-Connector flex neu gestartet werden, entweder durch einen Neustart des Geräts oder durch `docker-compose down && docker-compose up -d` (im Benutzerverzeichnis von "root" - `cd ~`)
- Sie können den Befehl `nmcli` verwenden, um die IP-Adressen für beide Schnittstellen zu sehen (für DHCP können Sie die IP-Adresse sehen, die dem Gerät zugewiesen wurde)

## Verbinden von MTConnect-Anwendungen

- Der MTConnect-Endpunkt ist auf Port `5000` an beiden Netzwerkschnittstellen verfügbar.
- Sie können den Befehl `nmcli` verwenden, um die IP-Adressen für beide Schnittstellen zu sehen (für DHCP können Sie die IP-Adresse sehen, die dem Gerät zugewiesen wurde)

## OPC UA Clients verbinden

- Der OPC UA Server Endpunkt ist auf Port `4840` auf beiden Netzwerkschnittstellen verfügbar
- Sie können den Befehl `nmcli` verwenden, um die IP-Adressen für beide Schnittstellen zu sehen (bei DHCP können Sie die IP-Adresse sehen, die dem Gerät zugewiesen wurde)

## Dokumentation & Referenz zur Konfiguration

- In erster Linie sollte der IoT-Connector flex über den Webserver konfiguriert werden
- Die Konfiguration des IoT-Konnektors flex wird in `/etc/MDCLight/config/config.json` gespeichert - Sie können `IP=<Ihre ip> yarn copy_mdc_conf` verwenden, um die Konfiguration des IoT-Konnektors flex auf einem IoT2050 aus dem Repository zu aktualisieren
- Siehe das Dokument "MdcLightConfiguration" für eine Erklärung des Konfigurationsformats
- Die Konfiguration des MTConnect-Agenten wird in `/etc/MDCLight/mtc_config` gespeichert - Die Dokumentation für diese Konfigurationsdateien finden Sie auf dem [MTConnect Agent Github](https://github.com/mtconnect/cppagent#configuration)
- Nachdem Sie die Konfiguration geändert haben, müssen Sie die Docker-Container neu starten `docker-compose down && docker-compose up -d`. TIPP: Um Probleme mit dem
  messenger zu vermeiden, können Sie auch nur den "mdclight-prod_arm64"-Container neu starten, indem Sie `docker ps` verwenden, um die Container-ID zu finden und `docker restart <container id>`, um den Container neu zu starten.
- Überprüfen Sie die Protokolle mit `docker-compose logs -f`, um sicherzustellen, dass die Konfiguration korrekt ist und die Datenquelle zugänglich ist
