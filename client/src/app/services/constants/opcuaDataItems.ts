import { DataPointDataType } from 'app/models';

export default [
  {
    name: 'Operation Duration',
    address: 'Monitoring.MachineTool.OperationDuration',
    dataType: DataPointDataType.UInt32
  },
  {
    name: 'Operation Mode',
    address: 'Monitoring.MachineTool.OperationMode',
    dataType: DataPointDataType.Int32
  },
  {
    name: 'Power On Duration',
    address: 'Monitoring.MachineTool.PowerOnDuration',
    dataType: DataPointDataType.UInt32
  },
  {
    name: 'Stack Light 1 On (Blue)',
    address: 'Monitoring.Stacklight.Light_1.SignalOn',
    dataType: DataPointDataType.Boolean
  },
  {
    name: 'Stack Light 1 Mode (Blue)',
    address: 'Monitoring.Stacklight.Light_1.SignalMode',
    dataType: DataPointDataType.Int32
  },
  {
    name: 'Stack Light 2 On (Green)',
    address: 'Monitoring.Stacklight.Light_2.SignalOn',
    dataType: DataPointDataType.Boolean
  },
  {
    name: 'Stack Light 2 Mode (Green)',
    address: 'Monitoring.Stacklight.Light_2.SignalMode',
    dataType: DataPointDataType.Int32
  },
  {
    name: 'Stack Light 3 On (Yellow)',
    address: 'Monitoring.Stacklight.Light_3.SignalOn',
    dataType: DataPointDataType.Boolean
  },
  {
    name: 'Stack Light 3 Mode (Yellow)',
    address: 'Monitoring.Stacklight.Light_3.SignalMode',
    dataType: DataPointDataType.Int32
  },
  {
    name: 'Stack Light 4 On (Red)',
    address: 'Monitoring.Stacklight.Light_4.SignalOn',
    dataType: DataPointDataType.Boolean
  },
  {
    name: 'Stack Light 4 Mode (Red)',
    address: 'Monitoring.Stacklight.Light_4.SignalMode',
    dataType: DataPointDataType.Int32
  },
  {
    name: 'Emergency Stop Triggered',
    address: 'Notification.EmergencyStopTriggered',
    dataType: DataPointDataType.Boolean
  },
  {
    name: 'Current Run Time',
    address: 'Production.ActiveProgram.CurrentRunTime',
    dataType: DataPointDataType.UInt32
  },
  {
    name: 'Desired Parts',
    address: 'Production.ActiveProgram.DesiredParts',
    dataType: DataPointDataType.UInt32
  },
  {
    name: 'Name',
    address: 'Production.ActiveProgram.Name',
    dataType: DataPointDataType.String
  },
  {
    name: 'Part Count',
    address: 'Production.ActiveProgram.PartCounter',
    dataType: DataPointDataType.UInt32
  },
  {
    name: 'Program Path',
    address: 'Production.ActiveProgram.ProgramPath',
    dataType: DataPointDataType.String
  },
  {
    name: 'Current State',
    address: 'Production.ActiveProgram.State.CurrentState',
    dataType: DataPointDataType.LocalizedText
  },
  { name: 'Sensor 1', address: 'Sensor1', dataType: DataPointDataType.Double },
  { name: 'Sensor 2', address: 'Sensor2', dataType: DataPointDataType.Double },
  {
    name: 'Variable 1',
    address: 'Variable1',
    dataType: DataPointDataType.Double
  },
  {
    name: 'Variable 2',
    address: 'Variable2',
    dataType: DataPointDataType.Double
  },
  {
    name: 'Variable 3',
    address: 'Variable3',
    dataType: DataPointDataType.String
  },
  {
    name: 'Variable 4',
    address: 'Variable4',
    dataType: DataPointDataType.UInt16
  }
];
