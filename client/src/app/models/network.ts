export enum NetworkType {
  ETHERNET_X1 = 'x1',
  ETHERNET_X2 = 'x2',
  PROXY = 'proxy'
}

export enum ProxyType {
  Socks5 = 'socks5',
  Http = 'http'
}

export class NetworkConfig {
  useDhcp?: boolean;
  ipAddr?: string;
  netmask?: string;
  defaultGateway?: string;
  dnsServer?: string;
  useProxy?: boolean;
  type?: ProxyType;
  port?: number;
  username?: string;
  password?: string;
  configurationState?: boolean;
  serviceState?: boolean;
}
