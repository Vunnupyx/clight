import { Client, Message, Twin } from 'azure-iot-device';
import { MqttWs as iotHubTransport } from 'azure-iot-device-mqtt';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import { Mqtt as MqttTransport } from 'azure-iot-provisioning-device-mqtt';
import {
  RegistrationClient,
  RegistrationResult
} from 'azure-iot-provisioning-device/dist/interfaces';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { createHmac } from 'crypto';
import EventEmitter from 'events';
import { HttpsProxyAgent } from 'https-proxy-agent';
import TypedEmitter from 'typed-emitter';
import winston from 'winston';
import { NorthBoundError } from '../../common/errors';
import {
  IHttpsProxyConfig,
  ISocksProxyConfig
} from '../ConfigManager/interfaces';
('events');

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
  #dataBufferThresholdBytes = 150; //TODO:
  //TODO: add serial number and buffer size from config
  #dataBuffer = new MessageBuffer(
    'DUMMYNUMBER',
    this.#dataBufferThresholdBytes
  );
  #desiredProps: { [key: string]: any };

  public constructor(options: DataHubAdapterOptions) {
    this.#dpsServiceAddress = options.dpsHost;
    this.#registrationId = options.regId;
    this.#symKey = options.symKey;
    this.#scopeId = options.scopeId;
    this.#isGroupRegistration = options.group || false;
    this.#proxyConfig = options.proxy || null;
    this.#dataBuffer.on('full', this.bufferFullHandler.bind(this));
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
        if (this.#proxyConfig) {
          this.#symKeyProvTransport.setTransportOptions({
            webSocketAgent: this.#proxy
          });
        }
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

  // private registerTwinHandlers(): void {
  //   const logPrefix = `${DataHubAdapter.#className}::registerTwinHandlers`;
  //   if (!this.#deviceTwin) {
  //     throw new NorthBoundError(`${logPrefix} error due to no twin found.`);
  //   }
  //   //TODO:
  //   // this.desired
  //   [].forEach((des) => {
  //     this.#deviceTwin.on(`properties.desire.${des}`, () => {});
  //   });
  // }

  public sendData(key: string, value: any): void {
    this.#dataBuffer.addAsset(key, value);
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

  private bufferFullHandler(
    sendable: Message,
    newMessageBuffer: MessageBuffer,
    remainingData?: Array<{ key: string; value: any }>
  ) {
    if (!this.#dataHubClient) {
      winston.warn(
        `No datahub connection available. No send retry is implemented. Data is lost!!!!`
      );
      return;
    }
    this.#dataBuffer = newMessageBuffer;
    this.#dataBuffer.on('full', this.bufferFullHandler.bind(this));
    if (remainingData) this.#dataBuffer.addAssetList(remainingData);
    //TODO: add send callback
    if (sendable)
      this.#dataHubClient.sendEvent(sendable, this.sendEventHandler.bind(this));
  }

  private sendEventHandler(error: any, result: any) {
    winston.debug(`NOT IMPLEMENTED`);
    winston.debug(error);
    winston.debug(result);
  }
}

interface IAssetData {
  ts: string;
  k: string;
  v: boolean | number | string;
}

interface IMessageBufferEvents {
  full: (
    sendableMsg: Message,
    newMsgBuffer: MessageBuffer,
    remainingAssets: Array<{ key: string; value: IAssetData['v'] }>
  ) => void;
}

interface IMessageFormat {
  serialNumber: string;
  startDate: string;
  endDate: string;
  assetData: Array<IAssetData>;
}

class MessageBuffer extends (EventEmitter as new () => TypedEmitter<IMessageBufferEvents>) {
  #startDate = new Date().toISOString();
  #assetBuffer: IAssetData[] = [];

  constructor(private serialNumber: string, private bufferSizeBytes: number) {
    super();
  }

  public addAsset<valueType extends IAssetData['v']>(
    key: string,
    value: valueType
  ): void {
    this.#assetBuffer.push(this.generateAssetData(key, value));
    const currentMsg = this.getCurrentMsg();
    if (this.calcSize(currentMsg) >= this.bufferSizeBytes) {
      this.emitFullEvent();
    }
  }

  public addAssetList(
    assets: Array<{ key: string; value: IAssetData['v'] }>
  ): void {
    for (const [index, asset] of assets.entries()) {
      this.#assetBuffer.push(this.generateAssetData(asset.key, asset.value));
      const currentMsg = this.getCurrentMsg();
      if (this.calcSize(currentMsg) >= this.bufferSizeBytes) {
        const newMessageBuffer = new MessageBuffer(
          this.serialNumber,
          this.bufferSizeBytes
        );
        this.emitFullEvent(newMessageBuffer, assets.slice(index + 1));
        return;
      }
    }
  }

  private generateAssetData<valueType extends IAssetData['v']>(
    key: string,
    value: valueType
  ): { ts: string; k: string; v: valueType } {
    return {
      ts: new Date().toISOString(),
      k: key,
      v: value
    };
  }

  private getCurrentMsg(): IMessageFormat {
    return {
      serialNumber: this.serialNumber,
      startDate: this.#startDate,
      endDate: new Date().toISOString(),
      assetData: this.#assetBuffer
    };
  }

  /**
   * Return buffer size in bytes
   */
  private calcSize(obj: any): number {
    return Buffer.from(JSON.stringify(obj), 'utf-8').byteLength;
  }

  private emitFullEvent(
    newMessageBuffer?: MessageBuffer,
    remainingAssets?: Array<{ key: string; value: IAssetData['v'] }>
  ): void {
    this.emit(
      'full',
      new Message(JSON.stringify(this.getCurrentMsg())),
      newMessageBuffer ||
        new MessageBuffer(this.serialNumber, this.bufferSizeBytes),
      remainingAssets
    );
  }
}
