ARG DOCKER_REGISTRY
ARG MDC_LIGHT_RUNTIME_VERSION

FROM ${DOCKER_REGISTRY}/mdclight-base:latest

WORKDIR /

RUN echo "Building runtime with version ${MDC_LIGHT_RUNTIME_VERSION}"

# Install compiled MDC light runtime
COPY package.json package.json
RUN npm install

# Install key pair for network manager cli
RUN mkdir /root/.ssh/
COPY host/services/ContainerKeys/containerSSHConfig /root/.ssh
RUN mv /root/.ssh/containerSSHConfig /root/.ssh/config
RUN chmod 600 /root/.ssh/config

# Copy runtime config files
COPY _mdclight/opcua_nodeSet /runTimeFiles/nodeSets
COPY _mdclight/runtime.json /runTimeFiles/

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build

RUN mv build/main app

WORKDIR /app

ENV LOG_LEVEL=info
ENV MDC_LIGHT_FOLDER=/

CMD ["node", "--max-old-space-size=1024", "index.js"]