---
title: 'Data source: MTConnect'
---

## Introduction

With this data source you can read data points from other machines using MTConnect Agent or Adapter into your IoTconnector flex. Currently only Agent is supported.

On the top left side of the page you find the main settings for the data source: Enabled, Machine Name, Host, Port and Type.

- Enabled: To enable and disable the MTConnect data source connection.
- Machine Name: It is optional to use this field. If you enter the name of the machine, only its data points are read, otherwise all machines' data points are read from the MTConnect Agent/Adapter.
- Host: Hostname or IP address for the machine, where MTConnect Agent/Adapter is running.
- Port: Port for the machine, where MTConnect Agent/Adapter is running.
- Type: Agent or Adapter. (Currently only Agent is supported)

On the top right side of the page, you find the `Open MTConnect Stream` (only if Type is Agent) and `Test Connection` buttons.

- Open MTConnect Stream: This is active only when type is set to Agent and i opens the XML stream from the host machine. If Machine Name is entered, then the stream only shows data points of this machine.
- Test Connection: Pings the hostname to test reachability.

## Adding Data Points

To add a data point, click on the blue `Add Data Point` button ![Add data point button](/img/datasource/addbutton.png).

Newly added data points are shown at the bottom of the table. You need to give a name, selects its type ([see Data Point Types section](MTConnectDataSource.md#data-point-types)) and finally enter the address of the data point. The address given must match the `dataItemId` in the XML stream of MTConnect Agent, so that its value can be read.

Once you are done click green check icon to save your changes. After all changes please click `Apply Changes` on the top right of the page.

Example list of data points is as seen in the following screenshot:
![MTConnect Data points list example](/img/datasource/mtconnect_datapoints_example.png)

After adding the data points, their live values will be read and shown in the table. These data points can then be used as usual in [Virtual Data Points](VirtualDataPoints.md) and [Mapping](Mapping.md) for [Application Interfaces](ApplicationInterface.md).

### Data Point Types

There are two supported types of data points:

- Event
- Sample

##### Selecting the right type:

_For MTConnect Agent:_
Please check the /probe endpoint of your XML stream to find `category` of the data point you want to enter. `category` can have one of the following values: `EVENT`,`SAMPLE` and `CONDITION`. You can then choose the type accordingly in the IoTconnector flex.

_For MTConnect Adapter:_
If the datapoint is a time series or number then please choose `Event`. If it has another type, then please choose `Sample`. If it is a Condition, then please choose `Condition` (currently not supported).
