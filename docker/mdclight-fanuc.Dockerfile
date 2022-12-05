# Description:  All required dependencies to run Fanuc adapater inside a nodejs 10 subprocess.
#               Images should be between mdclight-base image and the mdclight image as new base
#               image for mdclight.
# Author:       Markus Leitz
# Date:         12-04-2022

ARG DOCKER_REGISTRY=""
ARG DOCKER_REGISTRY_PATH=$DOCKER_REGISTRY + "/"

FROM ${DOCKER_REGISTRY_PATH}mdclight-base-slim:latest

ARG FANUC_DEV_PACKAGES="wget python3 g++ make python3-pip build-essential crossbuild-essential-armhf"
ARG FANUC_RUNTIME_LIBS="libc6:armhf libgcc1:armhf libatomic1-armhf libstdc++6-armhf"
ARG NODE_V10_PATH="/usr/local/node10"
ARG NODE_V10_FILENAME="node-v10.24.1-linux-armv7l"

ENV NODE_V10=${NODE_V10_PATH}/${NODE_V10_FILENAME}/bin/
ENV IP=10.4.21.137 
ENV PORT=8193
COPY src/modules/Southbound/DataSources/Fanuc/ /app/fanuc/
RUN echo $PATH
RUN dpkg --add-architecture armhf \
    && apt-get update \
    && apt-get install -y $FANUC_DEV_PACKAGES $FANUC_RUNTIME_LIBS \
    && mkdir -p ${NODE_V10_PATH} \
    && wget -P ${NODE_V10_PATH} https://nodejs.org/download/release/v10.24.1/$NODE_V10_FILENAME.tar.gz \
    && cd ${NODE_V10_PATH} \
    && tar -xzf ${NODE_V10_FILENAME}.tar.gz \
    && rm -rf ${NODE_V10_FILENAME}.tar.gz \
    && cd /app/fanuc \
    && export OLD_PATH=$PATH \
    # Change PATH to node 10.24.1 for install of gpy modules
    && export PATH=$(echo $PATH | sed -e "s/root\/.nvm\/versions\/node\/v14.21.1\/bin/${NODE_V10_PATH}\/${NODE_V10_FILENAME}\/bin/g") \
    && npm config set user 0 \
    && npm config set unsafe-perm true \
    && echo $PATH && CC=arm-linux-gnueabihf-gcc-8 CXX=arm-linux-gnueabihf-g++-8 ${NODE_V10}npm install \
    # Revert PATH
    && export PATH=$OLD_PATH
WORKDIR /app/fanuc
CMD ${NODE_V10}node index.js
