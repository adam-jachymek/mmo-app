import { ExploreSocketGateway } from './../exploreSocket/exploreSocket.gateway';
import { ExploreSocketService } from './../exploreSocket/exploreSocket.service';
import { BattleService } from 'src/battle/battle.service';
import { ExploreService } from './../explore/explore.service';
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
    private readonly exploreService: ExploreService,
    private readonly battleService: BattleService,
    private readonly exploreSocket: ExploreSocketGateway,
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

    const user =
      await this.exploreService.moveUser(
        userIdNumber,
        axis,
        direction,
      );

    this.returnUser(userIdNumber);
    this.exploreSocket.updatePlayer(user.mapId);
  }

  async returnUser(userId: number) {
    const user = await this.userService.getUser(
      userId,
    );

    this.server
      .to(`user-${userId}`)
      .emit(`user-${userId}`, user);
  }

  @SubscribeMessage('startBattle')
  async startBattle(
    @MessageBody('userId') userId: number,
  ) {
    this.returnUser(Number(userId));
  }

  @SubscribeMessage('endBattle')
  async endBattle(
    @MessageBody('battleId') battleId: string,
    @MessageBody('userId') userId: number,
  ) {
    await this.battleService.endBattle(
      Number(battleId),
      Number(userId),
    );

    this.returnUser(Number(userId));
  }
}
