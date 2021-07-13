# Run adapter & agent

1. Setup and start socat and xquartz like described here:
   https://cntnr.io/running-guis-with-docker-on-mac-os-x-a14df6a76efc

2. Run "docker-compose up"
   Sometimes the xquartz connection cashes. Just restart everything again.

3. Hit "start" in die Adapter UI

4. Query data:
   curl http://127.0.0.1:5000/current > output.xml
