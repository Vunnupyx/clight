import { PreDefinedDataPoint } from "app/models";

export default [
  { name: 'Operation Duration', address: 'ns=7;s=OperationDuration' } as PreDefinedDataPoint,
  { name: 'Operation Mode', address: 'ns=7;s=OperationMode' } as PreDefinedDataPoint,
  { name: 'Power On Duration', address: 'ns=7;s=PowerOnDuration' } as PreDefinedDataPoint,
  { name: 'Stack Light 1 On (Blue)', address: 'ns=7;s=Light_1-SignalOn' } as PreDefinedDataPoint,
  {
    name: 'Stack Light 1 Mode (Blue)',
    address: 'ns=7;s=Light_1-SignalMode'
  } as PreDefinedDataPoint,
  { name: 'Stack Light 2 On (Green)', address: 'ns=7;s=Light_2-SignalOn' } as PreDefinedDataPoint,
  {
    name: 'Stack Light 2 Mode (Green)',
    address: 'ns=7;s=Light_2-SignalMode'
  } as PreDefinedDataPoint,
  { name: 'Stack Light 3 On (Yellow)', address: 'ns=7;s=Light_3-SignalOn' } as PreDefinedDataPoint,
  {
    name: 'Stack Light 3 Mode (Yellow)',
    address: 'ns=7;s=Light_3-SignalMode'
  } as PreDefinedDataPoint,
  { name: 'Stack Light 4 On (Red)', address: 'ns=7;s=Light_4-SignalOn' } as PreDefinedDataPoint,
  {
    name: 'Stack Light 4 Mode (Red)',
    address: 'ns=7;s=Light_4-SignalMode'
  } as PreDefinedDataPoint,
  {
    name: 'Emergency Stop Triggered',
    address: 'ns=7;s=EmergencyStopTriggered'
  } as PreDefinedDataPoint,
  { name: 'Current Run Time', address: 'ns=7;s=ActiveProgram-CurrentRunTime' } as PreDefinedDataPoint,
  { name: 'Desired Parts', address: 'ns=7;s=ActiveProgram-DesiredParts' } as PreDefinedDataPoint,
  { name: 'Name', address: 'ns=7;s=ActiveProgram-Name' } as PreDefinedDataPoint,
  { name: 'Part Count', address: 'ns=7;s=ActiveProgram-PartCounter' } as PreDefinedDataPoint,
  { name: 'Program Path', address: 'ns=7;s=ActiveProgram-ProgramPath' } as PreDefinedDataPoint,
  { name: 'Current State', address: 'ns=7;s=ActiveProgram-State-CurrentState' } as PreDefinedDataPoint,
  { name: 'Sensor 1', address: 'ns=7;s=Sensor1' } as PreDefinedDataPoint,
  { name: 'Sensor 2', address: 'ns=7;s=Sensor2' } as PreDefinedDataPoint,
  { name: 'Variable 1', address: 'ns=7;s=Variable1' } as PreDefinedDataPoint,
  { name: 'Variable 2', address: 'ns=7;s=Variable2' } as PreDefinedDataPoint,
  { name: 'Variable 3', address: 'ns=7;s=Variable3' } as PreDefinedDataPoint,
  { name: 'Variable 4', address: 'ns=7;s=Variable4' } as PreDefinedDataPoint
];
