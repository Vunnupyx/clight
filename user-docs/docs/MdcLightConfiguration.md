---
title: Configuration File
---

# Configuration File

The configuration file is a JSON file that stores various information and settings about the runtime. It has the following structure:

```json
{
  "general": {
    // Information about the device
  },
  "networkConfig": {
    // Configuration of network interfaces, proxy and time
  },
  "dataSources": {
    // A list of southbound data sources (currently supported: Siemens S7, ioshield)
  },
  "dataSinks": {
    // A list of application interfaces (currently supported: MTConnect, OPC UA, CELOS Exchange)
  },
  "virtualDataPoints": {
    //A list of virtual data points to link multiple source data points together
  },
  "mapping": {
    // A list of connections for data points of the data source and application interface
  },
  "quickStart": {
    // Status of quick start procedure
  },
  "env": {
    // Tags of the software versions to be used
  }
}
```

There are two example configuration inside the folder: `_mdclight/config/`

## Data sources

There are two types of data sources: The S7-Com PLC data source "s7" and the digital input shield "ioshield".

- S7: With the S7 data source you can read data from S7 PLCs. Reading DBs, Inputs, Outputs and memory data ("Merkers") is supported.
- IO-Shield: With the IO-Shield you can read data from digital inputs, wired directly to the IoT2050. Each digital input of the IO-Shield is one data point on the data source. Each data point can have three different states: 0 - off (Low, 0V), 1 - on (High, 24V) or 2 - blinking, the
  output is changing state with a minimum frequency of 2Hz (the maximum frequency is 10Hz).

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
      // Reading an input bit: "I0.0"
      // Reading an input bit: "Q0.0"
      // Reading an memory bit: "M50.0"
      // Reading a boolean value: "DB93,X0.0"
      // Reading an integer value: "DB93,INT44"
      // Reading a real value: "DB93,REAL100"
      // Reading a string value with an length of 10: "DB100,S0.10"
      // Reading a string value with an length of 255: "DB100,S0.255"
      // Reading a DWORD: "DB25,DWORD4"
      // Reading a Byte: "DB340,BYTE60"
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
    // For S7 400: The rack, where the S7 CPU is mounted
    "rack": 0,
    // Slot.
    // For S7 300: Always 2
    // For S7 1200 and S7 1500: Always 1
    // For S7 400: The slot, where the S7 CPU is mounted on the rack
    "slot": 2
  }
}
```

#### Sinumerik 840D 4.5 PLC Interface - S7 Addresses for MTConnect Values

EXECUTION

- ACTIVE - DB21,X35.5 (BOOL) - E_ChanActive // Channel active
- OPERIONAL_STOP - DB21,X35.6 (BOOL) E_ChanInterrupt // Channel interrupted
- PROGRAM_COMPLETED - DB21,X35.7 (BOOL) E_ChanReset // Channel reset
- READY - DB21,X36.5 (BOOL) - E_ChanRO // Channel ready for operation

CONTROLLER_MODE

- AUTOMATIC - DB11,X6.0 (BOOL) - „BAG”.E_AUTO // Auto active
- MANUAL_DATA_INPUT DB11,X6.1 - „BAG”.E_MDA // MDA active
- MANUAL - DB11,DBX6.2 - „BAG”.E_JOG // Jog active

TOOL_NUMBER - %DB1072.DBW28 (INT) // Tool Ident

## Virtual data points

Virtual data points must consist out of one or more sources (id's of data points from real data sources or id's of other virtual data points), a unique id (across all data points) and the type of operation for calculating the value.

Important: If a virtual data point is defined as source of another virtual data point, the source virtual data point must be defined before it is used!

Currently supported VDP operation type values: `and`, `or`, `not`, `counter`,`thresholds`, `greater`, `greaterEqual`, `smaller`, `smallerEqual`, `equal`,`unequal`, `enumeration`, `calculation`

Format of a VDP in configuration file (this inclues all possible operation specific settings as well, which are only used if that operation is chosen):

```json
{
  // Unique ID of the VDP
  "id": "9d62359b-c48b-4084-825f-1ce56c93e202",
  // Name given for the VDP
  "name": "my calculation",
  // Unique IDs of the data sources. It must contain at least 1 source. For and/or operation there must be at least 2 sources. Data sources must include all data points used in the operation/formula/enumeration below.
  "sources": ["dd88cdb9-994c-40ce-be60-1d37f3aa755a", "fda5000e-0942-4605-a995-9c49bd1e99d6"],
  // Type can be one of the types mentioned above
  "operationType": "and",
  //Only for thresholds operation:
  "thresholds": {
        "0": 0,
        "1": 40
      },
  // Only for comparison operations:
  "comparativeValue": "100",
  // Only for calculation operation:
  "formula": "(dd88cdb9-994c-40ce-be60-1d37f3aa755a + fda5000e-0942-4605-a995-9c49bd1e99d6) / 100",
  // Only for enumeration operation:
  "enumeration": {
    // Optional default value if no others match
    "defaultValue": "TEST",
    // List of enumeration items
    "items": [
          {
            "source": "dd88cdb9-994c-40ce-be60-1d37f3aa755a",
            "priority": 0,
            "returnValueIfTrue": "1"
          },
          {
            "source": "fda5000e-0942-4605-a995-9c49bd1e99d6",
            "priority": 1,
            "returnValueIfTrue": "2"
          }
        ]
  }
},

```

## Mapping

A single mapping supports the following configuration items:

```json
{
  // Unique ID of source data point
  "source": "55455122-9e2b-4473-b6e9-8463089cd299",
  // Unique ID of target data point
  "target": "1a468843-e2e1-4835-a111-a6844589526d",
  // Unique id of the mapping
  "id": "03b9488e-364e-4fed-8713-33a8eb005d18"
}
```

## Application Interface

In the configuration file this settings is under `dataSinks` key.

A single application interface supports the following configuration items:

- Note: There should be only one application interface configured

```json
{
  // Id of data source. MUST be unique
  "id": "mtconnect",
  // A descriptive name
  "name": "My MTConnect application interface",
  // A list of data points
  "dataPoints": [
    {
      // Id of datapoint. MUST be unique (across all data sources)
      // For the protocol MTconnect, that id will be associated with the id of a MTConnect data item
      "id": "estop",
      // A descriptive name
      "name": "Emergency Stop",
      // The type of the mtcoonect data item. Currently supported: "event".
      // Required for protocol "mtconnect".
      "type": "event",
      // A mapping for mtconnect data element.
      // Boolean values can be mapped to string values. For example, the emergency stop could be mapped to the corresponding mtconnect value "TRIGGERED" or "ARMED".
      // If more than two string values are needed, either integer values can be used or the values can be set by separate boolean values by setting "mapValues" must be set in the mapping. If more than one boolean value is "true", then the lowest active value is used.
      // Optional for the protocol "mtconnect".
      "map": {
        // Booleans
        "true": "TRIGGERED",
        "false": "ARMED",
        // Integer or "mapValues"
        "0": "AUTOMATIC",
        "1": "MANUAL_DATA_INPUT",
        "2": "SEMI_AUTOMATIC"
        // IO-Shield full mapping
        "0": "ON",
        "1": "OFF",
        "2": "BLINKING"
      },
      // Optional - Initial value, can also be used to set a constant value. Is overwritten as soon as data is read
      "initialValue": "TRIGGERED"
    }
  ],
  // Data source protocol. Supported protocols are: "mtconnect"
  "protocol": "mtconnect"
}
```

## Frequently Asked Questions

1. _Can I use the same id for a data point of a data source and a data point of an application interface?_
   Yes, data point ids only have to be unique within all data sources and separately within all application interfaces.
   Virtual data points also count as data source data points.

For example, the following would be valid:

```json
{
  // Identical source and target
  "source": "10456f7b-6d0c-4488-8d19-71de07754305",
  "target": "10456f7b-6d0c-4488-8d19-71de07754305",
  // a unique id across all data points
  "id": "0c24235c-f56d-435b-a560-6874079effb4"
}
```

2. _Can I set a constant value in a application interface?_
   Yes, just configure an enumeration data point with an initial value and no real or virtual data point mapped to it.
   For example:

```json
{
  // Unique id across data points
  "id": "d8090a1a-9e7f-494b-a695-ff077f4df75a",
  "sources": [],
  "operationType": "enumeration",
  "name": "MyConstant",
  "enumeration": {
    // Your constant here
    "defaultValue": "46.149"
  }
}
```
