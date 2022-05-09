import { isNil, isUndefined } from 'lodash';
import winston from 'winston';
import SshService from '../SshService';
import { NetworkInterfaceInfo } from './interfaces';

/**
 * Set network configuration for MDCL host.
 */
export default class NetworkManagerCliController {
  /**
   * Load configuration from host.
   */
  static async getConfiguration(
    networkInterface: 'eth0' | 'eth1'
  ): Promise<NetworkInterfaceInfo> {
    const configName = `lastConfig${networkInterface.replace('e', 'E')}`;
    if (NetworkManagerCliController[configName])
      return NetworkManagerCliController[configName];
    const nmcliCommand = `nmcli -t -f IP4,IPV4,CONNECTION,GENERAL con show ${networkInterface}-default`;
    const result = await SshService.sendCommand(nmcliCommand);
    const parsedResult = NetworkManagerCliController.parseNmCliOutput(
      result.stdout
    );
    const decodedResult =
      NetworkManagerCliController.decodeNmCliData(parsedResult);
    return decodedResult;
  }

  /**
   * Set network manager configuration.
   */
  static async setConfiguration(
    networkInterface: 'eth0' | 'eth1',
    config: NetworkInterfaceInfo
  ): Promise<void> {
    const logPrefix = `${NetworkManagerCliController.name}::setConfiguration`;
    const oldConfig = await this.getConfiguration(networkInterface);

    if (!NetworkManagerCliController.checkConfigChanged(config, oldConfig)) {
      winston.info(`${logPrefix} new config === old config. No changes`);
      return Promise.resolve();
    }
    

    let ipAddress = '';
    if (
      !(
        isNil(config.ipAddress) ||
        isNil(config.subnetMask) ||
        config.ipAddress.length === 0 ||
        config.subnetMask.length === 0
      )
    ) {
      ipAddress = `${
        config.ipAddress
      }/${NetworkManagerCliController.netmaskToCidr(config.subnetMask)}`;
    }
    const gateway = isNil(config.gateway) ? '' : config.gateway;
    const dns = isNil(config.dns) ? '' : config.dns;
    const dhcp = config.dhcp ? 'auto' : 'manual';

    const addressCommand = ipAddress ? `ipv4.addresses ${ipAddress}` : '';
    const gatewayCommand = gateway ? `ipv4.gateway ${gateway}` : '';
    const dnsCommand = dns ? `ipv4.dns ${dns}` : '';
    const dhcpCommand = dhcp ? `ipv4.method ${dhcp}` : '';

    const nmcliCommand = `nmcli con mod ${networkInterface}-default ${addressCommand} ${gatewayCommand} ${dnsCommand} ${dhcpCommand}`;
    winston.debug(`${logPrefix} sending command to host: ${nmcliCommand}`);
    try {
      await SshService.sendCommand(nmcliCommand);
      const resultApply = await SshService.sendCommand(
        `nmcli con up ${networkInterface}-default`
      );
      winston.info(resultApply);
    } catch (e) {
      if (config.dhcp && e.stderr.includes('at this time')) {
        winston.warn(
          `Could not activate on ${networkInterface} - error ignored because DHCP server might not be available`
        );
      } else {
        winston.error('Failed to set network configuration');
        winston.error(e);
        return Promise.reject(e);
      }
    }
    // Update cached configuration
    const configName = `lastConfig${networkInterface.replace('e', 'E')}`;
    NetworkManagerCliController[configName] = null;
    NetworkManagerCliController[configName] =
      await NetworkManagerCliController.getConfiguration(networkInterface);
  }

  /**
   * Returns true if config has changed.
   */
  static checkConfigChanged(newConfig, oldConfig): boolean {
    const newConfigCopy = Object.assign({}, newConfig);
    const oldConfigCopy = Object.assign({}, oldConfig);
    delete oldConfigCopy["name"];
    delete newConfigCopy["name"];
    var changed = false;
    for (const key of Object.keys(newConfigCopy)) {
      if (oldConfigCopy[key] !== newConfigCopy[key]) {
        changed = true;
        break;
      }
    }
    return changed;
  }

  /**
   * Generate NetworkInterfaceInfo object from request body.
   */
  static generateNetworkInterfaceInfo(
    body: any,
    name: string
  ): NetworkInterfaceInfo {
    const dhcpConfig = {
      name,
      activated: true,
      dhcp: true
    };
    return body.useDhcp
      ? dhcpConfig
      : {
          ...dhcpConfig,
          ...{
            dhcp: false,
            dns: body.dnsServer,
            gateway: body.defaultGateway,
            ipAddress: body.ipAddr,
            subnetMask: body.netmask
          }
        };
  }

  /**
   * Parse output of the cli
   */
  private static parseNmCliOutput(output: string) {
    const lines = output.split('\n');
    const rawOutput = {};
    for (const line of lines) {
      if (line.length < 4) continue;
      const lineParts = line.split(':');
      const attribute = lineParts[0];
      const value = lineParts[1];
      rawOutput[attribute] = value;
    }
    return rawOutput;
  }

  /**
   * Translate CIDR postfix to network mask style.
   */
  private static cidrToNetmask(bitCount: number): string {
    let mask = [],
      n;
    for (let i = 0; i < 4; i++) {
      n = Math.min(bitCount, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      bitCount -= n;
    }
    return mask.join('.');
  }

  /**
   * Translate network mask style to CIDR postfix.
   */
  private static netmaskToCidr(netmask: string): number {
    let cidr = 0;
    const values = netmask.split('.').map((value) => parseInt(value, 10));
    for (let byteIndex = 0; byteIndex < 4; byteIndex++) {
      for (let bitIndex = 7; bitIndex >= 0; bitIndex--) {
        const bitmask = 0b1 << bitIndex;
        const bitActive = (values[byteIndex] & bitmask) > 0;
        cidr = bitActive ? byteIndex * 8 + 8 - bitIndex : cidr;
      }
    }
    return cidr;
  }

  /**
   * Create NetworkInterfaceInfo object from parsed cli output.
   */
  private static decodeNmCliData(data): NetworkInterfaceInfo {
    const ip = data['ipv4.addresses'] || data['IP4.ADDRESS[1]'];
    const ipParts = ip.split('/'); // Example value: 10.202.55.150/24
    let ipAddress = ipParts[0];
    const cidr = parseInt(ipParts[1], 10);
    let subnetMask = NetworkManagerCliController.cidrToNetmask(cidr);
    if (ipAddress === '--' || ipAddress === '') {
      ipAddress = null;
      subnetMask = null;
    }
    let gateway = data['ipv4.gateway'] || data['IP4.GATEWAY'];
    if (gateway === '--') gateway = null;
    if (gateway === '') gateway = '0.0.0.0';
    let dns = data['ipv4.dns'] || data['IP4.DNS[1]'];
    if (dns === '--' || dns === '') dns = null;
    let activated = false;
    let state = data['GENERAL.STATE'];
    if (!isUndefined(state) && state === 'activated') activated = true;
    const decodeResults: NetworkInterfaceInfo = {
      name: data['connection.interface-name'],
      dhcp: data['ipv4.method'] === 'auto',
      ipAddress,
      subnetMask,
      gateway,
      dns,
      activated
    };
    return decodeResults;
  }
}
