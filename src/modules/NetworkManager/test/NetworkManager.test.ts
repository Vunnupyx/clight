import SshService from '../../SshService';

jest.mock('winston');

// Import unit under test
import NetworkManagerCliController from '../index';

// static method mock
const sendCommandMock = jest.spyOn(SshService, 'sendCommand');

describe('getConfiguration', () => {
  const UUT = NetworkManagerCliController;
  test('do not throw an error if no ip is available', async () => {
    const stdout = `ipv4.method:auto\nipv4.dns:\nipv4.dns-search:\nipv4.dns-options:\nipv4.dns-priority:0\nipv4.addresses:\nipv4.gateway:\nipv4.routes:\nipv4.route-metric:-1\nipv4.route-table:0\nipv4.routing-rules:\nipv4.ignore-auto-routes:no\nipv4.ignore-auto-dns:no\nipv4.dhcp-client-id:\nipv4.dhcp-iaid:\nipv4.dhcp-timeout:0\nipv4.dhcp-send-hostname:yes\nipv4.dhcp-hostname:\nipv4.dhcp-fqdn:\nipv4.dhcp-hostname-flags:0x0\nipv4.never-default:no\nipv4.may-fail:yes\nipv4.dad-timeout:-1\nipv4.dhcp-vendor-class-identifier:\nipv4.dhcp-reject-servers:\nconnection.id:eth0-default\nconnection.uuid:2f479c0e-43f7-3460-958d-4d44617ae118\nconnection.stable-id:\nconnection.type:802-3-ethernet\nconnection.interface-name:eno1\nconnection.autoconnect:yes\nconnection.autoconnect-priority:0\nconnection.autoconnect-retries:-1\nconnection.multi-connect:0\nconnection.auth-retries:-1\nconnection.timestamp:1659983916\nconnection.read-only:no\nconnection.permissions:\nconnection.zone:\nconnection.master:\nconnection.slave-type:\nconnection.autoconnect-slaves:-1\nconnection.secondaries:\nconnection.gateway-ping-timeout:0\nconnection.metered:unknown\nconnection.lldp:default\nconnection.mdns:-1\nconnection.llmnr:-1\nconnection.wait-device-timeout:-1\n`;
    sendCommandMock.mockImplementationOnce(async (...args) => {
      return Promise.resolve({ stderr: '', stdout });
    });
    UUT.getConfiguration('eth0').then((res) => {
      console.log(res);
      expect(res.ipAddress).toBe(null);
      expect(res.subnetMask).toBe(null);
      expect(res.activated).toBe(false);
    });
  });
});
