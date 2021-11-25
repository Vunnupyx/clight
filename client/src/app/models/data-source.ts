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
  ConnectionError = 'failed to connect'
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

export class DataSource {
  connection?: Connection;
  dataPoints?: SourceDataPoint[];
  enabled?: boolean;
  id?: string;
  name?: string;
  protocol?: DataSourceProtocol;
  softwareVersion?: string;
}
