import winston from 'winston';
import {
  DataSinkProtocols,
  DataSourceLifecycleEventTypes,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../../common/interfaces';
import { DataSink } from '../DataSink';
import { OPCUAAdapter } from '../../Adapter/OPCUAAdapter';
import { Variant, UAVariable } from 'node-opcua';
import {
  IDataSinkConfig,
  IGeneralConfig,
  IOPCUAConfig
} from '../../../ConfigManager/interfaces';

type OPCUANodeDict = {
  [key: string]: UAVariable;
};

export interface IOPCUADataSinkOptions {
  runtimeConfig: IOPCUAConfig;
  generalConfig: IGeneralConfig;
  dataSinkConfig: IDataSinkConfig;
}
/**
 * Implementation of the OPCDataSink.
 * Provides datapoints via node-opcua module.
 */
export class OPCUADataSink extends DataSink {
  private opcuaAdapter: OPCUAAdapter;
  private opcuaNodes: OPCUANodeDict = {};
  protected _protocol = DataSinkProtocols.OPCUA;
  private static className = OPCUADataSink.name;

  constructor(options: IOPCUADataSinkOptions) {
    super(options.dataSinkConfig);
    this.opcuaAdapter = new OPCUAAdapter({
      config: options.dataSinkConfig,
      generalConfig: options.generalConfig,
      runtimeConfig: options.runtimeConfig
    });
    this.enabled = options.dataSinkConfig.enabled;
  }

  public async init(): Promise<OPCUADataSink> {
    const logPrefix = `${OPCUADataSink.className}::init`;
    winston.info(`${logPrefix} initializing.`);

    if (!this.enabled) {
      winston.info(
        `${logPrefix} OPC UA data sink is disabled. Skipping initialization.`
      );
      this.currentStatus = LifecycleEventStatus.Disabled;
      return this;
    }

    return this.opcuaAdapter
      .init()
      .then((adapter) => adapter.start())
      .then(() => this.setupDataPoints())
      .then(() => winston.info(`${logPrefix} initialized.`))
      .then(() => this);
  }

  private setupDataPoints() {
    const logPrefix = `${OPCUADataSink.className}::setupDataPoints`;
    this.config.dataPoints.forEach((dp) => {
      winston.debug(`${logPrefix} Setting up node ${dp.address}`);
      try {
        this.opcuaNodes[dp.address] = this.opcuaAdapter.findNode(
          dp.address
        ) as UAVariable;
      } catch (e) {
        winston.warn(
          `${logPrefix} Unabled to find opcua data point ${dp.address}`
        );
      }
    });
  }

  protected processDataPointValue(dataPointId, value) {
    const logPrefix = `${OPCUADataSink.className}::onProcessDataPointValue`;

    const node = this.opcuaNodes[this.findNodeAddress(dataPointId)];

    if (node) {
      //@ts-ignore
      node.setValueFromSource(
        //@ts-ignore
        new Variant({ value, dataType: node._dataValue.value.dataType })
      );

      winston.debug(
        `${logPrefix} TargetDataPointId: ${dataPointId}, Value: ${value}`
      );
    }
  }

  public onLifecycleEvent(event: ILifecycleEvent): Promise<void> {
    // const logPrefix = `${OPCUADataSink.className}::onLifecycleEvent`;
    // let logMsg = `${logPrefix} `;

    // Check for OPCUA Error Messages
    switch (event.type) {
      case DataSourceLifecycleEventTypes.Connecting: {
        // TODO: To be implemented
        break;
      }
      case DataSourceLifecycleEventTypes.Connected: {
        // TODO: To be implemented
        break;
      }
      case DataSourceLifecycleEventTypes.ConnectionError: {
        // TODO: To be implemented
        break;
      }
      case DataSourceLifecycleEventTypes.Disconnected: {
        // TODO: To be implemented
        break;
      }
      case DataSourceLifecycleEventTypes.Reconnecting: {
        // TODO: To be implemented
        break;
      }
      default: {
        // return Promise.reject(
        //   new NorthBoundError(
        //     `${logPrefix} error due to receive unknown lifecycle event of type: ${event.type}.`
        //   )
        // );
      }
    }
    // winston.debug(logMsg);
    return Promise.resolve();
  }

  public shutdown(): Promise<void> {
    const logPrefix = `${OPCUADataSink.className}::shutdown`;
    return this.opcuaAdapter.shutdown();
  }

  public async disconnect() {
    const logPrefix = `${OPCUADataSink.className}::disconnect`;
    this.opcuaAdapter.stop();
  }

  /**
   * Find address of a node by datapoint id. For changing the opcua value.
   */
  private findNodeAddress(dataPointId: string): string {
    return this.config.dataPoints.find((dp) => dp.id === dataPointId).address;
  }
}
