import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Mob } from '@prisma/client';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { MobSpawnModule } from './mobSpawn.module';
import {
  CreateMobSpawnDto,
  EditMobSpawnDto,
} from './dto';

@Injectable()
export class MobSpawnService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

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

    const mobLevel = this.generateMobLevel(mob);

    const mobSpawned =
      await this.prisma.mobSpawn.create({
        data: {
          name: mob.name,
          level: mobLevel,
          hp: mob.hp * mobLevel,
          maxHp: mob.hp * mobLevel,
          mobId: dto.mobId,
          attack: mob.attack * mobLevel,
          defence: mob.defence * mobLevel,
          giveExp: mob.giveExp * mobLevel,
          sprite: mob.sprite,
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
