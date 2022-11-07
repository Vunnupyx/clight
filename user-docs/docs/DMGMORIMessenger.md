---
title: Connecting DMG MORI Messenger
---

You can connect and register your machine to DMG MORI Messenger for monitoring by using either Automatic or Manual method.

Note: In both methods, you need a DMG MORI Messenger license for your machines.

## Automatic Registration

Prerequisites for Automatic Registration:

- You must have the Serial number of the machine filled out under `Device Info` in `General` page of the IoTconnector flex.
- On DMG MORI Messenger have your Organization Unit and Machine Model configured.

**Step 1:** Click on `Connect Messenger` button to open the dialog for automatic registration
![DMG MORI Messenger button](/img/applicationinterface/messenger_button.png)

**Step 2:** In the opened dialog, fill out the information with your DMG MORI Messenger server hostname (or IP address), username and the password. Then click on `Save Server Configuration` button. Afterwards DMG MORI Messenger will be connected and the `Server Status` should display `Server is available`. See example photo below.

![DMG MORI Messenger Server Configuration](/img/applicationinterface/messenger_server_configuration.png)

**Step 3:** Once the server is available, click on the `Register` button. It will open the dialog to fill out registration information. Give a name to your machine, which will be the visible name in DMG MORI Messenger. Then choose your machine model, organization unit and the timezone. Once you click Save, the automatic registration will be performed and you will be able to see your machine in DMG MORI Messenger.
![DMG MORI Messenger Server Registration](/img/applicationinterface/messenger_server_registration.png)

## Manual Registration

**Step 1:** In IoTconnector flex `Application Interface` page, make sure that `Enabled` switch is turned on under MTConnect:

![MTConnect](/img/applicationinterface/mtconnect_enable_stream.png)

You can click on the `Open MTConnect Stream` to verify that the stream is working.

**Step 2:** Inside DMG MORI Messenger, go to Settings -> Machines and click the "Add" button. Now enter the your machine's details as needed.

For `MTConnect Agent` select `MTConnect Agent 1.3.0 (Standard)` and for `MTConnect Stream URL` enter `http://<iot-connector-device-ip>:15404`, for example `http://192.168.178.150:15404`. To find out your IP Address you can go to the [`Network`](Network.md) page on the IoTConnector flex UI.

![DMG MORI Messenger](/img/DMGMessenger.png)

After you configured the machine, data should be displayed on the Messenger dashboard after a few minutes.
