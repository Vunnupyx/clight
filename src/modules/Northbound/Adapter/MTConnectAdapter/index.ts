import { format } from 'date-fns';
import net from 'net';
import { v1 as uuidv1 } from 'uuid';
import winston from 'winston';
import { IMTConnectConfig } from '../../../ConfigManager/interfaces';
import { DataItem } from './DataItem';

export interface Socket extends net.Socket {
  id?: string;
}

/**
 * Creates MTConnect adapter that accepts agents and send data items to them
 */
export class MTConnectAdapter {
  protected name = MTConnectAdapter.name;
  private TIMEOUT = 10000;
  private server: net.Server | null = null;
  private clients: Socket[] = [];
  private _running: boolean = false;
  private dataItems: DataItem[] = [];

  constructor(private mtConfig: IMTConnectConfig) {}

  public get isRunning() {
    return this._running;
  }

  /**
   * Listens for incoming client
   * @returns string
   */
  private async listenForClients(_client: net.Socket) {
    const logPrefix = `${this.name}::listenForClients`;
    const client: Socket = _client;
    client.id = uuidv1();

    winston.info(`${logPrefix} client ${client.remoteAddress} connected`);
    this.clients.push(client);
    winston.info(`${logPrefix} connected clients: ${this.clients.length}`);
    this.heartbeatClient(client);

    await this.sendAllTo(client);
  }
  /**
   * Monitors connected clients and removes them on timeout or disconnect
   * @param  {Socket} client
   */
  private heartbeatClient(client: Socket) {
    const logPrefix = `${this.name}::heartbeatClient`;

    client.setEncoding('utf8');
    client.on('end', () => {
      winston.info(`${logPrefix} client disconnected`);
      this.clients = this.clients.filter((c) => c.id !== client.id);
      winston.info(`${logPrefix} connected clients: ${this.clients.length}`);
    });
    client.setTimeout(this.TIMEOUT * 2, () => {
      try {
        winston.info(`${logPrefix} client timed out`);
        client.destroy();
        this.clients = this.clients.filter((c) => c.id !== client.id);
        winston.info(`${logPrefix} connected clients: ${this.clients.length}`);
      } catch (error) {
        winston.error(`${logPrefix} error in timeout callback: ${error}`);
      }
    });
    client.on('data', async (data: string) => {
      await this.receive(client, data);
    });
  }

  /**
   * Handles all incoming messages from agents. Especially pings.
   * @returns string
   */
  private async receive(client: net.Socket, data: string) {
    // winston.debug(`Received data: ${data}`);

    if (data.startsWith('* PING\n')) {
      const line = `* PONG ${this.TIMEOUT}\n`;
      await this.writeToClient(client, line);
      // winston.debug(`Received ping, sending pong, timeout: ${this.TIMEOUT}`);
    }
  }

  /**
   * Returns current utc timestamp
   * @returns string
   */
  private getCurrentUtcTimestamp(): string {
    const time = new Date().getTime();
    const offset = new Date().getTimezoneOffset();
    const utcTime = time + offset * 60 * 1000;

    return format(new Date(utcTime), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'");
  }

  /**
   * Returns a list of all data items that should be sent together in on
   * message and a list of all data items that should be in a single line each
   * @param  {boolean=false} all
   * @returns object
   */
  private getItemLists(all: boolean = false): {
    together: DataItem[];
    separate: DataItem[];
  } {
    let together: DataItem[] = [];
    let separate: DataItem[] = [];

    for (const item of this.dataItems) {
      const list = item.itemList(all);
      if (item.newLine) {
        separate = [...separate, ...list];
      } else {
        together = [...together, ...list];
      }
    }

    return {
      together,
      separate
    };
  }

  /**
   * Sends all data items to an agent. That is initially required if an agent connects to the adapter
   * @returns void
   */
  private async sendAllTo(client: Socket) {
    const { together, separate } = this.getItemLists(true);

    if (together.length > 0) {
      let line = this.getCurrentUtcTimestamp();

      for (const item of together) line += '|' + item.toString();
      line += '\n';

      // winston.debug(`Sending message: ${line}`);
      await this.writeToClient(client, line);
    }

    if (separate.length > 0) {
      const timestamp = this.getCurrentUtcTimestamp();

      for (const item of separate) {
        const line = timestamp + '|' + item.toString() + '\n';

        // winston.debug(`Sending message: ${line.replace(/\n+$/, '')}`);

        await this.writeToClient(client, line);
      }
    }
  }

  /**
   * Writes data to client (Usually mtc adapters)
   * @param client
   * @param line
   */
  private async writeToClient(client: Socket, line: string) {
    const logPrefix = `${this.name}::writeToClient`;
    await new Promise<void>((resolve, reject) => {
      client.write(line, (err?: Error) => {
        if (err) {
          reject(err.message);
        }
        resolve();
      });
    }).catch((e) => {
      winston.warn(`${logPrefix} failed to write to client`);
      winston.error(JSON.stringify(e));
    });
  }

  /**
   * Adds an data item to adapter
   * @returns void
   */
  public addDataItem(item: DataItem) {
    if (!this.dataItems.some((_item) => _item === item)) {
      this.dataItems.push(item);
    }
  }

  /**
   * Removes all data items from adapter
   * @returns void
   */
  public removeAllDataItem() {
    this.dataItems = [];
  }

  /**
   * Removes a specific data item from adapter
   * @returns void
   */
  public removeDataItem(item: DataItem) {
    this.dataItems = this.dataItems.filter((_item) => _item !== item);
  }

  /**
   * Sends changed data items to all connected agents
   * @returns void
   */
  public async sendChanged(): Promise<void> {
    const { together, separate } = this.getItemLists();
    if (together.length > 0) {
      let line = this.getCurrentUtcTimestamp();

      for (const item of together) line += '|' + item.toString();
      line += '\n';

      if (this.clients.length > 0)
        // winston.debug(`Sending message: ${line.replace(/\n+$/, '')}`);

        for (const client of this.clients) {
          await this.writeToClient(client, line);
        }
    }

    if (separate.length > 0) {
      const timestamp = this.getCurrentUtcTimestamp();

      for (const item of separate) {
        const line = timestamp + '|' + item.toString() + '\n';

        if (this.clients.length > 0)
          // winston.debug(`Sending message: ${line.replace(/\n+$/, '')}`);

          for (const client of this.clients) {
            await this.writeToClient(client, line);
          }
      }
    }

    this.dataItems.forEach((item) => item.cleanup());
  }

  /**
   * Starts server on configured port
   * @returns void
   */
  public start(): void {
    if (!this._running) {
      this.server = net.createServer();
      this.server.listen(this.mtConfig.listenerPort);

      this.server.on('connection', this.listenForClients.bind(this));

      winston.info(
        `MTConnect Adapter listing on port ${this.mtConfig.listenerPort}`
      );
    }

    this._running = true;
  }

  /**
   * Stops server
   * @returns Promise
   */
  public async stop(): Promise<void> {
    if (this._running) {
      return new Promise((resolve) => {
        if (this.server) {
          this.server.close(() => {
            this._running = false;
            resolve();
          });
        } else {
          winston.warn(
            `${MTConnectAdapter.name}::stop requested server stop but server is undefined`
          );
        }
      });
    }
    return;
  }

  public shutdown(): Promise<void> {
    const logPrefix = `${MTConnectAdapter.name}::shutdown`;
    winston.debug(`${logPrefix} triggered.`);
    const shutdownFunctions: Promise<any>[] = [];
    this.clients.forEach((sock) => {
      let socketEndPromise: Promise<void> = new Promise((resolve, reject) => {
        sock.end();
        resolve();
      });
      sock.removeAllListeners();
      shutdownFunctions.push(socketEndPromise);
    });

    const serverShutdownPromise: Promise<void> = new Promise(
      async (resolve, reject) => {
        if (this.server?.removeAllListeners) this.server.removeAllListeners();
        if (this.server?.close) await this.server.close();
        this.server = null;
        resolve();
      }
    );

    shutdownFunctions.push(serverShutdownPromise);

    return Promise.all(shutdownFunctions)
      .then(() => {
        winston.info(`${logPrefix} successfully.`);
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}`);
        winston.error(err.stack);
      });
  }
}
