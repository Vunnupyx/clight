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
import winston from 'winston';
import { AdapterError, NorthBoundError } from '../../../../common/errors';
import {
  IDataHubConfig,
  IDataHubSettings,
  IProxyConfig,
  TDataHubDataPointType
} from '../../../ConfigManager/interfaces';
import {
  TGroupedMeasurements,
  IMeasurement
} from '../../DataSinks/DataHubDataSink';
import { LifecycleEventStatus } from '../../../../common/interfaces';
import { System } from '../../../System';

type TConnectionString =
  `HostName=${string};DeviceId=${string};SharedAccessKey=${string}`;

interface DataHubAdapterOptions extends IDataHubConfig {
  proxy?: IProxyConfig;
}

interface IDesiredServices {
  [serviceName: string]: {
    enabled: boolean;
    [additionalParameter: string]: any;
  };
}

export interface IDesiredProps {
  services: IDesiredServices;
}

function isDesiredProps(obj: any): obj is IDesiredProps {
  return 'services' in obj && Object.keys(obj.services).length > 0;
}
export class DataHubAdapter {
  static readonly #className: string = DataHubAdapter.name;
  private isRunning: boolean = false;
  private deviceTwinChanged = true;
  private onStateChange: (state: LifecycleEventStatus) => void;

  #initialized: boolean = false;
  #successfullyProvisioned: boolean = false;
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
  private provTimer: NodeJS.Timer = null;

  lastSentEventValues: { [key: string]: boolean | number | string } = {};

  /**
   *
   * @param options Static options defined inside the runtime config
   * @param settings Dynamic options defined inside the config and editable via the ui
   */
  public constructor(
    staticOptions: DataHubAdapterOptions,
    dynamicOptions: IDataHubSettings,
    onStateChange: (state: LifecycleEventStatus) => void = (state) => {}
  ) {
    if (
      !staticOptions.dataPointTypesData.probe.intervalHours ||
      !staticOptions.dataPointTypesData.telemetry.intervalHours
    ) {
      throw new NorthBoundError(
        `${
          DataHubAdapter.#className
        } can not build instance. No send interval available`
      );
    }
    this.#probeSendInterval = this.hoursToMs(
      staticOptions.dataPointTypesData.probe.intervalHours
    );
    this.#telemetrySendInterval = this.hoursToMs(
      staticOptions.dataPointTypesData.telemetry.intervalHours
    );
    this.#dpsServiceAddress = dynamicOptions?.provisioningHost || '';
    this.#registrationId = dynamicOptions?.regId || '';
    this.#symKey = dynamicOptions?.symKey || '';
    this.#scopeId = dynamicOptions?.scopeId || '';
    this.#isGroupRegistration = staticOptions.groupDevice || false;
    this.#proxyConfig = staticOptions.proxy || null;

    this.onStateChange = onStateChange;
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
      winston.warn(`${logPrefix} no desired properties found.`);
      return;
    }

    return this.#deviceTwin.properties.desired;
  }

  /**
   * Set reported properties on device twin.
   */
  public async setReportedProps(data: IDesiredServices): Promise<void> {
    return new Promise((res, rej) => {
      const logPrefix = `${DataHubAdapter.#className}::setDesiredProps`;
      if (!this.#deviceTwin) {
        winston.warn(`${logPrefix} no device twin available.`);
        return;
      }

      winston.info('Updating reported properties');
      this.#deviceTwin.properties.reported.update({ services: data }, (err) => {
        if (err) winston.error(`${logPrefix} error due to ${err.message}`);
        else this.deviceTwinChanged = false;
        res();
      });
    });
  }

  /**
   * Initialize the DataHubAdapter and get provisioning for the device.
   */
  public async init(): Promise<DataHubAdapter> {
    const logPrefix = `${DataHubAdapter.#className}::init`;

    this.#serialNumber = (
      (await new System().readMacAddress('eth1')) || '000000000000'
    )
      .split(':')
      .join('');

    return Promise.resolve()
      .then(() => {
        winston.debug(`${logPrefix} initializing.`);
        if (this.#proxyConfig && this.#proxyConfig.enabled) {
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
      .then((success) => {
        this.#initialized = true;
        this.#successfullyProvisioned = success;
        winston.debug(`${logPrefix} initialized. ${success ? 'R' : 'Not r'}egistered to DPS`);
        return this;
      })
      .catch((err) => {
        return Promise.reject(
          new NorthBoundError(`${logPrefix} error due to ${err.message}`)
        );
      });
  }

  /**
   * Start the provisioning process for this device
   */
  private startProvisioning(): Promise<boolean> {
    const logPrefix = `${DataHubAdapter.#className}::startProvisioning`;
    winston.debug(`${logPrefix} Starting provisioning...`);

    this.onStateChange(LifecycleEventStatus.Provisioning);

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

    const success = this.getProvisioning();
    if (!success) {
      this.onStateChange(LifecycleEventStatus.ProvisioningFailed)
    }
    return success;
  }

  /**
   * Start adapter by building a iot hub client.
   */
  public start(): Promise<void> {
    const logPrefix = `${DataHubAdapter.#className}::start`;
    winston.debug(`${logPrefix} starting...`);
    if (!this.#initialized)
      return Promise.reject(
        new NorthBoundError(`${logPrefix} try to start uninitialized adapter.`)
      );
    if (this.isRunning) {
      winston.debug(
        `${logPrefix} try to start a already started adapter. Please remove unnecessary invoke of start().`
      );
      return Promise.resolve();
    }

    if (!this.#successfullyProvisioned) {
      winston.warn(
        `${logPrefix} data hub adapter isn't provisioned successful. Skipping start`
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
        twin.on('properties.desired.services', async (data) => {
          winston.info(`${logPrefix} received desired services update.`);
          winston.debug(`${logPrefix} ${JSON.stringify(data)}`);

          await this.setReportedProps(data);
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
        this.onStateChange(LifecycleEventStatus.Connected);
        winston.info(`${logPrefix} successful. Adapter ready to send data.`);
      })
      .catch((err) => {
        this.onStateChange(LifecycleEventStatus.ConnectionError);
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
        this.onStateChange(LifecycleEventStatus.Disconnected);
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
  private getProvisioning(): Promise<boolean> {
    const logPrefix = `${DataHubAdapter.#className}::getProvisioning`;

    return new Promise((res, rej) => {
      winston.debug(`${logPrefix} Registering...`);
      const timeOut = 10*1000;
      this.provTimer = setTimeout(() => {
        this.#provClient.cancel();
        winston.error(`${logPrefix} hit timeout of ${timeOut} ms. Abort.`);
        this.onStateChange(LifecycleEventStatus.ProvisioningFailed);
        res(false);
      }, timeOut)
      this.#provClient.register((err, response) => {
        try {
          clearTimeout(this.provTimer);
          const success = this.registrationHandler(err, response);
          res(success);
        } catch (err) {
          winston.error(`${logPrefix} registration failed due to ${err?.message}`);
          res(false);
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
  private registrationHandler(error: Error, res: RegistrationResult): boolean {
    const logPrefix = `${DataHubAdapter.#className}::registrationHandler`;
    if (error) {
      if (error.name === 'NotConnectedError')
        this.onStateChange(LifecycleEventStatus.NoNetwork);
      else this.onStateChange(LifecycleEventStatus.ProvisioningFailed);

      return false;
    } else {
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
      return true;
    }
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
      if (measurementArray.length < 1) continue;
      //why object.entries infer string instead real strings?
      switch (group as TDataHubDataPointType) {
        case 'event': {
          // Remove not changed data
          const filteredMeasurementArray: IMeasurement[] = [];
          measurementArray.forEach((measurement) => {
            const filteredMeasurements: IMeasurement = {};
            for (const [key, value] of Object.entries(measurement)) {
              if (this.lastSentEventValues[key] !== value)
                filteredMeasurements[key] = value;
            }
            if (Object.keys(filteredMeasurements).length > 0)
              filteredMeasurementArray.push(filteredMeasurements);
          });

          if (filteredMeasurementArray.length === 0) continue;

          // Storing last sent value
          filteredMeasurementArray.forEach((measurement) => {
            for (const [key, value] of Object.entries(measurement)) {
              this.lastSentEventValues[key] = value;
            }
          });

          const eventBuffer = new MessageBuffer(this.#serialNumber);
          eventBuffer.addAssetList(filteredMeasurementArray);
          const msg = this.addMsgType('event', eventBuffer.getMessage());

          this.#dataHubClient.sendEvent(msg, () => {
            winston.debug(`${logPrefix} send event data`);
          });

          continue;
        }
        case 'telemetry': {
          this.#telemetryBuffer = new MessageBuffer(this.#serialNumber);
          this.#telemetryBuffer.addAssetList(measurementArray);
          break;
        }
        case 'probe': {
          this.#probeBuffer = new MessageBuffer(this.#serialNumber);
          this.#probeBuffer.addAssetList(measurementArray);
          break;
        }
        default: {
          winston.error(
            `${logPrefix} received data with invalid datapoint type`
          );
          continue;
        }
      }
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
        `${logPrefix} try to send ${msgType} to datahub on not running adapter.`
      );
      return;
    }
    const buffer =
      msgType === 'telemetry' ? this.#telemetryBuffer : this.#probeBuffer;
    if (!buffer) {
      winston.warn(
        `${logPrefix} try to send ${msgType} but no data buffer available`
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

  public shutdown(): Promise<void> {
    const logPrefix = `${DataHubAdapter.name}::shutdown`;
    this.killProv();
    const shutdownFunctions = [
      this.#provClient?.cancel(),
      this.#provGroupClient?.cancel()
    ];
    [
      this.#proxy,
      this.#provSecClient,
      this.#symKeyProvTransport,
      this.#dataHubClient,
      this.#deviceTwin
    ].forEach((prop) => {
      // @ts-ignore
      if (prop?.shutdown) shutdownFunctions.push(prop.shutdown());
      // @ts-ignore
      if (prop?.close) shutdownFunctions.push(prop.close());
      // @ts-ignore
      if (prop?.removeAllListeners)
        // @ts-ignore
        shutdownFunctions.push(prop.removeAllListeners());
      prop = undefined;
    });
    this.#runningTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    return Promise.all(shutdownFunctions)
      .then(() => {
        winston.info(`${logPrefix} successfully.`);
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}.`);
      });
  }

  private killProv() {
    this.#provClient.cancel();
    clearTimeout(this.provTimer);
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
  public addAssetList(assets: Array<IMeasurement>): void {
    for (const measurement of Object.values(assets)) {
      for (const [key, value] of Object.entries(measurement)) {
        this.#assetBuffer.push(this.generateAssetData(key, value));
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
   * Get sendable message object.
   */
  public getMessage(): Message {
    return new Message(JSON.stringify(this.getCurrentMsg()));
  }
}
