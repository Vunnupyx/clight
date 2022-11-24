#!/bin/sh

if [[ -z "$DOCKER_REGISTRY" ]]; then
    echo "DOCKER_REGISTRY must be provided!" 1>&2
    exit 1
fi

echo $1

docker buildx build  --platform linux/arm64 \
    --build-arg MDC_LIGHT_RUNTIME_VERSION=${1} \
    --build-arg DOCKER_REGISTRY=${DOCKER_REGISTRY} \
    -t ${DOCKER_REGISTRY}/mdclight:$1 \
    -f docker/mdclight.Dockerfile . --push --progress plain --no-cache