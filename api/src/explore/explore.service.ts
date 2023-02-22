import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BattleService } from 'src/battle/battle.service';
import { isEmpty } from 'lodash';

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
        include: {
          actionItemDrop: true,
          actionMobSpawns: true,
          teleportFrom: true,
          teleportTo: true,
        },
      });

    if (!isEmpty(tile.actionMobSpawns)) {
      const mobSpawn =
        await this.prisma.actionMobSpawn.findMany(
          {
            where: {
              mapTiles: {
                some: {
                  mapTile: {
                    id: tile.id,
                  },
                },
              },
            },
          },
        );

      async function randomMobOrNull(array) {
        let totalSpawnRate = 0;
        array.forEach((obj) => {
          totalSpawnRate += obj.spawnRate;
        });

        const randomNumber = Math.random() * 100;

        if (randomNumber < totalSpawnRate) {
          let currentRate = 0;
          for (let i = 0; i < array.length; i++) {
            currentRate += array[i].spawnRate;
            if (randomNumber < currentRate) {
              return array[i];
            }
          }
        }

        return null;
      }

      const selectedMob = await randomMobOrNull(
        mobSpawn,
      );

      if (selectedMob) {
        await this.battleService.createBattle(
          userId,
          {
            mobId: Number(selectedMob.mobId),
            mobMinLevel: Number(
              selectedMob.minLevel,
            ),
            mobMaxLevel: Number(
              selectedMob.maxLevel,
            ),
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
