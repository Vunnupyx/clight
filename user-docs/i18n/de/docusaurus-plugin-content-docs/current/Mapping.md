---
title: Mapping
---

# Mapping

## Introduction

Mapping describe the relation between source data points (NC/VDP/DI) and the destination data points (`MTConnect`/`OPC UA`). It is necessary to forward the source data value to the destination data points for different `Application Interfaces`.

### Add a mapping

![Mapping adding new data mapping](/img/mapping/adding.png)

1. Click the blue button with the white plus icon ![Mapping add new button](/img/mapping/mapping_addbutton.png)
2. The new item is added to the end of the table.
3. Select the desired source point from the dropdown menu on the Source column.
4. Select the desired target point for the desired `Application Interface` on Target column.
5. Click the green check button to leave the edit state or click the red cross to discard your entry.
6. Click the `Apply Changes` button to send your new data point the the device.

### Delete a mapping

1. Click on right side of the entry you want to delete in `Actions` section the garbage icon
2. Select Yes in the popped up overlay with the question: "Are you sure you want to delete data point [datapoint name]?"
3. Click the `Apply Changes` button to send the change to the backend

### Edit a mapping

1. Click on right side of the entry you want to delete in `Actions` section the pencil icon
2. The list entry is now editable like a new generated data point (see above documentation `Add a new data point`: Step 3 and further ).
3. After last changes click the green check button to leave the edit state or click the red cross to discard your entry.
4. Click the `Apply Changes` button to send your new data point the the device.
