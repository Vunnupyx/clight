# Description:  Main image for the mdclight runtime. Copy source code compile to js and copy 
#               runtime-files.
# Authors:      Benedikt Miller, Patrick Kopp, Markus Leitz
# Created:      10-11-2022
# Last Update:  12-06-2022 Reduce layer count

ARG DOCKER_REGISTRY
ARG FANUC_VERSION

FROM ${DOCKER_REGISTRY}/mdclight-fanuc:${FANUC_VERSION}

ARG MDC_LIGHT_RUNTIME_VERSION
# Install compiled MDC light runtime
COPY package.json tsconfig.json /
COPY src src
# Copy runtime config files
COPY _mdclight/runtime-files /etc/mdc-light/runtime-files
RUN echo Building runtime ${MDC_LIGHT_RUNTIME_VERSION} \
    && npm install \
    && npm cache clean -f \
    && mkdir -p /etc/mdc-light/{config,logs,jwtkeys,sslkeys,certs} \
    && mkdir -p /app \
    && npm run build \
    && mv build/main/* /app \
    && rm -rf /build /package.json /tsconfig.json /package-lock.json

WORKDIR /app

ENV LOG_LEVEL=debug
ENV MDC_LIGHT_FOLDER=/etc/mdc-light
ENV MDC_LIGHT_RUNTIME_VERSION=$MDC_LIGHT_RUNTIME_VERSION

EXPOSE 80/tcp 4840/tcp 7878/tcp

CMD node --max-old-space-size=1024 index.js