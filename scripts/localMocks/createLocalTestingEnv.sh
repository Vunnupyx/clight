#!/bin/bash

function setup() {
    #mkdir -p ./_mdclight/local/fakeSSH 
    mkdir -p ./mdclight/logs
    mkdir -p ./mdclight/runTimeFiles
    # rm -rf ./mdclight/local/ssl* ./_mdclight/local/fakeSSH/nmclikey*
    rm -rf ./mdclight/logs/*
    rm -rf ./mdclight/config/*
    # openssl req -x509 -nodes -days 10950 -newkey rsa:2048 -keyout ./_mdclight/local/ssl_private.key -out ./_mdclight/local/ssl.crt -subj "/C=DE/L=Munich/O=codestryke GmbH/CN=IOT2050/emailAddress=info@codestryke.com" &&
    # ssh-keygen -t rsa -b 4096 -N "" -C "DUMMY SSH KEYS FOR LOCAL TESTING" -f ./_mdclight/local/fakeSSH/nmclikey
    cp -R ./_mdclight/config ./mdclight
    cp ./_mdclight/runtime.json ./mdclight
    cp -R _mdclight/opcua_nodeSet ./mdclight/runTimeFiles/nodeSets
    ./scripts/localMocks/setupSysfsMock.sh
}

if [ -d "$(pwd)/mdclight/config" ]
then
    echo "Reset configs to defaults?"
    select yn in "Yes" "No"; do
    case $yn in
        Yes ) setup; break;;
        No ) break;;
    esac
    done
else
    setup
fi

