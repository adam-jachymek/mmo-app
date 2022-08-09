import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody()
    createMessageDto: CreateMessageDto,
  ) {
    const message =
      await this.messagesService.create(
        createMessageDto,
      );

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  join(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.join(
      name,
      client.id,
    );
  }

  // TO DO - add rooms

  // @SubscribeMessage('joinRoom')
  // joinRoom(
  //   @MessageBody('room') room: string,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   client.join(room);
  // }

  // @SubscribeMessage('leaveRoom')
  // leaveRoom(
  //   @MessageBody('room') room: string,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   client.leave(room);
  // }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name =
      await this.messagesService.getClientName(
        client.id,
      );

    client.broadcast.emit('typing', {
      name,
      isTyping,
    });
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(
    @MessageBody()
    updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(
      updateMessageDto.id,
      updateMessageDto,
    );
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }
}
