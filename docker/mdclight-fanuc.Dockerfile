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


RUN dpkg --add-architecture armhf \
    && apt-get update \
    && apt-get install -y $FANUC_DEV_PACKAGES $FANUC_RUNTIME_LIBS \
    && mkdir -p ${NODE_V10_PATH} \
    && mkdir -p /app/fanuc \
    && wget -P ${NODE_V10_PATH} https://nodejs.org/download/release/v10.24.1/$NODE_V10_FILENAME.tar.gz \
    && cd ${NODE_V10_PATH} \
    && tar -xzf ${NODE_V10_FILENAME}.tar.gz \
    && rm -rf ${NODE_V10_FILENAME}.tar.gz \
    && cd /app/fanuc \
    && export OLD_PATH=$PATH \
    # Change PATH to node 10.24.1 for install of gpy modules
    && export PATH=$(echo $PATH | sed -e "s@/usr/local/nvm/versions/node/${NODE_MDC_VERSION}/bin@${NODE_V10_PATH}/${NODE_V10_FILENAME}/bin@g") \
    && npm config set user 0 \
    && npm config set unsafe-perm true \
    && CC=arm-linux-gnueabihf-gcc-8 CXX=arm-linux-gnueabihf-g++-8 ${NPM_V10} install \
    && npm run build \
    && rm -rf Documentation *.ts \
    && ${NPM_V10} cache clean -f \
    # Revert PATH
    && export PATH=$OLD_PATH \
    # Remove setup dependencies
    && apt purge -y ${FANUC_DEV_PACKAGES} \
    && apt autoremove -y
