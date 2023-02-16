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

  async updateMany(data: {
    ids: number[];
    values: EditMapDto;
  }) {
    return await this.prisma.mapTiles.updateMany({
      where: {
        id: { in: data.ids },
      },
      data: { ...data.values },
    });
  }

  async deleteMapById(tileId: number) {
    return this.prisma.mapTiles.delete({
      where: {
        id: tileId,
      },
    });
  }
}
