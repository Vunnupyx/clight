import { Client, Message, Twin } from 'azure-iot-device';
import { MqttWs as iotHubTransport } from 'azure-iot-device-mqtt';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import { AmqpWs as ProvTransport } from 'azure-iot-provisioning-device-amqp';
import { parse } from 'url';
import {
  RegistrationClient,
  RegistrationResult
} from 'azure-iot-provisioning-device/dist/interfaces';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { createHmac } from 'crypto';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import TypedEmitter from 'typed-emitter';
import winston from 'winston';
import { NorthBoundError } from '../../../../common/errors';
import {
  IDataHubConfig,
  TDataHubDataPointType
} from '../../../ConfigManager/interfaces';
import { TGroupedMeasurements } from '../../DataSinks/DataHubDataSink';

type TConnectionString =
  `HostName=${string};DeviceId=${string};SharedAccessKey=${string}`;

interface DataHubAdapterOptions extends IDataHubConfig {}

interface IDesiredProps {
  services: {
    [serviceName: string]: {
      enabled: boolean;
      [additionalParameter: string]: any;
    };
  };
}

function isDesiredProps(obj: any): obj is IDesiredProps {
  return 'services' in obj && Object.keys(obj.services).length > 0;
}
export class DataHubAdapter {
  static readonly #className: string = DataHubAdapter.name;
  private isRunning: boolean = false;
  #initialized: boolean = false;
  #proxyConfig: DataHubAdapterOptions['proxy'];
  #proxy: HttpsProxyAgent | SocksProxyAgent;

  // Provisioning
  #registrationId: string;
  #symKey: string;
  #groupDeviceKey: string = null;
  #dpsServiceAddress: string;
  #scopeId: string;
  #isGroupRegistration: boolean;
  #provClient: RegistrationClient;
  #provGroupClient: RegistrationClient;
  #provSecClient: SymmetricKeySecurityClient;
  #symKeyProvTransport: ProvTransport;

  // Datahub and Twin
  #connectionSting: TConnectionString = null;
  #dataHubClient: Client;
  #deviceTwin: Twin;
  #probeBuffer: MessageBuffer;
  #telemetryBuffer: MessageBuffer;
  #serialNumber: string;
  #firstMeasurement = true;
  #probeSendInterval: number;
  #telemetrySendInterval: number;
  #runningTimers: Array<NodeJS.Timer> = [];

  public constructor(options: DataHubAdapterOptions) {
    if (
      !options.dataPointTypesData.probe.intervalHours ||
      !options.dataPointTypesData.telemetry.intervalHours
    ) {
      throw new NorthBoundError(
        `${
          DataHubAdapter.#className
        } can not build instance. No send interval available`
      );
    }
    this.#probeSendInterval = this.hoursToMs(
      options.dataPointTypesData.probe.intervalHours
    );
    this.#telemetrySendInterval = this.hoursToMs(
      options.dataPointTypesData.telemetry.intervalHours
    );
    this.#dpsServiceAddress = options.provisioningHost;
    this.#registrationId = options.regId;
    this.#symKey = options.symKey;
    this.#scopeId = options.scopeId;
    this.#isGroupRegistration = options.groupDevice || false;
    this.#proxyConfig = options.proxy || null;
    this.#serialNumber = options.serialNumber;
  }

  public get running(): boolean {
    return this.isRunning;
  }

  /**
   * Get desired properties object by device twin.
   */
  public getDesiredProps(): IDesiredProps {
    const logPrefix = `${DataHubAdapter.#className}::getDesiredProps`;
    if (!this.#deviceTwin) {
      winston.warn(`${logPrefix} no device twin available.`);
      return;
    }
    if (!isDesiredProps(this.#deviceTwin.properties.desired)) {
      throw new NorthBoundError(`${logPrefix} no desired properties found.`);
    }
    return this.#deviceTwin.properties.desired;
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
            `${logPrefix} proxy config detected. Building ${
              this.#proxyConfig.type
            } proxy object.`
          );
          this.#proxy = this.getProxyAgent();
        }
        if (this.#isGroupRegistration) {
          this.#groupDeviceKey = this.generateSymKeyForGroupDevice();
        }
      })
      .then(() => this.startProvisioning())
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
   * Start the provisioning process for this device
   */
  private startProvisioning(): Promise<void> {
    this.#provSecClient = new SymmetricKeySecurityClient(
      this.#registrationId,
      this.#groupDeviceKey || this.#symKey
    );
    this.#symKeyProvTransport = new ProvTransport();
    if (this.#proxy) {
      this.#symKeyProvTransport.setTransportOptions({
        webSocketAgent: this.#proxy
      });
    }
    this.#provClient = ProvisioningDeviceClient.create(
      this.#dpsServiceAddress,
      this.#scopeId,
      this.#symKeyProvTransport,
      this.#provSecClient
    );

    return this.getProvisioning();
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
    this.createDatahubClient();

    return this.#dataHubClient
      .on('error', (...args) =>
        winston.error(`DatahubClient error due to ${JSON.stringify(args)}`)
      )
      .open()
      .then((result) => {
        this.isRunning = result ? true : false;
        return this.#dataHubClient.getTwin();
      })
      .then((twin) => {
        this.#deviceTwin = twin;
        twin.on('properties.desired.services', () => {
          winston.debug(`${logPrefix} got services update.`);
        });
        this.#runningTimers.push(
          setInterval(() => {
            this.sendMessage('probe');
          }, this.#probeSendInterval)
        );
        this.#runningTimers.push(
          setInterval(() => {
            this.sendMessage('telemetry');
          }, this.#telemetrySendInterval)
        );
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
   * Create DataHubClient instance and add proxy if required.
   * Instance is available via this.#dataHubClient
   */
  private createDatahubClient(): void {
    this.#dataHubClient = Client.fromConnectionString(
      this.#connectionSting,
      iotHubTransport
    );
    if (this.#proxy) {
      this.#dataHubClient.setOptions({
        mqtt: { webSocketAgent: this.#proxy }
      });
    }
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
    this.#runningTimers.forEach((timer) => clearInterval(timer));
    this.#dataHubClient
      .close()
      .then(() => {
        Object.keys(this).forEach((key) => {
          delete this[key];
        });
        winston.info(`${logPrefix} successfully stopped adapter.`);
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
   * Helper function for converting hours into milliseconds
   */
  private hoursToMs(hours: number): number {
    return hours * 60 * 60 * 1000;
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

  private getProxyAgent(): HttpsProxyAgent | SocksProxyAgent {
    switch (this.#proxyConfig.type) {
      case 'http': {
        return new HttpsProxyAgent(
          parse(`http://${this.#proxyConfig.ip}:${this.#proxyConfig.port}`)
        );
      }
      case 'socks5': {
        const { username, password, ip, port } = this.#proxyConfig;
        return new SocksProxyAgent({
          host: ip,
          port,
          username,
          password,
          type: 5
        });
      }
    }
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
      this.#groupDeviceKey || this.#symKey
    );
  }

  /**
   * Generate a connection string.
   */
  private generateConnectionString(
    assignedHub: string,
    deviceId: string,
    key: string
  ): TConnectionString {
    return `HostName=${assignedHub};DeviceId=${deviceId};SharedAccessKey=${key}`;
  }

  /**
   * Send a key value pair.
   */
  public sendData(groupedMeasurements: TGroupedMeasurements): void {
    const logPrefix = `${DataHubAdapter.#className}::sendData`;

    for (const [group, measurementArray] of Object.entries(
      groupedMeasurements
    )) {
      // TODO: why object.entries infer string instead real strings?
      let buffer: MessageBuffer;
      switch (group as TDataHubDataPointType) {
        case 'event': {
          const eventBuffer = new MessageBuffer(this.#serialNumber);
          eventBuffer.addAssetList(measurementArray);
          const msg = this.addMsgType('event', eventBuffer.getMessage());
          this.#dataHubClient.sendEvent(msg, () => {
            winston.debug(`${logPrefix} send event data`);
          });
          continue;
        }
        case 'telemetry': {
          buffer = this.#telemetryBuffer;
          break;
        }
        case 'probe': {
          buffer = this.#probeBuffer;
          break;
        }
        default: {
          winston.error(
            `${logPrefix} received data with invalid datapoint type`
          );
          continue;
        }
      }
      buffer = new MessageBuffer(this.#serialNumber);
      buffer.addAssetList(measurementArray);
    }
    if (this.#firstMeasurement) {
      this.sendMessage('probe');
      this.sendMessage('telemetry');
      this.#firstMeasurement = false;
    }
  }

  private sendMessage(msgType: Exclude<TDataHubDataPointType, 'event'>): void {
    const logPrefix = `${DataHubAdapter.#className}::sendMessage`;
    if (!this.#dataHubClient || !this.isRunning) {
      winston.error(
        `${logPrefix} try to send event to datahub on not running adapter.`
      );
      return;
    }
    const buffer =
      msgType === 'telemetry' ? this.#telemetryBuffer : this.#probeBuffer;
    if (!buffer) {
      winston.warn(
        `${logPrefix} try to send data but no data buffer available`
      );
      return;
    }
    const msg = this.addMsgType(msgType, buffer.getMessage());
    this.#dataHubClient.sendEvent(msg, () => {
      winston.debug(`${logPrefix} send ${msgType} message`);
    });
  }

  /**
   * Add messageType property to message object to distinguish between types
   */
  private addMsgType(type: TDataHubDataPointType, msg: Message): Message {
    msg.properties.add('messageType', type);
    return msg;
  }
}

/**
 * Structure of asset data by DMG. For probes and telemetry data
 */
interface IAssetData {
  ts: string;
  k: string;
  v: boolean | number | string;
}

interface IMessageFormat {
  serialNumber: string;
  startDate: string;
  endDate: string;
  assetData: Array<IAssetData>;
}

/**
 * Representation of a object buffer with a creation timestamp and a full timestamp.
 */
class MessageBuffer {
  #startDate = new Date().toISOString();
  #assetBuffer: IAssetData[] = [];

  constructor(private serialNumber: string) {}

  /**
   * Add a iterable array of asset datasets to the buffer.
   */
  public addAssetList(assets: Array<{ [address: string]: any }>): void {
    assets.forEach((obj) => {
      this.#assetBuffer.push(
        this.generateAssetData(Object.keys(obj)[0], obj.address)
      );
    });
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
   * Get sendable message object.
   */
  public getMessage(): Message {
    return new Message(JSON.stringify(this.getCurrentMsg()));
  }
}
