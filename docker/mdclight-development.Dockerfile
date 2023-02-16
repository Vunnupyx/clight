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

WORKDIR /app

RUN mkdir -p /etc/mdc-light/{config,logs,jwtkeys,sslkeys,certs}

ENV LOG_LEVEL=debug
ENV MDC_LIGHT_FOLDER=/etc/mdc-light
ENV MDC_LIGHT_RUNTIME_VERSION=dev-$MDC_LIGHT_RUNTIME_VERSION

EXPOSE 80/tcp 4840/tcp 7878/tcp 9229/tcp

CMD node --max-old-space-size=1024 --inspect=0.0.0.0:9229 index.js