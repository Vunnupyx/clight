#!/bin/bash
# Description:  Handles container image setup. 
#               Download arm nodejs runtime and install node_modules with it
# Author:       Markus Leitz, codestryke GmbH <ml@codestryke.com>

dpkg --add-architecture armhf \
&& apt-get update \
&& apt-get install -y ${FANUC_DEV_PACKAGES} ${FANUC_RUNTIME_LIBS} \
&& mkdir -p ${NODE_V10_PATH} \
&& wget -P ${NODE_V10_PATH} https://nodejs.org/download/release/v10.24.1/${NODE_V10_FILENAME}.tar.gz \
&& cd ${NODE_V10_PATH} \
&& tar -xzf ${NODE_V10_FILENAME}.tar.gz \
&& rm -rf ${NODE_V10_FILENAME}.tar.gz \
&& cd /app/fanuc \
&& rm -rf node_modules \
&& NEWPATH=$(echo $PATH | sed -e "s@/usr/local/nvm/versions/node/${NODE_MDC_VERSION}/bin@${NODE_V10_PATH}/${NODE_V10_FILENAME}/bin@g") \
&& PATH=$NEWPATH \
&& npm config set user 0 \
&& npm config set unsafe-perm true \
&& CC=arm-linux-gnueabihf-gcc-8 CXX=arm-linux-gnueabihf-g++-8 npm install \
&& npm cache clean -f \
&& apt-get purge -y ${FANUC_DEV_PACKAGES} \
&& apt-get autoremove -y