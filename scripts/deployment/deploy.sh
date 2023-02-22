#!/bin/bash

# Script do simplify the container deployment for development purposes.
# Must be executed from workspace root!
# Always execute with `yarn deploy`!

#! You must be logged in with the az cli!
# az login
# az account set --subscription "CELOS Next Datahub DEV"
# docker login mdclightdev.azurecr.io with credentials from password manager

# Sourcing common functions
. ./scripts/deployment/common.sh

echo "Select mdclight version (git describe --tags):"
mdclightVersion=$(select_version ./scripts/build/lastMdclightChange.sh)
echo "Select web server version (git describe --tags):"
webserverVersion=$(select_version ./scripts/build/lastWebserverChange.sh)
echo "Select mtconnect (git describe --tags):"
mtconnectVersion=$(select_version ./scripts/build/lastMTConnectChange.sh)
echo "Select IoT2050 device:"
deviceId=$(select_edge_device)
echo "Select iothub: "
iotHub=$(select_datahub)

check_docker_image mdclight $mdclightVersion 
check_docker_image mdc-web-server $webserverVersion
check_docker_image mtconnect-agent $mtconnectVersion

currentGitHash=$(git rev-parse --short HEAD)

target="tags.mdclight='$currentGitHash'"
name=${currentGitHash}-mdclight
manifestName=mdclight.manifest.${currentGitHash}.json
manifestPath=scripts/deployment/$manifestName

node scripts/deployment/mdclight.manifest.js $mdclightVersion $webserverVersion $mtconnectVersion > $manifestPath
az iot edge deployment create -d "$name" -n "$iotHub" --content "$manifestPath" --target-condition "$target" --priority 1 --verbose --layered false
az iot hub device-twin update -n "$iotHub" -d "$deviceId" --tags "{\"mdclight\": \"${currentGitHash}\", \"mdclight-dev\": null}"
rm "$manifestPath"
