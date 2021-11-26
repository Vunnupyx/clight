import { SourceDataPoint } from './source-data-point';

export enum DataSourceProtocol {
  S7 = 's7',
  IOShield = 'ioshield'
}

export enum DataSourceSoftwareVersion {
  v4_5 = '4.5',
  v4_7 = '4.7'
}

export enum DataSourceConnectionStatus {
  Disabled = 'disabled',
  NotConfigured = 'notconfigured',
  Provisioning = 'provisioning',
  ProvisioningFailed = 'provisioningfailed',
  NoNetwork = 'nonetwork',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  ConnectionError = 'failedtoconnect',
  Unavailable = 'unavailable' // in case of status can't be loaded
}

export class DataSourceConnection {
  status!: DataSourceConnectionStatus;
}

export class Connection {
  ipAddr?: string;
  port?: number;
  rack?: number;
  slot?: number;
}

export enum S7Types {
  Sinumerik = 'nck',
  S7_300_400 = 's7-300/400',
  S7_1200_1500 = 's7-1200/1500'
}

export enum IOShieldTypes {
  DI_10 = '10di',
  AI_100_5di = 'ai-100+5di',
  AI_150_5di = 'ai-150+5di'
}

export class DataSource {
  type?: S7Types | IOShieldTypes;
  connection?: Connection;
  dataPoints?: SourceDataPoint[];
  enabled?: boolean;
  id?: string;
  name?: string;
  protocol?: DataSourceProtocol;
  softwareVersion?: string;
}
