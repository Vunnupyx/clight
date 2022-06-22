#!/bin/sh

# case $1 in 
#     dev);;
#     prod);;
#     stag);;
#     *)
#         echo "UNKNOWN ENV VARIABLE EXIT!"
#         exit 1
# esac

docker-compose -f /home/mdclite/docker-compose.yaml down && docker-compose -f /home/mdclite/docker-compose.yaml up -d --force-recreate