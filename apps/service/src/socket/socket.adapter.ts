import { WebSocketServer, WebSocket } from 'ws';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8080, { cors: { origin: '*' } }) // Ensure CORS is enabled
export class ServiceWebSocket
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(ServiceWebSocket.name);
  private server: WebSocketServer;

  constructor() {
    this.server = new WebSocketServer({ port: 8080 });
    this.logger.log('WebSocket server started on port 8080');

    this.server.on('connection', (client: WebSocket) => {
      this.logger.log('New client connected');

      client.on('message', (message) => {
        this.logger.log(`Received message: ${message}`);
        client.send(`Echo: ${message}`);
      });

      client.on('close', () => {
        this.logger.log('Client disconnected');
      });
    });
  }

  handleConnection(client: WebSocket) {
    this.logger.log('Client connected');
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log('Client disconnected');
  }

  close() {
    this.logger.log('Closing WebSocket server...');
    this.server.close();
  }
}
