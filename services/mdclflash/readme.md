# MDCL Flash Service

## Description

Used on USB backup device to flash a clean image of MDC Light on the iot2050 device.

This instructions is for Linux only.

There are two different steps:

1. Built your own bootable usb image from scratch
2. Use a already generated bootable usb image and inject the latest flashable IoT-Connector image.

## Requirements

- USB flash drive (18GB+)
- OS Image you want to use to install on the internal mmc
- IoT2050 device with usb first boot order and ssh access to a running IoT-Connector instance

## Set boot order

`fw_setenv boot_targets usb0 usb1 usb2 mmc0 mmc1`

## Step 1: Create the base bootable usb flash drive image

1.  Download your image of IoTconnector light you want to flash on the internal mmc into the root directory of this project
2.  Open your favorite shell. (Bash, ZSH ... )
3.  Set environment variable for ssh connection to IoT2050 via `export INSTALL_HOST=USERNAME@IOT2050NETWORKADDRESS`
    and replace `USERNAME` with your ssh username and `IOT2050NETWORKADDRESS` with the IP of your IoT2050 device
4.  Switch from project root directory into the service directory via `cd services/mdcflash` and run the installation script via `npm install && npm run install`;
5.  Copy the flash image to the Iot2050 device: `npm run copy:flashImage`
6.  Create Image
    - Download the generated image from your Iot2050:
      - If your IoT2050 was booted from internal MMC flash drive: `npm run dump:remote:internal`
      - If your IoT2050 was booted from external SD card flash drive: `npm run dump:remote:external`
    - You could also simply remove the SD card (in case it's booted from there) and create an image from it
7.  Congratulation you have created your own bootable usb stick image. To transfer your image to your usb flash drive please continioue with 2. Usecase

## Step 2: Transfer a bootable usb image to a usb flash drive via balenaEtcher (recommended)

Prerequisites: Download and install balenaEtcher from https://www.balena.io/etcher/

1. Open balenaEtcher
2. Select your usb device
3. Select your image from step 1
4. Flash!

## Step 2: Transfer a bootable usb image to a usb flash drive via the command line

1.  Save the usb flash image into services/mdclflash folder. If you finished 2. usecase it is already there.
2.  List the available USB device via `df -h` in shell
3.  Plugin the usb flash device
4.  List the available USB device via `df -h` in shell again and find the new entry. This is your USB flash drive.
5.  Find the device path of the usb drive. The schema is /dev/disk\*
6.  Use the device path to copy the image via `dd if=./dump*.gz of=DEVICE_PATH bs=4m` and replase `DEVICE_PATH` with the real path detected by step 5.
7.  Remove the usb drive and plug into the Iot2050 usb port.
8.  Restart the Iot2050. If the User led is blinking you can press the usb button 1 for 3 seconds an the flashing is starting. The device is rebooting after successfully flash process. During shutdown please remove usb drive.

## Copy usb image from existing usb device

1. List the available USB device via `df -h` in shell
2. Plugin the usb flash device
3. List the available USB device via `df -h` in shell again and find the new entry. This is your USB flash drive.
4. Find the device path of the usb drive. The schema is /dev/disk\*
5. Create an image from the usb device with `dd if=DEVICE_PATH of=iot-connector-light-os-v1.7.2_flash.img bs=1m count=16384` and replase `DEVICE_PATH` with the real path detected by step 4.

## Troubleshooting

### Fix boot sector issue (red led flashing and partition error message)

Boot again from USB device and execute those commands:

```
sudo apt-get install gdisk
sudo gdisk /dev/mmcblk1

Enter 'x' to change to expert mode
Enter 'e' to fix
Enter "m" to return to main menu
Enter "w" to exit and save
```
