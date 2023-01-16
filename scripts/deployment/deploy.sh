#!/bin/bash

# Temporary script do simplyfi the container deployment

#! You must be logged in with the az cli!
# az login
# az account set --subscription "CELOS Next Datahub DEV"

version="3.0.0-beta-1-133-gd55131b0"
versionForName=$(sed 's/[.]/-/g' <<< $version)

target="tags.mdclight='iotflex-$version'"
name=iotflex-${versionForName}-mdclight
fileName=./deployment.manifest.${version}.json

iotHub=iot-datahub-euw-devd
deviceId=IoTEdge-8C-F3-19-6A-E6-B5

check_docker_image () {
    docker manifest inspect $1 > /dev/null;
    if [[ $? -eq "0" ]]; then
        echo "$1 ok!"
    else
        echo "$1 does not exist!"
        exit 1
    fi
}

check_docker_image mdclightdev.azurecr.io/mdclight:$version 
check_docker_image mdclightdev.azurecr.io/mtconnect-agent:$version
check_docker_image mdclightdev.azurecr.io/mdc-web-server:$version

node deployment.manifest.js $version > $fileName

az iot edge deployment create -d $name -n iot-datahub-euw-devd --content $fileName --target-condition "$target" --priority 1 --verbose --layered false

az iot hub device-twin update -n $iotHub -d $deviceId --tags "{\"mdclight\": \"iotflex-${version}\"}"