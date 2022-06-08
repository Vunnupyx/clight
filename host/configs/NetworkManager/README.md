# Description
Contains the interface configuration and configuration files for NetworkManager on io2050 device.

## Deploy
### Automatic
Simply run the following commands: `npm run deploy:network:connections` and `npm run deploy:network:conf`

### Manual
Copy system-connections files with root permissions to host `/etc/NetworkManager/system-connections` directory.
Copy `no-systemd-resolved.conf` with root permissions to host `/etc/NetworkManager/conf.d` directory.
