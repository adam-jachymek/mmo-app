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
            include: {
              drop: true,
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

        const dropItems = [
          {
            id: 1,
            dropRate: 30,
          },
          {
            id: 2,
            dropRate: 50,
          },
        ];

        return null;
      }

      const selectedMob = await randomMobOrNull(
        mobSpawn,
      );

      if (selectedMob) {
        function getDroppedItems(dropItems) {
          const totalDropRate = dropItems.reduce(
            (sum, item) => sum + item.dropRate,
            0,
          );
          const items = [];
          const count = Math.floor(
            Math.random() *
              (dropItems.length + 1),
          );

          for (let i = 0; i < count; i++) {
            const randomValue =
              Math.random() * 100;
            let accumulatedDropRate = 0;

            for (const item of dropItems) {
              accumulatedDropRate +=
                item.dropRate;
              if (
                randomValue <= accumulatedDropRate
              ) {
                const quantity =
                  Math.floor(
                    Math.random() *
                      (item.quantityMax -
                        item.quantityMin),
                  ) + item.quantityMin;
                for (
                  let j = 0;
                  j < quantity;
                  j++
                ) {
                  items.push(item);
                }
                break;
              }
            }
          }

          return items;
        }

        console.log('DROP:');

        const droppedItems = getDroppedItems(
          selectedMob.drop,
        );

        console.log(droppedItems);

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
