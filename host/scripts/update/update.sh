#!/bin/sh

docker-compose -f /home/mdclite/docker-compose.yaml down &&
docker-compose -f /home/mdclite/docker-compose.yaml up -d --force-recreate