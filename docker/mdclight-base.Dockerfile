FROM debian:buster

# RUN echo 'deb http://deb.debian.org/debian testing main' >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y git build-essential cmake curl
RUN git clone https://github.com/eclipse/mraa.git
RUN git clone https://github.com/siemens/meta-iot2050

# Clone mraa library & fix to specific (known compatiable) commit
RUN cd mraa && git checkout 7786c7ded5c9ce7773890d0e3dc27632898fc6b1 && cd ..
# Clone meta-iot2050 & fix to specific (kown  compatiable) commit
RUN cd meta-iot2050 && git checkout 280a8d0a67e1dc22711c6089dd9f7d5cf58332d6 && cd ..
# Remove SWIG patch (not used)
RUN rm meta-iot2050/recipes-app/mraa/files/0001-Add-Node-7.x-aka-V8-5.2-support.patch
# Copy patches into mraa repo
RUN cp -r meta-iot2050/recipes-app/mraa/files mraa/patches

WORKDIR /mraa
# Apply siemens patches to mraa to enable board support for IOT2050
RUN git apply --ignore-whitespace patches/*.patch

RUN mkdir build \
    && cd build \
    && cmake -DBUILDSWIGNODE=OFF .. \
    && make \
    && make install

WORKDIR / 

# Cleanup
RUN rm -rf mraa
RUN rm -rf meta-iot2050

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs zip
RUN apt purge -y git build-essential cmake curl

