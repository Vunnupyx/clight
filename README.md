# Machine Data Connector light

## Getting started

To run the development version of the MDC light you need either Mac OS 10.15.x (or newer), Ubuntu 20.04 or Debian 10. On your operating system docker, nodejs (14.x) and yarn needs to be installed. VSCode is recommended as an IDE.

You also need to have access to the `registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light` docker registry, or you need to build the
docker containers locally using the entry points in the package.json. Use you Gitlab credentials to authenticate with the registry.

To run the MDC light runtime, use the following commands:

- `yarn` - Install dependencies
- `yarn docker:run:mtc` - Run the MTConnect agent
- `yarn dev` - To start the agent (in a different terminal)
- `IP=192.168.185.100 yarn copy_mdc_conf` to update the MDC light config on an IoT2050

### Local development without IO-Shield

If you want to use the ioshield data source without developing on an IoT2050, you have to install the following mocks:

Setup mock for mraa-gpio CLI:
`sudo chmod +x src/modules/Iot2050MraaDI10/mraa-gpio/mraa-gpio` and `sudo cp src/modules/Iot2050MraaDI10/mraa-gpio/mraa-gpio /usr/local/bin/`

If you don't have the command `stdbuf` installed copy the mock script also:
`sudo chmod +x src/modules/Iot2050MraaDI10/mraa-gpio/stdbuf` and `sudo cp src/modules/Iot2050MraaDI10/mraa-gpio/stdbuf /usr/local/bin/`

## Documentation

Additional documentation can be found in the following folders of this repository:

- `docs/developer` - Developer documentation
- `docs/user` - User facing documentation

## Project structure

Currently two docker containers are deployed to the IoT2050: The MTConnect agent (mtc) & the MDClight runtime.
The runtime accepts a user configuration file, connects to data sources and provides a TCP-Server for the MTConnect agent.
Only the MTConnect server (provided by the MTC agent) is accessible from the outside.

## Building the docker image

- `yarn build:mdclight` - Build & push the production (ARM64) docker image of the MDClight runtime
- See `docs/developer` for information on how to integrate new version with the operating system of the IoT2050
