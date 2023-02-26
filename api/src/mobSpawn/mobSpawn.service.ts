import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMobSpawnDto } from './dto';

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

    const mobLevel = this.generateMobLevel(
      Number(dto.minLevel),
      Number(dto.maxLevel),
    );

    const mobSpawned =
      await this.prisma.mobSpawn.create({
        data: {
          name: mob.name,
          level: mobLevel,
          hp: Math.floor(
            (mob.hp * mobLevel) / 1.5,
          ),
          maxHp: Math.floor(
            (mob.hp * mobLevel) / 1.5,
          ),
          mobId: dto.mobId,
          attack: mob.attack * mobLevel,
          defence: mob.defence * mobLevel,
          giveExp: mob.giveExp * mobLevel,
          sprite: mob.sprite,
          actionItemDropIds: dto.dropItemsIds,
        },
        include: {
          mob: true,
        },
      });

    return mobSpawned;
  }

  generateMobLevel(
    minLevel: number,
    maxLevel: number,
  ) {
    const difference = maxLevel + 1 - minLevel;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + minLevel;

    return rand;
  }

  async deleteMobSpawnById(mobSpawnId: number) {
    return await this.prisma.mobSpawn.delete({
      where: {
        id: mobSpawnId,
      },
    });
  }
}
