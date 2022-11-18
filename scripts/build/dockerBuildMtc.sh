#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

echo $1

docker buildx build --platform linux/arm64 \
    -t ${DOCKER_REGISTRY}/mtconnect-agent:$1 \
    -f docker/mtconnect.dockerfile --push .