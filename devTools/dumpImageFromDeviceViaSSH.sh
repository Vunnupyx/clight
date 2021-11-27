ssh $REMOTE_HOST \
"rm -rf /etc/ssh/ssh_host_* \
/etc/MDCLight/logs/*.log \
/etc/MDCLight/config/auth.json \
/etc/MDCLight/config/ssl* \
&& cat /dev/null > ~/.bash_history \
&& history -c \
&& nmcli con mod eth1-default ipv4.addresses 192.168.185.186/24 ipv4.gateway 0.0.0.0.0 ipv4.dns 0.0.0.0 ipv4.method auto > /dev/null 2>&1 \
&& nmcli con mod eth0-default ipv4.addresses 192.168.214.230/24 ipv4.gateway 0.0.0.0.0 ipv4.dns 0.0.0.0 ipv4.method manual > /dev/null 2>&1 \
&& nmcli con up eth0-default > /dev/null 2>&1 \
&& nmcli con up eth1-default > /dev/null 2>&1 \
&& dd if=/dev/mmcblk0 | gzip -1 -" | dd of="./iot-connector-light-os-`date +\"%d-%m-%Y\"`.gz"