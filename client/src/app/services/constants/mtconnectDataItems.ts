import { PreDefinedDataPoint } from 'app/models';

export default [
  {
    name: 'Emergency Stop',
    address: 'estop',
    initialValue: 'ARMED',
    type: 'event',
    map: {
      '0': 'TRIGGERED',
      '1': 'ARMED'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    name: 'Availability',
    address: 'avail',
    initialValue: 'AVAILABLE',
    type: 'event',
    map: {
      '0': 'UNAVAILABLE',
      '1': 'AVAILABLE'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    address: 'system',
    type: 'condition',
    name: 'System'
  } as PreDefinedDataPoint,
  {
    address: 'spindlerotating5',
    type: 'event',
    name: 'Spindle Rotating 5'
  } as PreDefinedDataPoint,
  {
    address: 'spindlerotating6',
    type: 'event',
    name: 'Spindle Rotating 6'
  } as PreDefinedDataPoint,
  {
    address: 'spindlerotating7',
    type: 'event',
    name: 'Spindle Rotating 7'
  } as PreDefinedDataPoint,
  {
    address: 'spindleoverride5',
    type: 'event',
    name: 'Spindle Override 5'
  } as PreDefinedDataPoint,
  {
    address: 'spindleoverride6',
    type: 'event',
    name: 'Spindle Override 6'
  } as PreDefinedDataPoint,
  {
    address: 'spindleoverride7',
    type: 'event',
    name: 'Spindle Override 7'
  } as PreDefinedDataPoint,
  {
    address: 'light_state_red',
    type: 'event',
    name: 'Light State Red',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  } as PreDefinedDataPoint,
  {
    address: 'light_state_yellow',
    type: 'event',
    name: 'Light State Yellow',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  } as PreDefinedDataPoint,
  {
    address: 'light_state_green',
    type: 'event',
    name: 'Light State Green',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  } as PreDefinedDataPoint,
  {
    address: 'light_state_blue',
    type: 'event',
    name: 'Light State Blue',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  } as PreDefinedDataPoint,
  {
    address: 'controlVersion',
    type: 'event',
    name: 'Control Version'
  } as PreDefinedDataPoint,
  {
    address: 'mtconnect_adapter_version',
    type: 'event',
    name: 'MTConnect Adapter Version'
  } as PreDefinedDataPoint,
  {
    address: 'numberOfActiveAlarms',
    type: 'event',
    name: 'Number of active Alarms'
  } as PreDefinedDataPoint,
  {
    address: 'operationTime',
    type: 'sample',
    name: 'Operation Time'
  } as PreDefinedDataPoint,
  {
    address: 'powerOnTime',
    type: 'sample',
    name: 'Power On Time'
  } as PreDefinedDataPoint,
  {
    address: 'cuttingTime',
    type: 'sample',
    name: 'Cutting Time'
  } as PreDefinedDataPoint,
  {
    address: 'currentRunTime',
    type: 'sample',
    name: 'Current Run Time'
  } as PreDefinedDataPoint,
  {
    address: 'machineSN',
    type: 'event',
    name: 'Machine Serial Number'
  } as PreDefinedDataPoint,
  {
    address: 'vendorServerInfo',
    type: 'event',
    name: 'Vendor Server Info'
  } as PreDefinedDataPoint,
  {
    address: 'part_count1',
    type: 'event',
    name: 'Part Count 1'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_desired1',
    type: 'event',
    name: 'Desired Part Count 1'
  } as PreDefinedDataPoint,
  {
    name: 'Controller Mode 1',
    address: 'mode1',
    type: 'event',
    initialValue: 'AUTOMATIC',
    map: {
      '0': 'MANUAL',
      '1': 'MANUAL_DATA_INPUT',
      '2': 'AUTOMATIC'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    name: 'Execution 1',
    address: 'execution1',
    type: 'event',
    initialValue: 'ACTIVE',
    map: {
      '1': 'INTERRUPTED',
      '2': 'STOPPED',
      '3': 'IN_PROGRESS',
      '4': 'WAITING',
      '5': 'ABORTED'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    address: 'program1',
    type: 'event',
    name: 'Program 1'
  } as PreDefinedDataPoint,
  {
    address: 'toolnumber1',
    type: 'event',
    name: 'Tool Number 1'
  } as PreDefinedDataPoint,
  {
    address: 'jogoverride1',
    type: 'event',
    name: 'Jog Override 1'
  } as PreDefinedDataPoint,
  {
    address: 'rapidoverride1',
    type: 'event',
    name: 'Rapid Override 1'
  } as PreDefinedDataPoint,
  {
    address: 'logic1',
    type: 'condition',
    name: 'Logic Program 1'
  } as PreDefinedDataPoint,
  {
    address: 'motion1',
    type: 'condition',
    name: 'Motion Program 1'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_overall1',
    type: 'event',
    name: 'Overall Part Count 1'
  } as PreDefinedDataPoint,
  {
    address: 'part_count2',
    type: 'event',
    name: 'Part Count 2'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_desired2',
    type: 'event',
    name: 'Desired Part Count 2'
  } as PreDefinedDataPoint,
  {
    name: 'Controller Mode 2',
    address: 'mode2',
    type: 'event',
    initialValue: 'AUTOMATIC',
    map: {
      '0': 'MANUAL',
      '1': 'MANUAL_DATA_INPUT',
      '2': 'AUTOMATIC'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    name: 'Execution 2',
    address: 'execution2',
    type: 'event',
    initialValue: 'ACTIVE',
    map: {
      '1': 'INTERRUPTED',
      '2': 'STOPPED',
      '3': 'IN_PROGRESS',
      '4': 'WAITING',
      '5': 'ABORTED'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    address: 'program2',
    type: 'event',
    name: 'Program 2'
  } as PreDefinedDataPoint,
  {
    address: 'toolnumber2',
    type: 'event',
    name: 'Tool Number 2'
  } as PreDefinedDataPoint,
  {
    address: 'operationmode2',
    type: 'event',
    name: 'Operation Mode 2'
  } as PreDefinedDataPoint,
  {
    address: 'jogoverride2',
    type: 'event',
    name: 'Jog Override 2'
  } as PreDefinedDataPoint,
  {
    address: 'rapidoverride2',
    type: 'event',
    name: 'Rapid Override 2'
  } as PreDefinedDataPoint,
  {
    address: 'logic2',
    type: 'condition',
    name: 'Logic Program 2'
  } as PreDefinedDataPoint,
  {
    address: 'motion2',
    type: 'condition',
    name: 'Motion Program 2'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_overall2',
    type: 'event',
    name: 'Overall Part Count 2'
  } as PreDefinedDataPoint,
  {
    address: 'part_count3',
    type: 'event',
    name: 'Part Count 3'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_desired3',
    type: 'event',
    name: 'Desired Part Count 3'
  } as PreDefinedDataPoint,
  {
    name: 'Controller Mode 3',
    address: 'mode3',
    type: 'event',
    initialValue: 'AUTOMATIC',
    map: {
      '0': 'MANUAL',
      '1': 'MANUAL_DATA_INPUT',
      '2': 'AUTOMATIC'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    name: 'Execution 3',
    address: 'execution3',
    type: 'event',
    initialValue: 'ACTIVE',
    map: {
      '1': 'INTERRUPTED',
      '2': 'STOPPED',
      '3': 'IN_PROGRESS',
      '4': 'WAITING',
      '5': 'ABORTED'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    address: 'program3',
    type: 'event',
    name: 'Program 3'
  } as PreDefinedDataPoint,
  {
    address: 'toolnumber3',
    type: 'event',
    name: 'Tool Number 3'
  } as PreDefinedDataPoint,
  {
    address: 'operationmode3',
    type: 'event',
    name: 'Operation Mode 3'
  } as PreDefinedDataPoint,
  {
    address: 'jogoverride3',
    type: 'event',
    name: 'Jog Override 3'
  } as PreDefinedDataPoint,
  {
    address: 'rapidoverride3',
    type: 'event',
    name: 'Rapid Override 3'
  } as PreDefinedDataPoint,
  {
    address: 'logic3',
    type: 'condition',
    name: 'Logic Program 3'
  } as PreDefinedDataPoint,
  {
    address: 'motion3',
    type: 'condition',
    name: 'Motion Program 3'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_overall3',
    type: 'event',
    name: 'Overall Part Count 3'
  } as PreDefinedDataPoint,
  {
    address: 'part_count4',
    type: 'event',
    name: 'Part Count 4'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_desired4',
    type: 'event',
    name: 'Desired Part Count 4'
  } as PreDefinedDataPoint,
  {
    name: 'Controller Mode 4',
    address: 'mode4',
    type: 'event',
    initialValue: 'AUTOMATIC',
    map: {
      '0': 'MANUAL',
      '1': 'MANUAL_DATA_INPUT',
      '2': 'AUTOMATIC'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    name: 'Execution 4',
    address: 'execution4',
    type: 'event',
    initialValue: 'ACTIVE',
    map: {
      '1': 'INTERRUPTED',
      '2': 'STOPPED',
      '3': 'IN_PROGRESS',
      '4': 'WAITING',
      '5': 'ABORTED'
    },
    mandatory: true
  } as PreDefinedDataPoint,
  {
    address: 'program4',
    type: 'event',
    name: 'Program 4'
  } as PreDefinedDataPoint,
  {
    address: 'toolnumber4',
    type: 'event',
    name: 'Tool Number 4'
  } as PreDefinedDataPoint,
  {
    address: 'operationmode4',
    type: 'event',
    name: 'Operation Mode 4'
  } as PreDefinedDataPoint,
  {
    address: 'jogoverride4',
    type: 'event',
    name: 'Jog Override 4'
  } as PreDefinedDataPoint,
  {
    address: 'rapidoverride4',
    type: 'event',
    name: 'Rapid Override 4'
  } as PreDefinedDataPoint,
  {
    address: 'logic4',
    type: 'condition',
    name: 'Logic Program 4'
  } as PreDefinedDataPoint,
  {
    address: 'motion4',
    type: 'condition',
    name: 'Motion Program 4'
  } as PreDefinedDataPoint,
  {
    address: 'part_count_overall4',
    type: 'event',
    name: 'Overall Part Count 4'
  } as PreDefinedDataPoint,
  {
    name: 'VoltAmpere (S)',
    address: 'VoltAmpere',
    type: 'sample'
    //TBD mandatory: true,
  } as PreDefinedDataPoint,
  {
    name: 'VoltAmpereReactive (Q)',
    address: 'VoltAmpereReactive',
    type: 'sample'
    //TBD mandatory: true,
  } as PreDefinedDataPoint,
  {
    name: 'Wattage (P)',
    address: 'Wattage',
    type: 'sample'
    //TBD mandatory: true,
  } as PreDefinedDataPoint,
  {
    name: 'ElectricalEnergy (Ea+)',
    address: 'ElectricalEnergy',
    type: 'sample'
    //TBD mandatory: true,
  } as PreDefinedDataPoint,
  {
    name: 'PowerFactor (PF)',
    address: 'PowerFactor',
    type: 'sample'
    //TBD mandatory: true,
  } as PreDefinedDataPoint
];
