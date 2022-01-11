---
title: Getting Started
---

## Login

If you login for the first time, you have to use a standard password and username. The default user is "User"

The default password is the MAC-Address, that can be found on the label on the right side of the IoT2050 (on the gray heat sink).

![IOT2050 Label](/content/IoT2050Label.png)

In this example the default password would be `8CF31929BA4A`.

After you sign in for the first time, you need to change the default password. The device will only be usable, after you changed your password.

## Configuration Wizard

After you have changed the default password, the "Configuration Wizard" will automatically open. Here you can select your language, select a template for your use case and tune it to your needs.

The following templates are available:

- GM Series (For DMG Mori GM 16-6 or GM 20-6 machines)
- SINUMERIK 840d SL (Connect SINUMERIK 840D sl controls to DMG Messenger, OPC UA or CELOS Exchange)
- SINUMERIK 840d SL (Connect SINUMERIK 840D sl controls to DMG Messenger)

After you have selected your template, you can fine tune the data source and application interface in the following steps. After you completed the wizard you can now start to connect your client applications.

## Connecting DMG Messenger

Go to Settings -> Machines and click the "Add" button. Now enter the your machine's details as needed.

For "MTConnect Agent" select "MTConnect Agent 1.3.0 (Standard)" and for "MTConnect Stream URL" enter `http://<iot-connector-device-ip>:15404`, for example `http://192.168.178.150:15404`. To find out your IP Address you can go to the "Network" page on the IoTConnector configuration UI.

![DMG Messenger](/content/DMGMessenger.png)

After you configured the machine, data should be displayed on the Messenger dashboard after a few minutes.
