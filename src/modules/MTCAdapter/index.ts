import net from "net";

class MTCAdapter {
    private server: net.Server;
    private clients: net.Socket;

    private running

    listenForClients(client: net.Socket) {
        this.clients.push(client)
    }

    heartbeat(client: net.Socket) {

    }

    start():void {
        if(!this.running) {
            this.server = net.createServer();

            this.server.on('connection',this.listenForClients)
        }

        this.running = true;
    }
}