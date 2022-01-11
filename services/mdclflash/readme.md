# MDCL Flash Service

## Description

Used on USB backup device to flash a clean image of MDC Light on the iot2050 device.

This instructions is for Linux only.

There are two different usecases:

1. Built your own bootable usb image from scratch
2. Use a already generated bootable usb image and inject the latest flashable IoT-Connector image.

## Requirements

- USB flash drive (18GB+)
- requested flashable IoT-Connector image
- IoT2050 device with usb first boot order and ssh access to a running IoT-Connector instance

## 1. Usecase: Generate your own bootable usb flash drive image

1.  Download your image of IoT-Connector light into the root directory of this project
2.  Open your favorite shell. (Bash, ZSH ... )
3.  Set environment variable for ssh connection to IoT2050 via `export INSTALL_HOST=USERNAME@IOT2050NETWORKADDRESS`
    and replace `USERNAME` with your ssh username and `IOT2050NETWORKADDRESS` with the IP of your IoT2050 device
4.  Switch from project root directory into the service directory via `cd services/mdcflash ` and run the installation script via ` npm install && npm run install`;
5.  Copy the flash image to the Iot2050 device: `npm run copy:flashImage`
6.  Download the generated image from your Iot2050:  
    6.1 If your IoT2050 was booted from internal MMC flash drive: `npm run dump:remote:internal`  
    6.2 If your IoT2050 was booted from external SD card flash drive: `npm run dump:remote:external`
7.  Congratulation you have created your own bootable usb stick image. To transfer your image to your usb flash drive please continioue with 2. Usecase

## 2. Usecase: Transfer a bootable usb image to a usb flash drive

1.  Save the usb flash image into services/mdclflash folder. If you finished 2. usecase it is already there.
2.  List the available USB device via `df -h` in shell
3.  Plugin the usb flash device
4.  List the available USB device via `df -h` in shell again and find the new entry. This is your USB flash drive.
5.  Find the device path of the usb drive. The schema is /dev/disk\*
6.  Use the device path to copy the image via `dd if=./dump*.gz of=DEVICE_PATH bs=4m` and replase `DEVICE_PATH` with the real path detected by step 5.
7.  Remove the usb drive and plug into the Iot2050 usb port.
8.  Restart the Iot2050. If the User led is blinking you can press the usb button 1 for 3 seconds an the flashing is starting. The device is rebooting after successfully flash process. During shutdown please remove usb drive.

## 3. Get a reusable usb flash drive image

1. Plugin the usb flash drive from the 2. usecase into your computer
2. Create an image from the usb device with `dd if=/dev/rdisk2 of=iot-connector-light-os-v1.7.0_flash.img bs=1m count=16384`
