import { System } from '../System';

export class LicenseCheck {
  #macList = [
    // dev
    '00:00:00:00:00:00',
    // codestryke
    '8C:F3:19:29:BA:4A',
    '8C:F3:19:1E:BD:22',
    '8C:F3:19:3A:0A:60',
    '8C:F3:19:5B:9A:BE',
    '8C:F3:19:4C:05:C9',
    'E0:DC:A0:C8:6F:7E'
  ];
  #system = new System();

  public async checkLicense(): Promise<true> {
    const logPrefix = `${this.constructor.name}::checkMAC`;
    let mac = await this.#system.readMacAddress('eth0');

    if (mac === null && process.env.NODE_ENV === 'development')
      mac = '00:00:00:00:00:00';

    if (!this.#macList.includes(mac)) {
      throw {
        msg: `${logPrefix} License is not valid! Please contact support.`,
        code: 'LICENSE_CHECK_FAILED'
      };
    }
    return true;
  }
}
