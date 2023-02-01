import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class UserSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('connectUser')
  async connectUser(
    socket: Socket,
    userId: number,
  ) {
    socket.join(`user-${userId}`);
    const userIdNumber = Number(userId);

    this.server
      .to(`user-${userId}`)
      .emit(
        `user-${userId}`,
        `You joined to the user: ${userId}, user: ${socket.id}`,
      );

    this.returnUser(userIdNumber);
  }

  @SubscribeMessage('healUser')
  async healUser(
    @MessageBody('userId') userId: number,
  ) {
    const userIdNumber = Number(userId);

    await this.userService.healUser(userIdNumber);

    this.returnUser(userIdNumber);
  }

  @SubscribeMessage('updateUser')
  async updateUser(
    @MessageBody('userId') userId: number,
  ) {
    const userIdNumber = Number(userId);

    this.returnUser(userIdNumber);
  }

  @SubscribeMessage('moveUser')
  async explore(
    @MessageBody('userId') userId: number,
    @MessageBody('axis') axis: string,
    @MessageBody('direction') direction: number,
  ) {
    const userIdNumber = Number(userId);

    await this.userService.moveUser(
      userIdNumber,
      axis,
      direction,
    );

    this.returnUser(userIdNumber);
  }

  async returnUser(userId: number) {
    const user = await this.userService.getUser(
      userId,
    );

    this.server
      .to(`user-${userId}`)
      .emit(`user-${userId}`, user);
  }
}
