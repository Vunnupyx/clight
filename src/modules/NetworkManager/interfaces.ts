// # {"operation": "get_interface_info", "interface": "eth1"}
// # {"operation": "configure_interface", "interface": "eth1", "payload":
//    {"dhcp": False, "ip_address": "192.168.0.32", "subnet_mask": "255.255.255.0", "gateway": "192.168.0.100", "dns": "192.168.0.101"}}
// # {"operation": "reset_to_default"}
export interface NetworkManagerPayload {
    dhcp: boolean;
    ip_address?: string;
    subnet_mask?: string;
    gateway?: string;
    dns?: string;
  }
  export interface NetworkManagerCommand {
    operation: string;
    network_interface?: string;
    payload?: string;
  }
  export interface NetworkManagerNetworkInterfaceInfo {
    dhcp: boolean;
    ip_address?: string;
    subnet_mask?: string;
    gateway?: string;
    dns?: string;
    error: Array<string>;
  }
  export interface NetworkInterfaceInfo {
    name: string;
    dhcp: boolean;
    activated: boolean|null;
    ipAddress?: string;
    subnetMask?: string;
    gateway?: string;
    dns?: string;
    error?: Array<string>;
  }
  export interface ProxySettings {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
  }