export default [
  { name: 'progName', address: '/Channel/ProgramPointer/progName' },
  { name: 'feedRateOvr', address: '/Nck/MachineAxis/feedRateOvr' },
  { name: 'actProgNetTime', address: '/Channel/State/actProgNetTime' },
  { name: 'OpMode', address: '/Bag/State/OpMode' },
  {
    name: 'singleBlockActive',
    address: '/Channel/ProgramModification/singleBlockActive'
  },
  {
    name: 'selectedWorkPProg',
    address: '/Channel/Programinfo/selectedWorkPProg'
  },
  { name: 'feedRateIpoOvr', address: '/Channel/State/feedRateIpoOvr' },
  {
    name: 'numSpindles',
    address: '/Channel/Configuration/numSpindles'
  },
  { name: 'SpindleType', address: '/Channel/Spindle/SpindleType' },
  { name: 'speedOvr', address: '/Channel/Spindle/speedOvr' },
  { name: 'rapFeedRateOvr', address: '/Channel/State/rapFeedRateOvr' },
  { name: 'totalParts', address: '/Channel/State/totalParts' },
  { name: 'reqParts', address: '/Channel/State/reqParts' },
  { name: 'actParts', address: '/Channel/State/actParts' },
  { name: 'actTNumber', address: '/Channel/State/actTNumber' },
  { name: 'numAlarms', address: '/Nck/State/numAlarms' },
  { name: 'maxnumAlarms', address: '/Nck/Configuration/maxnumAlarms' },
  { name: 'sequencedAlarmAlarmNo', address: '/Nck/SequencedAlarms/alarmNo' },
  { name: 'alarmEventAlarmNo', address: '/Nck/AlarmEvent/alarmNo' },
  { name: 'lastAlarmNo', address: '/Nck/LastAlarm/alarmNo' },
  { name: 'topPrioAlarmNo', address: '/Nck/TopPrioAlarm/alarmNo' }
];
