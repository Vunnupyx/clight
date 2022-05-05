# MDCL Flasher User Guide

!!! FS:04 ONLY !!!

This image of MDCL Flasher flashes MDC Lite version 2.0 to internal eMMC of the IOT2050.

## How to install:

1. Download MDC_LITE_INSTALLER-<MDCVERSION>-FS04.zip from AWS
2. Unzip the bundle
3. Insert USB device to PC
4. [Linux] Copy flasher to USB Stick
   1. Command: sudo dd if=<path to image> of=<your device> bs=4M oflag=sync
      Example: sudo dd if=mdclight-iot2050.img of=/dev/sdb bs=4M oflag=sync
5. [Windows/Linux] You can also use balena Etcher for a safer way to flash the image: Download Balena Etcher
6. After the command or balena Etcher is finished your USB device is ready to install mdc lite and upgrade firmware version of IOT2050.

## How to use:

1. Remove SD card
2. Insert USB stick to any USB port
3. Start IOT2050 and hold USER-Button during bootup. You can release USER-Button if STAT LED is blinking.
4. Wait for green blinking USER1-LED.
5. Hold USER-Button for 3 seconds and release.
6. USER1 LED starts blinking orange -> Device install mdc lite to eMMC
7. If the USER1-LED is green and the installation was successful.
8. Remove USB device and restart IOT2050
