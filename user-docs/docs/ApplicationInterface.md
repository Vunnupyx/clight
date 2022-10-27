---
title: Application Interfaces
---

## Introduction

`Application Interfaces` provide the opportunity to export data from the IoTconnector flex to external applications. The data read and prepared from the data sources can thus be processed further by external applications, such as for example DMG MORI Messenger, or cloud platforms.

The current supported interfaces/protocols are:

- `MTConnect` (Interface for DMG MORI Messenger, other Applications)
- `OPC UA` (Interface for other Applications, such as UA Expert)
- `CELOS Xchange` (Interface for DMG MORI cloud applications, such as Tulip)

## General Usage

![](/img/applicationinterface/overview.png)

In the first setup process you are able to select your required `Application Interfaces`. Depending on the selected Templates there are preselected `data points` available on each interface tab.

For every protocol with exception of the `CELOS Xchange` it is possible to add, delete or edit a `data point` in the list. For `OPC UA` you can create your own custom variables. It is also possible to enable or disable the interface completely.

For protocol specific settings, please read the corresponding section.

### Mapping a data point to the Application Interfaces

You can only map data points to `MTConnect` and `OPC UA`. Once you have the desired data point in the list of the Application Interface of your choice, it is mapped using the [`Mapping`](Mapping.md) page. Here is how to map it to the necessary source:

- Have your data source or the desired Virtual Data Point readily configured.
- Go to the [`Mapping`](Mapping.md) page and create a new Mapping.
- Choose your source data point.
- Under the `Target` column, the data points in Application Interface will be visible. Choose the one you want to map.
- Once you save and apply the changes, the mapping will be complete and you can see in your `Application Interface` page that this data point has a green check mark in front of its name as shown in the example photo below. The value will then be visible to the relevant Application.

![Mapped data point](/img/applicationinterface/mapped_application_interface_datapoint.png)

### Add a new data point

You can only add data points to `MTConnect` and `OPC UA`. Follow these steps to add a new data point:

1. Click the blue button with the white plus icon
2. Select the desired data source point from the popped up overlay and click the arrow button
3. The overlay disappears and there is a new editable entry in the list.
4. Enter the name you want for this data point. The current text is only a placeholder.
5. (optional) Change the type of the data point as desired
6. (optional) Enter a initial value for your data point
7. (optional) Add some mapping for the received values. This mapping is similar to `Enumeration` in Virtual Data Points, and it maps final value to another text/number that you enter. See example photo below.
8. Click the green check button to save or click the red cross to discard your entry.
9. Click the `Apply Changes` button to send your new data point the the device.

Note: The green check icon next to the data point (example seen in photo below) is visible only after a [mapping (see above)](ApplicationInterface.md#mapping-a-data-point-to-the-application-interfaces) has been made for this data point.
![Added data points](/img/applicationinterface/applicationinterface_added_datapoint.png)

### Delete a new data point

You can only delete data points to `MTConnect` and `OPC UA`. Follow these steps to delete a data point:

1. Click on right side of the entry you want to delete in `Actions` section the garbage icon
2. Select Yes in the popped up overlay with the question: "Are you sure you want to delete data point?"
3. Click the `Apply Changes` button to send the change to the backend

### Edit a data point

You can only edit data points to `MTConnect` and `OPC UA`. Follow these steps to edit a data point:

1. Click on right side of the entry you want to delete in `Actions` section the pencil icon
2. The list entry is now editable like a new generated data point (see: Add a new data point: Step 4 and further ).
3. After last changes click the green check button to save or click the red cross to discard your entry.
4. Click the `Apply Changes` button to send your new data point the the device.
