import { IDataSinkConfig } from "../ConfigManager/interfaces";
import { EventBus } from "../EventBus/index";
import { IDataSinkManagerParams } from "./interfaces";
import { createDataSink } from "../DataSink/DataSinkFactory";
import { IMeasurementEvent } from "../../common/interfaces";
import { DataSink } from "../DataSink/DataSink";
import { MTConnectManager } from "../MTConnectManager";

export class DataSinkManager {
  private dataSinkConfig: ReadonlyArray<IDataSinkConfig>;
  private measurementsBus: EventBus<IMeasurementEvent>;
  // private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSinks: ReadonlyArray<DataSink>;

  constructor(params: IDataSinkManagerParams) {
    this.dataSinkConfig = params.dataSinksConfig;
    // this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;

    this.spawnDataSinks();
  }

  // Not in use
  public async shutdownDataSink(): Promise<void> {
    for await (const dataSink of this.dataSinks) {
      if (dataSink) {
        await dataSink.shutdown();
      }
    }
    this.dataSinks = [];
  }

  // Not in use
  public hasDataSinks(): boolean {
    return !!this.dataSinks?.length;
  }

  public spawnDataSinks(): void {
    this.dataSinks = this.dataSinkConfig.map(createDataSink);
    this.subscribeDataSinks();

    MTConnectManager.startAdapter();
  }

  private subscribeDataSinks(): void {
    this.dataSinks.forEach((ds) =>
      this.measurementsBus.onEvent(ds.onMeasurement.bind(ds))
    );
  }

  // private onMeasurementEvent = (measurementEvent: IMeasurementEvent): void => {
  //   this.measurementsBus.push(measurementEvent);
  // };

  // private onLifecycleEvent = (lifeCycleEvent: ILifecycleEvent): void => {
  //   this.lifecycleBus.push(lifeCycleEvent);
  // };
}
