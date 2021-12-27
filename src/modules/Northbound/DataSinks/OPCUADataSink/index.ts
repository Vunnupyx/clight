import winston from 'winston';
import {
  DataSinkProtocols,
  DataSourceLifecycleEventTypes,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../../common/interfaces';
import { DataSink, IDataSinkOptions } from '../DataSink';
import { OPCUAAdapter } from '../../Adapter/OPCUAAdapter';
import { Variant, UAVariable } from 'node-opcua';
import {
  IGeneralConfig,
  IOPCUAConfig
} from '../../../ConfigManager/interfaces';

type OPCUANodeDict = {
  [key: string]: UAVariable;
};

export interface IOPCUADataSinkOptions extends IDataSinkOptions {
  runtimeConfig: IOPCUAConfig;
  generalConfig: IGeneralConfig;
}
/**
 * Implementation of the OPCDataSink.
 * Provides datapoints via node-opcua module.
 */
export class OPCUADataSink extends DataSink {
  private opcuaAdapter: OPCUAAdapter;
  private opcuaNodes: OPCUANodeDict = {};
  protected _protocol = DataSinkProtocols.OPCUA;
  protected name = OPCUADataSink.name;
  private generalConfig: IGeneralConfig;

  constructor(options: IOPCUADataSinkOptions) {
    super(options);
    this.opcuaAdapter = new OPCUAAdapter({
      config: options.dataSinkConfig,
      generalConfig: options.generalConfig,
      runtimeConfig: options.runtimeConfig
    });
    this.generalConfig = options.generalConfig;
  }

  public async init(): Promise<OPCUADataSink> {
    const logPrefix = `${this.name}::init`;
    winston.info(`${logPrefix} initializing.`);

    if (!this.enabled) {
      winston.info(
        `${logPrefix} OPC UA data sink is disabled. Skipping initialization.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
      return this;
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of OPC UA data sink due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return this;
    }

    this.updateCurrentStatus(LifecycleEventStatus.Connecting);
    return this.opcuaAdapter
      .init()
      .then((adapter) => adapter.start())
      .then(() => this.setupDataPoints())
      .then(() => {
        this.updateCurrentStatus(LifecycleEventStatus.Connected);
        winston.info(`${logPrefix} initialized.`);
        return this;
      });
  }

  private setupDataPoints() {
    const logPrefix = `${this.name}::setupDataPoints`;
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

    this.setStaticNodes();
  }

  /**
   * Sets values for static nodes like serial number, model or manufacturer
   */
  private setStaticNodes() {
    const serialNumberNode = this.opcuaAdapter.findNode(
      'ns=7;s=SerialNumber'
    ) as UAVariable;
    this.setNodeValue(serialNumberNode, this.generalConfig.serialNumber || '');

    const manufacturerNode = this.opcuaAdapter.findNode(
      'ns=7;s=Manufacturer'
    ) as UAVariable;
    this.setNodeValue(manufacturerNode, this.generalConfig.manufacturer || '');

    const modelNode = this.opcuaAdapter.findNode('ns=7;s=Model') as UAVariable;
    this.setNodeValue(modelNode, this.generalConfig.model || '');
  }

  /**
   * Sets value for a specific node
   * @param node
   * @param value
   */
  private setNodeValue(node: UAVariable, value: any) {
    const logPrefix = `${this.name}::setNodeValue`;
    try {
      if (node) {
        //@ts-ignore
        node.setValueFromSource(
          new Variant({
            value,
            //@ts-ignore
            dataType: node.dataType.value
          })
        );
      }
    } catch (e) {
      winston.error(
        `${logPrefix} Failed to set value for ${node.nodeId?.toString()}. `
      );
      winston.debug(JSON.stringify(e));
    }
  }

  protected processDataPointValue(dataPointId, value) {
    const node = this.opcuaNodes[this.findNodeAddress(dataPointId)];
    this.setNodeValue(node, value);
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
    const logPrefix = `${this.name}::shutdown`;
    return this.opcuaAdapter.shutdown();
  }

  public async disconnect() {
    this.opcuaAdapter.stop();
    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
  }

  /**
   * Find address of a node by datapoint id. For changing the opcua value.
   */
  private findNodeAddress(dataPointId: string): string {
    return this.config.dataPoints.find((dp) => dp.id === dataPointId).address;
  }
}
