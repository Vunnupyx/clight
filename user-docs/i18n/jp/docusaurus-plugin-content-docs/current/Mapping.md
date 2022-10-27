---
title: Mapping
---

# Mapping

## Introduction

Mapping describe the relation between source data points (`NC`/`DI`/`AI`/`VDP`) and the destination data points (`MTConnect`/`OPC UA`). It is necessary to forward the source data value to the destination data points for different [`Application Interfaces`](ApplicationInterface.md).

**Note:** The target data points in [`Application Interfaces`](ApplicationInterface.md) must be defined before you can create a mapping, because you need to choose that target data point while creating the VDP.

### Add a mapping

![Mapping adding new data mapping](/img/mapping/adding.png)

1. Click the blue button with the white plus icon ![Mapping add new button](/img/mapping/mapping_addbutton.png)
2. The new row is added to the end of the table.
3. Select the desired source point from the dropdown menu on the Source column.
4. Select the desired target data point (for the desired [`Application Interface`](ApplicationInterface.md)) on Target column.
5. Click the green check button to save or click the red cross to discard your entry.
6. Click the `Apply Changes` button to send your new data point to the device.

### Delete a mapping

1. For the mapping you want to delete, click on the garbage icon on the right side in `Actions` column
2. Select Yes in the dialog with the question: "Are you sure you want to delete data point?"
3. Click the `Apply Changes` button to send the change to the backend

### Edit a mapping

1. Click on right side of the entry you want to delete in `Actions` section the pencil icon
2. The list entry is now editable like a new generated data point (see [`Add a mapping`](Mapping.md#add-a-mapping) section above, start from Step 3 and continue further).
3. After your changes, click the green check button to save or click the red cross to discard your entry
4. Click the `Apply Changes` button to send your new data point to the device.
