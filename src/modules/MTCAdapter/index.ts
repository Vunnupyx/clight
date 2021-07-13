import net from "net";
import winston from "winston";
import { v1 as uuidv1 } from "uuid";
import { DataItem } from "./DataItem";
import { format } from "date-fns";

interface Socket extends net.Socket {
  id?: string;
}

class MTCAdapter {
  private TIMEOUT = 10000;
  private server: net.Server;
  private clients: Socket[] = [];
  private running;
  private dataItems: DataItem[] = [];

  private listenForClients(_client: net.Socket) {
    const client: Socket = _client;
    client.id = uuidv1();

    winston.debug(`Client ${client.remoteAddress} connected`);
    this.clients.push(client);
    winston.debug(`Connected clients: ${this.clients.length}`);
    this.heartbeatClient(client);

    this.sendAllTo(client);
  }

  private heartbeatClient(client: Socket) {
    client.setEncoding("utf8");
    client.on("end", () => {
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
    client.on("data", (data: string) => {
      this.receive(client, data);
    });
  }

  private receive(client: net.Socket, data: string) {
    winston.debug(`Received data: ${data}`);

    if (data.startsWith("* PING\n")) {
      client.write(`* PONG ${this.TIMEOUT}\n`);
      winston.debug(`Received ping, sending pong, timeout: ${this.TIMEOUT}`);
    }
  }

  private getCurrentUtcTimestamp(): string {
    const time = new Date().getTime();
    const offset = new Date().getTimezoneOffset();
    const utcTime = time + offset * 60 * 1000;

    return format(new Date(utcTime), "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'");
  }

  private getItemLists(all: boolean = false) {
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
      separate,
    };
  }

  private sendAllTo(client: Socket) {
    const { together } = this.getItemLists(true);

    if (together.length > 0) {
      let line = this.getCurrentUtcTimestamp();

      for (const item of together) line += "|" + item.toString();
      line += "\n";

      winston.debug(`Sending message: ${line}`);
      client.write(line);
    }

    // TODO Send separate
  }

  public addDataItem(item: DataItem) {
    if (!this.dataItems.some((_item) => _item === item)) {
      this.dataItems.push(item);
    }
  }

  public removeAllDataItem() {
    this.dataItems = [];
  }

  public removeDataItem(item: DataItem) {
    this.dataItems = this.dataItems.filter((_item) => _item !== item);
  }

  public sendChanged() {
    const { together } = this.getItemLists(true);
    if (together.length > 0) {
      let line = this.getCurrentUtcTimestamp();

      for (const item of together) line += "|" + item.toString();
      line += "\n";

      winston.debug(`Sending message: ${line}`);

      for (const client of this.clients) {
        client.write(line);
      }
    }

    // TODO Send separate
  }

  public start(): void {
    if (!this.running) {
      this.server = net.createServer();
      this.server.listen(7878);

      this.server.on("connection", this.listenForClients.bind(this));

      winston.debug("MTConnect Adapter listing on port 7878");
    }

    this.running = true;
  }
}

export default MTCAdapter;
