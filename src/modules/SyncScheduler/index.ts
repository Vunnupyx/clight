type SubscriberById = { [key: number]: (id: number) => void };
type SubscribersForInterval = { [key: number]: SubscriberById };

/**
 * Implements a (globally) synchronous interval scheduler
 */
export class SynchronousIntervalScheduler {
  private static instance: SynchronousIntervalScheduler;

  private subscribers: SubscribersForInterval = {};
  private lastAssignedSubId = 0;
  private internalCycleInterval: ReturnType<typeof setInterval>;
  private internalCycleLastExecution: { [key: number]: number } = {};

  /**
   * Sets up the internal scheduler loop
   */
  private constructor() {
    this.internalCycleInterval = setInterval(this.cycle.bind(this), 100);
  }

  /**
   * Shutdown the scheduler & clean up the internal loop
   */
  public shutdown() {
    clearInterval(this.internalCycleInterval);
  }

  /**
   * Scheduler main loop, called with limited timer resolution
   */
  private cycle() {
    Object.keys(this.subscribers).forEach((key) => {
      const now = Date.now();
      const currentInterval = parseInt(key, 10);
      const lastRun = this.internalCycleLastExecution[key] || 0;

      if (now - lastRun >= currentInterval) {
        Object.keys(this.subscribers[key]).forEach((subscriberId) => {
          this.subscribers[key][subscriberId]([currentInterval]);
        });
        this.internalCycleLastExecution[key] = now;
      }
    });
  }

  /**
   * Add a listener function for one or multiple intervals
   * @param cycleIntervals All intervals at which to call the callback
   * @param callback
   * @returns
   */
  public addListener(
    cycleIntervals: Array<number>,
    callback: (interval: number) => void
  ): number {
    this.lastAssignedSubId += 1;
    cycleIntervals.forEach((cycleInterval) => {
      if (!(cycleInterval in this.subscribers))
        this.subscribers[cycleInterval] = {};
      this.subscribers[cycleInterval][this.lastAssignedSubId] = callback;
    });
    return this.lastAssignedSubId;
  }

  /**
   * Remove a listener callback from scheduling
   * @param subscriberId The id of the listener/subscription
   */
  public removeListener(subscriberId: number) {
    Object.keys(this.subscribers).forEach((interval) => {
      if (subscriberId in this.subscribers[interval]) {
        delete this.subscribers[interval][subscriberId];
      }
    });
  }

  /**
   * Get the scheduler Singleton instance
   * @returns The global instance
   */
  static getInstance(): SynchronousIntervalScheduler {
    if (!SynchronousIntervalScheduler.instance) {
      SynchronousIntervalScheduler.instance = new this();
    }

    return SynchronousIntervalScheduler.instance;
  }
}
