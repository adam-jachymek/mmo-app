import { UserSocketGateway } from 'src/userSocket/userSocket.gateway';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattleService } from 'src/battle/battle.service';

@WebSocketGateway({ cors: true })
export class BattleSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly battleService: BattleService,
    private readonly userSocket: UserSocketGateway,
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
    @MessageBody('mobAnimation')
    mobAnimation: string,
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

      await this.delay(500);

      const mobAfterAttack =
        await this.battleService.userAttack(
          battleIdInt,
          userId,
        );

      this.sendUpdate(
        battleId,
        mobAnimation,
        null,
        mobAfterAttack.damage,
      );

      if (mobAfterAttack?.mob.hp > 0) {
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

    const playerAnimation = 'bite';

    const userAfterAttack =
      await this.battleService.attackUser(
        battleIdInt,
        userId,
      );

    await this.delay(500);

    if (userAfterAttack.user.hp > 0) {
      await this.battleService.userTurnChanger(
        battleIdInt,
        true,
      );
      this.sendUpdate(
        battleId,
        null,
        playerAnimation,
        0,
        userAfterAttack.damage,
      );
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

  async sendUpdate(
    battleId: string,
    mobAnimation?: string,
    playerAnimation?: string,
    userDamage?: number,
    mobDamage?: number,
  ) {
    const battleSocket = battleId.toString();

    const battle =
      await this.battleService.returnBattle(
        Number(battleId),
        mobAnimation,
        playerAnimation,
        userDamage,
        mobDamage,
      );

    this.server
      .to(battleSocket)
      .emit(battleSocket, battle);
  }
}
