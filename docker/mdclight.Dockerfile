ARG DOCKER_REGISTRY

FROM ${DOCKER_REGISTRY}/mdclight-base:latest

WORKDIR /

ARG MDC_LIGHT_RUNTIME_VERSION
RUN echo Building runtime ${MDC_LIGHT_RUNTIME_VERSION}

# Install compiled MDC light runtime
COPY package.json package.json
RUN npm install

# Install key pair for network manager cli
RUN mkdir /root/.ssh/
COPY host/services/ContainerKeys/containerSSHConfig /root/.ssh
RUN mv /root/.ssh/containerSSHConfig /root/.ssh/config
RUN chmod 600 /root/.ssh/config

RUN mkdir -p /etc/MDClight/config
RUN mkdir -p /etc/MDClight/logs
RUN mkdir -p /etc/MDClight/jwtkeys
RUN mkdir -p /etc/MDClight/sslkeys

# Copy runtime config files
COPY _mdclight/runtime-files /etc/MDClight/runtime-files

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build

RUN mv build/main app

WORKDIR /app

ENV LOG_LEVEL=info
ENV MDC_LIGHT_FOLDER=/etc/MDClight
ENV MDC_LIGHT_RUNTIME_VERSION=$MDC_LIGHT_RUNTIME_VERSION

CMD ["node", "--max-old-space-size=1024", "index.js"]