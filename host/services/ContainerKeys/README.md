# Key-Pair generator for 'Networkmanager' SSH access to host

## Description

This service generates a new pair of public/private RSA 4096 bit key at every system start. This keys are used to set network configuration from docker container to physical host.

## Installation

### Automatic

Simply run `npm run deploy:service:containerkeys`

### Manual
Copy `containerkeys.service` to `/etc/systemd/system`.
Service must be enabled via `systemctl enable containerkeys.service` for starting on automatically.
