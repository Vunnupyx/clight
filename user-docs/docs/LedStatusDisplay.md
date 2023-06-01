---
title: Status LEDs
---

# Status LEDs

## Introduction

There are 4 different LEDs on the `SIEMENS SIMATIC IOT2050` device:
![SIEMENS SIMATIC IOT2050 LEDs](/img/IoT2050Leds.png)

- PWR: Displays the power status of the device.
- STAT: Displays the status of the Operating System (CELOS X)
- USER 1 and USER 2: Controlled by the IoTconnector flex to display various purposes and explained below.

### States of STAT LED

The current status of the CELOS X Operating System is visualized by using the STATS LED of the device.

| Status                                                                                                                                   | STATS LED             |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| U-Boot running (LED remains red if there is an error within U-Boot)                                                                      | RED                   |
| GRUB running                                                                                                                             | ORANGE                |
| GRUB fails to boot                                                                                                                       | RED BLINKING (1 Hz)   |
| CELOS OS running with online connection                                                                                                  | GREEN                 |
| CELOS OS running without online connection (at least one of the components cumulocity-agent, Netservice, CELOS Xchange is not connected) | GREEN BLINKING (1 Hz) |
| CELOS OS emergency mode (i.e. unlock-data failed)                                                                                        | RED BLINKING (2 Hz)   |

### USER 1 and USER 2 LEDs

The current runtime status of IoTconnector flex is also directly visible on the `SIEMENS SIMATIC IOT2050` device and displayed by different LEDs and with different colors.

There are two different LEDs on the `SIEMENS SIMATIC IOT2050` device that are reflecting status of IoTconnector flex:

- USER 1
- USER 2

and three different colors for each LED:

- Green
- Red
- Orange

#### States of USER 1 LED

USER 1 LED displays the current configuration state:

- orange blinking (No Configuration/Not accepted Terms and Conditions)
- orange ([`configured`](LedStatusDisplay.md#what-does-configured-mean) but no running data source or application interface)
- green ([`configured`](LedStatusDisplay.md#what-does-configured-mean) and running data source and application interface)

#### States of USER 2 LED

USER 2 LED has only 2 states:

- Off (IoTconnector flex is not running)
- Green (IoTconnector flex is running)

#### What does `configured` mean?

The status `configured` is defined as:

- One enabled data source with on or more data points
- One enabled data sink with one or more data points
- One or more mapping
