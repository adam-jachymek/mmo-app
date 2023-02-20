import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMapDto, EditMapDto } from './dto';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  getMap() {
    return this.prisma.map.findMany({
      include: { tiles: true },
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
        tiles: {
          orderBy: {
            id: 'asc',
          },
          include: {
            actionMobSpawn: true,
            actionItemDrop: true,
            teleportFrom: true,
            teleportTo: true,
          },
        },
      },
    });
  }

  async createMap(dto: CreateMapDto) {
    const map = await this.prisma.map.create({
      data: {
        ...dto,
      },
    });

    return map;
  }

  async editMapById(
    userId: number,
    mapId: number,
    dto: EditMapDto,
  ) {
    // get the item by id
    const map = await this.prisma.map.findUnique({
      where: {
        id: mapId,
      },
    });

    return this.prisma.map.update({
      where: {
        id: mapId,
      },
      data: {
        ...dto,
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
