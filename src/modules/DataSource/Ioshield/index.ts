import NodeS7 from "nodes7";
import winston from "winston";
import { DataSource } from "../DataSource";
import {
  DataSourceLifecycleEventTypes,
  LifecycleEventStatus,
  DataPointLifecycleEventTypes,
  EventLevels,
} from "../../../common/interfaces";
import { IDataPointConfig } from "../../ConfigManager/interfaces";
import { IMeasurement } from "../interfaces";
import { Iot2050MraaDI10 } from "../../Iot2050MraaDI10/Iot2050mraa";

export class IoshieldDataSource extends DataSource {
  mraaClient: Iot2050MraaDI10;

  public async init(): Promise<void> {
    const { name, protocol, id } = this.config;
    this.submitLifecycleEvent({
      id,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Connected,
      status: LifecycleEventStatus.Connected,
      dataSource: { protocol, name },
    });

    this.mraaClient = new Iot2050MraaDI10();
    this.mraaClient.init();

    this.setupDataPoints();
  }

  protected async dataSourceCycle(
    currentIntervals: Array<number>
  ): Promise<void> {
    const currentCycleDataPoints: Array<IDataPointConfig> =
      this.config.dataPoints.filter((dp: IDataPointConfig) => {
        const rf = Math.max(dp.readFrequency, 1000);
        return currentIntervals.includes(rf);
      });

    try {
      const results = await this.mraaClient.getValues();

      const measurements: IMeasurement[] = [];
      for (const dp of currentCycleDataPoints) {
        const value = results[dp.address];

        if (typeof value === "undefined") continue;

        const measurement: IMeasurement = {
          id: dp.id,
          name: dp.name,
          value,
        };

        measurements.push(measurement);
      }

      if (measurements.length > 0) this.onDataPointMeasurement(measurements);
    } catch (e) {
      winston.error(e);
    }
  }

  public async disconnect(): Promise<void> {}
}
