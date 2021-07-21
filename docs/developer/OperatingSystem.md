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
4.

apt update
apt install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce docker-ce-cli containerd.io

curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
