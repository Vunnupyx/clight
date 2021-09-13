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
import { BaseNode } from 'node-opcua-address-space';
import { Variant } from 'node-opcua-variant';

type OPCUANodeDict = {
  [key: string]: BaseNode;
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
  }

  public init(): this {
    const logPrefix = `${OPCUADataSink.className}::init`;
    // Map datapoints to
    this.config.dataPoints.forEach((dp) => {
      winston.debug(`Setting up node ${dp.id}`);
      // create node for every dp or add data to endpoints from xml?
      this.opcuaNodes[dp.id] = this.opcuaAdapter.findNode(dp.id);
      // winston.debug(`${dp.id}: ${this.opcuaNodes[dp.id]}`);
    });

    return this;
  }

  protected processDataPointValue(dataPointId, value) {
    const logPrefix = `${OPCUADataSink.className}::onProcessDataPointValue`;

    const node = this.opcuaNodes[dataPointId];

    if (node) {
      //@ts-ignore
      node.value = {
        get: () => {
          winston.debug(`Get opc ua node: ${dataPointId}`);
          return new Variant({ value });
        }
      };

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
    winston.info(logMsg);
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
}
