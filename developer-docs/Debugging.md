# Debugging

This document should explain how to debug some issues, that are tricky to debug.

## Nginx

Sometime, Nginx does respond with 404 Not Found error and doesn't tell us why.
The best way to debug such issues is to start the mdc-web-server container, but override the entrypoint, to start the service in debug mode.

`docker run -it --name nginx --network host --mount type=bind,source=$(pwd)/nginx.conf,target=/etc/nginx/nginx.conf -v dmgmori-mdclight-sslkeys:/etc/mdc-light/sslkeys --entrypoint sh mdclightdev.azurecr.io/mdc-web-server:<TAG>`

After that, start the debug service by using `nginx-debug -g 'daemon off;'`

When doing so, you could ingest an overridden version of the nginx config to debug step by step.
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
