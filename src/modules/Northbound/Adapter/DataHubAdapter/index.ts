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
import { NorthBoundError } from '../../../../common/errors';
import { IDataHubConfig } from '../../../ConfigManager/interfaces';

type TConnectionString =
  `HostName=${string};DeviceId=${string};SharedAccessKey=${string}`;

interface DataHubAdapterOptions extends IDataHubConfig {}

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
  #dataBufferThresholdBytes = 500; //TODO: what is a good buffer size?
  //TODO: add serial number and buffer size from config
  #dataBuffer: MessageBuffer;
  #desiredProps: { [key: string]: any };

  public constructor(options: DataHubAdapterOptions) {
    this.#dpsServiceAddress = options.provisioningHost;
    this.#registrationId = options.regId;
    this.#symKey = options.symKey;
    this.#scopeId = options.scopeId;
    this.#isGroupRegistration = options.groupDevice || false;
    this.#proxyConfig = options.proxy || null;
    this.#dataBufferThresholdBytes =
      options.minMsgSize || this.#dataBufferThresholdBytes;
    this.#dataBuffer = new MessageBuffer(
      options.serialNumber,
      this.#dataBufferThresholdBytes
    );
    this.#dataBuffer.once('full', this.bufferFullHandler.bind(this));
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
  public stop(): Promise<void> {
    const logPrefix = `${DataHubAdapter.#className}::stop`;
    if (!this.isRunning) {
      winston.debug(`${logPrefix} try to stop a not running adapter.`);
      return;
    }
    this.isRunning = false;
    this.#dataHubClient.close()
      .then( () => {
        Object.keys(this).forEach((key) => {
          delete(this[key]);
        });
        winston.info(`${logPrefix} successfully stopped adapter.`);
    })
    .catch((err) => {
      return Promise.reject(new NorthBoundError(`${logPrefix} error due to ${JSON.stringify(err)}`));
    })
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

  /**
   * Send a key value pair.
   */
  public sendData(key: string, value: any): void {
    this.#dataBuffer.addAsset(key, value);
  }

  /**
   * Handles to full event of the current Message Buffer
   */
  private bufferFullHandler(
    sendable: Message,
    newMessageBuffer: MessageBuffer,
    remainingData?: Array<{ key: string; value: any }>
  ) {
    if (!this.#dataHubClient) {
      winston.warn(
        `No datahub connection available. No send retry is implemented. Data lost!!!!`
      );
      return;
    }
    this.#dataBuffer = newMessageBuffer;
    this.#dataBuffer.once('full', this.bufferFullHandler.bind(this));
    //TODO: add send callback
    if (sendable) {
      sendable.contentType = 'application/json';
      sendable.contentEncoding = 'utf-8';
      this.#dataHubClient.sendEvent(
        sendable,
        this.sendEventCallback.bind(this)
      );
    }
    if (remainingData) this.#dataBuffer.addAssetList(remainingData);
  }

  /**
   * TODO: Handle result of sending data to datahub
   */
  private sendEventCallback(error: any, result: any) {
    winston.debug(`NOT IMPLEMENTED`);
    winston.debug(error);
    winston.debug(result);
  }
}

/**
 * Structure of asset data by DMG.
 */
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

/**
 * Representation of a object buffer with a creation timestamp and a full timestamp.
 * Emit full event if buffer is full and also emits the sendable buffer data and a new empty buffer object.
 * ATTENTION:
 *  Implementation is threshold buffer implementation -> emitted sendable object >= bufferSizeBytes !
 *  Maybe a buffer size limit is needed here. please adapt implementation
 */
class MessageBuffer extends (EventEmitter as new () => TypedEmitter<IMessageBufferEvents>) {
  #startDate = new Date().toISOString();
  #assetBuffer: IAssetData[] = [];

  constructor(private serialNumber: string, private bufferSizeBytes: number) {
    super();
  }

  /**
   * Add a single asset dataset to the buffer.
   */
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

  /**
   * Add a iterable array of asset datasets to the buffer.
   */
  public addAssetList(
    assets: Array<{ key: string; value: IAssetData['v'] }>
  ): void {
    for (const [index, asset] of assets.entries()) {
      this.#assetBuffer.push(this.generateAssetData(asset.key, asset.value));
      const currentMsg = this.getCurrentMsg();
      if (this.calcSize(currentMsg) >= this.bufferSizeBytes) {
        this.emitFullEvent(assets.slice(index + 1));
        return;
      }
    }
  }

  /**
   * Generate a object of type IAssetData and automatically add timestamp.
   */
  private generateAssetData<valueType extends IAssetData['v']>(
    key: string,
    value: valueType
  ): IAssetData {
    return {
      ts: new Date().toISOString(),
      k: key,
      v: value
    };
  }

  /**
   * Return the current object representation.
   */
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

  /**
   * Help function for emitting of full event. Generates all necessary data.
   */
  private emitFullEvent(
    remainingAssets?: Array<{ key: string; value: IAssetData['v'] }>
  ): void {
    this.emit(
      'full',
      new Message(JSON.stringify(this.getCurrentMsg())),
      new MessageBuffer(this.serialNumber, this.bufferSizeBytes),
      remainingAssets
    );
  }
}
