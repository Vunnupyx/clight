import { OPCUAServer, NodeIdLike, BaseNode } from 'node-opcua';
import winston from 'winston';

import { ConfigManager } from '../ConfigManager';
import { IOPCUAConfig } from '../ConfigManager/interfaces';
import { AdapterError, NorthBoundError } from '../../common/errors';

/**
 * Implementation of OPCUA adapter.
 * TODO: extend description
 */
export class OPCUAAdapter {
  private server: OPCUAServer;
  private config: IOPCUAConfig;
  private running = false;

  private static className: string;
  private static shutdownTimeoutMs = 1000;

  constructor(config: ConfigManager) {
    OPCUAAdapter.className = this.constructor.name;
    OPCUAAdapter.configValidation(config);
    this.config = config.runtimeConfig.opcua;
    // TODO: Inject project logger to OPCUAServer
    this.server = new OPCUAServer(this.config);
  }

  /**
   * Validation check for config data at runtime.
   *
   * @param config
   * @throws NorthboundError if any required configuration is missing.
   */
  private static configValidation(config: ConfigManager) {
    const logPrefix = `${this.className} error due to`;
    if (!config)
      throw new NorthBoundError(`${logPrefix} no ConfigManager found.`);
    if (!config.runtimeConfig)
      throw new NorthBoundError(`${logPrefix} no runtime config found.`);
    if (!config.runtimeConfig.opcua)
      throw new NorthBoundError(`${logPrefix} no opcua config found.`);
  }

  /**
   * Start Adapter
   *
   * @returns Promise
   * - resolved if successfully started or already running
   * - rejected with
   *  - AdapterError if server is not initialized
   */
  public async start(): Promise<void> {
    const logPrefix = `${OPCUAAdapter.className}::start`;
    const checked = this.initCheck(logPrefix);
    if (checked) return Promise.reject(checked);
    if (this.running) {
      const errorMsg = `${logPrefix} try to start adapter but already running.`;
      winston.debug(errorMsg);
      return Promise.resolve();
    }
    this.server
      .start()
      .then(() => {
        this.running = true;
        winston.info(`${logPrefix} adapter successfully started.`);
      })
      .catch((err) => {
        const errorMsg = `${logPrefix} error due to ${JSON.stringify(err)}`;
        return Promise.reject(new NorthBoundError(errorMsg));
      });
  }

  public async init(): Promise<OPCUAAdapter> {
    const logPrefix = `${OPCUAAdapter.className}::init`;
    if (this.running) {
      winston.info(`${logPrefix} adapter already running.`);
      return this;
    }
    if (this.server.initialized) {
      winston.info(
        `${OPCUAAdapter.className}::init adapter already initialized.`
      );
      return this;
    }
    return this.server
      .initialize()
      .then(() => {
        winston.info(`${logPrefix} initialized.`);
        return this;
      })
      .catch((err) => {
        return Promise.reject(
          new AdapterError(
            `${logPrefix} error during initial node-opcua server due to ${JSON.stringify(
              err
            )}.`
          )
        );
      });
  }

  /**
   * Stop server with a given timeout. If no timeout is given uses static value.
   *
   * @returns Promise
   *  - resolved if successful shutdown
   *  - rejected on any error
   */
  public async stop(timeoutMs?: number): Promise<void> {
    const logPrefix = `${OPCUAAdapter.className}::stop`;
    if (!this.running) {
      winston.debug(`${logPrefix} try to stop a already stopped adapter`);
      return Promise.resolve();
    }

    return this.server
      .shutdown(timeoutMs || OPCUAAdapter.shutdownTimeoutMs)
      .then(() => {
        this.running = false;
        winston.info(`${logPrefix} adapter stopped.`);
      })
      .catch((err) => {
        const errMsg = `${logPrefix} try to stop adapter error due to ${JSON.stringify(
          err
        )}`;
        return Promise.reject(new NorthBoundError(errMsg));
      });
  }

  private getNameSpaces() {
    const logPrefix = `${OPCUAAdapter.className}::getNamespace`;
    const checked = this.initCheck(logPrefix);
    if (checked) throw checked;
    return this.server.engine.addressSpace.getNamespaceArray();
  }

  private findNode(nodeIdentifier: NodeIdLike): BaseNode | null {
    const logPrefix = `${OPCUAAdapter.className}::findNode`;
    return this.server.engine.addressSpace.findNode(nodeIdentifier);
  }

  /**
   * TODO: Write Doku.
   */
  private initCheck(logPrefix: string): AdapterError | void {
    if (!this.server.initialized) {
      return new AdapterError(
        `${logPrefix} error due to adapter not initialized.`
      );
    }
  }
}
