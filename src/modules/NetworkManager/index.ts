import { isNil, isUndefined } from 'lodash';
import { JsonDataSetMessageContentMask } from 'node-opcua-types';
import { stderr } from 'process';
import winston from 'winston';
import SshService from '../SshService';
import { NetworkInterfaceInfo } from './interfaces';

/**
 * Handle network configuration for MDCL host system.
 * Communicate via ssh to host machine.
 * Cache configurations after write.
 */
export default class NetworkManagerCliController {
  /**
   * Load configuration file from host.
   */
  static async getConfiguration(
    networkInterface: 'eth0' | 'eth1'
  ): Promise<NetworkInterfaceInfo> {
    const logPrefix = `NetworkManagerCliController::getConfiguration`;
    const configName = `lastConfig${networkInterface.replace('e', 'E')}`;
    if (NetworkManagerCliController[configName]) {
      winston.debug(
        `${logPrefix} found configuration for ${networkInterface} in cache. Return cached value.`
      );
      return Promise.resolve(NetworkManagerCliController[configName]);
    }

    const nmcliCommand = `nmcli -t -f IP4,IPV4,CONNECTION,GENERAL con show ${networkInterface}-default`;
    return SshService.sendCommand(nmcliCommand)
      .then((result) => {
        if (
          typeof result.stdout !== 'string' ||
          typeof result.stderr !== 'string'
        ) {
          winston.error(`${logPrefix} except string received buffer. Abort.`);
          return Promise.reject();
        }
        if (result.stderr.length !== 0) {
          winston.error(
            `${logPrefix} error during reading ${networkInterface} due to ${result.stderr}`
          );
          return Promise.reject();
        }
        const parsedResult = NetworkManagerCliController.parseNmCliOutput(
          result.stdout
        );
        const decodedResult =
          NetworkManagerCliController.decodeNmCliData(parsedResult);
        return decodedResult;
      })
      .catch((err) => {
        winston.error(
          `${logPrefix} error during reading ${networkInterface} config file due to ${JSON.stringify(
            err
          )}`
        );
        return Promise.reject();
      });
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

    const addressCommand = `ipv4.addresses ${ipAddress ? ipAddress : `''`}`;
    const gatewayCommand = `ipv4.gateway ${gateway ? gateway : `''`}`;
    const dnsCommand = `ipv4.dns ${dns ? dns : `''`}`;
    const dhcpCommand = `ipv4.method ${dhcp ? dhcp : `''`}`;

    const nmcliCommand = `nmcli con mod ${networkInterface}-default ${addressCommand} ${gatewayCommand} ${dnsCommand} ${dhcpCommand}`;
    winston.debug(`${logPrefix} sending command to host: ${nmcliCommand}`);
    try {
      await SshService.sendCommand(nmcliCommand, true);
      const resultApply = await SshService.sendCommand(
        `nmcli con up ${networkInterface}-default`,
        true
      );
      winston.info(resultApply);
    } catch (e) {
      if (config.dhcp && e.stderr.includes('at this time')) {
        winston.warn(
          `${logPrefix} could not activate on ${networkInterface} - error ignored because DHCP server might not be available`
        );
      } else {
        winston.error(
          `${logPrefix} failed to set network configuration due to ${
            e.stderr.trim() || JSON.stringify(e)
          }`
        );
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
    delete oldConfigCopy['name'];
    delete newConfigCopy['name'];
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
