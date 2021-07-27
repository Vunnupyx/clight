
### Setup local mocks
Setup mock for mraa-gpio CLI:
`sudo chmod +x mraa-gpio` and  `sudo cp mraa-gpio /usr/local/bin/`

If you don't have the command `stdbuf` installed copy the mock script also:
`sudo chmod +x stdbuf` and `sudo cp stdbuf /usr/local/bin/`


### Build copy and run on real device (example)

Replace the IP address and setup public key auth on the development target before executing.

`tsc Iot2050mraa.ts && scp ./IoT2050mraa.js root@192.168.185.126:~/IoT2050mraa.js && ssh root@192.168.185.126 node IoT2050mraa.js`