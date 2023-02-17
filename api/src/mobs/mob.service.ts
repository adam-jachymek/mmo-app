import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMobDto, EditMobDto } from './dto';

@Injectable()
export class MobService {
  constructor(private prisma: PrismaService) {}

  getMobs() {
    return this.prisma.mob.findMany();
  }

  getMobById(mobId: number) {
    return this.prisma.mob.findFirst({
      where: {
        id: mobId,
      },
    });
  }

  async createMob(dto: CreateMobDto) {
    const mob = await this.prisma.mob.create({
      data: {
        ...dto,
        sprite: dto.name.toLowerCase(),
      },
    });

    return mob;
  }

  async editMobById(
    mobId: number,
    dto: EditMobDto,
  ) {
    return await this.prisma.mob.update({
      where: {
        id: mobId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteMobById(mobId: number) {
    const mob = await this.prisma.mob.findUnique({
      where: {
        id: mobId,
      },
    });

    await this.prisma.mob.delete({
      where: {
        id: mobId,
      },
    });
  }
}
