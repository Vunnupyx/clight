import { System } from '../System';

export class LicenseCheck {
  #macList = [
    // codestryke
    '8CF31929BA4A',
    '8CF3191EBD22',
    '8CF3193A0A60',
    '8CF3195B9ABE',
    'E0DCA0C86F7E'
  ];
  #system = new System();

  public async checkLicense(): Promise<true> {
    const logPrefix = `${this.constructor.name}::checkMAC`;
    const mac = await this.#system.readMacAddress('eth0');
    if (!this.#macList.includes(mac)) {
      throw {
        msg: `${logPrefix} License is not valid! Please contact support.`,
        code: 'LICENSE_CHECK_FAILED'
      };
    }
    return true;
  }
}
