import { Module } from '@nestjs/common';
import { ServiceWebSocket } from './socket.adapter';

@Module({
  providers: [ServiceWebSocket],
})
export class SocketModule {}
