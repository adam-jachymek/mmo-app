import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import Socket from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server;

  // @SubscribeMessage('message')
  // handleMessage(
  //   @MessageBody()
  //   data: {
  //     name: string;
  //     message: string;
  //   },
  // ): void {
  //   this.server.emit('message', data);
  // }

  // @SubscribeMessage('events')
  // handleEvent(client, data: string): string {
  //   return data;
  // }

  // @SubscribeMessage('join')
  // joinRoom(
  //   @MessageBody('name') name: string,
  //   @ConnectedSocket() client,
  // ): void {
  //   this.server.emit('join', client.id);
  // }
}
