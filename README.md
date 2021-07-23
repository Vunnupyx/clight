# Machine Data Connector light

## Getting started

To run the MDC light runtime, use the following command:
`yarn` (optional) Install dependencies
`yarn dev`

## Documentation

- `docs/developer` - Developer documentation
- `docs/user` - User facing documentation

### Project structure

Currently two docker containers are deployed to the IoT2050: The MTConnect agent (mtc) & the MDClight runtime.
The runtime accepts a user configuration file, connects to data sources and provides a TCP-Server for the MTConnect agent.
Only the MTConnect server (provided by the MTC agent) is accessible from the outside.

## Building

- `yarn build:mdclight` - Build & push the production (ARM64) docker image of the MDClight runtime
