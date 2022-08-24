# Resets device to the complete factory state. Restart required

rm -rf /home/mdclite/.ssh/nmcli \
echo "" > /home/mdclite/.ssh/authorized_keys \
rm -rf /etc/MDCLight/logs/*.log \
/etc/MDCLight/config/auth.json \
/etc/MDCLight/config/config.json \
/etc/MDCLight/config/certs \
&& cp /etc/MDCLight/config/config.factory.json /etc/MDCLight/config/config.json \
&& cat /dev/null > ~/.bash_history \
&& history -c