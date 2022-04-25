import { System } from "../System";

export class LicenseCheck {
    #macList = [];
    #system = new System();

    public async checkLicense(): Promise<true> {
        const logPrefix = `${this.constructor.name}::checkMAC`;
        const mac = await this.#system.readMacAddress('eth0');
        if(!this.#macList.includes(mac)) {
            throw {msg: `${logPrefix} License is not valid! Please contact support.`, code: 'LICENSE_CHECK_FAILED'};
        }
        return true;
    }
}