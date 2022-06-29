#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

docker buildx build --platform linux/arm64,linux/amd64 \
    -t ${DOCKER_REGISTRY}/mdclight-base:latest \
    -f docker/mdclight-base.Dockerfile --push .