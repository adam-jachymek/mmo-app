import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActionMobSpawnDto } from './dto/ActionMobSpawn';

@Injectable()
export class ActionMobSpawnService {
  constructor(private prisma: PrismaService) {}

  async getActionMobSpawns(tileId: number) {
    return await this.prisma.actionMobSpawn.findMany(
      {
        where: {
          mapTiles: {
            some: {
              mapTile: {
                id: tileId,
              },
            },
          },
        },
        include: {
          mapTiles: true,
        },
      },
    );
  }

  async getManyActionMobSpawns(
    tilesIdsQuery: string[],
  ) {
    const tilesIds = Array.isArray(tilesIdsQuery)
      ? tilesIdsQuery.map((id) =>
          parseInt(id, 10),
        )
      : [parseInt(tilesIdsQuery, 10)];

    return await this.prisma.actionMobSpawn.findMany(
      {
        where: {
          mapTiles: {
            some: {
              mapTile: {
                id: { in: tilesIds },
              },
            },
          },
        },
        include: {
          mapTiles: true,
        },
      },
    );
  }

  async createActionMobSpawn(
    tilesIdsQuery: string[],
    dto: ActionMobSpawnDto,
  ) {
    const tilesIds = Array.isArray(tilesIdsQuery)
      ? tilesIdsQuery.map((id) =>
          parseInt(id, 10),
        )
      : [parseInt(tilesIdsQuery, 10)];

    const mapTilesData = tilesIds.map((id) => ({
      mapTile: {
        connect: {
          id: id,
        },
      },
    }));

    return await this.prisma.actionMobSpawn.create(
      {
        data: {
          ...dto,
          mapTiles: {
            create: mapTilesData,
          },
        },
      },
    );
  }

  async updateActionMobSpawn(
    actionMobSpawnId: number,
    tilesIdsQuery: string[],
    dto: ActionMobSpawnDto,
  ) {
    const tilesIds = Array.isArray(tilesIdsQuery)
      ? tilesIdsQuery.map((id) =>
          parseInt(id, 10),
        )
      : [parseInt(tilesIdsQuery, 10)];

    const mapTilesData = tilesIds.map((id) => ({
      mapTile: {
        connect: {
          id: id,
        },
      },
    }));

    return await this.prisma.actionMobSpawn.update(
      {
        where: {
          id: actionMobSpawnId,
        },
        data: {
          ...dto,
          mapTiles: {
            deleteMany: {
              actionMobSpawnId: actionMobSpawnId,
            },
            create: mapTilesData,
          },
        },
      },
    );
  }

  async addTilesToActionMobSpawn(
    actionMobSpawnId: number,
    tilesIdsQuery: string[],
  ) {
    const tilesIds = Array.isArray(tilesIdsQuery)
      ? tilesIdsQuery.map((id) =>
          parseInt(id, 10),
        )
      : [parseInt(tilesIdsQuery, 10)];

    const mapTilesData = tilesIds.map((id) => ({
      mapTile: {
        connect: {
          id: id,
        },
      },
    }));

    return await this.prisma.actionMobSpawn.update(
      {
        where: {
          id: actionMobSpawnId,
        },
        data: {
          mapTiles: {
            deleteMany: {
              actionMobSpawnId: actionMobSpawnId,
            },
            create: mapTilesData,
          },
        },
      },
    );
  }

  async deleteTilesFromActionMobSpawn(
    actionMobSpawnId: number,
    tilesIdsQuery: string[],
  ) {
    const tilesIds = Array.isArray(tilesIdsQuery)
      ? tilesIdsQuery.map((id) =>
          parseInt(id, 10),
        )
      : [parseInt(tilesIdsQuery, 10)];

    return await this.prisma.actionMobSpawn.update(
      {
        where: {
          id: actionMobSpawnId,
        },
        data: {
          mapTiles: {
            deleteMany: {
              actionMobSpawnId: actionMobSpawnId,
              mapTileId: { in: tilesIds },
            },
          },
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
