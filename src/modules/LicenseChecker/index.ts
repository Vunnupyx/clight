import winston from 'winston';
import { LicenseError } from '../../common/errors';
import { LedStatusService } from '../LedStatusService';
import { System } from '../System';

export class LicenseChecker {
  #macList = [
    // codestryke
    '8C:F3:19:29:BA:4A',
    '8C:F3:19:1E:BD:22',
    '8C:F3:19:3A:0A:60',
    '8C:F3:19:5B:9A:BE',
    '8C:F3:19:4C:05:C9',
    'E0:DC:A0:C8:6F:7E',
    '8C:F3:19:6A:E6:B5',
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
  private _isLicensed: boolean = null;
  private system = new System();
  private _ledManager: LedStatusService;


  async init(): Promise<void> {
    const logPrefix = `${this.constructor.name}::init`;
    winston.info(`${logPrefix} initializing...`);
    if (!this._ledManager) {
      winston.warn(`${logPrefix} LedStatusService not available!`);
      return Promise.reject();
    }
    if(this._isLicensed !== null) {
      winston.info(`${logPrefix} already initialized`);
      return Promise.resolve();
    };
    let mac = await this.system.readMacAddress('eth0');

    const initialized = `${logPrefix} initialized.`;
    if (mac === null && process.env.NODE_ENV === 'development') {
      this._isLicensed = true;
      winston.info(initialized);
      return Promise.resolve();
    }

    if (!this.#macList.includes(mac)) {
      winston.warn(
        `${logPrefix} License is not valid! Please contact support.`
      );
      this._ledManager.setLicenseInvalid();
      this._isLicensed = false;
      return Promise.resolve();
    }
    this._isLicensed = true;
    winston.info(initialized);
  }

  set ledManager(manager: LedStatusService) {
    this._ledManager = manager;
  }

  get isLicensed(): boolean {
    const logPrefix = `${this.constructor.name}::isLicensed`;
    if (this._isLicensed === null) {
      const msg = `${logPrefix} calling before initialized.`;
      winston.error(msg);
      throw new LicenseError(msg, 'NOT_YET_INITIATED');
    }
    return this._isLicensed;
  }
}
