rm -rf /etc/ssh/ssh_host_* \
/etc/MDCLight/logs/*.log \
/etc/MDCLight/config/auth.json \
/etc/MDCLight/config/ssl* \
&& cat /dev/null > ~/.bash_history \
&& history -c