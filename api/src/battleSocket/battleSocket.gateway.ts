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
import { NoInferType } from '@nestjs/config';
import { stringify } from 'querystring';

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
    battleId: string,
  ) {
    socket.join(battleId);

    this.startBattle(battleId);

    this.server
      .to(battleId)
      .emit(
        battleId,
        `You joined to the battle: ${battleId}, user: ${socket.id}`,
      );
  }

  @SubscribeMessage('startBattle')
  async startBattle(battleId: string) {
    const battleIdInt = Number(battleId);

    await this.battleService.startBattle(
      battleIdInt,
    );

    const battle =
      await this.battleService.returnBattle(
        battleIdInt,
      );

    this.server
      .to(battleId)
      .emit(battleId, battle);
  }

  @SubscribeMessage('userAttack')
  async userAttack(
    @MessageBody('battleId') battleId: string,
    @MessageBody('userId') userId: number,
  ) {
    const battleIdInt = Number(battleId);

    const battle =
      await this.battleService.returnBattle(
        Number(battleId),
      );

    if (userId === battle.activeUser) {
      await this.battleService.userTurnChanger(
        battleIdInt,
        false,
      );

      this.sendUpdate(battleId);

      await this.delay(1000);

      const mobAfterAttack =
        await this.battleService.userAttack(
          battleIdInt,
          userId,
        );

      this.sendUpdate(battleId);

      if (mobAfterAttack.hp > 0) {
        await this.attackUser(battleId, userId);
      } else {
        await this.youWin(battleId);
      }
    }
  }

  async attackUser(
    battleId: string,
    userId: number,
  ) {
    const battleIdInt = Number(battleId);

    const userAfterAttack =
      await this.battleService.attackUser(
        battleIdInt,
        userId,
      );

    await this.delay(1000);

    if (userAfterAttack.hp > 0) {
      await this.battleService.userTurnChanger(
        battleIdInt,
        true,
      );
      this.sendUpdate(battleId);
    } else {
      this.youLost(battleId);
    }
  }

  async youWin(battleId: string) {
    const battleIdInt = Number(battleId);

    await this.battleService.youWin(battleIdInt);
    this.sendUpdate(battleId);
  }

  async youLost(battleId: string) {
    const battleIdInt = Number(battleId);

    await this.battleService.youLost(battleIdInt);
    this.sendUpdate(battleId);
  }

  async delay(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms),
    );
  }

  async sendUpdate(battleId: string) {
    const battleSocket = battleId.toString();

    const battle =
      await this.battleService.returnBattle(
        Number(battleId),
      );

    this.server
      .to(battleSocket)
      .emit(battleSocket, battle);
  }
}
