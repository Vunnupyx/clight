---
title: Getting Started
slug: /
---

## Login

If you login for the first time, you have to use a standard password and username. The default user is in the following format:
`DM` + `<MAC-Address without separators>`

The MAC-Address can be found on the label on the right side of the IoT2050 (on the gray heat sink).

![IOT2050 Label](/content/IoT2050Label.png)

In this example the default user would be `DM8CF31929BA4A`. The default password is `iotconnectorlight`.

After you sign in for the first time, you need to change the default password. The device will only be usable, after you changed your password.

## Configuration Wizard

After you have changed the default password, the "Configuration Wizard" will automatically open. Here you can select your language, select a template for your use case and tune it to your needs.

The following templates are available:

- GM Series (For DMG Mori GM 16-6 or GM 20-6 machines)
- SINUMERIK 840d SL (Connect SINUMERIK 840D sl controls to DMG Messenger, OPC UA or CELOS Exchange)
- SINUMERIK 840d SL (Connect SINUMERIK 840D sl controls to DMG Messenger)

After you have selected your template, you can fine tune the data source and application interface in the following steps. After you completed the wizard you can now start to connect your client applications.

## Connecting Client Applications

### MTConnect

- The MTConnect endpoint is exposed on port `15404` on both network interfaces
- Checkout the "Network Settings"-Tab to see which IP addresses are configured for your device
- You can use the "Open MTConnect Stream" button on the Application Interfaces/MTConnect page to see the current values in MTConnect

### OPC UA

- The OPC UA Server endpoint is exposed on port `4840` on both network interfaces
- Checkout the "Network Settings"-Tab to see which IP addresses are configured for your device
- You can use the the free software [uaExpert](https://www.unified-automation.com/products/development-tools/uaexpert.html) to check the values on the OPC UA server
