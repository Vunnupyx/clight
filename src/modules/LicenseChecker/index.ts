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
    'E0:DC:A0:C8:6F:7E',
    // DMG
    '8C:F3:19:6B:17:5E',
    '8C:F3:19:6B:17:44',
    '8C:F3:19:6B:17:80',
    '8C:F3:19:6B:17:1E',
    '8C:F3:19:6B:17:86',
    '8C:F3:19:6B:17:78',
    '8C:F3:19:6B:17:70',
    '8C:F3:19:6B:17:8E',
    '8C:F3:19:6B:17:36',
    '8C:F3:19:6B:17:34',
    '8C:F3:19:6B:17:14',
    '8C:F3:19:6B:17:82',
    '8C:F3:19:6B:17:52',
    '8C:F3:19:6B:17:2E',
    '8C:F3:19:6B:17:6E',
    '8C:F3:19:6B:17:03',
    '8C:F3:19:6B:17:54',
    '8C:F3:19:6B:17:30',
    '8C:F3:19:6B:17:38',
    'E0:DC:A0:D7:2F:08',
    'E0:DC:A0:B9:D8:C7',
    '8C:F3:19:1E:BD:73',
    '8C:F3:19:35:86:D3',
    '8C:F3:19:3A:0A:7A',
    '8C:F3:19:3A:0A:60',
    '8C:F3:19:2D:8A:2E',
    '8C:F3:19:3A:0A:7C',
    '8C:F3:19:35:86:D3',
    '8C:F3:19:3A:0A:74'
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
