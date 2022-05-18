#!/bin/bash

mkdir -p ./_mdclight/local/fakeSSH 
mkdir -p ./_mdclight/local/logs
rm -rf ./_mdclight/local/ssl* ./_mdclight/local/fakeSSH/nmclikey*
rm -rf ./_mdclight/local/logs/*
openssl req -x509 -nodes -days 10950 -newkey rsa:2048 -keyout ./_mdclight/local/ssl_private.key -out ./_mdclight/local/ssl.crt -subj "/C=DE/L=Munich/O=codestryke GmbH/CN=IOT2050/emailAddress=info@codestryke.com" &&
ssh-keygen -t rsa -b 4096 -N "" -C "DUMMY SSH KEYS FOR LOCAL TESTING" -f ./_mdclight/local/fakeSSH/nmclikey
cp -R _mdclight/config _mdclight/local/config
