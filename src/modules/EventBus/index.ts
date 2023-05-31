import winston from 'winston';
import { IAppEvent } from '../../common/interfaces';
import { IDataSourceMeasurementEvent } from '../Southbound/DataSources/interfaces';
import { LogLevel } from '../Logger/interfaces';
import { TSubscriberFn } from './interfaces';

/**
 * Implementation of runtimes event bus
 */
export class EventBus<TEventType> {
  private callbacks: { [key: string]: TSubscriberFn<TEventType> } = {};
  protected logLevel: string;

  constructor(private name: string = EventBus.name, logLevel: LogLevel = null) {
    this.logLevel = logLevel;

    if (this.logLevel) {
      this.addEventListener(this.log.bind(this), `EventBus_log`);
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
   * @param id id of the callback
   * @returns void
   */
  public addEventListener(cb: TSubscriberFn<TEventType>, id: string): void {
    const logPrefix = `${this.name}::addEventListener`;
    if (this.callbacks[id]) {
      winston.warn(
        `${logPrefix} callback with id ${id} already exists. Overwriting the event listener.`
      );
    }
    this.callbacks[id] = cb;
  }

  /**
   * Removes a call back from the event bus
   * @param id The id of the callback that should be removed
   */
  public removeEventListener(id: string): void {
    const logPrefix = `${this.name}::removeEventListener`;
    if (this.callbacks[id]) {
      delete this.callbacks[id];
    } else {
      winston.warn(
        `${logPrefix} trying to remove event listener with id ${id} which does not exists.`
      );
    }
  }

  /**
   * Emits event to the event bus. This will call all callbacks with the event.
   * @param  {TEventType} event
   * @returns Promise
   */
  // TODO Rename
  public async push(event: TEventType): Promise<void> {
    // TODO These are not promises
    const logPrefix = `${this.name}::push`;

    const promises = Object.values(this.callbacks).map((cb) => cb(event));

    winston.verbose(
      `${logPrefix} pushing event to ${promises.length} callbacks`
    );

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
