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

| Name              | Type            | Number of Sources | Result      |
| ----------------- | --------------- | ----------------- | ----------- |
| AND               | Logical         | Multiple          | Boolean     |
| OR                | Logical         | Multiple          | Boolean     |
| NOT               | Logical         | Single            | Boolean     |
| Counter           | Counter         | Single            | Number      |
| Thresholds        | Threshold       | Single            | Text/Number |
| Greater           | Comparison      | Single            | Boolean     |
| Greater or Equal  | Comparison      | Single            | Boolean     |
| Smaller           | Comparison      | Single            | Boolean     |
| Smaller or Equal  | Comparison      | Single            | Boolean     |
| Equal             | Comparison      | Single            | Boolean     |
| Unequal           | Comparison      | Single            | Boolean     |
| Enumeration       | Enumeration     | Multiple          | Text/Number |
| Calculation       | Mathematical    | Multiple          | Number      |
| Set Energy Tariff | Enumeration     | Multiple          | Text        |
| Blink Detection   | Blink Detection | Single            | Number      |

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

##### BLINK DETECTION

Type: Blink Detection | Number of Sources: Single | Result: Number (0, 1 or 2)

This VDP is used to define a blinking detection behavior for a single source value (from Data Source or another VDP). With the customizable settings, it allows setting the wished behavior for a blink detection.

###### Definition of terms:

`Timeframe`: A moving window of time. It is used to check rising edges within this time period to determine blinking status.
`Rising Edge`: Change of a source value from `false` to `true`.
`Falling Edge`: Change of a source value from `true` to `false`.

###### Adjustable Parameters:

With the following adjustable parameters you can customize the blink detection behavior. The given settings apply only to that VDP, so different VDPs can have different settings.

| Name                               | Allowed value range        | Description                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Timeframe                          | 1000-120000 (milliseconds) | Amount of time in milliseconds, in which defined count of rising edges must occur to detect blinking status of the source value                                                                                                                                                                                                                |
| Rising Edges                       | 1-10 (count)               | Count of rising edges that are required to determine a blinking status within the defined timeframe                                                                                                                                                                                                                                            |
| Linked Blink Detections (Optional) | -                          | Optionally you can link other signals as dependency. If the linked input starts blinking, it resets the blink detection of this signal, in order to synchronise the output of both signals. It's useful for some use cases that both signals change to blinking at the same time although the blink start appears at different points of time. |

###### Result of the VDP:

Result of the VDP shows the connected source's status. Possible results of this VDP are:

- 0 = OFF
- 1 = ON
- 2 = BLINKING

###### Blink Detection Logic and Examples:

- Signals are delayed at the output with timeframe length, even if there is no blinking detected. That is to make sure all values are evaluated within the timeframe to detect potential blinking behaviour.
  > Example: Assume timeframe is 10 seconds and rising edge count is 3. Any source value will be displayed at the output 10 seconds later. If within this 10 seconds 3 rising edges are detected then the output will be 2 (BLINKING), otherwise its value will be 1(ON) or 0(OFF) depending on the source value.
- When enough rising edges are available, the blinking is activated at the end of the timeframe and timeframe amount of time is counted from the first rising edge within that timeframe. So, even if blinking detected in the middle of the timeframe, the blink status is shown at the end of the timeframe. Then the result of VDP is 2 (blinking).
  > Example: Assume timeframe is 10 seconds and rising edge count is 3. When source has 3 rising edges in 6 seconds, the result of blinking is still shown when 10 seconds from first rising edge has passed. The value after that depends again on source values and count of detected rising edges.
- After blinking of the source ends, the first value is kept for a timeframe long.
  > Example: Assume timeframe is 10 seconds and source value turns to false when the blinking ends. Then the output will be shown as false for 10 seconds long, even if source value changes within 10 seconds.
- If there is a linked signal connected, that linked signal's rising edge resets the blinking behaviour of the main signal for a timeframe amount of time. The last value of the main signal before reset is shown as output during the timeframe. This is used to help synchronize blinking status of two or more connected signals.
  > Example: Assume timeframe is 10 seconds and rising edge count is 3 and VDP2 depends on VDP1. When VDP1 has a rising edge, VDP2 cannot have a blinking status for 10 seconds since the rising edge from VDP1. Also, during this time VDP2 output is shown as its last value before this reset for 10 seconds long.

The following example images show the usage and difference between independent and linked signals:

> Independent Signals:
> ![Blink detection with independent signals](/img/vdp/blinking_detection_with_independent_signals.png)

> Linked signals:
> ![Blink detection with linked signals](/img/vdp/blinking_detection_with_dependent_signals.png)

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
