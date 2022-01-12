---
title: Virtual Data Points
---

# Virtual Data Points (VDPs)
## Introduction

Virtual Data Point is a feature to create a calculated data point from one or more real data points. There are many linking operations available like:
- AND (Logical AND: returns true if all selected data points values are true)
- OR (Logical OR: returns true if at least one selected data point value is true)
- NOT (Logical NEGATION: returns false if the data point value is true and vice versa)
- Counter (Count every state change of a data point)
- Thresholds (return defined value if threshold is exceeded, multiple thresholds a possible for one data point)

If you need a combination of operations please read the `Combine Operations` section

### Combine Operations

If you have the case to combine some linking operations this can easily be done by creating a VDP for every operation section. To get a deeper knowledge about this, have a look at this example: *DP1 & DP2 & !DP3*

1. Create a first VDP1 with DP1 and DP2, AND operation
2. Create a second VDP2 with DP3, NOT operation
3. Create a third final VDP3 with VDP1, VDP2, AND operation

### Add a Virtual Data Point

1. Click the blue button with the white plus icon
2. Enter a name for your new generated VDP
3. Select a operation mode
4. Select one or multiple sources
5. Click the green check button to leave the edit state or click the red cross to discard your entry.
6. Click the `Apply Changes` button to send your new data point the the device.

### Add a Virtual Threshold Data Point

1. Click the blue button with the white plus icon
2. Enter a name for your new generated VDP
3. Select THRESHOLDS operation mode
4. Select one data source
5. Click the graph icon in the `Actions` sections
6. Click the blue button with the white plus icon in the popped up overlay and click the blue button with the plus icon
7. The new generated threshold list item muss be filled with a value which will be returned if the threshold is exceeded.
8. (optional) Add as many threshold items as you want
9. Click the set button to close the overlay
10. Click the green check button to leave the edit state or click the red cross to discard your entry.
11. Click the `Apply Changes` button to send your VDP
### Delete a Virtual Data Point
1. Click on right side of the entry you want to delete in `Actions` section the garbage icon
2. Select Yes in the popped up overlay with the question: "Are you sure you want to delete data point [datapoint name]?"
3. Click the `Apply Changes` button to send the change to the backend
