export enum NetworkType {
  ETHERNET_X1 = 'x1',
  ETHERNET_X2 = 'x2',
  PROXY = 'proxy',
  TIME = 'time'
}

export enum ProxyType {
  Socks5 = 'socks5',
  Http = 'http'
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
