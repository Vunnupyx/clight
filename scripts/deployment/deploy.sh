#!/bin/bash

# Temporary script do simplify the container deployment.

#! You must be logged in with the az cli!
# az login
# az account set --subscription "CELOS Next Datahub DEV"
# docker login mdclightdev.azurecr.io with credentials from password manager

read -p "\"git describe --tags\" output: " version
# version="3.0.0-beta-1-133-gd55131b0"
versionForName=$(sed 's/[.]/-/g' <<< $version) # replace all . with -

target="tags.mdclight='$version'"
name=${versionForName}-mdclight
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
manifestName=deployment.manifest.${version}.json
manifestPath=$script_dir/$manifestName

# check if docker image is available at registry
check_docker_image () {
    docker manifest inspect $1 > /dev/null;
    if [[ $? -eq "0" ]]; then
        echo "$1 ok!"
    else
        echo "$1 does not exist!"
        exit 1
    fi
}

# select device to deploy to
select_edge_device() {
    devices=("IoTEdge-8C-F3-19-C3-0E-B1 (Cem)" "IoTEdge-8C-F3-19-C3-0E-61 (Markus)" "IoTEdge-8C-F3-19-C3-0E-6B (Patrick)" "OTHER")
    select yn in "${devices[@]}" ; do
    # ${devices[-1]} for bash > 4.2
    if [[ "$yn" == "${devices[${#devices[@]} - 1]}" ]]; then
        read -p "device ID: " id
        echo "$id"
        break
    fi
    splitt=( $yn )
    echo "${splitt[0]}"
    break
    done
}

# select iot hub to publish deployment
select_datahub() {
    
    iothubs=("iot-datahub-euw-devd" "iot-datahub-euw-dev" "OTHER")
    select yn in "${iothubs[@]}" ; do
    # ${devices[-1]} for bash > 4.2
    if [[ "$yn" == "${iothubs[${#iothubs[@]} - 1]}" ]]; then
        read -p "iothubs ID: " id
        echo "$id"
        break
    fi
    echo "$yn"
    break
    done
}

echo "Select IoT2050 device: "
deviceId=$(select_edge_device)
echo "Select iothub: "
iotHub=$(select_datahub)

# check_docker_image mdclightdev.azurecr.io/mdclight:$version 
# check_docker_image mdclightdev.azurecr.io/mtconnect-agent:$version
# check_docker_image mdclightdev.azurecr.io/mdc-web-server:$version



node "$script_dir"/deployment.manifest.js $version > $manifestPath
az iot edge deployment create -d "$name" -n "$iotHub" --content "$manifestPath" --target-condition "$target" --priority 1 --verbose --layered false
az iot hub device-twin update -n "$iotHub" -d "$deviceId" --tags "{\"mdclight\": \"${version}\"}"
rm "$manifestPath"
