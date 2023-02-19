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
ENV NODE_V10=${NODE_V10_PATH}/${NODE_V10_FILENAME}/bin/node
ENV NPM_V10=${NODE_V10_PATH}/${NODE_V10_FILENAME}/bin/npm
# Copy fanuc process code to /app folder
COPY Worker /app/fanuc
RUN dpkg --add-architecture armhf 
RUN apt-get update 
RUN apt-get install -y $FANUC_DEV_PACKAGES $FANUC_RUNTIME_LIBS 
RUN mkdir -p ${NODE_V10_PATH} 
RUN mkdir -p /app/fanuc 
RUN wget -P ${NODE_V10_PATH} https://nodejs.org/download/release/v10.24.1/$NODE_V10_FILENAME.tar.gz 
RUN cd ${NODE_V10_PATH} 
RUN tar -xzf ${NODE_V10_FILENAME}.tar.gz 
RUN rm -rf ${NODE_V10_FILENAME}.tar.gz 
RUN cd /app/fanuc 
RUN export OLD_PATH=$PATH 
    # Change PATH to node 10.24.1 for install of gpy modules
RUN REPLACE_STRING="s@/usr/local/nvm/versions/node/$NODE_MDC_VERSION/bin@$NODE_V10_PATH/$NODE_V10_FILENAME/bin@g"
RUN export PATH=$(echo $PATH | sed -e $REPLACE_STRING) 
RUN npm config set user 0 
RUN npm config set unsafe-perm true 
RUN CC=arm-linux-gnueabihf-gcc-8 CXX=arm-linux-gnueabihf-g++-8 ${NPM_V10} ci 
RUN npm run build 
RUN rm -rf Documentation *.ts 
RUN ${NPM_V10} cache clean -f 
    # Revert PATH
RUN export PATH=$OLD_PATH 
    # Remove setup dependencies
RUN apt purge -y ${FANUC_DEV_PACKAGES} 
RUN apt autoremove -y
