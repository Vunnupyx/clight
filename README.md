# Machine Data Connector light

## Getting started

To run the MDC light runtime, use the following commands:

- `yarn` (optional) Install dependencies
- `yarn dev` to start the agent
- `IP=192.168.185.100 yarn copy_conf` to update the MDC light config on an IoT2050

## Documentation

- `docs/developer` - Developer documentation
- `docs/user` - User facing documentation

### Project structure

Currently two docker containers are deployed to the IoT2050: The MTConnect agent (mtc) & the MDClight runtime.
The runtime accepts a user configuration file, connects to data sources and provides a TCP-Server for the MTConnect agent.
Only the MTConnect server (provided by the MTC agent) is accessible from the outside.

## Building

- `yarn build:mdclight` - Build & push the production (ARM64) docker image of the MDClight runtime
- `docker:build:mtc-prod` - Build & push the production (ARM64) docker image of the MTConnectAgent runtime
