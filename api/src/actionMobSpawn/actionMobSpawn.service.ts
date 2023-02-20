import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActionMobSpawnDto } from './dto/ActionMobSpawn';

@Injectable()
export class ActionMobSpawnService {
  constructor(private prisma: PrismaService) {}

  async getMobSpawns(tileId: number) {
    return await this.prisma.actionMobSpawn.findMany(
      {
        where: {
          mapTileId: tileId,
        },
      },
    );
  }

  async createOrUpdateMobSpawn(
    tileId: number,
    dto: ActionMobSpawnDto,
    actionMobSpawnId?: number,
  ) {
    return await this.prisma.actionMobSpawn.upsert(
      {
        where: { id: actionMobSpawnId || 0 },
        update: {
          ...dto,
        },
        create: {
          mapTileId: tileId,
          ...dto,
        },
      },
    );
  }

  async deleteMobSpawn(actionMobId: number) {
    return this.prisma.actionMobSpawn.delete({
      where: {
        id: actionMobId,
      },
    });
  }
}
