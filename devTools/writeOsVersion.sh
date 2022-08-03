read -p "Enter OS Major Version:" MAJOR_VERSION
read -p "Enter OS Minor Version:" MINOR_VERSION
read -p "Enter OS Patch Version:" PATCH_VERSION

VERSION=$(date +'%Y').$(date +'%m').$(date +'%d')-V${MAJOR_VERSION}.${MAJOR_VERSION}.${MAJOR_VERSION}

echo Writing Version $VERSION

ssh $INSTALL_HOST "echo VERSION=$VERSION > '/etc/mdcflex-os-release'"
