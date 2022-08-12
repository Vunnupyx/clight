# MDCL Flash Service

## (Recommended) Create usb device with the your release image using a base image for the usb device

### Requirements

- USB flash drive (18GB+)
- Installer image need installed gdisk packages

### Step 1: Move you image you want to use for flashing into the existing base flash image

1. Download the fash device base image: https://codestryke-artifacts.s3.eu-central-1.amazonaws.com/dmg-mdclight/6nGDr9SZEvhN9qTLOuzMBK61mMb96OmJVf4d/Z9DGRRrFEX87Axzyq0aSxB6sB3LqFWCnW1tk/iot-connector-light-os-base-flash_v1.0.0.img.zip
2. Flash the base image to an usb device (Recommendation: Use balenaEtcher (https://www.balena.io/etcher/))

### Step 2: Create an release operation system image from an sd card

1. Prepare the release operation system image on a sd card
   1.1 Make sure, the latest docker-compose file is located inside `/root/docker-compose.yml`. Use `yarn copy_compose` (inside project root folder) to update
   1.2 Make sure, the latest mdclight configuration is installed inside `/etc/MDClight/config/*`. Use `yarn copy_mdc_conf` (inside project root folder) to update
   1.3 Make sure, the latest MTConnect configuration is installed inside `/etc/MDCLight/mtc_config/*`. Use `yarn copy_mtc_conf` (inside project root folder) to update
   1.4 Stop containers `docker-compose down`
   1.5 Pull latest docker images `docker-compose pull`
   1.6 Start latest docker images `docker-compose up -d`
   1.7 Remove unused docker images `docker system prune`
   1.8 Cleanup and shutdown `./cleanup.sh && shutdown now`
   1.9 Wait until device has shut down (Red STAT LED flashing)
2. Remove sd kart and insert it into your computer
3. Create the image from the SD card `dd if=/dev/rdisk2 of=iot-connector-light-os-v1.7.3.img bs=1m count=13517`. Make sure that you use the correct disk!
4. Create archive of the image `gzip -9 iot-connector-light-os-v1.7.3.img`

### Step 3: Prepare flash usb device

1. Boot your iot2050 from the usb device (This only works, if the correct boot order is set on the device `fw_setenv boot_targets usb0 usb1 usb2 mmc0 mmc1`)
2. Create checksum value of archive `sha1sum iot-connector-light-os-v1.7.3.img.gz`
3. Copy the image archiv to the devices root folder `export INSTALL_HOST=USERNAME@IOT2050NETWORKADDRESS && yarn copy:flashImage` (This must be executed from the flash service directory `services/mdclflash`. Replace `USERNAME` with your ssh username and `IOT2050NETWORKADDRESS` with the IP of your IoT2050 device)
4. Ssh into device and check if checksum is still the same `sha1sum iot-connector-light-os-v1.7.3.img.gz`. The output must be equal!
5. Shutdown device `shutdown now`
6. Congratulation you have created your own bootable usb stick

### Step 4: (optional) Create Image from usb device

1. List the available USB device via `df -h` in shell
2. Plugin the usb flash device
3. List the available USB device via `df -h` in shell again and find the new entry. This is your USB flash drive.
4. Find the device path of the usb drive. The schema is /dev/disk\*
5. Create an image from the usb device with `dd if=DEVICE_PATH of=iot-connector-light-os-v1.7.2_flash.img bs=1m count=16384` and replase `DEVICE_PATH` with the real path detected by step 4.

### Flash sd card or usb device using balenaEtcher

Prerequisites: Download and install balenaEtcher from https://www.balena.io/etcher/

1. Open balenaEtcher
2. Select your usb device
3. Select your image from step 1
4. Flash!

# Create usb device with the your release image from scratch

## Description

## Requirements

- USB flash drive (18GB+)
- OS Image you want to use to install on the internal mmc
- IoT2050 device with usb first boot order and ssh access to a running IoT-Connector instance

## Set boot order

## Step 1: Create the base bootable usb flash drive image from scratch

1.  Download your image of IoTconnector light you want to flash on the internal mmc into the root directory of this project
2.  Open your favorite shell. (Bash, ZSH ... )
3.  Set environment variable for ssh connection to IoT2050 via `export INSTALL_HOST=USERNAME@IOT2050NETWORKADDRESS`
    and replace `USERNAME` with your ssh username and `IOT2050NETWORKADDRESS` with the IP of your IoT2050 device
4.  Switch from project root directory into the service directory via `cd services/mdcflash` and run the installation script via `npm install`;
5.  Copy the flash image to the Iot2050 device: `npm run copy:flashImage`
6.  Create usb image mage
    - Download the generated image from your Iot2050:
      - If your IoT2050 was booted from internal MMC flash drive: `npm run dump:remote:internal`
      - If your IoT2050 was booted from external SD card flash drive: `npm run dump:remote:external`
    - You could also simply remove the SD card (in case it's booted from there) and create an image from it
7.  Congratulation you have created your own bootable usb stick image. To transfer your image to your usb flash drive please continue with step 2

## Step 2: Transfer a bootable usb image to a usb flash drive via the command line

1.  Save the usb flash image into services/mdclflash folder. If you finished 2. usecase it is already there.
2.  List the available USB device via `df -h` in shell
3.  Plugin the usb flash device
4.  List the available USB device via `df -h` in shell again and find the new entry. This is your USB flash drive.
5.  Find the device path of the usb drive. The schema is /dev/disk\*
6.  Use the device path to copy the image via `dd if=./dump*.gz of=DEVICE_PATH bs=4m` and replase `DEVICE_PATH` with the real path detected by step 5.
7.  Remove the usb drive and plug into the Iot2050 usb port.
8.  Restart the Iot2050. If the User led is blinking you can press the usb button 1 for 3 seconds an the flashing is starting. The device is rebooting after successfully flash process. During shutdown please remove usb drive.

### Step 4: (optional) Create Image from usb device

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

# Build mdclflash
