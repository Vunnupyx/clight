# Description:  All required dependencies to run Fanuc adapater inside a nodejs 10 subprocess.
#               Images should be between mdclight-base image and the mdclight image as new base
#               image for mdclight.
# Author:       Markus Leitz
# Date:         12-04-2022

ARG DOCKER_REGISTRY
ARG BASE_VERSION

FROM ${DOCKER_REGISTRY}/mdclight-base:${BASE_VERSION}

SHELL ["/bin/bash", "-l", "-c"]

ARG FANUC_DEV_PACKAGES="wget python3 g++ make python3-pip build-essential crossbuild-essential-armhf"
ARG FANUC_RUNTIME_LIBS="libc6:armhf libgcc1:armhf libatomic1-armhf libstdc++6-armhf"
ARG NODE_V10_PATH=/usr/local/node10
ARG NODE_V10_FILENAME=node-v10.24.1-linux-armv7l
ARG NODE_MDC_VERSION=v14.21.1

ENV NODE_V10=${NODE_V10_PATH}/${NODE_V10_FILENAME}/bin/

# Copy fanuc process code to /app folder
COPY src/modules/Southbound/DataSources/Fanuc/ /app/fanuc/
COPY scripts/build/setupFanucImage.sh /

RUN ./setupFanucImage.sh && rm -rf /setupFanucImage.sh
