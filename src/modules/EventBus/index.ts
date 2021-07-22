import winston from "winston";
import { IAppEvent, IMeasurementEvent } from "../../common/interfaces";
import { LogLevel } from "../Logger/interfaces";
import { TSubscriberFn } from "./interfaces";

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
  protected log(event: IAppEvent | IAppEvent[]) {
    const events = Array.isArray(event) ? event : [event];

    events.forEach((event) => {
      const { level, type, id } = event;
      const payload = event?.payload;
      const message = `Level: ${level}, Type: ${type}, ${id}${
        payload ? `, Payload: ${payload?.toString()}` : ""
      }`;
      winston.log(this.logLevel, message, { source: "EVENTBUS" });
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

  /**
   * Emits event to the event bus. This will call all callbacks with the event.
   * @param  {TEventType} event
   * @returns Promise
   */
  public async push(event: TEventType): Promise<void> {
    const promises = this.callbacks.map((cb) => cb(event));
    await Promise.all(promises);
  }
}

export class MeasurementEventBus<TEventType> extends EventBus<TEventType> {
  /**
   * Logs event
   * @param  {TSubscriberFn<TEventType>} cb
   * @returns void
   */
  protected log(events: IMeasurementEvent[]) {
    events.forEach((event) => {
      const { measurement } = event;
      const message = `Level: DataPoint, Type: Measurement${
        measurement ? `, Payload: ${measurement.id}=${measurement.value}` : ""
      }`;
      winston.log(this.logLevel, message, { source: "EVENTBUS" });
    });
  }
}
