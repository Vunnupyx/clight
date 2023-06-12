# Description:  Main image for the mdclight runtime. Copy source code compile to js and copy 
#               runtime-files.
# Authors:      Benedikt Miller, Patrick Kopp, Markus Leitz
# Created:      10-11-2022
# Last Update:  12-06-2022 Reduce layer count

ARG DOCKER_REGISTRY
ARG FANUC_VERSION

FROM node:14.21.2-alpine as builder

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install

COPY src src
RUN npm run build

# TODO! Use fanuc image as soons its implemented
# FROM ${DOCKER_REGISTRY}/mdclight-fanuc:${FANUC_VERSION}
FROM ${DOCKER_REGISTRY}/mdclight-base:${FANUC_VERSION}

ARG MDC_LIGHT_RUNTIME_VERSION

WORKDIR /app

# Install compiled MDC light runtime

# Copy runtime config files

COPY package.json ./
RUN npm install --only=prod \
    && npm cache clean -f

COPY --from=builder /app/build/main .

RUN mkdir -p /etc/mdc-light/{config,logs,jwtkeys,sslkeys,certs}
COPY _mdclight/runtime-files /etc/mdc-light/runtime-files

ENV LOG_LEVEL=debug
ENV MDC_LIGHT_FOLDER=/etc/mdc-light
ENV MDC_LIGHT_RUNTIME_VERSION=$MDC_LIGHT_RUNTIME_VERSION

EXPOSE 80/tcp 4840/tcp 7878/tcp

CMD node --max-old-space-size=1024 index.js