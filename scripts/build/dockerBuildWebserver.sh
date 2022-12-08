#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

echo $1

docker buildx build --platform linux/arm64 \
    --build-arg MDC_LIGHT_WEBSERVER_VERSION=${1} \
    -t ${DOCKER_REGISTRY}/mdc-web-server:${1} \
    -f docker/mdcwebserver_arm64.Dockerfile --push .


# docker build --build-arg MDC_LIGHT_WEBSERVER_VERSION=0.0.1 -t mdclightdev.azurecr.io/mdc-web-server:0.0.1 -f docker/mdcwebserver_arm64.Dockerfile .