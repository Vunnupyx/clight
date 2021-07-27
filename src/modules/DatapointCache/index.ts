import { IDataSourceMeasurementEvent } from "../DataSource";

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
   * Adds or updates the last event of a data point.
   * @param  {string} id
   * @param  {Value} value
   * @returns void
   */
  public update(event: IDataSourceMeasurementEvent): void {
    const lastEvent = this.getLastEvent(event.measurement.id);
    this.dataPoints[event.measurement.id] = {
      changed: lastEvent
        ? lastEvent.measurement.value !== event.measurement.value
        : false,
      event,
    };
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
}
