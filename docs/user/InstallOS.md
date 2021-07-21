# Install Operation System to IoT2050 Advanced

## Prepare SD Card

Use dd to copy the operation system to an SD Card. Industrial SD Card are recommended.

Command:
`sudo dd if=<path to image> of=<your device> bs=4M oflag=sync`

Example:
`sudo dd if=/home/codestryke/Documents/meta-iot2050/build/tmp/deploy/images/iot2050/iot2050-image-example-iot2050-debian-iot2050.wic.img of=/dev/sda bs=4M oflag=sync`

After the command is finished your SD Card is ready.

## Setup IoT2050 & Change Boot Order

1. Create `/etc/fw_env.config`, for example using nano: `nano /etc/fw_env.config` - copy & paste the following contents:

```
# MTD device name       Device offset   Env. size       Flash sector size       Number of sectors
/dev/mtd3               0x0000          0x20000         0x10000
/dev/mtd4               0x0000          0x20000         0x10000
```

`fw_setenv boot_targets mmc0 mmc1 usb0 usb1`

## Setup OS & Config

Now you can disconnect the IoT2050 from the power supply and insert the SD card. After you reconnect the power, the device will boot into
the the new OS stored on the SD card.

Here you can configure the network configuration:

For P1 X1:
`nano /etc/NetworkManager/system-connections/enp2s0-default`

For P1 X2:
`nano /etc/NetworkManager/system-connections/enp3s0-default`

After you changed the network setting you can apply them using `nmcli con up enp2s0-default` and/or `nmcli con up enp2s0-default` - depending on which file you changed.

## Configuring the MDClight

- The MDClight config is stored in `/etc/MDCLight/config`
- After you changed the configuration you need to restart the docker containers `docker restart $(docker ps -q)`

Config structure: TBD
