import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattleService } from 'src/battle/battle.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@WebSocketGateway({ cors: true })
export class BattleSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly battleService: BattleService,
  ) {}

  @SubscribeMessage('joinBattle')
  async joinBattle(
    socket: Socket,
    battleId: number,
  ) {
    const battleSocket = battleId.toString();

    socket.join(battleSocket);

    const battle =
      await this.battleService.getBattle(
        Number(battleId),
      );

    this.server
      .to(battleSocket)
      .emit(battleSocket, battle);
  }

  @SubscribeMessage('turn')
  async turn(battleId: number) {
    const battleSocket = battleId.toString();

    const getUser =
      await this.battleService.getBattle(
        Number(battleId),
      );

    await this.battleService.turn(
      getUser.usersInBattle[0].user,
      battleId,
    );

    const battle =
      await this.battleService.getBattle(
        Number(battleId),
      );

    this.server
      .to(battleSocket)
      .emit(battleSocket, battle);
  }
}
