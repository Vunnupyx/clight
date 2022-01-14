---
title: Status LEDs
---

# Status LEDs

## Introduction

The current runtime status of MDCLight is also directly visible on the `Siemens™ SIMATIC IoT2050™` device and displayed by different LEDs and with different colors.

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
- orange (configured but not connected to NC)
- green (configured and successfully connected to NC)

### States of USER 2 LED

USER 2 LED has only 2 states:

- Off (MDCLight is not running)
- Green (MDCLight is running)

### What does `configured` means?

The status `configured` is defined as:

- One enabled connected data source
- Minimum one active data point at this active source
- One enabled Application Interface (data sink) with minimum one data point
- One active mapping between the enabled connected data sink data point and the enabled Application Interface data point
