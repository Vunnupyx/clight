# Debugging

This document should explain how to debug some issues, that are tricky to debug.

## Netservice

Check if it runs: ssh -L localhost:44301:192.168.185.179:44301 root@192.168.185.179
Open in browser: https://localhost:44301/ccw/index.html#/login

Or on remote device: curl https://172.17.0.1:44301/ccw/index.html -k

## Nginx

Sometime, Nginx does respond with 404 Not Found error and doesn't tell us why.
The best way to debug such issues is to start the mdc-web-server container, but override the entrypoint, to start the service in debug mode.

`docker run -p 443:443 --network=azure-iot-edge --mount type=bind,source=/home/root/nginx.conf,target=/etc/nginx/nginx.conf -v dmgmori-mdclight-sslkeys:/etc/mdc-light/sslkeys --entrypoint sh -it mdclightdev.azurecr.io/mdc-web-server:3.0.8`

After that, start the debug service by using `nginx-debug -g 'daemon off;'`

When doing so, you could ingest an overridden version of the nginx config to debug step by step.
Don't forget to set the debug level (toplevel: `error_log /var/log/nginx/error_log debug;`)
ATTENTION: Double check network configuration. The container might be inside the wrong network.

404 error might be related to a wrong location match. You could see that in the following logs.
2023/02/07 16:31:35 [debug] 10#10: *3 test location: "/"
2023/02/07 16:31:35 [debug] 10#10: *3 test location: "help/"
2023/02/07 16:31:35 [debug] 10#10: *3 test location: "ccw"
2023/02/07 16:31:35 [debug] 10#10: *3 test location: ~ "\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$"
2023/02/07 16:31:35 [debug] 10#10: *3 test location: ~ "\.(?:css|js)$"
2023/02/07 16:31:35 [debug] 10#10: *3 test location: ~ "^.+\..+$"
2023/02/07 16:31:35 [debug] 10#10: *3 using configuration "^.+\..+$"

As "^.+\..+$" is the most complex expression it is used always for .html requests, no matter if previous matches were valid.
To provide this use "^~" to forward matches. E.g. location ^~ /netservice

## Run runtime manually

```
docker run \
    --mount type=volume,source=dmgmori-mdclight-config,target=/etc/mdclight/config \
    --mount type=volume,source=dmgmori-mdclight-logs,target=/etc/mdc-light/logs \
    --mount type=bind,source=/var/log,target=/host/log/system \
    --mount type=bind,source=/proc,target=/proc \
    --mount type=bind,source=/sys,target=/sys \
    -p 4840:4840 \
    -p 7878:7878 \
    -p 80:80 \
    --network azure-iot-edge \
    --network-alias=mdclight \
    -d \
    mdclightdev.azurecr.io/mdclight:3.0.8
```
