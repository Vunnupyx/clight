FROM debian:buster

RUN echo 'deb http://deb.debian.org/debian testing main' >> /etc/apt/sources.list
RUN apt -y update
RUN apt install -y build-essential git cmake libxml2 libxml2-dev ruby curl
RUN mkdir -p ~/agent/build
RUN cd ~/agent
RUN git clone https://github.com/mtconnect/cppagent.git
RUN cd ~/agent/build
RUN cmake -D CMAKE_BUILD_TYPE=Release ../cppagent/
RUN make
RUN cp agent/agent /usr/local/bin

WORKDIR /agentConfiguration

CMD ["agent", "run"]