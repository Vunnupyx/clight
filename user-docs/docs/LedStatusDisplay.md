---
title: Status LEDs
---

# Status LEDs

## Introduction

The current runtime status of IoT connector flex is also directly visible on the `Siemens™ SIMATIC IoT2050™` device and displayed by different LEDs and with different colors.

There are two different LEDs on the `Siemens™ SIMATIC IoT2050™` device:

- USER 1
- USER 2

and three different colors for each LED:

- Green
- Red
- Orange

### States of USER 1 LED

USER 1 LED displays the current configuration state:

- orange blinking (No Configuration/Not accepted Terms and Conditions)
- orange (`configured` but not connected to NC)
- green (`configured` and successfully connected to NC)

### States of USER 2 LED

USER 2 LED has only 2 states:

- Off (IoTconnector flex is not running)
- Green (IoTconnector flex is running)

### What does `configured` mean?

The status `configured` is defined as:

- One enabled data source
- Minimum one active data point at this active source
- One enabled Application Interface with minimum one data point
- One active mapping between the enabled connected data source data point and the enabled Application Interface data point
