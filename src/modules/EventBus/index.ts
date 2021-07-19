import { TSubscriberFn } from "./interfaces";

class EventBus<TEventType> {
  callbacks: TSubscriberFn<TEventType>[] = [];

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
  public async emit(event: TEventType): Promise<void> {
    const promises = this.callbacks.map((cb) => cb(event));
    await Promise.all(promises);
  }
}

export default EventBus;
