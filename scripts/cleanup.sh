# Resets device to the complete factory state. Restart required

rm -rf /etc/ssh/ssh_host_* \
/etc/MDCLight/logs/*.log \
/etc/MDCLight/config/auth.json \
/etc/MDCLight/config/ssl* \
/etc/MDCLight/config/config.json \
&& cp /etc/MDCLight/config/config.factory.json /etc/MDCLight/config/config.json \
&& cat /dev/null > ~/.bash_history \
&& history -c