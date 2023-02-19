#!/bin/bash

# Deployment of dev environment to device
# Must be executed from workspace root!
# Always execute with `yarn deploy-dev`!

#! You must be logged in with the az cli!
# az login
# az account set --subscription "CELOS Next Datahub DEV"
# docker login mdclightdev.azurecr.io with credentials from password manager

# Sourcing common functions
. ./scripts/deployment/common.sh

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

currentGitHash=$(git rev-parse --short HEAD)

target="tags.mdclight-dev='$currentGitHash'"
name=${currentGitHash}-mdclight-dev
manifestName=mdclight-dev.manifest.${currentGitHash}.json
manifestPath=scripts/deployment/$manifestName

node scripts/deployment/mdclight-dev.manifest.js $mdclightDevVersion $webserverVersion $mtconnectVersion > $manifestPath

# TODO Only create if not exists
az iot edge deployment create -d "$name" -n "$iotHub" --content "$manifestPath" --target-condition "$target" --priority 1 --verbose --layered false
az iot hub device-twin update -n "$iotHub" -d "$deviceId" --tags "{\"mdclight-dev\": \"${currentGitHash}\", \"mdclight\": null}"
rm "$manifestPath"
