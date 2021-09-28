import winston from 'winston';
import {
  DataSourceLifecycleEventTypes,
  ILifecycleEvent
} from '../../../common/interfaces';
import { IDataSourceMeasurementEvent } from '../../DataSource';
import { DataSink } from '../DataSink';
import { IDataSinkParams } from '../interfaces';
import { OPCUAAdapter } from '../../OPCUAAdapter';
import { IDataSinkConfig } from '../../ConfigManager/interfaces';
import { OPCUAManager } from '../../OPCUAManager';
import { NorthBoundError } from '../../../common/errors';
import { Variant, BaseNode, DataType, DataValue, UAVariable } from 'node-opcua';

type OPCUANodeDict = {
  [key: string]: UAVariable;
};

/**
 * Implementation of the OPCDataSink.
 * Provides datapoints via node-opcua module.
 */
export class OPCUADataSink extends DataSink {
  private opcuaAdapter: OPCUAAdapter;
  private opcuaNodes: OPCUANodeDict = {};

  private static className: string;

  constructor(config: IDataSinkParams) {
    super(config);
    this.opcuaAdapter = OPCUAManager.getAdapter();
    OPCUADataSink.className = this.constructor.name;
    this.protocol = 'opcua';
  }

  public init(): this {
    this.setupDataPoints();
    return this;
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

    const node = this.opcuaNodes[dataPointId];

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
    const logPrefix = `${OPCUADataSink.className}::onLifecycleEvent`;
    let logMsg = `${logPrefix} `;
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
    winston.debug(logMsg);
    return Promise.resolve();
  }

  public shutdown() {
    const logPrefix = `${OPCUADataSink.className}::shutdown`;
    throw new Error('Method not implemented.');
  }

  public async disconnect() {
    const logPrefix = `${OPCUADataSink.className}::disconnect`;
    this.opcuaAdapter.stop();
  }
  /**
   * Current status of opcua sink
   * true -> running
   * false -> not running
   */
  public currentStatus(): boolean {
    return !!this.opcuaAdapter?.isRunning
  }
}
