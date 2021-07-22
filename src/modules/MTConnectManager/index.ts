import { ConfigManager } from "../ConfigManager";
import { MTConnectAdapter } from "../MTConnectAdapter";
import { SynchronousIntervalScheduler } from "../SyncScheduler";

export class MTConnectManager {
  private static adapter: MTConnectAdapter;
  private static scheduler: SynchronousIntervalScheduler;
  private static schedulerListenerId: number;

  static startAdapter(): void {
    this.adapter.start();

    if (this.schedulerListenerId) return;
    this.schedulerListenerId = this.scheduler.addListener(
      [1000],
      this.adapter.sendChanged.bind(this.adapter)
    );
  }

  static createAdater(config: ConfigManager): void {
    this.adapter = new MTConnectAdapter(config);
    this.scheduler = SynchronousIntervalScheduler.getInstance();
  }

  static getAdapter(): MTConnectAdapter {
    if (!this.adapter) {
      throw new Error("Instance not yet created!");
    }

    return this.adapter;
  }
}
