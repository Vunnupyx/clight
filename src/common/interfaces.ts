import { IDataSinkLifecycleEvent } from '../modules/Northbound/DataSinks/interfaces';
import { IDataSourceLifecycleEvent } from '../modules/Southbound/DataSources/interfaces';

export enum EventLevels {
  Device = 'device',
  DataSource = 'dataSource',
  DataSink = 'dataSink',
  DataPoint = 'dataPoint'
}

export enum ErrorTypes {
  ECONNREFUSED = 'ECONNREFUSED',
  ENOTFOUND = 'ENOTFOUND',
  InvalidConfiguration = 'INVALID_APP_CONFIGURATION'
}

export enum DataSourceProtocols {
  S7 = 's7',
  IOSHIELD = 'ioshield',
  ENERGY = 'energy',
  MTCONNECT = 'mtconnect'
}

export enum DataSinkProtocols {
  MTCONNECT = 'mtconnect',
  OPCUA = 'opcua',
  DATAHUB = 'datahub'
}

export enum MTConnectDataItemTypes {
  EVENT = 'event',
  SAMPLE = 'sample',
  CONDITION = 'condition'
}

export enum DeviceLifecycleEventTypes {
  LaunchSuccess = 'device.launch-success',
  LaunchError = 'device.launch-error',
  ErrorOnParseLocalConfig = 'device.error-on-parse-local-config',
  DeviceConfigDoesNotExists = 'device.config-file-does-not-exists'
}

export enum DataPointLifecycleEventTypes {
  Init = 'datapoint.init',
  ReadError = 'datapoint.read-error',
  ReadSuccess = 'datapoint.read-success'
}

export enum LifecycleEventStatus {
  Disabled = 'disabled',
  NotConfigured = 'notconfigured',
  InvalidConfiguration = 'invalidconfiguration',
  TimeError = 'clienttimedeviation',
  NoNetwork = 'nonetwork',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  ConnectionError = 'failedtoconnect',
  Unavailable = 'unavailable',
  TermsAndConditionsNotAccepted = 'termsandconditionsnotaccepted',
  AuthenticationFailed = 'authenticationfailed',
  InvalidState = 'invalidstate'
}

export interface IBaseAppEvent {
  id: string;
  level: EventLevels;
  type: string;
  payload?: any;
}

export interface IBaseLifecycleEvent extends IBaseAppEvent {
  type:
    | LifecycleEventStatus
    | ErrorTypes
    | DeviceLifecycleEventTypes
    | DataPointLifecycleEventTypes;
}

export interface IErrorEvent extends IBaseAppEvent {
  level: EventLevels;
}

export type ILifecycleEvent =
  | IDataSourceLifecycleEvent
  | IDataSinkLifecycleEvent
  | IBaseLifecycleEvent;

export type IAppEvent = ILifecycleEvent | IErrorEvent;
