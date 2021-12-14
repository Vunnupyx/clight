#!/bin/bash

KEY_COMMENT="key for network manager of mdc container"
# Create a SSH key pair for the backend container.
ssh-keygen -t rsa -b 4096 -N "" -C "$KEY_COMMENT" -f /root/.ssh/nmcli/nmclikey
# remove old keys from authorized_keys
sed -i "/$KEY_COMMENT/d" /root/.ssh/authorized_keys
# get container of mdc. Is also hostname
NAME=$(docker ps -aqf "name=mdclight")
# add new keys to authorized_keys
cat /root/.ssh/nmcli/nmclikey.pub | sed -e `s/^/from = "$NAME"` >> /root/.ssh/authorized_keys
exit 0
