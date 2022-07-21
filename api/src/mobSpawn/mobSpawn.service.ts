import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Mob } from '@prisma/client';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMobSpawnDto,
  EditMobSpawnDto,
} from './dto';

@Injectable()
export class MobSpawnService {
  constructor(private prisma: PrismaService) {}

  getMobSpawns() {
    return this.prisma.mobSpawn.findMany({
      include: {
        mob: true,
      },
    });
  }

  getMobSpawnById(mobSpawnId: number) {
    return this.prisma.mobSpawn.findFirst({
      where: {
        id: mobSpawnId,
      },
      include: {
        mob: true,
      },
    });
  }

  async createMobSpawn(dto: CreateMobSpawnDto) {
    const mob = await this.prisma.mob.findFirst({
      where: {
        id: dto.mobId,
      },
    });

    const mobSpawned =
      await this.prisma.mobSpawn.create({
        data: {
          level: this.generateMobLevel(mob),
          hp: mob.hp,
          mobId: dto.mobId,
          ...dto,
        },
        include: {
          mob: true,
        },
      });

    return mobSpawned;
  }

  generateMobLevel(mob: Mob) {
    const difference =
      mob.maxLevel - mob.minLevel;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + mob.minLevel;

    return rand;
  }

  async editMobSpawnById(
    user: User,
    mobSpawnId: number,
    dto: EditMobSpawnDto,
  ) {
    const spawnedMob =
      await this.prisma.mobSpawn.findUnique({
        where: {
          id: mobSpawnId,
        },
      });

    if (spawnedMob.hp < 1) {
      await this.prisma.mobSpawn.delete({
        where: {
          id: mobSpawnId,
        },
      });
    }

    return this.prisma.mobSpawn.update({
      where: {
        id: mobSpawnId,
      },
      data: {
        hp:
          spawnedMob.hp -
          this.generateAttack(user),
      },
    });
  }

  generateAttack(user: User) {
    const difference = user.strength - 1;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + 1;

    return rand;
  }

  async deleteMobSpawnById(mobSpawnId: number) {
    const mobSpawn =
      await this.prisma.mobSpawn.findUnique({
        where: {
          id: mobSpawnId,
        },
      });

    await this.prisma.mobSpawn.delete({
      where: {
        id: mobSpawnId,
      },
    });
  }
}
