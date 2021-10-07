# MTConnect

## Building cpp Agent

Original Guide: [MTConnect](http://mtcup.org/wiki/Installing_C%2B%2B_Agent_on_Ubuntu)

On Debian 10 you need to install gcc 8.5 or later, so we add the testing sources to apt:

```
echo 'deb http://deb.debian.org/debian testing main' >> /etc/apt/sources.list
apt -y update
apt install -y build-essential git cmake libxml2 libxml2-dev ruby curl
mkdir -p ~/agent/build
cd ~/agent
git clone https://github.com/mtconnect/cppagent.git
cd build
cmake -D CMAKE_BUILD_TYPE=Release ../cppagent/
make
cp agent/agent /usr/local/bin
agent -h
```

## Docker

The repository also includes a docker image with the MTConnect Agent installed. It can be started with `yarn docker:run:mtc`.
The agent can be used in the image using the `agent` command.

```
$ docker run -it registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light/mtconnect /bin/bash
root@d998d3b1b362:/# agent -h
Configuration search path: current directory and "/usr/local/bin/"
MTConnect Agent Version 1.7.0.3 - built on Sun Jul 11 20:48:52 2021
Usage: agent [help|daemonize|debug|run] [configuration_file]
       help           Prints this message
       daemonize      Run this process as a background daemon.
                      daemonize with -h will display additional options
       debug          Runs the agent on the command line with verbose logging
       run            Runs the agent on the command line
       config_file    The configuration file to load
                      Default: agent.cfg in current directory

When the agent is started without any arguments it will default to run
```
