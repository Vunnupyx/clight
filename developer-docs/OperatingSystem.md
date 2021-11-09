# Operating System

## Building the operating system

1. Clone the repository `git clone https://github.com/siemens/meta-iot2050`
2. Checkout the base commit for this documentation (other commits, the newest version might work) `git checkout 3bdaf2226cb4034530caf9cf91985c68e1a2b9b4`
3. Build this image `./kas-container build kas-iot2050-example.yml`
4. After that flash the image to an SD Card or the internal Memory on an IoT2050 Advanced

## Image configuration

1. Setup a new root password when prompted
2. Clean up unneeded or outdated packages `apt purge node-red node-red nodejs mosquitto tcf-agent`
3. Check that no ports are still listening beside SSH (Port 22) `netstat -tulpn | grep LISTEN`
4. Install docker

```
apt update
apt install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce docker-ce-cli containerd.io
docker run hello-world
```

5. Install docker-compose

```
apt install python3-setuptools python3.7-dev
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
pip3 install --upgrade pip
pip3 install docker-compose
```

6. Cleanup

```
rustup self uninstall
apt purge python3-setuptools python3.7-dev
```

7. Login to registry: `docker login registry.gitlab.com``
8. Create `docker-compose.yml`
9. Start containers: `docker-compose -d up`

10. Remove device specific configuration

```
rm -rf /etc/MDCLight/config/auth.json
rm -rf /etc/MDCLight/config/ssl.crt
rm -rf /etc/MDCLight/config/ssl_private.key
rm -rf /etc/ssh/ssh_host_*
rm -rf  rm -rf /etc/MDCLight/logs/*.log
cat /dev/null > ~/.bash_history && history -c && exit
nmcli con mod eth0-default ipv4.addresses 192.168.214.230/24 ipv4.gateway 0.0.0.0.0 ipv4.dns 0.0.0.0 ipv4.method manual
nmcli con up eth0-default
nmcli con mod eth1-default ipv4.addresses 192.168.185.186/24 ipv4.gateway 0.0.0.0.0 ipv4.dns 0.0.0.0 ipv4.method auto
nmcli con up eth1-default
```

11. And shutdown: `shutdown -h now`
12. Remove the sd card & insert it into an SD Card reader
13. `dd if=/dev/rdisk2 of=mdc-light-os-v1.0.5.img bs=8m`

## Update containers

1. Pull newer containers: `docker-compose pull`
2. Restart `docker-compose down && docker-compose up -d`

## V2

## SSL Cert generation

```
[Unit]
Description=Generate SSL certificate & private key if they don't exist already
WantedBy=docker.service

[Service]
Type=oneshot
ExecStart=bash -c 'test ! -e /etc/MDCLight/config/ssl_private.key && openssl req -x509 -nodes -days 10950 -newkey rsa:2048 -keyout /etc/MDCLight/config/ssl_private.key -out /etc/MDCLight/config/ssl.crt -subj "/C=DE/L=Munich/O=codestryke GmbH/CN=IOT2050/emailAddress=info@codestryke.com" || true'
RemainAfterExit=true
StandardOutput=journal

[Install]
WantedBy=multi-user.target
```
