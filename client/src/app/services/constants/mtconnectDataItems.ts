export default [
  {
    address: 'estop',
    type: 'event',
    initialValue: 'TRIGGERED',
    name: 'Emergency Stop',
    map: {
      true: 'ARMED',
      false: 'TRIGGERED'
    }
  },
  {
    address: 'avail',
    type: 'event',
    name: 'Available'
  },
  {
    address: 'system',
    type: 'condition',
    name: 'System'
  },
  {
    address: 'spindlerotating5',
    type: 'event',
    name: 'Spindle Rotating 5'
  },
  {
    address: 'spindlerotating6',
    type: 'event',
    name: 'Spindle Rotating 6'
  },
  {
    address: 'spindlerotating7',
    type: 'event',
    name: 'Spindle Rotating 7'
  },
  {
    address: 'spindleoverride5',
    type: 'event',
    name: 'Spindle Override 5'
  },
  {
    address: 'spindleoverride6',
    type: 'event',
    name: 'Spindle Override 6'
  },
  {
    address: 'spindleoverride7',
    type: 'event',
    name: 'Spindle Override 7'
  },
  {
    address: 'light_state_red',
    type: 'event',
    name: 'Light State Red',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  },
  {
    address: 'light_state_yellow',
    type: 'event',
    name: 'Light State Yellow',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  },
  {
    address: 'light_state_green',
    type: 'event',
    name: 'Light State Green',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  },
  {
    address: 'light_state_blue',
    type: 'event',
    name: 'Light State Blue',
    map: {
      true: 'ON',
      false: 'OFF'
    }
  },
  {
    address: 'controlVersion',
    type: 'event',
    name: 'Control Version'
  },
  {
    address: 'mtconnect_adapter_version',
    type: 'event',
    name: 'MTConnect Adapter Version'
  },
  {
    address: 'numberOfActiveAlarms',
    type: 'event',
    name: 'Number of active Alarms'
  },
  {
    address: 'operationTime',
    type: 'sample',
    name: 'Operation Time'
  },
  {
    address: 'powerOnTime',
    type: 'sample',
    name: 'Power On Time'
  },
  {
    address: 'cuttingTime',
    type: 'sample',
    name: 'Cutting Time'
  },
  {
    address: 'currentRunTime',
    type: 'sample',
    name: 'Current Run Time'
  },
  {
    address: 'machineSN',
    type: 'event',
    name: 'Machine Serial Number'
  },
  {
    address: 'vendorServerInfo',
    type: 'event',
    name: 'Vendor Server Info'
  },
  {
    address: 'part_count1',
    type: 'event',
    name: 'Part Count 1'
  },
  {
    address: 'part_count_desired1',
    type: 'event',
    name: 'Desired Part Count 1'
  },
  {
    address: 'mode1',
    type: 'event',
    name: 'Controller Mode 1'
  },
  {
    address: 'execution1',
    type: 'event',
    name: 'Execution 1'
  },
  {
    address: 'program1',
    type: 'event',
    name: 'Program 1'
  },
  {
    address: 'toolnumber1',
    type: 'event',
    name: 'Tool Number 1'
  },
  {
    address: 'jogoverride1',
    type: 'event',
    name: 'Jog Override 1'
  },
  {
    address: 'rapidoverride1',
    type: 'event',
    name: 'Rapid Override 1'
  },
  {
    address: 'logic1',
    type: 'condition',
    name: 'Logic Program 1'
  },
  {
    address: 'motion1',
    type: 'condition',
    name: 'Motion Program 1'
  },
  {
    address: 'part_count_overall1',
    type: 'event',
    name: 'Overall Part Count 1'
  },
  {
    address: 'part_count2',
    type: 'event',
    name: 'Part Count 2'
  },
  {
    address: 'part_count_desired2',
    type: 'event',
    name: 'Desired Part Count 2'
  },
  {
    address: 'mode2',
    type: 'event',
    name: 'Controller Mode 2'
  },
  {
    address: 'execution2',
    type: 'event',
    name: 'Execution 2'
  },
  {
    address: 'program2',
    type: 'event',
    name: 'Program 2'
  },
  {
    address: 'toolnumber2',
    type: 'event',
    name: 'Tool Number 2'
  },
  {
    address: 'operationmode2',
    type: 'event',
    name: 'Operation Mode 2'
  },
  {
    address: 'jogoverride2',
    type: 'event',
    name: 'Jog Override 2'
  },
  {
    address: 'rapidoverride2',
    type: 'event',
    name: 'Rapid Override 2'
  },
  {
    address: 'logic2',
    type: 'condition',
    name: 'Logic Program 2'
  },
  {
    address: 'motion2',
    type: 'condition',
    name: 'Motion Program 2'
  },
  {
    address: 'part_count_overall2',
    type: 'event',
    name: 'Overall Part Count 2'
  },
  {
    address: 'part_count3',
    type: 'event',
    name: 'Part Count 3'
  },
  {
    address: 'part_count_desired3',
    type: 'event',
    name: 'Desired Part Count 3'
  },
  {
    address: 'mode3',
    type: 'event',
    name: 'Controller Mode 3'
  },
  {
    address: 'execution3',
    type: 'event',
    name: 'Execution 3'
  },
  {
    address: 'program3',
    type: 'event',
    name: 'Program 3'
  },
  {
    address: 'toolnumber3',
    type: 'event',
    name: 'Tool Number 3'
  },
  {
    address: 'operationmode3',
    type: 'event',
    name: 'Operation Mode 3'
  },
  {
    address: 'jogoverride3',
    type: 'event',
    name: 'Jog Override 3'
  },
  {
    address: 'rapidoverride3',
    type: 'event',
    name: 'Rapid Override 3'
  },
  {
    address: 'logic3',
    type: 'condition',
    name: 'Logic Program 3'
  },
  {
    address: 'motion3',
    type: 'condition',
    name: 'Motion Program 3'
  },
  {
    address: 'part_count_overall3',
    type: 'event',
    name: 'Overall Part Count 3'
  },
  {
    address: 'part_count4',
    type: 'event',
    name: 'Part Count 4'
  },
  {
    address: 'part_count_desired4',
    type: 'event',
    name: 'Desired Part Count 4'
  },
  {
    address: 'mode4',
    type: 'event',
    name: 'Controller Mode 4'
  },
  {
    address: 'execution4',
    type: 'event',
    name: 'Execution 4'
  },
  {
    address: 'program4',
    type: 'event',
    name: 'Program 4'
  },
  {
    address: 'toolnumber4',
    type: 'event',
    name: 'Tool Number 4'
  },
  {
    address: 'operationmode4',
    type: 'event',
    name: 'Operation Mode 4'
  },
  {
    address: 'jogoverride4',
    type: 'event',
    name: 'Jog Override 4'
  },
  {
    address: 'rapidoverride4',
    type: 'event',
    name: 'Rapid Override 4'
  },
  {
    address: 'logic4',
    type: 'condition',
    name: 'Logic Program 4'
  },
  {
    address: 'motion4',
    type: 'condition',
    name: 'Motion Program 4'
  },
  {
    address: 'part_count_overall4',
    type: 'event',
    name: 'Overall Part Count 4'
  }
];
