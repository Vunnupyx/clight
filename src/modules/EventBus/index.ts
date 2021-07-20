import winston from "winston";
import { IAppEvent } from "../../common/interfaces";
import { LogLevel } from "../Logger/interfaces";
import { TSubscriberFn } from "./interfaces";

export class EventBus<TEventType> {
  private callbacks: TSubscriberFn<TEventType>[] = [];
  private logLevel: string;

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
  private log(event: IAppEvent) {
    const { level, type } = event;
    const payload = event?.payload;
    const message = `Level: ${level}, Type: ${type}${
      payload ? `, Payload: ${payload?.toString()}` : ""
    }`;
    winston.log(this.logLevel, message, { source: "EVENTBUS" });
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
