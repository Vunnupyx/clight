---
title: 'Data source: Energy'
---

## Introduction

With this data source you can connect an Energy counter device to your IoTconnector flex device. You can then read the data points from the Energy counter and process it further in IoTconnector flex and map it to an application interface data point.

Note: Currently only Phoenix Contact EMpro Energy counters are supported.

On the top left side of the page you find the main settings for the data source: Enabling, IP address for the Energy counter and selecting the type. At the bottom you will see the [`Current Tariff`](Energy.md#tariff) which is explained further below.

On the top right side of the page you can see the connection status to the Energy counter and the "Test Connection" button to test reachability of the counter.

## Adding Data Points

The possible data points are listed below and can be added using the blue `Add Data Point` button and then using the `Select` button inside the row.

| Address          | Type        | Description                                                                                                                                |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| IN               | Measurement | Effective value current IN                                                                                                                 |
| P                | Measurement | Sum of active power according to DIN EN 61557-12 with sign. >0: Demand <0: Delivery IN                                                     |
| Q                | Measurement | Vectorial total reactive power according to DIN EN 61557-12 with sign as sum of the individual reactive powers. >0: Demand <0: Delivery IN |
| S                | Measurement | Vectorial total apparent power according to DIN EN 61557-12 IN                                                                             |
| PF               | Measurement | Vectorial total power factor with sign according to IEEE. >0: Inductive <0: Capacitive                                                     |
| Ea+              | Meter       | Total active energy demand                                                                                                                 |
| Ea-              | Meter       | Total active energy delivery                                                                                                               |
| Er+              | Meter       | Total reactive energy demand                                                                                                               |
| Ea-              | Meter       | Total reactive energy delivery                                                                                                             |
| T`X` Ea+         | Meter       | Active energy demand since last reset in tariff `X`                                                                                        |
| T`X` Ea-         | Meter       | Active energy delivery since last reset in tariff `X`                                                                                      |
| T`X` Er+         | Meter       | Reactive energy demand since last reset in tariff `X`                                                                                      |
| T`X` Er-         | Meter       | Reactive energy delivery since last reset in tariff `X`                                                                                    |
| T`X` Es          | Meter       | Apparent energy since last reset in tariff `X`                                                                                             |
| T`X` Er          | Meter       | Unsigned reactive energy since last reset in tariff `X`                                                                                    |
| T`X` Runtime     | Meter       | Runtime since last reset in tariff `X`                                                                                                     |
| Tariff           | Device      | Selection of a tariff, 0: No tariff counter active, 1: Tariff 1, 2: Tariff 2, 3: Tariff 3, 4: Tariff 4                                     |
| Firmware Version | Device      | Firmware revision number                                                                                                                   |
| Hardware Version | Device      | Hardware revision number                                                                                                                   |
| Serial Number    | Device      | Serial number                                                                                                                              |
| MAC Address      | Device      | Device MAC address                                                                                                                         |
| Article Number   | Device      | Article number                                                                                                                             |

## Tariff

Tariff is used on the Energy counter to categorize energy usage for better analysis. These are called tariffs, and there are 4 tariffs available:

- Tariff 1 (T1): STANDBY
- Tariff 2 (T2): READY_FOR_PROCESSING
- Tariff 3 (T3): WARM_UP
- Tariff 4 (T4): PROCESSING

By categorizing energy count to such tariffs, you can see clearly how each machine status is consuming energy. You can see in the data points list, that some data points have the T1, T2, T3 or T4 in their names. These are the four tariffs mentioned above, so that energy consumption for each tariff can be observed accordingly.

### How to display current tariff:

To correctly display Current Tariff on top left side of the Data Source page, you need to have `tariff-number` data point added to the table of Data Points. This is possible via two options: Adding the data point manually using the `Add Data Point` method, or by choosing the EEM Kit template from the [`Configuration Wizard`](GettingStarted.md#configuration-wizard).

After the `tariff-number` data point is added, it will be similar to the screenshot below, and the Current Tariff will show the value accordingly.

Note: `tariff-number` is a mandatory data point, therefore it cannot be deleted.

![Energy Tariff Number data point](/img/datasource/EnergyTariffNumberDatapoint.png)

### How to set tariff automatically

Tariff can be automatically set to one of the above mentioned list of tariffs, by setting up the necessary Virtual Data Point (VDP).

This VDP functions as mapping a desired source to a specific tariff, so that when that condition is true, the tariff is activated automatically.

To add the VDP, please go to `Virtual Data Points` page and add the VDP with the type `Set Energy Tariff`. Then give it a name and save. The result will look like the screenshot below:

![Energy Tariff Set VDP](/img/datasource/EnergyTariffVdp.png)

Note: This VDP can only be added once.

After adding the VDP, edit it to select some `Sources`, that will be used as basis for activating relevant tariff number. These sources can be from `Data Source` data points, or other VDPs that have custom logic.

After selecting the sources, please click `Set enumeration` button on the right side and the following dialog will open.

![Energy Tariff Set VDP Dialog](/img/datasource/EnergyTariffVdpDialog.png)

Here you can map the desired source to the desired tariff number. Whenever the source value is `true` (boolean true, or has a positive integer value or has a text) then the tariff will active. If there are multiple tariff number conditions fulfilled, then the result is chosen with the priority order of the tariffs seen on the dialog. You may use drag&drop to rearrange the priority order of the tariff numbers.

The resultant tariff number is then activated on the Energy counter and the counter will categorize energy consumption to that tariff from that moment on and you can see active tariff in Energy Data Source page as well.

For more information about the usage of this Enumeration VDP, please check VDP Enumeration explanation [`here`](VirtualDataPoints.md#enumeration).
