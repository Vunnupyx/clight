ARG DOCKER_REGISTRY

FROM ${DOCKER_REGISTRY}/mdclight-base:latest

WORKDIR /

ARG MDC_LIGHT_RUNTIME_VERSION
RUN echo Building runtime ${MDC_LIGHT_RUNTIME_VERSION}

# Install compiled MDC light runtime
COPY package.json package.json
RUN npm install

RUN mkdir -p /etc/mdc-light/config
RUN mkdir -p /etc/mdc-light/logs
RUN mkdir -p /etc/mdc-light/jwtkeys
RUN mkdir -p /etc/mdc-light/sslkeys

# Copy runtime config files
COPY _mdclight/runtime-files /etc/mdc-light/runtime-files

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build

RUN mv build/main app

WORKDIR /app

ENV LOG_LEVEL=info
ENV MDC_LIGHT_FOLDER=/etc/mdc-light
ENV MDC_LIGHT_RUNTIME_VERSION=$MDC_LIGHT_RUNTIME_VERSION

EXPOSE 80/tcp
EXPOSE 4840/tcp
EXPOSE 7878/tcp

CMD ["node", "--max-old-space-size=1024", "index.js"]