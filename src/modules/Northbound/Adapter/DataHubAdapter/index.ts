import { Message, Twin, ModuleClient } from 'azure-iot-device';
import { MqttWs as IotHubTransport } from 'azure-iot-device-mqtt';

import winston from 'winston';
import { NorthBoundError } from '../../../../common/errors';
import {
  IDataHubConfig,
  TDataHubDataPointType
} from '../../../ConfigManager/interfaces';
import {
  TGroupedMeasurements,
  IMeasurement
} from '../../DataSinks/DataHubDataSink';
import { LifecycleEventStatus } from '../../../../common/interfaces';
import { System } from '../../../System';

interface DataHubAdapterOptions extends IDataHubConfig {}

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
  private isRunning: boolean = false;
  private deviceTwinChanged = true;
  private onStateChange: (state: LifecycleEventStatus) => void;

  private initialized: boolean = false;

  // Datahub and Twin
  private dataHubClient: ModuleClient;
  private deviceTwin: Twin;
  private probeBuffer: MessageBuffer;
  private telemetryBuffer: MessageBuffer;
  private serialNumber: string;
  private firstMeasurement = true;
  private probeSendInterval: number;
  private telemetrySendInterval: number;
  private runningTimers: Array<NodeJS.Timer> = [];

  private lastSentEventValues: { [key: string]: boolean | number | string } =
    {};

  /**
   *
   * @param options Static options defined inside the runtime config
   * @param settings Dynamic options defined inside the config and editable via the ui
   */
  public constructor(
    staticOptions: DataHubAdapterOptions,
    onStateChange: (state: LifecycleEventStatus) => void = (state) => {}
  ) {
    if (
      !staticOptions.dataPointTypesData.probe.intervalHours ||
      !staticOptions.dataPointTypesData.telemetry.intervalHours
    ) {
      throw new NorthBoundError(
        `${this.constructor.name} can not build instance. No send interval available`
      );
    }
    this.probeSendInterval = this.hoursToMs(
      staticOptions.dataPointTypesData.probe.intervalHours
    );
    this.telemetrySendInterval = this.hoursToMs(
      staticOptions.dataPointTypesData.telemetry.intervalHours
    );

    this.onStateChange = onStateChange;
  }

  public get running(): boolean {
    return this.isRunning;
  }

  /**
   * Get desired properties object by device twin.
   */
  public getDesiredProps(): IDesiredProps {
    const logPrefix = `${this.constructor.name}::getDesiredProps`;
    if (!this.deviceTwin) {
      winston.warn(`${logPrefix} no device twin available.`);
      return;
    }
    if (!isDesiredProps(this.deviceTwin.properties.desired)) {
      winston.warn(
        `${logPrefix} no desired properties found. ${JSON.stringify(
          this.deviceTwin
        )}`
      );
      return;
    }

    return this.deviceTwin.properties.desired;
  }

  /**
   * Set reported properties on device twin.
   */
  public async setReportedProps(data: IDesiredServices): Promise<void> {
    const logPrefix = `${this.constructor.name}::setReportedProps`;

    return new Promise((res, rej) => {
      if (!this.deviceTwin) {
        winston.warn(`${logPrefix} no device twin available.`);
        return rej();
      }

      winston.info(`${logPrefix} updating reported properties`);
      this.deviceTwin.properties.reported.update({ services: data }, (err) => {
        if (err) winston.error(`${logPrefix} error due to ${err.message}`);
        else this.deviceTwinChanged = false;
        return res();
      });
    });
  }

  /**
   * Initialize the DataHubAdapter and get provisioning for the device.
   */
  public async init(): Promise<DataHubAdapter> {
    const logPrefix = `${this.constructor.name}::init`;

    this.serialNumber = (
      (await new System().readMacAddress('eth0')) || '000000000000'
    )
      .split(':')
      .join('');

    return Promise.resolve()
      .then(() => {
        winston.debug(`${logPrefix} initializing.`);
      })
      .then(() => {
        return ModuleClient.fromEnvironment(IotHubTransport);
      })
      .then((modClient) => {
        this.dataHubClient = modClient;
        this.initialized = true;
        return this;
      })
      .catch((err) => {
        return Promise.reject(
          new NorthBoundError(`${logPrefix} error due to ${err.message}`)
        );
      });
  }

  /**
   * Start adapter by building a iot hub client.
   */
  public start(): Promise<void> {
    const logPrefix = `${this.constructor.name}::start`;
    winston.debug(`${logPrefix} starting...`);
    if (!this.initialized)
      return Promise.reject(
        new NorthBoundError(`${logPrefix} try to start uninitialized adapter.`)
      );
    if (this.isRunning) {
      winston.debug(
        `${logPrefix} try to start a already started adapter. Please remove unnecessary invoke of start().`
      );
      return Promise.resolve();
    }

    return this.dataHubClient
      .on('error', (...args) =>
        winston.error(`DatahubClient error due to ${JSON.stringify(args)}`)
      )
      .open()
      .then((result) => {
        this.isRunning = result ? true : false;
        return this.dataHubClient.getTwin();
      })
      .then((twin) => {
        this.deviceTwin = twin;
        twin.on('properties.desired.services', async (data) => {
          winston.info(`${logPrefix} received desired services update.`);
          winston.debug(`${logPrefix} ${JSON.stringify(data)}`);

          await this.setReportedProps(data);
        });
        this.runningTimers.push(
          setInterval(() => {
            this.sendMessage('probe');
          }, this.probeSendInterval)
        );
        this.runningTimers.push(
          setInterval(() => {
            this.sendMessage('telemetry');
          }, this.telemetrySendInterval)
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
   * Stop adapter and set running status.
   */
  public stop(): Promise<void> {
    const logPrefix = `${this.constructor.name}::stop`;
    if (!this.isRunning) {
      winston.debug(`${logPrefix} try to stop a not running adapter.`);
      return;
    }
    this.isRunning = false;
    this.runningTimers.forEach((timer) => clearInterval(timer));
    this.dataHubClient
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
   * Send a key value pair.
   */
  public sendData(groupedMeasurements: TGroupedMeasurements): void {
    const logPrefix = `${this.constructor.name}::sendData`;

    // winston.debug(`${logPrefix} start: ${JSON.stringify(groupedMeasurements)}`);

    for (const [group, measurementArray] of Object.entries(
      groupedMeasurements
    )) {
      if (measurementArray.length < 1) continue;
      // winston.debug(`${logPrefix} ${group}`);

      // why object.entries infer string instead real strings?
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

          const eventBuffer = new MessageBuffer(this.serialNumber);
          eventBuffer.addAssetList(filteredMeasurementArray);
          const msg = this.addMsgType('event', eventBuffer.getMessage());

          const sendTime = new Date().toISOString();
          winston.debug(
            `${logPrefix} publishing ${filteredMeasurementArray.length} event data points (${sendTime})`
          );
          this.dataHubClient.sendEvent(msg, (result) => {
            winston.debug(
              `${logPrefix} successfully published ${filteredMeasurementArray.length} event data points (${sendTime})`
            );
          });

          continue;
        }
        case 'telemetry': {
          this.telemetryBuffer = new MessageBuffer(this.serialNumber);
          this.telemetryBuffer.addAssetList(measurementArray);
          break;
        }
        case 'probe': {
          this.probeBuffer = new MessageBuffer(this.serialNumber);
          this.probeBuffer.addAssetList(measurementArray);
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
    if (this.firstMeasurement) {
      this.sendMessage('probe');
      this.sendMessage('telemetry');
      this.firstMeasurement = false;
    }
  }

  private sendMessage(msgType: Exclude<TDataHubDataPointType, 'event'>): void {
    const logPrefix = `${this.constructor.name}::sendMessage`;
    if (!this.dataHubClient || !this.isRunning) {
      winston.error(
        `${logPrefix} try to send ${msgType} to datahub on not running adapter.`
      );
      return;
    }
    const buffer =
      msgType === 'telemetry' ? this.telemetryBuffer : this.probeBuffer;
    if (!buffer) {
      winston.warn(
        `${logPrefix} try to send ${msgType} but no data buffer available`
      );
      return;
    }
    const msg = this.addMsgType(msgType, buffer.getMessage());

    this.dataHubClient.sendEvent(msg, (err, result) => {
      if (err) {
        winston.error(`${logPrefix} error sending due to ${err}`);
        return;
      }
      winston.debug(
        `${logPrefix} successfully published ${msgType} data points`
      );
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

    const shutdownFunctions = [];
    [this.dataHubClient, this.deviceTwin].forEach((prop) => {
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
    this.runningTimers.forEach((timer) => {
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
}

/**
 * Structure of asset data by DMG MORI. For probes and telemetry data
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
