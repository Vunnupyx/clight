import {
  IDataSourceEvent,
  IDataSourceLifecycleEvent,
  IDataSourceMeasurementEvent,
  IMeasurement,
} from "../modules/DataSource";

export enum DeviceTypes {
  IOT2050 = "IOT2050",
  IPC127E = "IPC127E",
  IPC227E = "IPC227E",
  IPC627D = "IPC627D",
  MBNET = "MBNET",
  DOCKER = "DOCKER",
  GENERIC = "GENERIC",
}

export enum EventLevels {
  Device = "device",
  DataSource = "dataSource",
  DataPoint = "dataPoint",
}

export enum ErrorTypes {
  ECONNREFUSED = "ECONNREFUSED",
  ENOTFOUND = "ENOTFOUND",
  InvalidConfiguration = "INVALID_APP_CONFIGURATION",
}

export enum DataSourceProtocols {
  S7 = "s7",
  IOSHIELD = "ioshield",
}

export enum DataSinkProtocols {
  MTCONNECT = "mtconnect",
}

export enum MTConnectDataItemTypes {
  EVENT = "event",
}

export enum DeviceLifecycleEventTypes {
  LaunchSuccess = "device.launch-success",
  ConfigUpdateLaunchSuccess = "device.config-update-launch-success",
  LaunchError = "device.launch-error",
  DataSourceConfigurationIsNotValid = "device.data-source-configuration-is-not-valid",
  ErrorOnParseLocalConfig = "device.error-on-parse-local-config",
  DeviceTypeReadError = "device.error-while-reading-device-type-file",
  DeviceReadFileError = "device.error-while-reading-device-type-file",
  DeviceConfigDoesNotExists = "device.config-file-does-not-exists",
  ErrorReadDeviceId = "device.error-while-reading-device-id-file",
  ErrorWriteDeviceId = "device.error-while-writing-device-id-file",
  ErrorGetDeviceId = "device.error-while-getting-device-id",
}

export enum DataSourceLifecycleEventTypes {
  Connecting = "datasource.connecting",
  Connected = "datasource.connected",
  Disconnected = "datasource.disconnected",
  Reconnecting = "datasource.reconnecting",
  ConnectionError = "datasource.failed-to-connect",
  BadConnectionSting = "datasource.bad-connection-string",
  IdNotProvided = "datasource.id-not-provided",
}

export enum DataPointLifecycleEventTypes {
  Init = "datapoint.init",
  ReadError = "datapoint.read-error",
  ReadSuccess = "datapoint.read-success",
}

export interface INetworkConfiguration {
  internet_dhcp: string;
  internet_ip_address: string;
  internet_gateway: string;
  internet_subnet_mask: string;
  internet_dns_server: string;
  network_dhcp: string;
  network_ip_address: string;
  network_subnet_mask: string;
  network_gateway: string;
  network_dns_server: string;
}

export enum LifecycleEventStatus {
  Connecting = "connecting",
  Connected = "connected",
  Disconnected = "disconnected",
  Reconnecting = "reconnecting",
  ConnectionError = "failed to connect",
  BadConnectionSting = "failed to connect due to bad connection string",
  IdNotProvided = "id is not provided in connection string",
}

export enum HealthStatuses {
  GOOD = "good",
  WARNING = "warning",
  ERROR = "error",
  SUBCOMPONENT_ERROR = "SUBCOMPONENT_ERROR",
  FAILED_TO_CONNECT_TCP = "FAILED_TO_CONNECT_TCP",
  FAILED_TO_CONNECT_ISO = "FAILED_TO_CONNECT_ISO",
  FAILED_TO_CONNECT_APPLICATION = "FAILED_TO_CONNECT_APPLICATION",
  UNKNOWN_ADDRESS = "UNKOWN_ADDRESS",
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
