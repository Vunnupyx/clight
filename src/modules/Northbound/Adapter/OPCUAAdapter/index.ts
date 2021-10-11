import fs from 'fs-extra';
import {
  BaseNode,
  OPCUAServer,
  NodeIdLike,
  UAObject,
  UserManagerOptions,
  OPCUACertificateManager
} from 'node-opcua';
import { CertificateManager } from 'node-opcua-pki';
import winston from 'winston';

import { ConfigManager } from '../../../ConfigManager';
import {
  IGeneralConfig,
  IOPCUAConfig,
  IUser,
  IConfig,
  IDataSinkConfig
} from '../../../ConfigManager/interfaces';
import { AdapterError, NorthBoundError } from '../../../../common/errors';
import path from 'path';
import { compare } from 'bcrypt';

interface IOPCUAAdapterOptions {
  config: IDataSinkConfig,
  runtimeConfig: IOPCUAConfig,
  generalConfig: IGeneralConfig,
}
/**
 * Implementation of OPCUA adapter.
 */
export class OPCUAAdapter {
  
  private opcuaRuntimeConfig: IOPCUAAdapterOptions['runtimeConfig'];
  private dataSinkConfig: IOPCUAAdapterOptions['config'];
  private generalConfig: IOPCUAAdapterOptions['generalConfig'];

  private auth: boolean;
  private users: IUser[];
  
  private server: OPCUAServer;
  private _running = false;
  private nodesetDir: string;

  private userManager: UserManagerOptions;
  private serverCertificateManager: OPCUACertificateManager;

  static readonly className = OPCUAAdapter.name;
  private static shutdownTimeoutMs = 1000;

  constructor(options: IOPCUAAdapterOptions) {
    this.opcuaRuntimeConfig = options.runtimeConfig
    this.dataSinkConfig = options.config;
    this.generalConfig = options.generalConfig;

    if(!this.dataSinkConfig.auth) {
      // Enable anonymous if no auth infos are found
      this.auth = true;
    } else {
      this.auth = this.dataSinkConfig.auth.type !== 'userpassword' ? true : false;
    }
    this.users = [{
      userName: this.dataSinkConfig?.auth?.userName,
      password: this.dataSinkConfig?.auth?.password
    }]
  }

  public get isRunning() {
    return this._running;
  }

  /**
   * Returns configured machine name or place empty if neither manufacturer nor serialNumber configured
   */
  private getMachineName() {
    if (!this.generalConfig.manufacturer && !this.generalConfig.serialNumber)
      return 'UnnamedMachine';
    else
      return `${
        this.generalConfig.manufacturer ? this.generalConfig.manufacturer : ''
      }${
        this.generalConfig.manufacturer && this.generalConfig.serialNumber
          ? '-'
          : ''
      }${
        this.generalConfig.serialNumber ? this.generalConfig.serialNumber : ''
      }`;
  }

  /**
   * Rewrites all xml nodesets into tmp folder and replaces static texts like the machineName
   */
  private async setupNodesets() {
    this.nodesetDir = path.join(process.cwd(), 'mdclight/config/tmpnodesets');
    await fs.copy(this.opcuaRuntimeConfig.nodesetDir, this.nodesetDir);
    const files = (await fs.readdir(this.nodesetDir)) as string[];
    const fullFiles = files.map((file) => path.join(this.nodesetDir, file));

    for (const file of fullFiles)
      if (file.includes('dmgmori-umati-v')) {
        fs.writeFileSync(
          file,
          fs
            .readFileSync(file, 'utf8')
            .split('{{machineName}}')
            .join(this.getMachineName())
        );
      }

    return fullFiles;
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
    if (this._running) {
      const errorMsg = `${logPrefix} try to start adapter but already running.`;
      winston.debug(errorMsg);
      return Promise.resolve();
    }
    this.server
      .start()
      .then(() => {
        this._running = true;
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

  /**
   * Initializes opc ua server. Also initially sets up certificates on first startup
   */
  public async init(): Promise<OPCUAAdapter> {
    const logPrefix = `${OPCUAAdapter.className}::init`;
    winston.info(`${logPrefix} initialing.`);
    if (this._running) {
      winston.info(`${logPrefix} adapter already running.`);
      return this;
    }
    if (this.server && this.server.initialized) {
      winston.info(
        `${OPCUAAdapter.className}::init adapter already initialized.`
      );
      return this;
    }

    const applicationUri = this.opcuaRuntimeConfig.serverInfo.applicationUri;
    const certificateFolder = path.join(process.cwd(), 'mdclight/config/certs');
    const certificateFile = path.join(
      certificateFolder,
      'server_certificate.pem'
    );

    this.serverCertificateManager = new OPCUACertificateManager({
      automaticallyAcceptUnknownCertificate: true,
      rootFolder: certificateFolder
    });

    await this.serverCertificateManager.initialize();

    if (!fs.existsSync(certificateFolder)) {
      fs.mkdirSync(certificateFolder);
    }

    if (!fs.existsSync(certificateFile)) {
      winston.info(`Creating certificate: ${certificateFile}`);

      const pkiM = new CertificateManager({
        location: certificateFolder
      });
      await pkiM.initialize();
      await pkiM.createSelfSignedCertificate({
        applicationUri,
        subject: '/CN=MDClightOPCUAServer',
        startDate: new Date(),
        dns: [],
        validity: 365 * 100,
        outputFile: certificateFile
      });
      winston.info(`Certificate ${certificateFile} created`);
    }

    const privateKeyFile = this.serverCertificateManager.privateKey;

    this.serverCertificateManager = new OPCUACertificateManager({
      rootFolder: certificateFolder
    });

    this.userManager = {
      isValidUserAsync: async (userName: string, password: string, cb: (any, bool) => void): Promise<void> => {
        const user = this.users.find((user) => userName === user.userName);
        if (!user) {
          const errMsg = `No user information found. Log in was rejected.`;
          cb(new NorthBoundError(errMsg, null, 'OPCUAAdapter', 'isValidUserAsync'), false);
          return;
        }
        const valid = await compare(password, user.password);
        if (!valid) winston.warn(`${user} try to login with wrong password.`);
        cb(null, valid);
      }
    };

    const nodeSets = await this.setupNodesets();

    // TODO: Inject project logger to OPCUAServer
    this.server = new OPCUAServer({
      ...{...this.opcuaRuntimeConfig, ...{allowAnonymous: this.auth }},
      userManager: this.userManager,
      serverCertificateManager: this.serverCertificateManager,
      privateKeyFile,
      certificateFile,
      nodeset_filename: nodeSets
    });

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
    if (!this._running) {
      winston.debug(`${logPrefix} try to stop a already stopped adapter`);
      return Promise.resolve();
    }

    return this.server
      .shutdown(timeoutMs || OPCUAAdapter.shutdownTimeoutMs)
      .then(() => {
        this._running = false;
        winston.info(`${logPrefix} adapter stopped.`);
      })
      .catch((err) => {
        const errMsg = `${logPrefix} try to stop adapter error due to ${JSON.stringify(
          err
        )}`;
        return Promise.reject(new NorthBoundError(errMsg));
      });
  }

  public findNode(nodeIdentifier: NodeIdLike): BaseNode | null {
    const logPrefix = `${OPCUAAdapter.className}::findNode`;
    const node = this.server.engine.addressSpace.findNode(nodeIdentifier);

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