import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BattleService } from 'src/battle/battle.service';

@Injectable()
export class ExploreService {
  constructor(
    private prisma: PrismaService,
    private readonly battleService: BattleService,
  ) {}

  async moveUser(
    userId: number,
    axis: string,
    direction: number,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    const newAxis = {
      x: user.x,
      y: user.y,
      [axis]: user[axis] + direction,
    };

    const tile =
      await this.prisma.mapTiles.findFirst({
        where: {
          mapId: user.mapId,
          ...newAxis,
        },
      });

    if (tile.action_name === 'TELEPORT') {
      const action =
        tile?.action as Prisma.JsonObject;

      const teleport =
        action.teleport as Prisma.JsonObject;

      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          mapId: Number(teleport.mapId),
          x: Number(teleport.newMapX),
          y: Number(teleport.newMapY),
        },
      });
    }

    if (tile.action_name === 'MOB') {
      const action =
        tile?.action as Prisma.JsonObject;

      const mobSpawn =
        action.mobSpawn as Prisma.JsonObject;

      const random = Math.random();

      const procent =
        Number(mobSpawn.procent) / 100;

      if (random < procent) {
        await this.battleService.createBattle(
          userId,
          {
            mobId: Number(mobSpawn.mobId),
          },
        );
      }

      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          [axis]: user[axis] + direction,
        },
      });
    }

    if (!tile.blocked) {
      return this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          [axis]: user[axis] + direction,
        },
      });
    }
  }
}
