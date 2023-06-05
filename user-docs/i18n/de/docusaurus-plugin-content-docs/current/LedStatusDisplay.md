---
title: Status LEDs
---

## Einleitung

Der aktuelle Laufzeitstatus von IoTconnector flex ist auch direkt auf dem `SIEMENS SIMATIC IOT2050` Gerät sichtbar und wird durch verschiedene LEDs und mit unterschiedlichen Farben angezeigt.

Es gibt zwei verschiedene LEDs auf dem `SIEMENS SIMATIC IOT2050` Gerät:

- USER 1
- USER 2

![SIEMENS SIMATIC IOT2050 LEDs](/img/IoT2050Leds.png)

und drei verschiedene Farben für jede LED:

- Grün
- Rot
- Orange

### Zustände der USER 1 LED

Die USER 1 LED zeigt den aktuellen Konfigurationsstatus an:

- orange blinkend (Keine Konfiguration/Nicht akzeptierte Bedingungen)
- orange ([`konfiguriert`](LedStatusDisplay.md#what-does-configured-mean) aber nicht mit NC verbunden)
- grün ([`konfiguriert`](LedStatusDisplay.md#what-does-configured-mean) und erfolgreich mit der NC verbunden)

### Zustände der USER 2 LED

Die USER 2 LED hat nur 2 Zustände:

- Aus (IoTconnector flex ist nicht in Betrieb)
- Grün (IoTconnector flex ist in Betrieb)
- Rot blinkend (Lizenz fehlt)

### Was bedeutet "konfiguriert"?

Der Status `konfiguriert` ist definiert als:

- Eine aktivierte Datenquelle
- Mindestens ein aktiver Datenpunkt an dieser aktiven Quelle
- Eine aktivierte Anwendungsschnittstelle mit mindestens einem Datenpunkt
- Ein aktives Mapping zwischen dem Datenpunkt der aktivierten verbundenen Datenquelle und dem Datenpunkt der aktivierten Anwendungsschnittstelle
