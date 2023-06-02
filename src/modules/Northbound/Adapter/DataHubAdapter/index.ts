import { Message, Twin, ModuleClient } from 'azure-iot-device';
import { Mqtt as IotHubTransport } from 'azure-iot-device-mqtt';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';

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
import { inspect } from 'util';
import {
  AzureResponse,
  CommandEventPayload,
  isErrorResultPayload,
  isUpdatesResultPayload,
  isUpdateTriggeredResultPayload,
  VersionInformation
} from './interfaces';
import { ConfigurationAgentManager } from '../../../ConfigurationAgentManager';

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
  private moduleId: string = '';

  // Datahub and Twin
  private dataHubClient: ModuleClient | null = null;
  private moduleTwin: Twin | null = null;
  private probeBuffer: MessageBuffer | null = null;
  private telemetryBuffer: MessageBuffer | null = null;
  private serialNumber: string = '';
  private firstMeasurement = true;
  private probeSendInterval: number;
  private telemetrySendInterval: number;
  private runningTimers: Array<NodeJS.Timer> = [];

  // Get update mechanismn
  private getCommandId = uuid();
  private getCallbackName = this.getCommandId;
  private getUpdateRequests: Array<Response> = [];

  // Set update mechanism
  private setCommandId = uuid();
  private setCallbackName = this.setCommandId;
  private setUpdateRequests: Array<Response> = [];
  private requestedVersion: VersionInformation['release'] | null = null;

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
    if (!process.env.IOTEDGE_MODULEID) {
      winston.warn(
        `${DataHubAdapter.name}::init process.env.IOTEDGE_MODULEID is not defined!`
      );
    } else {
      this.moduleId = process.env.IOTEDGE_MODULEID;
    }
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
  public getDesiredProps(): IDesiredProps | undefined {
    const logPrefix = `${this.constructor.name}::getDesiredProps`;

    if (!this.moduleTwin) {
      winston.warn(`${logPrefix} no device twin available.`);
      return;
    }
    if (!isDesiredProps(this.moduleTwin.properties.desired)) {
      // winston.warn(`${logPrefix} no desired properties found.`);
      return;
    }

    return this.moduleTwin.properties.desired;
  }

  /**
   * Set reported properties on device twin.
   */
  public async setReportedProps(data: IDesiredServices): Promise<void> {
    const logPrefix = `${this.constructor.name}::setReportedProps`;

    return new Promise((res, rej) => {
      if (!this.moduleTwin) {
        winston.warn(`${logPrefix} no device twin available.`);
        return rej();
      }

      winston.info(`${logPrefix} updating reported properties`);
      this.moduleTwin.properties.reported.update(
        { services: data },
        (err: unknown) => {
          if (err) winston.error(`${logPrefix} error due to ${err}`);
          else this.deviceTwinChanged = false;
          return res();
        }
      );
    });
  }

  /**
   * Initialize the DataHubAdapter and get provisioning for the device.
   */
  public async init(): Promise<DataHubAdapter> {
    const logPrefix = `${this.constructor.name}::init`;

    this.serialNumber =
      (await ConfigurationAgentManager.getMachineInfo())?.Serial || 'unknown';

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
    if (!this.dataHubClient)
      return Promise.reject(
        new NorthBoundError(`${logPrefix} datahub client is not defined yet.`)
      );

    return this.dataHubClient
      .on('error', (...args) =>
        winston.error(`DatahubClient error due to ${JSON.stringify(args)}`)
      )
      .open()
      .then((result) => {
        this.isRunning = result ? true : false;
        return this.dataHubClient!.getTwin();
      })
      .then((twin) => {
        this.moduleTwin = twin;
        winston.debug(
          `${logPrefix} got device twin. Register to desired services`
        );
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
        this.registerSetUpdateHandler();
        this.registerGetUpdateResponseHandler();
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
      return Promise.reject();
    }
    this.isRunning = false;
    this.runningTimers.forEach((timer) => clearInterval(timer));

    if (!this.dataHubClient)
      return Promise.reject(
        new NorthBoundError(`${logPrefix} datahub client is not defined.`)
      );

    return this.dataHubClient
      .close()
      .then(() => {
        this.onStateChange(LifecycleEventStatus.Disconnected);
        Object.keys(this).forEach((key) => {
          // TBD To be clarified and fixed!
          //@ts-ignore
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
          try {
            if (!this.dataHubClient)
              throw new Error('datahub client is not defined');

            this.dataHubClient.sendEvent(msg, (result) => {
              winston.debug(
                `${logPrefix} successfully published ${filteredMeasurementArray.length} event data points (${sendTime})`
              );
            });
          } catch (error) {
            winston.error(
              `${logPrefix} could not publish ${filteredMeasurementArray.length} event data points (${sendTime}) due to ${error}`
            );
          }

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

    const shutdownFunctions: Promise<any>[] = [];
    [this.dataHubClient, this.moduleTwin].forEach((prop) => {
      // @ts-ignore
      if (prop?.shutdown) shutdownFunctions.push(prop.shutdown());
      // @ts-ignore
      if (prop?.close) shutdownFunctions.push(prop.close());
      // @ts-ignore
      if (prop?.removeAllListeners)
        // @ts-ignore
        shutdownFunctions.push(prop.removeAllListeners());
      prop = null;
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

  /**
   * Register the handler receiving response from azure
   */
  private registerGetUpdateResponseHandler(): void {
    const logPrefix = `${DataHubAdapter.name}::registerGetUpdateResponseHandler`;

    winston.info(`${logPrefix} registering ${this.getCommandId}`);
    try {
      if (!this.dataHubClient) throw new Error('datahub client is not defined');
      this.dataHubClient.onMethod(
        this.getCallbackName,
        this.getUpdateResponseHandler.bind(this)
      );
      winston.info(`${logPrefix} ${this.getCommandId} registered.`);
    } catch (err) {
      winston.info(
        `${logPrefix} ${this.getCommandId} already registered or datahubclient is not defined (error = ${err}).`
      );
      return;
    }
  }

  /**
   * Send a request to get all available MDCL updates.
   * Response is received
   */
  private async requestAvailableUpdates(): Promise<void> {
    const logPrefix = `${DataHubAdapter.name}::requestAvailableUpdates`;
    const azureFuncName = `get-mdclight-updates`;

    winston.info(`${logPrefix} requesting available updated.`);

    const payload: CommandEventPayload = {
      locale: 'en'
    };

    const msg = new Message(JSON.stringify(payload));

    msg.properties.add('messageType', 'command');
    msg.properties.add('moduleId', this.moduleId);
    msg.properties.add('command', azureFuncName);
    msg.properties.add('commandId', this.getCommandId);
    msg.properties.add('methodName', this.getCallbackName);

    try {
      if (!this.dataHubClient) throw new Error('datahub client is not defined');
      await this.dataHubClient.sendEvent(msg);
    } catch (error) {
      const msg = `Error sending event msg'`;
      winston.error(`${logPrefix} ${msg} ${inspect(error)}`);
    }
  }

  /**
   * Receive responses with all available mdclight updates
   *
   * @param azureResponse         Response from azure function
   * @param azureFunctionCallback Response object to send receive ack to azure function
   */
  private getUpdateResponseHandler(
    azureResponse: AzureResponse,
    azureFunctionCallback: (arg0: number, arg1: { message: string }) => void
  ): void {
    const logPrefix = `${DataHubAdapter.name}::getUpdateResponseHandler`;
    winston.info(`${logPrefix} called from azure backend.`);

    try {
      const errorPayload =
        isErrorResultPayload(azureResponse.payload.payload) &&
        azureResponse.payload.payload;
      if (errorPayload) {
        winston.error(
          `${logPrefix} receive error from azure function call due to ${JSON.stringify(
            errorPayload.error.message
          )}`
        );
        this.getUpdateRequests.forEach((response) => {
          response.status(503).json({
            error: 'Unable to get update information.'
          });
        });
        this.getUpdateRequests = [];
        // ACK response
        winston.debug(
          `${logPrefix} acknowledge receive of message from called azure function.`
        );
        // TBD
        azureFunctionCallback.send(200, {
          message: `ACK`
        });
        return;
      }

      if (isUpdatesResultPayload(azureResponse.payload.payload)) {
        winston.debug(
          `Receive result payload from azure with payload: ${JSON.stringify(
            azureResponse.payload
          )}`
        );
        const status =
          azureResponse.payload.payload.result.updateList.length > 0
            ? 200
            : 204; // OK or no content
        const message =
          status === 200
            ? 'List of available MDCL updates.'
            : 'No updates available.';
        const updates: Array<VersionInformation> =
          azureResponse.payload.payload.result.updateList.map(
            ({
              release,
              releaseNotes,
              releaseNotesMissingReason,
              deploymentData: { BaseLayerVersion, OSVersion }
            }) => {
              return {
                release,
                releaseNotes,
                releaseNotesMissingReason,
                BaseLayerVersion,
                OSVersion
              };
            }
          );
        winston.debug(
          `${logPrefix} responses waiting for resolving: ${this.getUpdateRequests.length}`
        );
        this.getUpdateRequests.forEach((response) => {
          return response.status(status).json({
            message,
            updates
          });
        });
        this.getUpdateRequests = [];
        // ACK response
        winston.debug(
          `${logPrefix} acknowledge receive of message from called azure function.`
        );
        // TBD
        azureFunctionCallback.send(200, {
          message: `ACK`
        });
        return;
      }
      winston.info(
        `${logPrefix} callback called but no final result found, ${JSON.stringify(
          azureResponse
        )}. Waiting for final result.`
      );
      // TBD
      azureFunctionCallback.send(200, {
        message: `ACK`
      });
    } catch (error) {
      winston.error(`${logPrefix} error inside azure callback function.`);
    }
  }

  /**
   * Send request for available updates and add response object to array.
   * @param response
   */
  public async getUpdate(response: Response): Promise<void> {
    const logPrefix = `${DataHubAdapter.name}::getUpdate`;

    winston.info(`${logPrefix} called.`);
    this.getUpdateRequests.push(response);
    await this.requestAvailableUpdates();
    winston.info(
      `${logPrefix} response object registered and sending request.`
    );
  }

  /**
   * Sending message to trigger set of mdc update.
   * @param release
   * @param baseLayerVersion
   */
  private async sendUpdateRequest(
    release: VersionInformation['release'],
    baseLayerVersion: VersionInformation['BaseLayerVersion']
  ): Promise<void> {
    const logPrefix = `${DataHubAdapter.name}::sendUpdateRequest`;

    winston.info(`${logPrefix} sending request to update MDCL.`);
    const azureFuncName = `update-mdclight-version`;
    const payload: CommandEventPayload = {
      release,
      baseLayerVersion
    };
    const msg = new Message(JSON.stringify(payload));

    msg.properties.add('messageType', 'command');
    msg.properties.add('moduleId', this.moduleId);
    msg.properties.add('command', azureFuncName);
    msg.properties.add('commandId', this.setCommandId);
    msg.properties.add('methodName', this.setCallbackName);

    try {
      if (!this.dataHubClient)
        throw new Error(`${logPrefix} datahub client is not defined.`);

      await this.dataHubClient.sendEvent(msg);
    } catch (error) {
      const msg = `Error sending event msg'`;
      winston.error(`${logPrefix} ${msg} ${inspect(error)}`);
    }
    winston.info(`${logPrefix} request to update MDCL sent.`);
  }

  /**
   * Register the handler for response of set update
   */
  private registerSetUpdateHandler(): void {
    const logPrefix = `${DataHubAdapter.name}::registerSetUpdateHandler`;

    winston.info(`${logPrefix} registering ${this.setCommandId}`);
    try {
      if (!this.dataHubClient)
        throw new Error(`${logPrefix} datahub client is not defined.`);

      this.dataHubClient.onMethod(
        this.setCallbackName,
        this.setUpdateResponseHandler.bind(this)
      );
      winston.info(`${logPrefix} ${this.setCommandId} registered.`);
    } catch (err) {
      winston.error(`${logPrefix} ${this.setCommandId} already registered.`);
    }
  }

  /**
   * Receive responses from azure
   *
   * @param azureResponse         Response from azure function
   * @param azureFunctionCallback Response object to send receive ack to azure function
   */
  private setUpdateResponseHandler(
    azureResponse: AzureResponse,
    azureFunctionCallback
  ): void {
    const logPrefix = `${DataHubAdapter.name}::setUpdateResponseHandler`;
    winston.verbose(`${logPrefix} setUpdateResponseHandler called.`);

    const errorPayload =
      isErrorResultPayload(azureResponse.payload.payload) &&
      azureResponse.payload.payload;
    if (errorPayload) {
      winston.error(
        `${logPrefix} receive error from azure function call due to ${JSON.stringify(
          errorPayload.error.message
        )}`
      );
      this.setUpdateRequests.forEach((response) => {
        response.status(503).json({
          error: 'No update possible. Please try again later'
        });
      });
      this.setUpdateRequests = [];
      winston.debug(
        `${logPrefix} acknowledge receive of message from called azure function.`
      );
      // ACK response
      azureFunctionCallback.send(200, {
        message: `ACK`
      });
      return;
    }
    const {
      payload: { payload }
    } = azureResponse;

    if (isUpdateTriggeredResultPayload(payload)) {
      const status = /success/i.test(payload.result.message) ? 202 : 404;

      const error = status === 202 ? undefined : 'Version not found.';
      const message = status === 202 ? 'Update started.' : undefined;
      const version = status === 202 ? this.requestedVersion : undefined;

      const sendObj = {
        error,
        message,
        version
      };

      winston.debug(
        `${logPrefix} responses waiting for resolving: ${this.setUpdateRequests.length}`
      );
      this.setUpdateRequests.forEach((response) => {
        response.status(status).json(JSON.parse(JSON.stringify(sendObj)));
      });
      this.setUpdateRequests = [];
      winston.debug(
        `${logPrefix} acknowledge receive of message from called azure function.`
      );
      // ACK response
      azureFunctionCallback.send(200, {
        message: `ACK`
      });
      return;
    }
    winston.info(
      `${logPrefix} receive response without final result ${JSON.stringify(
        azureResponse
      )}. Wait for final result.`
    );
    azureFunctionCallback.send(200, {
      message: `ACK`
    });
    return;
  }

  /**
   * Send request for available updates and add response object to array.
   * @param response
   */
  public setUpdate(
    response: Response,
    payloadSend: {
      release: VersionInformation['release'];
      baseLayerVersion: VersionInformation['BaseLayerVersion'];
    }
  ): void {
    const logPrefix = `${DataHubAdapter.name}::setUpdate`;

    winston.info(`${logPrefix} called.`);
    this.setUpdateRequests.push(response);
    this.requestedVersion = payloadSend.release;
    this.sendUpdateRequest(payloadSend.release, payloadSend.baseLayerVersion);
    winston.info(
      `${logPrefix} response object registered and sending request.`
    );
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
