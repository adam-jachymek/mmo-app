import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMapDto, EditMapDto } from './dto';

@Injectable()
export class MapTilesService {
  constructor(private prisma: PrismaService) {}

  async createMapTiles(dto: CreateMapDto) {
    const xAxisCount = 10;
    const yAxisCount = 10;
    for (let y = 0; y < yAxisCount; y++) {
      for (let x = 0; x < xAxisCount; x++) {
        await this.prisma.mapTiles.create({
          data: {
            ...dto,
            x,
            y,
          },
        });
      }
    }
  }

  async editTileById(
    tileId: number,
    dto: EditMapDto,
  ) {
    return this.prisma.mapTiles.update({
      where: {
        id: tileId,
      },
      data: {
        ...dto,
      },
    });
  }

  getMap() {
    return this.prisma.map.findMany({
      include: { mobs: true },
    });
  }

  getMapAdmin() {
    return this.prisma.map.findMany({});
  }

  getMapById(mapId: number) {
    return this.prisma.map.findFirst({
      where: {
        id: mapId,
      },
      include: {
        mobs: true,
      },
    });
  }

  async deleteMapById(
    userId: number,
    mapId: number,
  ) {
    const map = await this.prisma.map.findUnique({
      where: {
        id: mapId,
      },
    });

    // check if user owns the map
    // if (!map || item.id !== userId)
    //   throw new ForbiddenException(
    //     'Access to resources denied',
    //   );

    await this.prisma.map.delete({
      where: {
        id: mapId,
      },
    });
  }
}
