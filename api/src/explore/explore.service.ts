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

    if (!tile || tile.blocked) {
      return;
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

    if (!isEmpty(tile.actionMobSpawns)) {
      const mobSpawns =
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
            include: {
              drop: true,
            },
          },
        );

      const selectedMob =
        this.randomMobOrNull(mobSpawns);

      if (selectedMob) {
        const droppedItems = this.getItemsToDrop(
          selectedMob.drop,
        );

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
            dropArray: droppedItems,
          },
        );
      }
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

  getItemsToDrop(dropItems) {
    const itemsToDrop = [];

    for (const item of dropItems) {
      const randomValue = Math.random() * 100;
      if (randomValue <= item.dropRate) {
        const quantity =
          Math.floor(
            Math.random() *
              (item.quantityMax -
                item.quantityMin),
          ) + item.quantityMin;
        for (let j = 0; j < quantity; j++) {
          itemsToDrop.push(item);
        }
      }
    }

    return itemsToDrop;
  }

  randomMobOrNull(mobSpawns) {
    let totalSpawnRate = 0;
    mobSpawns.forEach((mobSpawn) => {
      totalSpawnRate += mobSpawn.spawnRate;
    });

    const randomNumber = Math.random() * 100;

    if (randomNumber < totalSpawnRate) {
      let currentRate = 0;
      for (let i = 0; i < mobSpawns.length; i++) {
        currentRate += mobSpawns[i].spawnRate;
        if (randomNumber < currentRate) {
          return mobSpawns[i];
        }
      }
    }

    return null;
  }
}
