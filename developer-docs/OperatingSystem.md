# Operating System

## Building the operating system

1. Clone the repository `git clone https://github.com/siemens/meta-iot2050`
2. Checkout the base commit for this documentation (other commits, the newest version might work) `git checkout 3bdaf2226cb4034530caf9cf91985c68e1a2b9b4`
3. Build this image `./kas-container build kas-iot2050-example.yml`
4. After that flash the image to an SD Card or the internal Memory on an IoT2050 Advanced

## Image configuration

1. Setup a new root password when prompted (Please use password from Lastpass)
2. Clean up unneeded or outdated packages `apt purge node-red node-red nodejs mosquitto tcf-agent`
3. Check that no ports are still listening beside SSH (Port 22) `netstat -tulpn | grep LISTEN`
4. Install dependencies

```
apt update
apt install apt-transport-https ca-certificates curl gnupg lsb-release docker-compose timesyncd screen
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce docker-ce-cli containerd.io
```

5. Enable timesyncd

```
systemctl enable /lib/systemd/system/systemd-timesyncd.service
chown root:mdclite /etc/systemd/timesyncd.conf
chmod 664 /etc/systemd/timesyncd.conf
```

6. Copy configs

```
npm run deploy:all
```

7. Cleanup

```
apt autoremove
```

8. Create mdclite user
   Use password from Lastpass

```
adduser mdclite
```

9. Login to mdclite account
10. Login to docker image registrys: *is part of deploy:all*
11. Start containers: 
```
DOCKER_REGISTRY=<PATH_TO_PROD_REPO> DOCKER_WEBSERVER_TAG=<TAG> DOCKER_MDC_TAG=<TAG> DOCKER_MTC_TAG=<TAG> docker-compose -d up
```

12. Remove device specific configuration.

Run from repo:

```
npm run deploy:clean:logs
```

13. And shutdown: `shutdown -h now`
14. Remove all bootable devices including the sd card from which the image should be made.
15. Insert bootable USB device with separate iot2050 meta image for manipulation of sd card image
16. Boot device with usb device and hold down the `USER`-Button during start.
17. Login to root user of USB device
18. Insert SD card
19. `fdisk -l /dev/mmcblk0` <- SD-Card device
20. Note `END` value of the partition `/dev/mmcblk0p1`
21. [OPTIONAL] If the partition is to big for the internal eMMC (+-16GB) you can resize the partition before clone. I recommend a size round about 13GB.

    1. Install _parted_ on USB device image via `apt update && apt install parted`.
    2. `parted /dev/mmcblk0p1`
    3. `print` shows current size
    4. `resize` starts the resize process
    5. insert `1` for the first partition
    6. insert the new size in MB for ex. 13000 for 13GB
    7. `quit`
    8. [IMPORTANT ]Please do step 19. and 20 again because the `END` of the partition has changed!

22. Remove the sd card & insert it into an SD Card reader
23. Check the device path of the inserted sd card (macOS: `diskutil -l`) mostly /dev/disk2. [IMPORTANT] Please be safe to copy the correct device.
24. Calculate the `count` for dd: Use the noted value of (`END` +1 )/2048
25. Clone sd card image via `dd if=/dev/<PATH-TO-SD-CARD> bs=1m count=<CALCULATED_VALUE> | gzip -9 > <PATH-TO-SAVE-IMAGE>`
    [INFO] on macOS please use rdisk<DISKNUMBER> for speedup copy

## Update containers

### Via frontend

Login to device and click the `update now` button.

### Manual

1. Pull newer containers: `docker-compose pull`
2. Restart `docker-compose down && docker-compose up -d`
