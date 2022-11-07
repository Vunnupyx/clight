# MDC Flex Flasher User Guide

## Versions

---

| Device           | Flasher Version | MDC Connector Flex version | Firmware version |
| ---------------- | --------------- | -------------------------- | ---------------- |
| IOT2050 **FS04** | 1.0.2           | 2.3.0                      | none             |

## Description

---

This bootable image of _MDC Flasher_ flashes the above version to internal eMMC of the IOT2050 and update the firmware version to if necessary.

## How to flash to USB device:

---

1. Download MDC_LITE_INSTALLER-<MDCVERSION>-<FIRMWARE_VERSION>.zip from AWS
2. Unzip the bundle
3. Insert USB device to PC
4. [Linux] Copy flasher to USB Stick
   1. Command: sudo dd if=<path to image> of=<your device> bs=4M oflag=sync
      Example: sudo dd if=mdclight-iot2050.img of=/dev/sdb bs=4M oflag=sync
5. [Windows/Linux] You can also use balena Etcher for a safer way to flash the image: Download Balena Etcher
6. After the command or balena Etcher is finished your USB device is ready to install mdc lite and upgrade firmware version of IOT2050.

## How to install on IOT2050 via USB storage:

---

0. Shutdown IOT2050 if it is running.
1. Unplug all removable boot devices like SD card or USB devices.
2. Insert USB storage with flashed image (see steps above) to any USB port
3. Start IOT2050 and hold USER-Button during bootup. You can release USER-Button if STAT LED is blinking.
4. Wait for green blinking USER1- and USER2-LED. Now the flash service is ready to flash.
5. Hold USER-Button for 3 seconds.
6. USER1 LED starts blinking orange and USER2 LED is still blinking green. The installation process is running.
7. After installation the installer check the installed firmware version and update if necessary.
8. If the USER2-LED is green and the USER1-LED is off the installation was successful, otherwise please check error codes section and contact support.
9. Remove USB device and restart IOT2050 via reset button.
10. The IOT2050 device now is booting from internal eMMC

### LED states

User 1 Led represent the state of the installer.

User 2 Led repesent the state of firmware updater.

## Error codes

---

| LED User1 | LED USER2 | Description                                                                                                                      |
| :-------: | :-------: | -------------------------------------------------------------------------------------------------------------------------------- |
|    red    |    red    | Installation image corrupted. Please retry installation with a new flashed USB device. If this also fails please contact support |
|   green   |    red    | Installation succeeded but firmware update failed. Please contact support                                                        |
