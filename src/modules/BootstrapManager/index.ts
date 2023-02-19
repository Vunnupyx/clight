import winston from 'winston';
import fetch from 'node-fetch';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { EventBus, MeasurementEventBus } from '../EventBus';
import {
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent
} from '../../common/interfaces';
import { ConfigManager } from '../ConfigManager';
import { LogLevel } from '../Logger/interfaces';
import { DataSinksManager } from '../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../DatapointCache';
import { VirtualDataPointManager } from '../VirtualDataPointManager';
import { RestApiManager } from '../Backend/RESTAPIManager';
import IoT2050HardwareEvents from '../IoT2050HardwareEvents';
import { TLSKeyManager } from '../TLSKeyManager';
import { LedStatusService } from '../LedStatusService';
import { ConfigurationAgentManager } from '../ConfigurationAgentManager';

/**
 * Launches agent and handles module life cycles
 */
export class BootstrapManager {
  private configManager: ConfigManager;
  private dataSourcesManager: DataSourcesManager;
  private dataSinksManager: DataSinksManager;
  private errorEventsBus: EventBus<IErrorEvent>;
  private lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private measurementsEventsBus: MeasurementEventBus;
  private dataPointCache: DataPointCache;
  private virtualDataPointManager: VirtualDataPointManager;
  private backend: RestApiManager;
  private hwEvents: IoT2050HardwareEvents;
  private ledManager: LedStatusService;
  private tlsKeyManager: TLSKeyManager;

  constructor() {
    this.errorEventsBus = new EventBus<IErrorEvent>(LogLevel.ERROR);
    this.lifecycleEventsBus = new EventBus<ILifecycleEvent>(LogLevel.INFO);
    this.measurementsEventsBus = new MeasurementEventBus(LogLevel.DEBUG);

    this.configManager = new ConfigManager({
      errorEventsBus: this.errorEventsBus,
      lifecycleEventsBus: this.lifecycleEventsBus
    });

    this.dataPointCache = new DataPointCache();

    this.virtualDataPointManager = new VirtualDataPointManager({
      configManager: this.configManager,
      cache: this.dataPointCache
    });

    this.dataSinksManager = new DataSinksManager({
      configManager: this.configManager,
      dataPointCache: this.dataPointCache,
      errorBus: this.errorEventsBus,
      lifecycleBus: this.lifecycleEventsBus,
      measurementsBus: this.measurementsEventsBus
    });
    this.configManager.dataSinksManager = this.dataSinksManager;

    this.dataSourcesManager = new DataSourcesManager({
      configManager: this.configManager,
      dataPointCache: this.dataPointCache,
      virtualDataPointManager: this.virtualDataPointManager,
      errorBus: this.errorEventsBus,
      lifecycleBus: this.lifecycleEventsBus,
      measurementsBus: this.measurementsEventsBus
    });

    this.ledManager = new LedStatusService(
      this.configManager,
      this.dataSourcesManager
    );

    this.configManager.dataSourcesManager = this.dataSourcesManager;

    this.backend = new RestApiManager({
      configManager: this.configManager,
      dataSourcesManager: this.dataSourcesManager,
      dataSinksManager: this.dataSinksManager,
      dataPointCache: this.dataPointCache,
      vdpManager: this.virtualDataPointManager
    });

    this.hwEvents = new IoT2050HardwareEvents();
    this.tlsKeyManager = new TLSKeyManager();
  }

  /**
   * Launches agent
   */
  public async start() {
    try {
      await this.ledManager.init();
      this.setupKillEvents();

      await this.tlsKeyManager.generateKeys();
      await this.configManager.init();
      const regIdButtonEvent = this.hwEvents.registerCallback(async () => {
        try {
          await this.configManager.factoryResetConfiguration();
          await this.ledManager.turnOffLeds();
          await ConfigurationAgentManager.systemRestart();
        } catch (e) {
          winston.error(`Device factory reset error: ${e?.message}`);
        }
      });
      // Activate watcher
      await this.hwEvents.watchUserButtonLongPress();

      this.lifecycleEventsBus.push({
        id: 'device',
        level: EventLevels.Device,
        type: DeviceLifecycleEventTypes.LaunchSuccess
      });

      this.ledManager.runTimeStatus(true);
    } catch (error) {
      this.errorEventsBus.push({
        id: 'device',
        level: EventLevels.Device,
        type: DeviceLifecycleEventTypes.LaunchError,
        payload: JSON.stringify(error)
      });

      winston.error(`Error while launching. Exiting program. `);
      winston.error(JSON.stringify(error));

      process.exit(1);
    }
  }

  setupKillEvents() {
    //so the program will not close instantly
    process.stdin.resume();

    //do something when app is closing
    process.on('exit', (exitCode) => {
      winston.info(`Exited program, code:" ${exitCode}`);
    });

    //catches ctrl+c event
    process.on('SIGINT', this.signalHandler.bind(this, 'SIGINT'));

    process.on('SIGHUP', this.signalHandler.bind(this, 'SIGHUP'));
    process.on('SIGQUIT', this.signalHandler.bind(this, 'SIGQUIT'));
    process.on('SIGTERM', this.signalHandler.bind(this, 'SIGTERM'));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', this.signalHandler.bind(this, 'SIGUSR1'));
    process.on('SIGUSR2', this.signalHandler.bind(this, 'SIGUSR2'));

    //catches uncaught exceptions
    process.on('uncaughtException', this.exceptionHandler.bind(this));
    //catches unhandled rejection
    process.on('unhandledRejection', this.rejectionHandler.bind(this));
  }

  private exceptionHandler(e) {
    winston.error(`Exiting due unhandled exception.`);
    winston.error(e.stack);
    this.ledManager.runTimeStatus(false);
    process.exit(1);
  }

  private rejectionHandler(reason, promise) {
    winston.error(
      `Exiting due unhandled rejection at: ${JSON.stringify(
        promise
      )} reason: ${reason}`
    );
    this.ledManager.runTimeStatus(false);
    process.exit(1);
  }

  private signalHandler(signal) {
    winston.error(`Received signal ${signal}.`);
    this.ledManager.runTimeStatus(false);

    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGHUP');
    process.removeAllListeners('SIGQUIT');
    process.removeAllListeners('SIGTERM');

    // necessary to communicate the signal to the parent process
    process.kill(process.pid, signal);

    setTimeout(() => {
      process.exit(0);
    }, 100);
  }
}
