import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMapDto, EditTileDto } from './dto';

@Injectable()
export class MapTilesService {
  constructor(private prisma: PrismaService) {}

  async createMapTiles(dto: CreateMapDto) {
    const xAxisCount = 20;
    const yAxisCount = 20;
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

  async editTile(
    tileId: number,
    dto: EditTileDto,
  ) {
    return await this.prisma.mapTiles.update({
      where: { id: tileId },
      data: {
        ...dto,
      },
    });
  }

  async updateManyTiles(data: {
    ids: number[];
    values: EditTileDto;
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
