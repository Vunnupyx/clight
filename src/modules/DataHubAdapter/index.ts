import { Client, Twin, Message } from 'azure-iot-device';
import { MqttWs as iotHubTransport } from 'azure-iot-device-mqtt';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import { Mqtt as MqttTransport } from 'azure-iot-provisioning-device-mqtt';
import {
  RegistrationClient,
  RegistrationResult
} from 'azure-iot-provisioning-device/dist/interfaces';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { createHmac } from 'crypto';
import winston from 'winston';
import { NorthBoundError } from '../../common/errors';
import {
  IHttpsProxyConfig,
  ISocksProxyConfig
} from '../ConfigManager/interfaces';

type TConnectionString =
  `HostName=${string};DeviceId=${string};SharedAccessKey=${string}`;

interface DataHubAdapterOptions {
  dpsHost: string;
  scopeId: string;
  regId: string;
  symKey: string;
  group?: boolean;
  proxy?: IHttpsProxyConfig | ISocksProxyConfig;
}

export class DataHubAdapter {
  static readonly #className: string = DataHubAdapter.name;
  private isRunning: boolean = false;
  #initialized: boolean = false;
  #proxyConfig: DataHubAdapterOptions['proxy'];
  #proxy: HttpsProxyAgent; // TODO: Add Socks proxy module

  // Provisioning
  #registrationId: string;
  #symKey: string;
  #dpsServiceAddress: string;
  #scopeId: string;
  #isGroupRegistration: boolean;
  #provClient: RegistrationClient;
  #provGroupClient: RegistrationClient;
  #provSecClient: SymmetricKeySecurityClient;
  #symKeyProvTransport: MqttTransport;

  // Datahub and Twin
  #connectionSting: TConnectionString = null;
  #dataHubClient: Client;
  #deviceTwin: Twin;
  #dataBuffer: Array<Array<any>> = []; // TODO:
  #dataBufferThresholdBytes: 150; //TODO:
  #desiredProps: { [key: string]: any };

  public constructor(options: DataHubAdapterOptions) {
    this.#dpsServiceAddress = options.dpsHost;
    this.#registrationId = options.regId;
    this.#symKey = options.symKey;
    this.#scopeId = options.scopeId;
    this.#isGroupRegistration = options.group || false;
    this.#proxyConfig = options.proxy || null;
  }

  public get running(): boolean {
    return this.isRunning;
  }

  /**
   * Initialize the DataHubAdapter and get provisioning for the device.
   */
  public init(): Promise<DataHubAdapter> {
    const logPrefix = `${DataHubAdapter.#className}::init`;
    return Promise.resolve()
      .then(() => {
        winston.debug(`${logPrefix} initializing.`);
        if (this.#proxyConfig) {
          winston.debug(
            `${logPrefix} proxy config detected. Building proxy object.`
          );
          this.#proxy = new HttpsProxyAgent(this.#proxyConfig.ip);
        }
        this.#provSecClient = new SymmetricKeySecurityClient(
          this.#registrationId,
          this.#isGroupRegistration
            ? this.generateSymKeyForGroupDevice()
            : this.#symKey
        );
      })
      .then(() => {
        this.#symKeyProvTransport = new MqttTransport();
        this.#symKeyProvTransport.setTransportOptions({
          webSocketAgent: this.#proxy
        });
      })
      .then(() => {
        this.#provClient = ProvisioningDeviceClient.create(
          this.#dpsServiceAddress,
          this.#scopeId,
          this.#symKeyProvTransport,
          this.#provSecClient
        );
      })
      .then(() => this.getProvisioning())
      .then(() => {
        this.#initialized = true;
        winston.debug(`${logPrefix} initialized. Registered to DPS`);
        return this;
      })
      .catch((err) => {
        return Promise.reject(
          new NorthBoundError(
            `${logPrefix} error due to ${JSON.stringify(err)}`
          )
        );
      });
  }

  /**
   * Start adapter by building a iot hub client.
   */
  public start(): Promise<void> {
    const logPrefix = `${DataHubAdapter.#className}::start`;
    if (!this.#initialized || !this.#connectionSting)
      return Promise.reject(
        new NorthBoundError(`${logPrefix} try to start uninitialized adapter.`)
      );
    if (this.isRunning) {
      winston.debug(
        `${logPrefix} try to start a already started adapter. Please remove unnecessary invoke of start().`
      );
      return Promise.resolve();
    }
    this.#dataHubClient = Client.fromConnectionString(
      this.#connectionSting,
      iotHubTransport
    );
    if (this.#proxy) {
      this.#dataHubClient.setTransportOptions({
        mqtt: { webSocketAgent: this.#proxy }
      });
    }
    return this.#dataHubClient
      .getTwin()
      .then((twin) => {
        this.#deviceTwin = twin;
        // this.registerTwinHandlers();
        this.isRunning = true;
        winston.info(`${logPrefix} successful. Adapter ready to send data.`);
      })
      .catch((err) => {
        return Promise.reject(
          new NorthBoundError(
            `${logPrefix} error due to ${JSON.stringify(err)}`
          )
        );
      });
  }

  /**
   * Stop adapter and set running status.
   */
  public stop(): void {
    const logPrefix = `${DataHubAdapter.#className}::stop`;
    if (!this.isRunning) {
      winston.debug(`${logPrefix} try to stop a not running adapter.`);
      return;
    }
    this.isRunning = false;
    this.#dataHubClient = null;
    winston.info(`${logPrefix} successfully stopped adapter.`);
  }

  /**
   * Send provisioning request to device provisioning service.
   */
  private getProvisioning(): Promise<void> {
    const logPrefix = `${DataHubAdapter.#className}::getProvisioning`;
    return new Promise((res, rej) => {
      this.#provClient.register(async (err, response) => {
        try {
          this.registrationHandler(err, response);
          res();
        } catch (err) {
          rej(
            new NorthBoundError(
              `${logPrefix} error due to ${JSON.stringify(err)}`
            )
          );
        }
      });
    });
  }

  /**
   * Generate a symmetric key for a specific registrationId.
   * ATTENTION: Only called in group mode set by constructor options.
   */
  private generateSymKeyForGroupDevice() {
    return createHmac('SHA256', Buffer.from(this.#symKey, 'base64'))
      .update(this.#registrationId, 'utf8')
      .digest('base64');
  }

  /**
   * Handler for registration requests.
   */
  private registrationHandler(error: Error, res: RegistrationResult): void {
    const logPrefix = `${DataHubAdapter.#className}::registrationHandler`;
    if (error)
      throw new NorthBoundError(
        `${logPrefix} error due to ${JSON.stringify(error)}`
      );
    winston.debug(
      `${logPrefix} successfully got provisioning information: \n ${JSON.stringify(
        res,
        null,
        2
      )}`
    );
    this.#connectionSting = this.generateConnectionString(
      res.assignedHub,
      res.deviceId,
      this.#symKey
    );
  }

  /**
   * Generate a connection string.
   */
  private generateConnectionString(
    assignedHub: string,
    deviceId: string,
    sharedKey: string
  ): TConnectionString {
    return `HostName=${assignedHub};DeviceId=${deviceId};SharedAccessKey=${sharedKey}`;
  }

  private registerTwinHandlers(): void {
    const logPrefix = `${DataHubAdapter.#className}::registerTwinHandlers`;
    if (!this.#deviceTwin) {
      throw new NorthBoundError(`${logPrefix} error due to no twin found.`);
    }
    //TODO:
    // this.desired
    [].forEach((des) => {
      this.#deviceTwin.on(`properties.desire.${des}`, () => {});
    });
  }
  private generateMsgFromBuffer(): Message {
    return new Message(
      JSON.stringify({ deviceId: this.#registrationId, data: this.#dataBuffer })
    );
  }

  public sendData(data: { [key: string]: any }[]): void {
    this.#dataBuffer.push(data);
    if (!(this.calcBufferSize() >= this.#dataBufferThresholdBytes)) return;
    const msg = this.generateMsgFromBuffer();
    this.#dataHubClient.sendEvent(msg);
  }

  /**
   * Return buffer size in bytes
   */
  private calcBufferSize(): number {
    return Buffer.from(JSON.stringify(this.#dataBuffer), 'utf-8').byteLength;
  }

  /*
  "desired": {
            "telemetryConfig": {
                "sendFrequency": "5m"
            },
            */
  private sendDesiredProps(): void {
    Object.entries(this.#deviceTwin.properties.desired).forEach(
      ([key, value]) => {
        this.#deviceTwin.properties.reported[key] = value;
      }
    );
  }
}
