---
title: Status LEDs
---

## Einleitung

Auf dem Gerät `SIEMENS SIMATIC IOT2050` befinden sich 4 verschiedene LEDs:
![SIEMENS SIMATIC IOT2050 LEDs](/img/IoT2050Leds.png)

- PWR: Zeigt den Energiestatus des Geräts an.
- STAT: Zeigt den Status des Betriebssystems (CELOS X) an
- USER 1 and USER 2: Gesteuert durch den IoTconnector flex zur Anzeige verschiedener Zwecke, die im Folgenden erläutert werden.

### Zustände der STAT LED

Der aktuelle Status der CELOS X Operating System wird über die STATS-LED des Gerätes visualisiert.

| Zustand                                                                                                                   | STATS LED            |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| U-Boot läuft (LED bleibt rot falls es Fehler innerhalb von U-Boot gibt)                                                   | ROT                  |
| GRUB läuft                                                                                                                | ORANGE               |
| GRUB bootet nicht                                                                                                         | ROT BLINKEND (1 Hz)  |
| CELOS OS läuft mit Online-Verbindung                                                                                      | GRÜN                 |
| CELOS OS läuft ohne Online-Verbindung (mindestens einer von cumulocity-agent, Netservice, CELOS Xchange ist nicht online) | GRÜN BLINKEND (1 Hz) |
| CELOS OS emergency mode (i.e. unlock-data fehlgeschlagen)                                                                 | ROT BLINKEND (2 Hz)  |

### USER 1 und USER 2 LEDs

Der aktuelle Laufzeitstatus von IoTconnector flex ist auch direkt auf dem `SIEMENS SIMATIC IOT2050` Gerät sichtbar und wird durch verschiedene LEDs und mit unterschiedlichen Farben angezeigt.

Es gibt zwei verschiedene LEDs auf dem `SIEMENS SIMATIC IOT2050` Gerät, dass das den Status von IoTconnector flex widerspiegelt:

- USER 1
- USER 2

und drei verschiedene Farben für jede LED:

- Grün
- Rot
- Orange

### Zustände der USER 1 LED

Die USER 1 LED zeigt den aktuellen Konfigurationsstatus an:

- orange blinkend (Keine Konfiguration/Nicht akzeptierte Bedingungen)
- orange ([`konfiguriert`](LedStatusDisplay.md#what-does-configured-mean) aber nicht mit NC verbunden)
- grün ([`konfiguriert`](LedStatusDisplay.md#what-does-configured-mean) und erfolgreich mit der NC verbunden)

#### Zustände der USER 2 LED

Die USER 2 LED hat nur 2 Zustände:

- Aus (IoTconnector flex ist nicht in Betrieb)
- Grün (IoTconnector flex ist in Betrieb)
- Rot blinkend (Lizenz fehlt)

#### Was bedeutet "konfiguriert"?

Der Status `konfiguriert` ist definiert als:

- Eine aktivierte Datenquelle
- Mindestens ein aktiver Datenpunkt an dieser aktiven Quelle
- Eine aktivierte Anwendungsschnittstelle mit mindestens einem Datenpunkt
- Ein aktives Mapping zwischen dem Datenpunkt der aktivierten verbundenen Datenquelle und dem Datenpunkt der aktivierten Anwendungsschnittstelle
