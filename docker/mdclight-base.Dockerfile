# Description:  Base image for the mdclight runtime. Install mraa from sourde with a patch bye 
#               siemens.
# Author:       Benedikt Miller, Markus Leitz
# Date:         12-04-2022 (Updated)
# Last changes: Reduce layer count be run all setup in one RUN command.

# TODO: Test image debian:buster-slim
FROM debian:buster

SHELL ["bash", "-l", "-c"]

ARG SETUP_DEPS="git build-essential cmake curl"
ARG RUNTIME_DEPS="zip openssl"
ARG NODE_VERSION=v14.21.1
ENV NVM_DIR=/usr/local/nvm
RUN apt-get update \
    && apt-get install -y ${SETUP_DEPS} ${RUNTIME_DEPS} \
    && git clone https://github.com/eclipse/mraa.git \
    && git clone https://github.com/siemens/meta-iot2050 \
    # Clone mraa library & fix to specific (known compatiable) commit
    && cd /mraa && git checkout 7786c7ded5c9ce7773890d0e3dc27632898fc6b1 \
    # Clone meta-iot2050 & fix to specific (kown  compatiable) commit
    && cd /meta-iot2050 && git checkout 280a8d0a67e1dc22711c6089dd9f7d5cf58332d6 \
    # Remove SWIG patch (not used)
    && rm /meta-iot2050/recipes-app/mraa/files/0001-Add-Node-7.x-aka-V8-5.2-support.patch \
    # Copy patches into mraa repo
    && cp -r /meta-iot2050/recipes-app/mraa/files /mraa/patches \
    && cd /mraa \
    # Apply siemens patches to mraa to enable board support for IOT2050
    && git apply --ignore-whitespace patches/*.patch \
    # Build and install mraa
    && mkdir build \
    && cd build \
    && cmake -DBUILDSWIGNODE=OFF .. \
    && make \
    && make install \
    # Cleanup
    && rm -rf /mraa /meta-iot2050 \
    # Required for the curl command 
    && cd / \
    # Install node version manager and install node v14.21.1
    && curl --silent  -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.33.0/install.sh | bash \
    && source ~/.bashrc \
    && nvm install ${NODE_VERSION} \
    # Remove setup dependencies
    && apt purge -y ${SETUP_DEPS} \
    && apt autoremove -y
