# Configure data sources

The data source configuration consists of 4 components

- dataSources: A list of southbound data sources (currently supported: s7)
- dataSinks: A list of northbound data "sinks" (currently supported: MTConnect)
- virtualDataPoints: A list of virtual data points to link multiple source data points together
- mapping: A list of connections for data points of the data source and data sink

There are two example configuration inside: ../../\_mdclight/config/

## Data sources

A single data source supports the following configuration items:

- Note: There should be only one data source configured

```json
{
  // Id of data source. MUST be unique
  "id": "dataSource",
  // A descriptive name
  "name": "My data source",
  // A list of data points
  "dataPoints": [
    {
      // Id of data point. MUST be unique (across all data sources)
      "id": "estop",
      // A descriptive name
      "name": "Emergency Stop",
      // Data point address
      // Some examples for protocol "s7"
      // Reading an input: "I0.0"
      // Reading an input: "Q0.0"
      // Reading a boolean value: "DB93,X0.0"
      // Reading an integer value: "DB93,INT44"
      // Reading a real value: "DB93,REAL100"
      // Reading a string value with an length of 10: "DB100,S0.10"
      // Reading a string value with an length of 255: "DB100,S0.255"
      // Some examples for protocol "ioshield"
      // Reading inputs: "DI0" - "DI9"
      "address": "DB93,X0.0",
      // Read frequency in ms
      "readFrequency": 1200
    }
  ],
  // Data source protocol. Supported protocols are: "s7", "ioshield"
  "protocol": "s7",
  // The data sources connection info. Only required for protocol "s7"
  "connection": {
    // Ip Address
    "ipAddr": "192.168.0.114",
    // Port. Default for protocol "s7": 102
    "port": 102,
    // Rack.
    // For S7 300, S7 1200 and S7 1500: Always 0
    // For S7 400: The rack, where the S7 is mounted
    "rack": 0,
    // Slot.
    // For S7 300: Always 2
    // For S7 1200 and S7 1500: Always 1
    // For S7 400: The slot, where the S7 is mounted on the rack
    "slot": 2
  }
}
```

### S7 Addresses for MTConnect Values

EXECUTION

- ACTIVE - DB21,X35.5 (BOOL) - E_ChanActive // Channel active
- OPERIONAL_STOP - DB21,X35.6 (BOOL) E_ChanInterrupt // Channel interrupted
- PROGRAM_COMPLETED - DB21,X35.7 (BOOL) E_ChanReset // Channel reset
- READY - DB21,X36.5 (BOOL) - E_ChanRO // Channel ready for operation

CONTROLLER_MODE

- AUTOMATIC - DB11,X6.0 (BOOL) - „BAG”.E_AUTO
- MANUAL_DATA_INPUT DB11,X6.1 - „BAG”.E_MDA
- MANUAL - DB11,DBX6.2 - „BAG”.E_JOG

TOOL_NUMBER - NC-Var & Nathstellensignale: 2.14.2 - %DB1072.DBW28 (INT)

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
      // For protocol mtconnect, that id will be associated with the id of an data item
      "id": "estop",
      // A descriptive name
      "name": "Emergency Stop",
      // The type of the mtcoonect data item. Currently supported: "event".
      // Required for protocol "mtconnect".
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
  // Data source protocol. Supported protocols are: "mtconnect"
  "protocol": "mtconnect"
}
```

## Virtual data points

With virtual data points you can create additional data points for further use.
There are 4 types of operants:

- and
- or
- not
- counter

Virtual data points must consist out of one or more sources (id's of data points from real data sources or id's of other virtual data points), an unique id (across all data sources) and the type (see above).

Important: If a virtual data point is defined as source of another virtual data point, the source virtual data point must be defined before it is used!

All operations are converting non boolean source values into booleans.
If the source value is from type number: x = number > 0 (0 => false, 1, 2, 3, ...n => true)
If the source value is from type string: x = string.length > 0 ("" => false, "a..." => true)

```json
// Implementation of a "AND Operation". If all sources are "true", the result is also true.
{
  "id": "andResult",
  // Virtual data points from type "or" must contain more then 1 source
  "sources": ["inputAnd1", "inputAnd2"],
  "type": "and",
},
// Implementation of a "OR Operation". If one source is "true", the result is also true.
{
  "id": "orResult",
  // Virtual data points from type "or" must contain more then 1 source
  "sources": ["inputOr1", "inputOr2"],
  "type": "or",
},
// Implementation of a "NOT Operation". If the source is "true", the result is false.
{
  "id": "notResult",
  // Virtual data points from type "not" must contain exactly one source
  "sources": ["inputNot1"],
  "type": "not",
},
// Implementation of an counter. The counter counts up, on every rising flag of the source
// Counters are persistent across reboots. If you need to reset counters, you must delete the file where there are stored.
// The file located inside the configuration folder
{
  "id": "counterResult",
  // Virtual data points from type "counter" must contain exactly one source
  "sources": ["inputCounter1"],
  "type": "counter",
},
// Examples of nested virtual data points. Sources must be defined first!
{
  "id": "nestedAndResult1",
  "sources": ["andResult", "orResult"],
  "type": "and",
},
{
  "id": "nestedOrResult2",
  "sources": ["nested1AndResult", "notResult"],
  "d": "or",
}
```

## Mapping

A single mapping supports the following configuration items:

```json
{
  // Id of source data point
  "source": "cModeAuto",
  // Id of target data point
  "target": "mode1",
  // The value, a boolean uses for it's target value
  "mapValue": "0"
}
```
