import { IDataSourceLifecycleEvent } from '../modules/DataSource';

export enum EventLevels {
  Device = 'device',
  DataSource = 'dataSource',
  DataPoint = 'dataPoint'
}

export enum ErrorTypes {
  ECONNREFUSED = 'ECONNREFUSED',
  ENOTFOUND = 'ENOTFOUND',
  InvalidConfiguration = 'INVALID_APP_CONFIGURATION'
}

export enum DataSourceProtocols {
  S7 = 's7',
  IOSHIELD = 'ioshield'
}

export enum DataSinkProtocols {
  MTCONNECT = 'mtconnect',
  OPCUA = 'opcua'
}

export enum MTConnectDataItemTypes {
  EVENT = 'event'
}

export enum DeviceLifecycleEventTypes {
  LaunchSuccess = 'device.launch-success',
  LaunchError = 'device.launch-error',
  ErrorOnParseLocalConfig = 'device.error-on-parse-local-config',
  DeviceConfigDoesNotExists = 'device.config-file-does-not-exists'
}

export enum DataSourceLifecycleEventTypes {
  Connecting = 'datasource.connecting',
  Connected = 'datasource.connected',
  Disconnected = 'datasource.disconnected',
  Reconnecting = 'datasource.reconnecting',
  ConnectionError = 'datasource.failed-to-connect'
}

export enum DataPointLifecycleEventTypes {
  Init = 'datapoint.init',
  ReadError = 'datapoint.read-error',
  ReadSuccess = 'datapoint.read-success'
}

export enum LifecycleEventStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  ConnectionError = 'failed to connect'
}

export interface IBaseAppEvent {
  id: string;
  level: EventLevels;
  type: string;
  payload?: any;
}

export interface IBaseLifecycleEvent extends IBaseAppEvent {
  type:
    | DataSourceLifecycleEventTypes
    | ErrorTypes
    | DeviceLifecycleEventTypes
    | DataPointLifecycleEventTypes;
}

export interface IErrorEvent extends IBaseAppEvent {
  level: EventLevels;
}

export type ILifecycleEvent = IDataSourceLifecycleEvent | IBaseLifecycleEvent;

export type IAppEvent = ILifecycleEvent | IErrorEvent;
