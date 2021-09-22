import { ConfigManager } from '../ConfigManager';
import { MTConnectAdapter } from '../MTConnectAdapter';
import { SynchronousIntervalScheduler } from '../SyncScheduler';

/*
 ** Creates and manages the runtimes mtconnect adapter
 */
export class MTConnectManager {
  private static adapter: MTConnectAdapter;
  private static scheduler: SynchronousIntervalScheduler;
  private static schedulerListenerId: number;

  /**
   * Starts adapter and sets up scheduler for periodic data transmission
   * @returns void
   */
  static startAdapter(): void {
    this.adapter.start();

    if (this.schedulerListenerId) return;
    this.schedulerListenerId = this.scheduler.addListener(
      [1000],
      this.adapter.sendChanged.bind(this.adapter)
    );
  }

  /**
   * Creates singleton adapter
   * @param  {ConfigManager} config
   * @returns void
   */
  static createAdapter(config: ConfigManager): void {
    this.adapter = new MTConnectAdapter(config);
    this.scheduler = SynchronousIntervalScheduler.getInstance();
  }

  /**
   * Returns adapter instance
   * @returns MTConnectAdapter
   */
  static getAdapter(): MTConnectAdapter {
    if (!this.adapter) {
      throw new Error('Instance not yet created!');
    }

    return this.adapter;
  }
}
