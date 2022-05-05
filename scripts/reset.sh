# Resets device to a initial state, with empty config and no password set

rm -rf /etc/MDCLight/config/auth.json \
/etc/MDCLight/config/config.json \
/etc/MDCLight/config/certs \
&& cp /etc/MDCLight/config/config.factory.json /etc/MDCLight/config/config.json