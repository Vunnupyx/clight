# Configure data sources

The data source config consists of 3 components

- dataSources: A list of southbound data sources (currently supported: s7)
- dataSinks: A list of northbound data "sinks" (currently supported: MTConnect)
- mapping: A list of connections for data points of the data source and data sink

An example can be found here: ../../\_mdclight/config/config.json

## Data sources

A single data source supports the following configuration items:

- Note: There should be only one data source configured

```json
{
  // Id of data source. MUST be unique
  "id": "s7_1500",
  // A descriptive name
  "name": "My s7",
  // A list of data points
  "dataPoints": [
    {
      // Id of data point. MUST be unique (across all data sources)
      "id": "estop",
      // A descriptive name
      "name": "Emergency Stop",
      // Data point address
      // Some examples for protocol "s7"
      // Reading a boolean value: "DB93,X0.0"
      // Reading an integer value: "DB93,INT44"
      // Reading a real value: "DB93,REAL100"
      // Reading a string value with an length of 10: "DB100,S0.10"
      // Reading a string value with an length of 255: "DB100,S0.255"
      "address": "DB93,X0.0",
      // Read frequency in ms
      "readFrequency": 1200
    }
  ],
  // Data source protocol. Supported protocals are: "s7", "ioshield"
  "protocol": "s7",
  // The data sources connection info
  "connection": {
    // Ip Address
    "ipAddr": "192.168.0.114",
    // Port. Default for protocal "s7": 102
    "port": 102,
    // Rack. Only required for protocal "s7"
    // For S7 300, S7 1200 and S7 1500: Always 0
    // For S7 400: The rack, where the S7 is mounted
    "rack": 0,
    // Slot. Only required for protocal "s7"
    // For S7 300: Always 2
    // For S7 1200 and S7 1500: Always 1
    // For S7 400: The slot, where the S7 is mounted on the rack
    "slot": 2
  }
}
```

## Data sinks

A single data sink supports the following configuration items:

- Note: There should be only one data sink configured

```json
{
  // Id of data source. MUST be unique
  "id": "mtconnect",
  // A descriptive name
  "name": "My MTConnect data sink",
  // A list of data points
  "dataPoints": [
    {
      // Id of datapoint. MUST be unique (across all data sources)
      // For protocal mtconnect, that id will be associated with the id of an data item
      "id": "estop",
      // A descriptive name
      "name": "Emergency Stop",
      // The type of the mtcoonect data item. Currently supported: "event".
      // Required for protocal "mtconnect".
      "type": "event",
      // A mapping for mtconnect data element.
      // Boolean values can be mapped to string values. For example, the emergency stop could be mapped to the corresponding mtconnect value "TIGGERED" or "ARMED".
      // If more than two string values are needed, either integer values can be used or the values can be set by separate boolean values by setting "mapValues" must be set in the mapping. If more than one boolean value is "true", then the lowest active value is used.
      // Optional for the protocol "mtconnect".
      "map": {
        // Booleans
        "true": "TIGGERED",
        "false": "ARMED",
        // Integer or "mapValues"
        "0": "AUTOMATIC",
        "1": "MANUAL_DATA_INPUT",
        "2": "SEMI_AUTOMATIC"
      }
    }
  ],
  // Data source protocol. Supported protocals are: "mtconnect"
  "protocol": "mtconnect"
}
```

# Mapping

A single mapping supports the following configuration items:

```json
{
  // Id of source data point
  "source": "cModeAuto",
  // Id of target data point
  "target": "mode1",
  // The alue, a boolean uses for it's target value
  "mapValue": "0"
}
```
