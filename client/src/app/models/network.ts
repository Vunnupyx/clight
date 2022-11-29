export enum NetworkType {
  ETHERNET_X1 = 'x1',
  ETHERNET_X2 = 'x2',
  PROXY = 'proxy',
  NTP = 'ntp'
}

export interface NetworkConfig {
  x1: NetworkAdapter;
  x2: NetworkAdapter;
  proxy: NetworkProxy;
  ntp: {
    host: string[];
    timestamp: NetworkDateTime;
    ntpEnabled: boolean;
  };
}

export interface NetworkAdapter {
  id: string;
  displayName: string;
  enabled: boolean;
  ipv4Settings: IpSettings;
  ipv6Settings: IpSettings;
  macAddress: string;
  ssid: string;
}

interface IpSettings {
  enabled: boolean;
  dhcp: boolean;
  ipAddresses: [
    {
      Address: string;
      Netmask: string;
    }
  ];
  defaultGateway: string;
  dnsserver: string[];
}

export interface NetworkProxy {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  whitelist: string[];
}

export interface NetworkNtp {
  useNtp: boolean;
  ntpHost: string;
  currentTime: string;
  timezone: string;
  reachable: boolean;
}

export interface NetworkDateTime {
  datetime: string;
  timezone: string;
}

export interface NetworkTimestamp {
  Timestamp: string;
}

export interface NetworkNtpReachable {
  address: string;
  reachable: boolean;
  valid: boolean;
}
