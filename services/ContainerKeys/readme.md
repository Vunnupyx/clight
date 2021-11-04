# Key-Pair generator for 'Networkmanager' SSH access to host
## Description
This service generates a new pair of public/private RSA 4096 bit key at every system start. This keys are used to set network configuration from docker container to physical host.

## Installation
This service ist already install on MDC Light Golden Image . `containerkeys.service` is located at */etc/systemd/system*. The Shell script `containerkeys.sh` is located inside */root*.

Service must be enabled via `systemctrl enable servicename` for starting on automatically.