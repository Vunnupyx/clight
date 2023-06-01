interface ICosNetworkIPSettings {
  enabled: boolean;
  defaultGateway: string;
  dhcp: boolean;
  dnsserver: string[];
  ipAddresses: Array<{ Address: string; Netmask: string }>;
}

export interface ICosNetworkAdapterSetting {
  id: string;
  displayName: string;
  enabled: boolean;
  ipv4Settings: ICosNetworkIPSettings[];
  ipv6Settings: ICosNetworkIPSettings[];
  macAddress: string;
  ssid: string;
}

export type ICosNetworkAdapterSettings = ICosNetworkAdapterSetting[];

export interface ICosNetworkAdapterStatus {
  linkStatus: 'disabled' | 'disconnected' | 'connected' | 'unknown';
  configurationStatus:
    | 'configuring'
    | 'unmanaged'
    | 'failed'
    | 'pending'
    | 'linger'
    | 'unknown';
  message: string;
}

export interface ICosSystemCommissioningStatus {
  Timestamp: string;
  Finished: boolean;
}

export interface ICosSystemVersion {
  Name: string;
  DisplayName: string;
  Version: string;
}
export type ICosSystemVersions = ICosSystemVersion[];

//System restart response is an empty object
export type ICosSystemRestartResponse = {};

export interface ICosResponseError {
  message: string;
  error: string;
}

export type ICosLedsList = string[];
export interface IMachineInfo {
  Serial: string;
  Model: string;
  ControlType: string;
  ControlManufacturer: string;
  Manufacturer: string;
  Source: string;
  Timestamp: string;
}
