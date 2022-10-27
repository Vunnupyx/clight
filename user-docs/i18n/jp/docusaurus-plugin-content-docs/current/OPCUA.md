---
title: Connecting OPC UA
---

- The OPC UA Server endpoint is exposed on port `4840` on both network interfaces
- Checkout the [`Network`](Network.md) page to see which IP addresses are configured for your device
- You can use the the free software [`uaExpert`](https://www.unified-automation.com/products/development-tools/uaexpert.html) to check the values on the OPC UA server

You can enable or disable the OPC UA server with the `Enabled` switch.
![OPC UA Overview](/img/applicationinterface/opcua_overview.png)

## Authentication

The OPC UA interface has a drop down menu to select the desired authentication setting. User can choose:

- Anonymous (No authentication required)
- User/Password (Only the entered user name and password allow access to the OPC UA server)
  ![OPC UA Auth Options](/img/applicationinterface/opcua_auth.png)

## Encryption

OPC UA server also supports various security policies and modes. OPC UA Client can choose to use these policies and modes to access OPC UA data points.

Security Policies:

- None
- Basic128Rsa15
- Basic256
- Basic256Sha256

Security Modes:

- None
- Sign
- Sign & Encrypt

## Custom OPC UA Variables

OPC UA interface also allows custom OPC UA Variables. Follow these steps to add custom OPC UA Variable:

- When you open the dialog for OPC UA Variables, click the blue `Add your own OPC UA Variables` button as seen in the photo below.
  ![OPC UA Custom Variables](/img/applicationinterface/opcua_custom.png)

- Enter a `Name` for the OPC UA Variable, a `Node ID` and choose the `Data Type` and click `Save`.
  ![OPC UA Custom Variable Dialog](/img/applicationinterface/add_opcua_custom.png)

- You will see the saved variable on the top, similar to the example below.
  ![OPC UA Added Custom Variable](/img/applicationinterface/added_new_opcua_variable.png)

- You can then click to `Select Variable` button at the right end of the variable to add it to the table.
- To map a value to this variable, follow the normal mapping instructions as explained in [`Application Interface` page](ApplicationInterface.md) and [`Mapping`](Mapping.md) page.
