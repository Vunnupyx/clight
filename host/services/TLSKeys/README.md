## Description

Generate TLS certificates for webservice.

## Installation

### Automatic

Simply run `deploy:service:tlskeys`.

### Manual
Copy `tlskeys.service` to `/etc/systemd/system`.
Service must be enabled via `systemctl enable tlskeys.service` for starting on automatically.