---
title: 'Data source: Input Board'
---

## Introduction

With this data source you can connect electrical signals to your IoTconnector flex device. The signals can either be digital (Sink or Source, 0V/24V) or analog inputs (0-10V or 0-20mA). This is especially useful if you want to connect older equipment without a digital control or a machine where access to the control is not possible.

On the top of the page you find the main settings for the data source: Enabling and selecting the type.

## Changing the type of the Input Board

You can use the Type dropdown menu on the top of the page to select which type of Input Board you are using.

![Input Board Types](/img/datasource/inputboard_types.png)

## Default Configuration

By default the Data Source is configured the following way:

- DI0 - Emergency Stop
- DI1 - Stack Light: Red
- DI2 - Stack Light: Yellow
- DI3 - Stack Light: Green
- DI4 - Stack Light: Blue
- AI0 - Current Sensor
- AI1 - Not used

## Analog Inputs

With analog inputs, you must select the correct configuration of 100A or 150A sensors so that the scaling is done correctly to the value.

#### Jumper Settings for Analog Inputs

On SIEMENS SIMATIC IOT2050, you need to set the jumper correctly to enable the analog inputs. Please check the user manual of SIEMENS SIMATIC IOT2050 for the details.

## Adding Data Points

![Input Board Add Data Point](/img/datasource/inputboard_add.png)

To add a data point, click on the blue `Add Data Point` button ![Add data point button](/img/datasource/addbutton.png).

Newly added data points are shown at the bottom of the table.You need to give a name and select the address of the data point (see photo below). Once you are done click green check icon to save your changes. After all changes please click `Apply Changes` on the top right of the page.

![Input Board New Data Point](/img/datasource/inputboard_newdatapoint.png)

## Blinking state of digital inputs

Digitals inputs have a special blinking state (value=2) when their input changes from 0 to 1 (rising flags) three times within 10 seconds. This status is seen as value = 2 (in comparison to 0=false and 1=true). This status is reset if rising flags happen less than 3 times within 10 seconds.
