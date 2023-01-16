#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

docker buildx build --platform linux/arm64 \
    --build-arg DOCKER_REGISTRY=${DOCKER_REGISTRY} \
    -t ${DOCKER_REGISTRY}/mdclight-fanuc:latest \
    -f docker/mdclight-fanuc.Dockerfile . --push --progress plain