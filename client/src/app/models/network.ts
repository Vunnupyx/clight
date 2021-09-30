export enum NetworkType {
  ETHERNET_X1 = 'x1',
  ETHERNET_X2 = 'x2',
  PROXY = 'proxy',
}

export class NetworkConfig {
  useDhcp?: boolean;
  ipAddr?: string;
  netmask?: string;
  defaultGateway?: string;
  dnsServer?: string;// TODO: is missed in server response
  useProxy?: boolean;
  port?: number;
  username?: string;
  password?: string;
  configurationState?: boolean;
  serviceState?: boolean;
}
