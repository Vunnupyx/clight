FROM mdclight-base:latest

WORKDIR /
# Install compiled MDC light runtime
COPY package.json package.json
RUN npm install

# Install key pair for network manager cli
RUN mkdir /root/.ssh/
COPY host/services/ContainerKeys/containerSSHConfig /root/.ssh
COPY _mdclight/opcua_nodeSet /runTimeFiles/nodeSets
COPY _mdclight/runtime.json /runTimeFiles/
RUN mv /root/.ssh/containerSSHConfig /root/.ssh/config
RUN chmod 600 /root/.ssh/config

COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build

RUN mv build/main app

WORKDIR /app

ENV LOG_LEVEL=debug
ENV MDC_LIGHT_FOLDER=/


ARG MDC_LIGHT_RUNTIME_VERSION=staging
ENV MDC_LIGHT_RUNTIME_VERSION ${MDC_LIGHT_RUNTIME_VERSION}
ENV NODE_ENV=development

#FAKE LEDS FOR LOCAL TEST CONTAINER ENV
ENV MOCK_LEDS=fakeSys
RUN mkdir -p ${MOCK_LEDS}/sys/class/leds/user-led1-green && touch ${MOCK_LEDS}/sys/class/leds/user-led1-green/brightness
RUN mkdir -p ${MOCK_LEDS}/sys/class/leds/user-led1-red && touch ${MOCK_LEDS}/sys/class/leds/user-led1-red/brightness
RUN mkdir -p ${MOCK_LEDS}/sys/class/leds/user-led2-green && touch ${MOCK_LEDS}/sys/class/leds/user-led2-green/brightness
RUN mkdir -p ${MOCK_LEDS}/sys/class/leds/user-led2-red && touch ${MOCK_LEDS}/sys/class/leds/user-led2-red/brightness

# FAKE USER BUTTON FOR LOCAL TEST CONTAINER ENV
ENV MOCK_USER_BUTTON=fakeSys
RUN mkdir -p ${MOCK_USER_BUTTON}/sys/class/gpio/gpio211 && touch ${MOCK_USER_BUTTON}/sys/class/gpio/export && touch ${MOCK_USER_BUTTON}/sys/class/gpio/gpio211/value


CMD ["node", "--max-old-space-size=1024", "index.js"]
# CMD ["sleep","3600"]