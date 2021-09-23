import net from 'net';
import winston from 'winston';
import { v1 as uuidv1 } from 'uuid';
import { DataItem } from './DataItem';
import { format } from 'date-fns';
import { ConfigManager } from '../ConfigManager';
import { IConfig, IMTConnectConfig } from '../ConfigManager/interfaces';

export interface Socket extends net.Socket {
  id?: string;
}

/**
 * Creates MTConnect adapter that accepts agents and send data items to them
 */
export class MTConnectAdapter {
  private TIMEOUT = 10000;
  private server: net.Server;
  private clients: Socket[] = [];
  private running;
  private dataItems: DataItem[] = [];
  private config: IMTConnectConfig;

  constructor(config: ConfigManager) {
    this.config = config.runtimeConfig.mtconnect;
    // register for config changes
    config.on('newConfig', this.configChangedHandler.bind(this));
  }

  /**
   * Listens for incoming client
   * @returns string
   */
  private listenForClients(_client: net.Socket) {
    const client: Socket = _client;
    client.id = uuidv1();

    winston.debug(`Client ${client.remoteAddress} connected`);
    this.clients.push(client);
    winston.debug(`Connected clients: ${this.clients.length}`);
    this.heartbeatClient(client);

    this.sendAllTo(client);
  }
  /**
   * Monitors connected clients and removes them on timeout or disconnect
   * @param  {Socket} client
   */
  private heartbeatClient(client: Socket) {
    client.setEncoding('utf8');
    client.on('end', () => {
      winston.debug(`Client disconnected`);
      this.clients = this.clients.filter((c) => c.id !== client.id);
      winston.debug(`Connected clients: ${this.clients.length}`);
    });
    client.setTimeout(this.TIMEOUT * 2, () => {
      winston.debug(`Client timed out`);
      client.destroy();
      this.clients = this.clients.filter((c) => c.id !== client.id);
      winston.debug(`Connected clients: ${this.clients.length}`);
    });
    client.on('data', (data: string) => {
      this.receive(client, data);
    });
  }

  /**
   * Handles all incoming messages from agents. Especially pings.
   * @returns string
   */
  private receive(client: net.Socket, data: string) {
    winston.debug(`Received data: ${data}`);

    if (data.startsWith('* PING\n')) {
      client.write(`* PONG ${this.TIMEOUT}\n`);
      winston.debug(`Received ping, sending pong, timeout: ${this.TIMEOUT}`);
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
   * Sends all data items to an agent
   * @returns void
   */
  private sendAllTo(client: Socket) {
    const { together } = this.getItemLists(true);

    if (together.length > 0) {
      let line = this.getCurrentUtcTimestamp();

      for (const item of together) line += '|' + item.toString();
      line += '\n';

      winston.debug(`Sending message: ${line}`);
      client.write(line);
    }
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
  public sendChanged(): void {
    const { together } = this.getItemLists();
    if (together.length > 0) {
      let line = this.getCurrentUtcTimestamp();

      for (const item of together) line += '|' + item.toString();
      line += '\n';

      winston.debug(`Sending message: ${line.replace(/\n+$/, '')}`);

      for (const client of this.clients) {
        client.write(line);
      }

      this.dataItems.forEach((item) => item.cleanup());
    }
  }

  /**
   * Starts server on configured port
   * @returns void
   */
  public start(): void {
    if (!this.running) {
      this.server = net.createServer();
      this.server.listen(this.config.listenerPort);

      this.server.on('connection', this.listenForClients.bind(this));

      winston.debug(
        `MTConnect Adapter listing on port ${this.config.listenerPort}`
      );
    }

    this.running = true;
  }

  /**
   * Stops server
   * @returns Promise
   */
  public async stop(): Promise<void> {
    if (this.running) {
      return new Promise((resolve) => {
        this.server.close(() => {
          resolve();
        });
      });
    }

    this.running = false;
    return;
  }
  private configChangedHandler(config: IConfig) {
    //TODO implement this
  }
}
