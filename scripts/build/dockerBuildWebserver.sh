#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

docker buildx build --platform linux/arm64 \
    --build-arg MDC_LIGHT_WEBSERVER_VERSION=${1} \
    -t ${DOCKER_REGISTRY}/mdc-web-server:${BRANCH_NAME:-latest} \
    -f docker/mdcwebserver_arm64.Dockerfile --push .