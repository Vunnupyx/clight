FROM registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light/mdclight-base:latest

WORKDIR /
# Install compiled MDC light runtime
COPY package.json package.json
RUN npm install

# Install key pair for network manager cli
RUN mkdir /root/.ssh/
COPY services/ContainerKeys/containerSSHConfig /root/.ssh
RUN mv /root/.ssh/containerSSHConfig /root/.ssh/config
RUN chmod 600 /root/.ssh/config

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build

RUN mv build/main app

WORKDIR /app

ENV LOG_LEVEL=info
ENV MDC_LIGHT_FOLDER=/

ARG MDC_LIGHT_RUNTIME_VERSION=staging
ENV MDC_LIGHT_RUNTIME_VERSION ${MDC_LIGHT_RUNTIME_VERSION}

CMD ["node", "index.js"]