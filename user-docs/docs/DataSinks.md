---
title: Application Interfaces
---

## Introduction

`Application Interfaces` provide the intersections protocols in the IoT Connector light. The process data read from the data sources can thus be processed further by external applications, such as for example DMG MORI MONITORING, or cloud platforms.

The current supported interfaces/protocols are:

- `MTConnect` (Interface for DMG MORI MONITORING, other Applications)
- `OPC UA` (Interface for other Application, such as UA Expert)
- `CELOS Xchange` (Interface for DMG MORI cloud applications, such as Tulip)

## General Usage

In the first setup process you are able to select your required `Application Interfaces`. Depending on the selected Templates there are preselected `data points` available on each interface tab.

For every protocol with exception of the `CELOS Xchange` it is possible to add, delete or edit a `data point` in the list. Its also possible to enable or disable the interface completely.

For protocol specific settings read the corresponding section.

### Add a new data point

Adding a new data point to the data points list is very simple and straight forward.

1. Click the blue button with the white plus icon
2. Select the desired data source point from the popped up overlay and click the arrow button
3. The overlay disappears and there is a new editable entry in the list.
4. Enter the name you want for this data point. The current text is only a placeholder.
5. (optional) Change the type of the data point as desired
6. (optional) Enter a initial value for your data point
7. (optional) Add some mapping for the received values
8. Click the green check button to leave the edit state or click the red cross to discard your entry.
9. Click the `Apply Changes` button to send your new data point the the device.

### Delete a new data point

Deleting a new data point is also a straight forward process.

1. Click on right side of the entry you want to delete in `Actions` section the garbage icon
2. Select Yes in the popped up overlay with the question: "Are you sure you want to delete data point [datapoint name]?"
3. Click the `Apply Changes` button to send the change to the backend

### Edit a data point

Equal to deleting a new data point you change the entries for a data point

1. Click on right side of the entry you want to delete in `Actions` section the pencil icon
2. The list entry is now editable like a new generated data point (see: Add a new data point: Step 4 and further ).
3. After last changes click the green check button to leave the edit state or click the red cross to discard your entry.
4. Click the `Apply Changes` button to send your new data point the the device.

### MTConnect specific configurations and options

The MTConnect interface tab has one additional button to show the current `MTConnect` data stream in a new browser tab.

### OPC UA

The OPC UA interface tab has a drop down menu to select the desired authentication setting for this interface. User can choose:

- Anonymous (No authentication required)
- User/Password (Only entered user name and password allow access to the interface)

### CELOS Xchange

If you are using the `CELOS Xchange` interface there is no additional configuration required. All preconfigured data points are automatically send to the `CELOS Xchange` cloud instance, in case they are mapped correctly in the mapping section.
