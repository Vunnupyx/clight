import { IDataSourceMeasurementEvent } from '../Southbound/DataSources/interfaces';

type TimeSeriesValue = {
  ts: string;
  unit?: string;
  description?: string;
  value: boolean | number | string;
};

export type EventsById = {
  [id: string]: {
    changed: boolean;
    event: IDataSourceMeasurementEvent;
    timeseries: TimeSeriesValue[];
  };
};

/**
 * Caches the last value of every datapoint
 */
export class DataPointCache {
  private dataPoints: EventsById = {};

  /**
   * Adds or updates one or multiple events
   * @param  {IDataSourceMeasurementEvent | IDataSourceMeasurementEvent[]} events
   * @returns void
   */
  public update(
    events: IDataSourceMeasurementEvent | IDataSourceMeasurementEvent[]
  ): void {
    let _events: IDataSourceMeasurementEvent[] = [];
    if (Array.isArray(events)) {
      _events = events;
    } else {
      _events = [events];
    }

    _events.forEach((event) => {
      const lastEvent = this.getCurrentEvent(event.measurement.id);
      this.dataPoints[event.measurement.id] = {
        changed: lastEvent
          ? lastEvent.measurement.value !== event.measurement.value
          : false,
        event,
        timeseries: [
          ...(this.dataPoints[event.measurement.id]?.timeseries || []),
          {
            ts: new Date().toISOString(),
            unit: event.measurement.unit,
            description: event.measurement.description,
            value: event.measurement.value
          }
        ].filter((time) => {
          const PERIOD = 5 * 60 * 1000; // 5 min

          const ts = new Date(time.ts);
          const pastDate = new Date(Date.now() - PERIOD);

          return ts >= pastDate;
        })
      };
    });
  }

  /**
   * Returns the current event of a data point and null if the data point doesnt exist
   * @param  {string} id
   * @returns IMeasurementEvent
   */
  public getCurrentEvent(id: string): IDataSourceMeasurementEvent | undefined {
    return this.dataPoints[id] ? this.dataPoints[id].event : undefined;
  }

  /**
   * Returns latest value of a data point and null if the data point doesnt exist
   * @param  {string} id
   * @returns IMeasurementEvent
   */
  public getLastestValue(id: string): TimeSeriesValue | null {
    return this.dataPoints[id]
      ? this.dataPoints[id].timeseries[
          this.dataPoints[id].timeseries.length - 1
        ]
      : null;
  }

  /**
   * Returns array of timeseries for specific event
   * @param  {string} id
   * @returns TimeSeriesValue[]
   */
  public getTimeSeries(id: string): TimeSeriesValue[] {
    return this.dataPoints[id] ? this.dataPoints[id].timeseries : [];
  }

  /**
   * Whether a event has changed in the last cycle or not
   * @param  {string} id
   * @returns boolean
   */
  public hasChanged(id: string): boolean {
    return this.dataPoints[id] ? this.dataPoints[id].changed : true;
  }

  /**
   * Reset a specific data point to a give value.
   *
   * @param id identifier of the source data point
   * @param newValue new value of the data point
   */
  public resetValue(id: string, newValue = 0): void {
    if (this.dataPoints[id]) {
      const event: IDataSourceMeasurementEvent = {
        measurement: {
          id,
          name: 'reset',
          value: newValue
        },
        dataSource: {
          protocol: 'virtual'
        }
      };
      this.update(event);
    }
  }

  /**
   * Clears all data points
   */
  public clearAll(): void {
    this.dataPoints = {};
  }
}
