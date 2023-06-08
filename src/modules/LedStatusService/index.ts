import winston from 'winston';
import {
  DataSinkProtocols,
  DataSourceProtocols,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../common/interfaces';
import { ConfigManager } from '../ConfigManager';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { DataSinksManager } from '../Northbound/DataSinks/DataSinksManager';
import { ConfigurationAgentManager } from '../ConfigurationAgentManager';
import { EventBus } from '../EventBus';
import { IDataPointMapping } from '../ConfigManager/interfaces';

type TLedColors = 'red' | 'green' | 'orange';
type TUser1State = 'not_configured' | 'configured' | 'connected';

/**
 * Set LEDs or blink to display status of the runtime for user.
 */
export class LedStatusService {
  #ledIds: { [key: string]: string } = { '1': 'user1', '2': 'user2' }; // Received LED Ids are "user1" and "user2", already assigned to avoid undefined at beginning
  user1State: TUser1State = 'not_configured';

  constructor(
    private configManager: ConfigManager,
    private datasourceManager: DataSourcesManager,
    private dataSinksManager: DataSinksManager,
    private lifecycleBus: EventBus<ILifecycleEvent>
  ) {
    this.configManager.once('configsLoaded', async () => {
      await this.checkUserLED1();
    });
    this.configManager.on('configChange', async () => {
      await this.checkUserLED1();
    });
    this.lifecycleBus.addEventListener(
      this.handleLiveCycleEvent.bind(this),
      'LedStatusService_onLifecycleEvent'
    );
  }

  public async init(): Promise<void> {
    await this.getLedIds();
  }

  /**
   * Turn on the given LED with color and frequency. Frequency default is 0 (=non blink)
   */
  private async setLed(
    ledNumber: number | string,
    color: TLedColors,
    frequency?: number
  ): Promise<void> {
    // Turn off LED before turn on with new color or frequency.
    // Currently, the configuration agent behaves uncontrolled when changing the LED status.
    await this.unsetLed(ledNumber);
    await ConfigurationAgentManager.setLedStatus(
      this.#ledIds[ledNumber],
      'on',
      color,
      frequency
    );
  }

  /**
   * Turn off the given LED.
   */
  private async unsetLed(ledNumber: number | string): Promise<void> {
    await ConfigurationAgentManager.setLedStatus(
      this.#ledIds[ledNumber],
      'off'
    );
  }

  /**
   * Reads IDs of LEDs from configuration agent
   */
  private async getLedIds() {
    let list = await ConfigurationAgentManager.getLedList();
    list?.forEach((id, index) => {
      let letNumber = `${index + 1}`;
      this.#ledIds[letNumber] = id;
    });
  }

  /**
   * Check if:
   * - Configuration is valid
   * - Template is selected
   * - Terms and Conditions are accepted
   */
  private checkUserLED1(): void {
    const logPrefix = `${LedStatusService.name}::checkUserLED1`;

    winston.debug(`${logPrefix} start checking.`);
    try {
      if (this.isConfigured()) {
        if (this.getDataSourcesConnected() && this.getDataSinksConnected()) {
          this.setLed1State('connected');
        } else {
          this.setLed1State('configured');
        }
      } else {
        // not configured
        this.setLed1State('not_configured');
      }
    } catch (error) {
      winston.error(`${logPrefix} error checking USER LED 1: ${error}`);
      // set to not configured
      this.setLed1State('not_configured');
    }
  }

  private getConfiguredSources = (): DataSourceProtocols[] => {
    return (
      this.configManager.config?.dataSources
        ?.filter((source) => source.enabled && source.dataPoints?.length > 0)
        ?.map((source) => source.protocol) || []
    );
  };

  private getConfiguredSinks = (): DataSinkProtocols[] => {
    return (
      this.configManager.config?.dataSinks
        ?.filter((sink) => sink.enabled && sink.dataPoints.length > 0)
        ?.map((sink) => sink.protocol) || []
    );
  };

  private getConfiguredMappings = (): IDataPointMapping[] => {
    return this.configManager.config?.mapping || [];
  };

  private getTermsAccepted = (): boolean => {
    return this.configManager.config?.termsAndConditions?.accepted;
  };

  private getDataSourcesConnected = (): boolean => {
    return this.getConfiguredSources().some(
      (source) =>
        this.datasourceManager
          .getDataSourceByProto(source)
          ?.getCurrentStatus() === LifecycleEventStatus.Connected
    );
  };

  private getDataSinksConnected = (): boolean => {
    return this.getConfiguredSinks().some(
      (sink) =>
        this.dataSinksManager.getDataSinkByProto(sink)?.getCurrentStatus() ===
        LifecycleEventStatus.Connected
    );
  };

  private isConfigured(): boolean {
    return (
      this.getTermsAccepted() &&
      this.getConfiguredSources().length > 0 &&
      this.getConfiguredSinks().length > 0 &&
      this.getConfiguredMappings().length > 0
    );
  }

  /**
   * Enable or disable orange blinking USER LED 1.
   * Represented one of this state:
   *  - No Configuration
   *  - No Template
   *  - Not accepted AGB
   */
  private setLed1State(state: TUser1State): void {
    const logPrefix = `${LedStatusService.name}::setLed1State`;

    if (this.user1State === state) {
      winston.debug(
        `${logPrefix} USER LED 1 is already in state '${state}'. Nothing to do.`
      );
      return;
    }

    this.user1State = state;

    switch (state) {
      case 'not_configured':
        winston.info(
          `${logPrefix} set USER LED 1 to 'orange blinking' because not not completely configured.`
        );
        this.setLed(1, 'orange', 1);
      case 'configured':
        winston.info(
          `${logPrefix} set USER LED 1 to 'orange ON' because configured`
        );
        this.setLed(1, 'orange', 0);
      case 'connected':
        winston.info(
          `${logPrefix} set USER LED 1 to 'green ON' because configured and connected`
        );
        this.setLed(1, 'green', 1);
      default:
        this.unsetLed(1);
    }
  }

  /**
   * Set/unset LED2 for display of runtime status.
   */
  public async runTimeStatus(status: boolean): Promise<void> {
    const logPrefix = `${LedStatusService.name}::runTimeStatus`;
    winston.info(
      `${logPrefix} set USER LED 2 to ${
        status ? 'green' : 'OFF'
      } (Runtime status: ${status ? 'RUNNING' : 'NOT RUNNING'})`
    );

    if (status) {
      await this.setLed(2, 'green');
    } else {
      await this.unsetLed(2);
    }
  }

  /**
   * Turns off both led's of the device
   */
  public async turnOffLeds() {
    await Promise.all([this.unsetLed(1), this.unsetLed(2)]);
  }

  /**
   * Shutdown LED Service
   */
  public async shutdown(): Promise<void> {
    const logPrefix = `${LedStatusService.name}::shutdown`;
    winston.info(`${logPrefix} starting.`);

    await this.turnOffLeds();
    winston.info(`${logPrefix} successfully.`);
  }

  private async handleLiveCycleEvent(event: ILifecycleEvent): Promise<void> {
    const logPrefix = `${LedStatusService.name}::handleLiveCycleEvent`;
    winston.info(
      `${logPrefix} a status has changed. Reevaluating USER LED 1 status...`
    );
    this.checkUserLED1();
  }
}
