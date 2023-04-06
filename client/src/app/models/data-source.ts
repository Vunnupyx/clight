import { SourceDataPoint } from './source-data-point';

export enum DataSourceProtocol {
  S7 = 's7',
  MTConnect = 'mtconnect',
  IOShield = 'ioshield',
  Energy = 'energy'
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
  Unavailable = 'unavailable', // in case of status can't be loaded
  TermsAndConditionsNotAccepted = 'termsandconditionsnotaccepted'
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
  SinumerikSl = 'nck',
  SinumerikPl = 'nck-pl',
  S7_300_400 = 's7-300/400',
  S7_1200_1500 = 's7-1200/1500'
}

export enum MTConnectTypes {
  Agent = 'agent',
  Adapter = 'adapter'
}

export enum IOShieldTypes {
  DI_10 = '10di',
  AI_100_5di = 'ai-100+5di',
  AI_150_5di = 'ai-150+5di'
}

export enum EnergyTypes {
  PhoenixEMpro = 'PhoenixEMpro'
}

export class DataSource {
  type?: S7Types | MTConnectTypes | IOShieldTypes | EnergyTypes;
  connection?: Connection;
  dataPoints?: SourceDataPoint[];
  enabled?: boolean;
  id?: string;
  machineName?: string;
  protocol?: DataSourceProtocol;
  softwareVersion?: string;
}
