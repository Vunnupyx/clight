import { DataSourceLifecycleEventTypes, ILifecycleEvent } from "../../../common/interfaces";
import { IDataSourceMeasurementEvent } from "../../DataSource";
import { DataSink } from "../DataSink";
import { IDataSinkParams } from "../interfaces";
import { OPCUAAdapter } from '../../OPCUAAdapter';
import { IDataSinkConfig } from "../../ConfigManager/interfaces";
import { OPCUAManager } from "../../OPCUAManager";
import { NorthBoundError } from "../../../common/errors";
import winston from "winston";



/**
 * Implementation of the OPCDataSink.
 * Provides datapoints via node-opcua module.
 */
export class OPCUADataSink extends DataSink {
    private opcuaAdapter: OPCUAAdapter;
    private dataPointFromConfig;

    private static className: string;

    constructor(config: IDataSinkParams) {
        super(config);
        this.opcuaAdapter = OPCUAManager.getAdapter();
        OPCUADataSink.className = this.constructor.name;
    }

    public init(): this {
        const logPrefix = `${OPCUADataSink.className}::init`;
        // Map datapoints to 
        throw new Error("Method not implemented.");
        // this.config.dataPoints.forEach((dp) => {
        //     // create node for every dp or add data to endpoints from xml?
        //     dp.
        // })
    }

    public onMeasurements(measurements: IDataSourceMeasurementEvent[]): Promise<void> {
        const logPrefix = `${OPCUADataSink.className}::onMeasurements`;
        // TODO: Wie sieht das MeasurementObjekt aus? Worauf muss ich filtern?

        // measurements.forEach((measurement) => {
        //     measurement.
        // })
        throw new Error("Method not implemented.");
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
                 return Promise.reject(
                     new NorthBoundError(`${logPrefix} error due to receive unknown lifecycle event.`));
            }
        }
        winston.info(logMsg);
        return Promise.resolve();
    }

    

    public shutdown() {
        const logPrefix = `${OPCUADataSink.className}::shutdown`;
        throw new Error("Method not implemented.");
    }

    public async disconnect() {
        const logPrefix = `${OPCUADataSink.className}::disconnect`;
        this.opcuaAdapter.stop()
    }
}