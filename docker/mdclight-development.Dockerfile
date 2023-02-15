# Description:  Development image for the mdclight runtime. It's basically emtpy an needs to be used like descibed in developer-docs/DevelopUsingRealDevice
# Authors:      Patrick Kopp
# Created:      15-02-2023
# Last Update:  15-02-2023

ARG DOCKER_REGISTRY
ARG FANUC_VERSION

# TODO! Use fanuc image as soons its implemented
# FROM ${DOCKER_REGISTRY}/mdclight-fanuc:${FANUC_VERSION}
FROM ${DOCKER_REGISTRY}/mdclight-base:${FANUC_VERSION}

ARG MDC_LIGHT_RUNTIME_VERSION
ENV MDC_LIGHT_RUNTIME_VERSION=dev-$MDC_LIGHT_RUNTIME_VERSION

WORKDIR /app

ENV LOG_LEVEL=debug
ENV MDC_LIGHT_FOLDER=/etc/mdc-light

EXPOSE 80/tcp 4840/tcp 7878/tcp

CMD node --max-old-space-size=1024 index.js