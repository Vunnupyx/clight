export default [
  { name: 'CNC Type', address: 'cnc_sysinfo.cnc_type' },
  { name: 'SerialNumber', address: '' },
  { name: 'OperationTimeOverall', address: '' },
  { name: 'PowerOnTimeOverall', address: '' },
  { name: 'CurrentRuntime', address: '' },
  { name: 'ExecutionState', address: 'cnc_statinfo.run' },
  { name: 'ControllerMode', address: 'cnc_statinfo.aut' },
  { name: 'SELECTED_PROG', address: 'cnc_exeprgname2.path_name' },
  { name: 'CurrentPartProgramm', address: 'cnc_pdf_rdmain.file_path' },
  { name: 'FeedOverride', address: '' },
  { name: 'OverrideMainSpindle', address: '' },
  { name: 'RapidOverride', address: '' },
  { name: 'PartCounter', address: '' },
  { name: 'PartCounterOverall', address: '' },
  { name: 'PartsDesired', address: '' },
  { name: 'Stacklight', address: '' },
  { name: 'ToolNumber', address: '' },
  { name: 'NumberOfActiveAlarms', address: 'cnc_rdalmmsg2.num ?' },
  { name: 'Alarms / Notifications', address: 'cnc_rdalmmsg2.num ?' },
  { name: 'Emergency Stop', address: '' }
];
