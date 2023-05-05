---
title: Virtual Data Points
---

import Player from 'react-player/file';
import video from '../static/video/vdp_calculation.mp4';

# Virtual Data Points (VDPs)

## Introduction

Virtual Data Point (VDP) is a feature to create a calculated data point from one or more real data points or previously defined virtual data point. There are many operations available for calculating the final value.

**Important:** If a VDP is defined as source of another VDP, the source VDP must be defined before it is used and it should appear above in the list of VDPs! Otherwise you see them as grayed out in the dropdown menu in `Sources`.

#### Automatic Conversion of Non-Boolean values to Boolean values

If your source is not a boolean value and you use logical, comparison or Enumeration operation, the source is converted to boolean while evaluating for the VDP:

- If the source value is a number: Any value above 0 is interpreted as `true` and 0 is interpreted as `false`
- If the source value is not number but a text: Any text length above 0 characters is interpreted as `true` whereas empty text ("") becomes `false`

### Available Operators

Note: If you need a combination of operations please read the `Combine Operations` section.

#### Overview of Operators:

| Name              | Type         | Number of Sources | Result      |
| ----------------- | ------------ | ----------------- | ----------- |
| AND               | Logical      | Multiple          | Boolean     |
| OR                | Logical      | Multiple          | Boolean     |
| NOT               | Logical      | Single            | Boolean     |
| Counter           | Counter      | Single            | Number      |
| Thresholds        | Threshold    | Single            | Text/Number |
| Greater           | Comparison   | Single            | Boolean     |
| Greater or Equal  | Comparison   | Single            | Boolean     |
| Smaller           | Comparison   | Single            | Boolean     |
| Smaller or Equal  | Comparison   | Single            | Boolean     |
| Equal             | Comparison   | Single            | Boolean     |
| Unequal           | Comparison   | Single            | Boolean     |
| Enumeration       | Enumeration  | Multiple          | Text/Number |
| Calculation       | Mathematical | Multiple          | Number      |
| Set Energy Tariff | Enumeration  | Multiple          | Text        |

#### Operators:

##### AND

Type: Logical | Number of Sources: Multiple | Result: Boolean

Returns true if all selected source data point values are true

##### OR

Type: Logical | Number of Sources: Multiple | Result: Boolean

Returns true if at least one selected source data point value is true

##### NOT

Type: Logical | Number of Sources: Single | Result: Boolean

Returns false if the source data point value is true and vice versa

##### COUNTER

Type: Counter | Number of Sources: Single | Result: Number

Counts every state change of a data point (rising flag of the source, i.e. from 0 to 1 or increase of value) and shows total count of changes as a number.

Counters are persistent across reboots. Counters can be reset in two ways:

- **Manual Reset:** You can reset a counter manually through the UI with the reset button

![Counter Manual Reset Button](/img/vdp/counter_manual_reset.png)

- **Scheduled Reset:** You can reset a counter by setting up a scheduled reset time. You may enter multiple schedules and while adding you can choose the month, day or time as specific or as `Every`. The counter count will be reset to 0 when the set scheduled times are reached.

**Note:** Once you set a new scheduled counter, it may take up to 5 minutes for it to take effect. After that, it will reset the counter according to the schedule.

![Counter Schedule Reset Button](/img/vdp/counter_schedule_reset.png)

Example of scheduled reset:
![Counter Schedule Example](/img/vdp/counter_scheduled_reset_example.png)

##### THRESHOLDS

Type: Threshold | Number of Sources: Single | Result: Text/Number

Returns defined value if threshold is exceeded, multiple thresholds are possible for one data point.

To set the desired thresholds, choose Set Threshold button on the right to open the dialog window:
![Setting thresholds](/img/vdp/set_threshold.png)
Enter desired thresholds and corresponding `Value` which will be the value of the VDP if given threshold is exceeded. Thresholds are sorted in ascending order to check which threshold is passed by the source value and its corresponding `Value` will be the result of the VDP.

**Example**: In the example below, the virtual data point called `Tank Status` is connected to `[AI] Tank Level` data source which has currently value 13.54 (thick black line on the graph). There are 3 thresholds given: 5-LOW, 10-NORMAL, 20-HIGH. As the current value is 13.54, the last threshold passed is 3-NORMAL, and therefore the VDP value will be `NORMAL`.
![Adding threshold](/img/vdp/add_threshold.png)

##### GREATER

Type: Comparison | Number of Sources: Single | Result: Boolean

Returns true if the data point value is greater than the comparative value.

To provide the compared value, use the `Set Comparative Value` button on the `Action`column of the row.

##### GREATER EQUAL

Type: Comparison | Number of Sources: Single | Result: Boolean

Returns true if the data point value is greater than or equal to the comparative value.

To provide the compared value, use the `Set Comparative Value` button on the `Action`column of the row.

##### SMALLER

Type: Comparison | Number of Sources: Single | Result: Boolean

Returns true if the data point value is smaller than the comparative value.

To provide the compared value, use the `Set Comparative Value` button on the `Action`column of the row.

##### SMALLER EQUAL

Type: Comparison | Number of Sources: Single | Result: Boolean

Returns true if the data point value is less than or equal to the comparative value.

To provide the compared value, use the `Set Comparative Value` button on the `Action`column of the row.

##### EQUAL

Type: Comparison | Number of Sources: Single | Result: Boolean

Returns true if the data point value is equal to the comparative value.

To provide the compared value, use the `Set Comparative Value` button on the `Action`column of the row.

##### UNEQUAL

Type: Comparison | Number of Sources: Single | Result: Boolean

Returns true if the data point value is _not_ equal to the comparative value.

To provide the compared value, use the `Set Comparative Value` button on the `Action`column of the row.

##### ENUMERATION

Type: Enumeration | Number of Sources: Multiple | Result: Text/Number

Returns a text that is matching to the value of the source. These are provided via the `Set Enumeration` button on `Action` column as seen below.
![Set enum button](/img/vdp/vdp_set_enum_button.png)

In Set Enumeration view, you can give a default value, which will be showed if none of the defined conditions are met.

![Add enum modal](/img/vdp/set_enum_default.png)

By clicking blue plus sign, you can add new conditions. For each such conditions, you need to choose a variable to be observed and the text to be shown if the source value becomes `true` by typing it under "Value if left side is true" column. If the chosen observed variable is not a boolean value, then it will be converted to boolean, as explained in [`Automatic Conversion of Non-Boolean values to Boolean values`](VirtualDataPoints.md#automatic-conversion-of-non-boolean-values-to-boolean-values).
![Adding enumerations](/img/vdp/set_enum_row.png)

Note: You may also change the order of enumeration by dragging and dropping the enumerations. This affects which value is true first, and therefore which enumeration would be the result of the VDP.

**Example:** An example with certain values can be seen in the following photo. If Digital Input representing Yellow Light is `true`, then the enumeration result will be `WARNING`. If Digital Input representing Green Light is `true`, then the enumeration result will be `GOOD`. In other cases the default result will be `NO INFO`.
![Example of adding enumerations](/img/vdp/set_enum_example.png)

##### CALCULATION

Type: Mathematical | Number of Sources: Multiple | Result: Number

Custom mathematical expression using variable names and manually typing the mathematical equations. It is useful when several data points need to be combined and in more complex mathematical operations.

**Important**: If you choose a boolean source, then its value is interpreted as 1 if true and 0 if false.

**Example Video:**
<Player controls url={video}/>

##### SET ENERGY TARIFF

Type: Enumeration | Number of Sources: Multiple | Result: Text

This type allows mapping data sources or other VDPs to a specific machine status, which is then used for automatic updating of Energy Tariff counter.

Note: The return values are fixed and cannot be changed, only the order of the machine status can be updated.

### How to Add a Virtual Data Point

![Adding new virtual data points](/img/vdp/add_vdp.png)

1. Click the blue button with the white plus icon. A new line is added to the list of VDPs.
2. Enter a name for your new generated VDP
3. Select an operator
4. Select one or multiple sources. To see which operator allows single or multiple sources, please see the table above.
   ![Choosing sources](/img/vdp/choose_source.png)
5. For operator specific details and settings see relevant operator's description above. For some operators you must provide extra information after you save.
6. Click the green check button on the right in `Actions` column to save and stop editing or click the red cross to discard your entry.
7. Click the `Apply Changes` button on top right of the page to send your new data point the the device.

### Combined Operations

There are two ways to create combined operations depending on the type of result you want:

- Using `Calculation`: If you want a numerical result with mathematical operation, you can use `Calculation` to combine multiple data sources. Please refer the explanation above.

- Creating new VDPs and combining these: If you want a boolean result from multiple sources you can combine them step by step through several VDPs. For example, to create result of _DataPoint1 & DataPoint2 & !DataPoint3_ => follow the following 4 steps:

1. Create a first VDP1 with DP1 and DP2, AND operation
2. Create a second VDP2 with DP3, NOT operation
3. Create a third final VDP3 with VDP1, VDP2, AND operation
4. The result will be equal to the VDP3 value

### How to Delete a Virtual Data Point

1. For the VDP you want to delete, click the garbage icon on right side under `Actions` column
2. Select Yes in the overlay dialog with the question: "Are you sure you want to delete data point?"
3. Click the `Apply Changes` button to send the change to the backend
