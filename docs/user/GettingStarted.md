# Install Operation System to IoT2050 Advanced

## Prepare SD Card

You can find the latest Golden Image for the IoT2050 Advanced can be downloaded here: [Download Image](https://codestryke-artifacts.s3.eu-central-1.amazonaws.com/dmg-mdclight/6nGDr9SZEvhN9qTLOuzMBK61mMb96OmJVf4d/Z9DGRRrFEX87Axzyq0aSxB6sB3LqFWCnW1tk/mdc-light-os-v1.0.8.img.zip)
Use dd to copy the operation system to an SD Card. Industrial SD Cards are recommended.

Command:
`sudo dd if=<path to image> of=<your device> bs=4M oflag=sync`

Example:
`sudo dd if=mdclight-iot2050.img of=/dev/sdb bs=4M oflag=sync`

You can also use balena Etcher for a safer way to flash the image: [Download Balena Etcher](https://www.balena.io/etcher/)

After the command or balena Etcher is finished your SD Card is ready.

## Setup IoT2050 & Change Boot Order

By default (for newer IoT2050 Advanced device) the Siemens Industrial OS 2.x is installed on the internal MMC storage. In addition the boot priority is set
to the internal memory above the SD card slot. This means that you have to boot into the Industrial OS, complete the setup wizard and change the boot order before
you can use the "MDC light Pilot OS".

1. First you need to complete the Industrial OS setup wizard. For this you need to connect a keyboard and monitor to your IoT2050 device. Keep in mind that an if you
want to use an "Display Port" to HDMI adapter, you need to use an active one.
2. After you connected monitor and keyboard connect the IoT2050 to a power source.
3. After boot the setup wizard should be displayed. You can mostly use default configurations, but be sure to configure a known IP address for at least one network interface, this will be used later for SSH access. If the wizard does not start and you are stuck on the "localhost" login, you can try to reboot. If that does not
work you need to use an USB->UART adapter to access the console: [Siemens Documentation](https://support.industry.siemens.com/tf/ww/en/posts/how-to-setup-pre-installed-industrial-os-on-iot2050-advanced/266090/?page=0&pageSize=10)
4. SSH into the device using the configured IP address, username and password.

Create `/etc/fw_env.config`, for example using the command line: 

```
cat <<EOT >> /etc/fw_env.config
# MTD device name       Device offset   Env. size       Flash sector size       Number of sectors
/dev/mtd3               0x0000          0x20000         0x10000
/dev/mtd4               0x0000          0x20000         0x10000
EOT
```

Then run `fw_setenv boot_targets mmc0 mmc1 usb0 usb1` to set the sd card to first boot priority

## Setup OS & Config

Now you can disconnect the IoT2050 from the power supply and insert the SD card. After you reconnect the power, the device will boot into
the the new OS stored on the SD card.

The device can be accessed using keyboard & monitor, or via SSH over the network. The default IP address of the eth0 interface is `192.168.214.231`, eth1 is set to
DHCP by default. CAUTION!: Make sure that no device in your network has the address 192.168.214.231 before you connect your network to eth0!

The default user is `root` & the default password is `mdclight`.

Once in the shell you can configure the network interfaces with the following commands:

For X1 P1 - eth0 (machine network):
`nmcli con mod 'eth0-default' ipv4.method auto` - For DHCP
`nmcli con mod 'eth0-default' ipv4.addresses 192.168.214.231/24 ipv4.method manual` - For static IP
`nmcli con up eth0-default` - After you entered one of the above commands, to activate the changes

For X1 P2 - eth1 (company network):
`nmcli con mod 'eth1-default' ipv4.method auto`
`nmcli con mod 'eth1-default' ipv4.addresses 192.168.185.181/24 ipv4.gateway 192.168.185.1 ipv4.dns 192.168.185.1 ipv4.method manual`
`nmcli con up eth1-default` - After you entered one of the above commands, to activate the changes

## Configuring MDClight

- The MDClight config is stored in `/etc/MDCLight/config/config.json` - You can use `IP=<your ip> yarn copy_mdc_conf` to update the MDC light config on an IoT2050
- See the "MdcLightConfiguration" document for an explanation of the configuration format
- The MTConnect agent configuration is stored in `/etc/MDCLight/mtc_config` - The documentation for these config files can be found on the [MTConnect Agent Github](https://github.com/mtconnect/cppagent#configuration)
- After you changed the configuration you need to restart the docker containers `docker-compose down && docker-compose up -d`. HINT: To avoid problems with the
messenger you can also only restart the "mdclight-prod_arm64" container by using `docker ps` to find the container id and `docker restart <container id>` to restart the container.
- Check the logs with `docker-compose logs -f` to verify the configuration is correct and the data source is accessible

## Connecting MTConnect Applications 

- The MTConnect endpoint is exposed on port `5000` on both network interfaces
- You can use the `nmcli` command to see the IP addresses for both interfaces (For DHCP you can see the IP address which was assigned to the device)