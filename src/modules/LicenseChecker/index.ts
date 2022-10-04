import winston from 'winston';
import { LicenseError } from '../../common/errors';
import { LedStatusService } from '../LedStatusService';
import { System } from '../System';

export class LicenseChecker {
  #macList = [
    // codestryke
    '8C:F3:19:1E:BD:22',
    '8C:F3:19:29:BA:4A',
    '8C:F3:19:3A:0A:60',
    '8C:F3:19:4C:05:C9',
    '8C:F3:19:5B:9A:BE',
    '8C:F3:19:6A:E6:B5',
    'E0:DC:A0:C8:6F:7E',
    // DMG
    '8C:F3:19:16:8C:C2',
    '8C:F3:19:16:8D:7E',
    '8C:F3:19:16:8D:8A',
    '8C:F3:19:16:8D:8C',
    '8C:F3:19:16:8D:92',
    '8C:F3:19:16:99:80',
    '8C:F3:19:16:99:88',
    '8C:F3:19:1E:BC:DA',
    '8C:F3:19:1E:BC:DC',
    '8C:F3:19:1E:BC:DE',
    '8C:F3:19:1E:BC:E0',
    '8C:F3:19:1E:BC:E2',
    '8C:F3:19:1E:BC:E4',
    '8C:F3:19:1E:BC:E6',
    '8C:F3:19:1E:BC:E8',
    '8C:F3:19:1E:BC:EA',
    '8C:F3:19:1E:BC:EC',
    '8C:F3:19:1E:BC:EE',
    '8C:F3:19:1E:BC:F0',
    '8C:F3:19:1E:BC:F2',
    '8C:F3:19:1E:BC:F8',
    '8C:F3:19:1E:BC:FA',
    '8C:F3:19:1E:BD:73',
    '8C:F3:19:1E:FD:8E',
    '8C:F3:19:1E:FD:9E',
    '8C:F3:19:1E:FD:A0',
    '8C:F3:19:1E:FE:0D',
    '8C:F3:19:1E:FE:0F',
    '8C:F3:19:1E:FE:11',
    '8C:F3:19:1E:FE:13',
    '8C:F3:19:1E:FE:15',
    '8C:F3:19:1E:FE:17',
    '8C:F3:19:1E:FE:19',
    '8C:F3:19:1E:FE:1B',
    '8C:F3:19:1E:FE:22',
    '8C:F3:19:1E:FE:24',
    '8C:F3:19:1E:FE:27',
    '8C:F3:19:1E:FE:28',
    '8C:F3:19:1E:FE:2A',
    '8C:F3:19:1E:FE:2C',
    '8C:F3:19:1E:FE:2E',
    '8C:F3:19:1E:FE:30',
    '8C:F3:19:1E:FE:32',
    '8C:F3:19:1E:FE:34',
    '8C:F3:19:1E:FE:36',
    '8C:F3:19:1E:FE:38',
    '8C:F3:19:1E:FE:3A',
    '8C:F3:19:1E:FE:3C',
    '8C:F3:19:1E:FE:3E',
    '8C:F3:19:1E:FE:40',
    '8C:F3:19:1E:FE:42',
    '8C:F3:19:1E:FE:44',
    '8C:F3:19:1E:FE:46',
    '8C:F3:19:1E:FE:48',
    '8C:F3:19:1F:2A:A8',
    '8C:F3:19:21:60:CB',
    '8C:F3:19:21:60:CD',
    '8C:F3:19:21:60:CF',
    '8C:F3:19:21:60:EA',
    '8C:F3:19:21:60:EC',
    '8C:F3:19:21:60:F0',
    '8C:F3:19:21:60:F2',
    '8C:F3:19:21:60:F4',
    '8C:F3:19:21:60:F6',
    '8C:F3:19:21:60:F8',
    '8C:F3:19:21:60:FA',
    '8C:F3:19:21:60:FC',
    '8C:F3:19:21:60:FE',
    '8C:F3:19:21:61:04',
    '8C:F3:19:21:61:08',
    '8C:F3:19:21:61:0A',
    '8C:F3:19:21:61:0D',
    '8C:F3:19:21:61:0F',
    '8C:F3:19:21:61:11',
    '8C:F3:19:21:61:17',
    '8C:F3:19:21:61:1B',
    '8C:F3:19:21:61:1F',
    '8C:F3:19:21:61:21',
    '8C:F3:19:21:61:23',
    '8C:F3:19:21:61:25',
    '8C:F3:19:21:61:27',
    '8C:F3:19:21:61:29',
    '8C:F3:19:21:61:2D',
    '8C:F3:19:21:61:2E',
    '8C:F3:19:21:61:37',
    '8C:F3:19:21:61:39',
    '8C:F3:19:21:61:3A',
    '8C:F3:19:21:61:3B',
    '8C:F3:19:21:61:3D',
    '8C:F3:19:21:61:41',
    '8C:F3:19:21:61:43',
    '8C:F3:19:21:61:49',
    '8C:F3:19:21:61:4B',
    '8C:F3:19:21:61:4F',
    '8C:F3:19:21:61:51',
    '8C:F3:19:21:61:53',
    '8C:F3:19:21:61:61',
    '8C:F3:19:21:61:63',
    '8C:F3:19:21:61:65',
    '8C:F3:19:21:61:67',
    '8C:F3:19:2D:8A:2E',
    '8C:F3:19:35:86:D3',
    '8C:F3:19:39:5E:14',
    '8C:F3:19:3A:0A:33',
    '8C:F3:19:3A:0A:60',
    '8C:F3:19:3A:0A:7A',
    '8C:F3:19:3A:0A:7C',
    '8C:F3:19:3A:0A:84',
    '8C:F3:19:3A:0A:AA',
    '8C:F3:19:68:AB:B0',
    '8C:F3:19:6B:17:03',
    '8C:F3:19:6B:17:14',
    '8C:F3:19:6B:17:1E',
    '8C:F3:19:6B:17:2E',
    '8C:F3:19:6B:17:30',
    '8C:F3:19:6B:17:34',
    '8C:F3:19:6B:17:36',
    '8C:F3:19:6B:17:38',
    '8C:F3:19:6B:17:44',
    '8C:F3:19:6B:17:52',
    '8C:F3:19:6B:17:54',
    '8C:F3:19:6B:17:6E',
    '8C:F3:19:6B:17:70',
    '8C:F3:19:6B:17:78',
    '8C:F3:19:6B:17:86',
    '8C:F3:19:6B:17:8E',
    '8C:F3:19:6B:7A:E4',
    '8C:F3:19:6B:C4:75',
    '8C:F3:19:6B:C4:85',
    '8C:F3:19:6B:C4:87',
    '8C:F3:19:6B:C4:A1',
    '8C:F3:19:6B:C4:A3',
    '8C:F3:19:6B:C4:AB',
    '8C:F3:19:6B:C4:AD',
    '8C:F3:19:6C:48:4B',
    '8C:F3:19:6C:48:50',
    '8C:F3:19:6C:48:8A',
    '8C:F3:19:6C:48:E6',
    '8C:F3:19:6C:48:FE',
    '8C:F3:19:6C:87:34',
    '8C:F3:19:6C:A4:02',
    '8C:F3:19:6C:A5:26',
    '8C:F3:19:6C:E9:C1',
    '8C:F3:19:6C:EE:1F',
    '8C:F3:19:6C:EE:3D',
    '8C:F3:19:6C:EE:41',
    '8C:F3:19:6C:EE:43',
    '8C:F3:19:6C:EE:45',
    '8C:F3:19:6C:EE:4D',
    '8C:F3:19:6C:EE:5B',
    '8C:F3:19:70:CA:61',
    '8C:F3:19:70:CA:6D',
    '8C:F3:19:70:CA:7B',
    '8C:F3:19:70:CA:90',
    '8C:F3:19:70:CA:96',
    '8C:F3:19:70:CA:98',
    '8C:F3:19:70:CA:9A',
    '8C:F3:19:70:CA:9E',
    '8C:F3:19:70:CA:A2',
    '8C:F3:19:70:CA:A6',
    '8C:F3:19:70:CA:A8',
    '8C:F3:19:70:CA:AA',
    '8C:F3:19:70:CA:AE',
    '8C:F3:19:70:CA:B0',
    '8C:F3:19:70:CA:B2',
    '8C:F3:19:70:CA:B4',
    '8C:F3:19:70:CA:B8',
    '8C:F3:19:70:CA:BC',
    '8C:F3:19:70:CA:BE',
    '8C:F3:19:70:CA:C0',
    '8C:F3:19:70:CA:C2',
    '8C:F3:19:70:CA:C6',
    '8C:F3:19:70:CA:C8',
    '8C:F3:19:70:CA:CA',
    '8C:F3:19:70:CA:CC',
    '8C:F3:19:70:CA:D5',
    '8C:F3:19:70:CA:E9',
    '8C:F3:19:70:CA:EB',
    '8C:F3:19:70:CA:ED',
    '8C:F3:19:70:CA:F5',
    '8C:F3:19:70:CA:F7',
    '8C:F3:19:70:CA:F9',
    '8C:F3:19:70:CA:FF',
    '8C:F3:19:70:CB:09',
    '8C:F3:19:70:CB:11',
    '8C:F3:19:70:CB:17',
    '8C:F3:19:70:CB:21',
    '8C:F3:19:70:CB:F0',
    '8C:F3:19:70:CC:07',
    '8C:F3:19:70:CC:0B',
    '8C:F3:19:71:44:DF',
    '8C:F3:19:71:44:E1',
    '8C:F3:19:71:44:EB',
    '8C:F3:19:71:44:F1',
    'E0:DC:A0:B9:D8:C7',
    'E0:DC:A0:D7:2F:08',
    'E0:DC:A0:FA:6F:35',
    // Cem and 4 new from Mr. Herrmann
    '8C:F3:19:7F:8E:86',
    '8C:F3:19:7F:DA:F1',
    '8C:F3:19:71:99:56',
    '8C:F3:19:71:98:F4',
    '8C:F3:19:71:99:5A'
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
    if (this._isLicensed !== null) {
      winston.info(`${logPrefix} already initialized`);
      return Promise.resolve();
    }

    //duplicate detection
    const dups = this.#macList.filter(
      (item, index, arr) => arr.indexOf(item) !== index
    );
    if (dups.length > 0) {
      winston.warn(`${logPrefix} duplicated MAC addresses detected: ${dups}`);
    }

    //invalid detection
    const invalid = this.#macList.filter(
      (item, index) => !/(([0-9A-F]{2}:){5}[0-9-A-F]{2})/.test(item)
    );
    if (invalid.length > 0) {
      winston.warn(`${logPrefix} invalid MAC addresses detected: ${invalid}`);
    }

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
