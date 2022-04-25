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
apt install apt-transport-https ca-certificates curl gnupg lsb-release docker-compose timesyncd
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
10. Login to docker image registry: `docker login registry.gitlab.com`
11. Start containers: `sudo docker-compose -d up`

12. Remove device specific configuration
```
npm run deploy:clean:logs
```
13. And shutdown: `shutdown -h now`
14. Remove the sd card & insert it into an SD Card reader
15. `dd if=/dev/rdisk2 of=iot-connector-light-os-v1.7.0_resized.img bs=1m count=13517`

## Update containers

### Via frontend 
Login to device and click the `update now` button.
### Manual
1. Pull newer containers: `docker-compose pull`
2. Restart `docker-compose down && docker-compose up -d`

