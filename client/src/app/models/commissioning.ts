export interface MachineInformation {
  Serial: string;
  Model: string;
  ControlType: string;
  ControlManufacturer: string;
  Manufacturer: string;
  Source: string;
  Timestamp: string;
}

export interface CommissioningInformation {
  Timestamp: string;
  Finished: boolean;
}

export enum LinkStatus {
  Connected = 'connected',
  Disabled = 'disabled',
  Disconnected = 'disconnected'
}

export enum ConfigurationStatus {
  Configured = 'configured',
  Configuring = 'configuring',
  Unmanaged = 'unmanaged',
  Failed = 'failed',
  Pending = 'pending',
  Linger = 'linger'
}

export interface AdapterConnection {
  linkStatus: LinkStatus;
  configurationStatus: ConfigurationStatus;
}

export enum DataHubModuleStatus {
  Running = 'running',
  Stopped = 'stopped'
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
