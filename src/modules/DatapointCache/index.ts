import { IDataSourceMeasurementEvent } from '../Southbound/DataSources/interfaces';

type EventsById = {
  [id: string]: {
    changed: boolean;
    event: IDataSourceMeasurementEvent;
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
    let _events = [];
    if (Array.isArray(events)) {
      _events = events;
    } else {
      _events = [events];
    }

    _events.forEach((event) => {
      const lastEvent = this.getLastEvent(event.measurement.id);
      this.dataPoints[event.measurement.id] = {
        changed: lastEvent
          ? lastEvent.measurement.value !== event.measurement.value
          : false,
        event
      };
    });
  }

  /**
   * Returns last event of a data point and null if the data point doesnt exist
   * @param  {string} id
   * @returns IMeasurementEvent
   */
  public getLastEvent(id: string): IDataSourceMeasurementEvent | null {
    return this.dataPoints[id] ? this.dataPoints[id].event : undefined;
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
   * Clears all data points
   */
  public clearAll(): void {
    this.dataPoints = {};
  }
}
