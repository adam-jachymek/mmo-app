import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MobSpawnService } from 'src/mobSpawn/mobSpawn.service';
import { MapService } from 'src/map/map.service';
import {
  CreateExploreDto,
  EditExploreDto,
} from './dto';

@Injectable()
export class ExploreService {
  constructor(
    private prisma: PrismaService,
    private readonly MobSpawnService: MobSpawnService,
    private readonly MapService: MapService,
  ) {}

  async getExplore(mapId: number) {
    const productsCount =
      await this.prisma.explore.count();
    const skip = Math.floor(
      Math.random() * productsCount,
    );

    const whatFound =
      await this.prisma.explore.findFirst({
        skip: skip,
      });

    return whatFound;
  }
}
