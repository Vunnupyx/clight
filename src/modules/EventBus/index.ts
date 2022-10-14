import winston from 'winston';
import { IAppEvent } from '../../common/interfaces';
import { IDataSourceMeasurementEvent } from '../Southbound/DataSources/interfaces';
import { LogLevel } from '../Logger/interfaces';
import { TSubscriberFn } from './interfaces';

/**
 * Implementation of runtimes event bus
 */
export class EventBus<TEventType> {
  private callbacks: TSubscriberFn<TEventType>[] = [];
  protected logLevel: string;

  constructor(logLevel: LogLevel = null) {
    this.logLevel = logLevel;

    if (this.logLevel) {
      this.onEvent(this.log.bind(this));
    }
  }

  /**
   * Logs event
   * @param  {TSubscriberFn<TEventType>} cb
   * @returns void
   */
  protected log(event: IAppEvent[]) {
    const events = Array.isArray(event) ? event : [event];

    events.forEach((event) => {
      const { level, type, id } = event;
      const payload = event?.payload;
      const message = `Level: ${level}, Type: ${type}, ${id}${
        payload ? `, Payload: ${payload?.toString()}` : ''
      }`;
      // winston.log(this.logLevel, message, { source: 'EVENTBUS' });
    });
  }

  /**
   * Adds callback to the event bus
   * @param  {TSubscriberFn<TEventType>} cb
   * @returns void
   */
  public onEvent(cb: TSubscriberFn<TEventType>): void {
    if (!this.callbacks.some((_cb) => _cb === cb)) {
      this.callbacks.push(cb);
    }
  }

  public offEvent(cb: TSubscriberFn<TEventType>): void {
    const index = this.callbacks.findIndex((_cb) => {
      _cb === cb;
    });
    if (index) this.callbacks.splice(index, 1);
  }

  /**
   * Emits event to the event bus. This will call all callbacks with the event.
   * @param  {TEventType} event
   * @returns Promise
   */
  // TODO Rename
  public async push(event: TEventType): Promise<void> {
    // TODO These are not promises
    const logPrefix = `${EventBus.name}::push`;

    const promises = this.callbacks.map((cb) => cb(event));
    await Promise.allSettled(promises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected')
          winston.error(
            `${logPrefix} error while processing Event: ${result.reason}`
          );
      });
    });
  }
}

export class MeasurementEventBus extends EventBus<
  IDataSourceMeasurementEvent[]
> {
  /**
   * Logs event
   * @param  {TSubscriberFn<TEventType>} cb
   * @returns void
   */
  // @ts-ignore
  protected log(events: IDataSourceMeasurementEvent[]) {
    events.forEach((event) => {
      const { measurement } = event;
      const message = `Level: DataPoint, Type: Measurement${
        measurement ? `, Payload: ${measurement.id}=${measurement.value}` : ''
      }`;
      // winston.log(this.logLevel, message, { source: 'EVENTBUS' });
    });
  }
}
