import fs from 'fs';
import {
  OPCUAServer,
  NodeIdLike,
  UAVariable,
  UserManagerOptions,
  OPCUACertificateManager
} from 'node-opcua';
import winston from 'winston';

import { ConfigManager } from '../ConfigManager';
import { IOPCUAConfig, IUser } from '../ConfigManager/interfaces';
import { AdapterError, NorthBoundError } from '../../common/errors';
import path from 'path';

/**
 * Implementation of OPCUA adapter.
 * TODO: extend description
 */
export class OPCUAAdapter {
  private server: OPCUAServer;
  private config: IOPCUAConfig;
  private users: IUser[];
  private running = false;

  private userManager: UserManagerOptions;
  private serverCertificateManager: OPCUACertificateManager;

  private static className: string;
  private static shutdownTimeoutMs = 1000;

  constructor(config: ConfigManager) {
    OPCUAAdapter.className = this.constructor.name;
    OPCUAAdapter.configValidation(config);
    this.config = config.runtimeConfig.opcua;
    this.users = config.runtimeConfig.users;

    const certPath = path.join(process.cwd(), 'mdclight/config/certs');
    if (!fs.existsSync(certPath)) {
      winston.info(
        `Certificate folder (${certPath}) does not exist. Creating...`
      );
      fs.mkdirSync(certPath);
    }

    this.serverCertificateManager = new OPCUACertificateManager({
      rootFolder: certPath
    });
    this.serverCertificateManager.initialize();

    this.userManager = {
      isValidUser: (userName: string, password: string): boolean => {
        return this.users.some(
          (user) => userName === user.userName && password === user.password
        );
      }
    };

    // TODO: Inject project logger to OPCUAServer
    this.server = new OPCUAServer({
      ...this.config,
      userManager: this.userManager
    });
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
        const endpointUrl =
          this.server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        winston.info(
          `${logPrefix} adapter successfully started. The primary server endpoint url is ${endpointUrl}`
        );
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

  public findNode(nodeIdentifier: NodeIdLike): UAVariable | null {
    const logPrefix = `${OPCUAAdapter.className}::findNode`;
    const node = this.server.engine.addressSpace.findNode(
      nodeIdentifier
    ) as UAVariable;

    if (node) return node;
    winston.warn(`${logPrefix} Node with id ${nodeIdentifier} not found!`);
    return null;
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
