export interface MachineInformation {
  Serial: string;
  Model: string;
  ControlType: string;
  ControlManufacturer: string;
  Source: string;
  Timestamp: string;
}

export interface CommissioningInformation {
  Timestamp: string;
  Finished: boolean;
}

export interface Adapter {
  macAddress: string;
  ipAddress: string;
  netmask: string;
}

export enum LinkStatus {
  Connected = 'connected',
  Disabled = 'disabled',
  Disconnected = 'disconnected',
  Unknown = 'unknown'
}

export enum ConfigurationStatus {
  Configured = 'configured',
  Configuring = 'configuring',
  Unmanaged = 'unmanaged',
  Failed = 'failed',
  Pending = 'pending',
  Linger = 'linger',
  Unknown = 'unknown'
}

export interface AdapterConnection {
  linkStatus: LinkStatus;
  configurationStatus: ConfigurationStatus;
}

export enum DataHubModuleStatus {
  Running = 'running',
  Stopped = 'stopped',
  Unknown = 'unknown'
}

export interface DataHubModule {
  ImageName: string;
  DisplayName: string;
  Version: string;
  Status: DataHubModuleStatus;
  StartedAt: string;
  Error: string;
}

export enum DataHubModuleName {
  MdcWebServer = 'mdc-web-server',
  MtconnectAgent = 'mtconnect-agent',
  Mdclight = 'mdclight',
  EdgeHub = 'edgeHub',
  EdgeAgent = 'edgeAgent'
}
