#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

docker buildx build --platform linux/arm64 \
    -t ${DOCKER_REGISTRY}/mtconnect-prod_arm64:latest \
    -f docker/mtconnect_arm64.dockerfile --push .