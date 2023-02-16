#!/bin/bash

# Deployment of dev environment to device
# Must be executed from workspace root!
# Always execute with `yarn deploy-dev`!

#! You must be logged in with the az cli!
# az login
# az account set --subscription "CELOS Next Datahub DEV"
# docker login mdclightdev.azurecr.io with credentials from password manager

# check if docker image is available at registry
check_docker_image () {
    registry=mdclightdev
    repository=$1
    tag=$2

    availableTags=$(az acr repository show-tags --name $registry --repository $repository -o tsv)

    exists="false"

    while IFS=';' read -ra ADDR; do
        for i in "${ADDR[@]}"; do
            if [ "$i" == "$tag" ]; then
                echo "$registry/$repository:$tag exists!"
                exists="true"
            fi
        done
    done <<< "$availableTags"

    if [ $exists == "false" ]
    then
        echo "$registry/$repository:$tag does not exist"
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

# select version. Takes script to determine a default version
select_version () {
    versions=($($1) "OTHER")
    select yn in "${versions[@]}" ; do
    # ${devices[-1]} for bash > 4.2
    if [[ "$yn" == "${versions[${#versions[@]} - 1]}" ]]; then
        read -p "Versions: " id
        echo "$id"
        break
    fi
    echo "$yn"
    break
    done
}

echo "Select mdclight developtment version (git describe --tags)"
mdclightDevVersion=$(select_version ./scripts/build/lastMdclightDevChange.sh)
echo "Select web server version (git describe --tags)"
webserverVersion=$(select_version ./scripts/build/lastWebserverChange.sh)
echo "Select mtconnect (git describe --tags)"
mtconnectVersion=$(select_version ./scripts/build/lastMTConnectChange.sh)
echo "Select IoT2050 device: "
deviceId=$(select_edge_device)
echo "Select iothub: "
iotHub=$(select_datahub)

check_docker_image mdclight-development $mdclightDevVersion 
check_docker_image mdc-web-server $webserverVersion
check_docker_image mtconnect-agent $mtconnectVersion

versionForName=$(sed 's/[.]/-/g' <<< $mdclightDevVersion) # replace all . with -

target="tags.mdclight-dev='$mdclightDevVersion'"
name=${versionForName}-mdclight-dev
manifestName=deployment.manifest.${mdclightDevVersion}.json
manifestPath=development-environment/$manifestName

node development-environment/deployment.manifest.js $mdclightDevVersion $webserverVersion $mtconnectVersion > $manifestPath

# TODO Only create if not exists
az iot edge deployment create -d "$name" -n "$iotHub" --content "$manifestPath" --target-condition "$target" --priority 1 --verbose --layered false
az iot hub device-twin update -n "$iotHub" -d "$deviceId" --tags "{\"mdclight-dev\": \"${mdclightDevVersion}\", \"mdclight\": null}"
rm "$manifestPath"
