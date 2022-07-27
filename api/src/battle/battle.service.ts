import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Mob } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBattleDto,
  EditBattleDto,
} from './dto';

@Injectable()
export class BattleService {
  constructor(private prisma: PrismaService) {}

  async createBattle(
    userId: number,
    dto: CreateBattleDto,
  ) {
    const battle =
      await this.prisma.battle.create({
        data: {
          userId: userId,
          mobSpawnId: dto.mobId,
        },
      });

    return battle;
  }

  generateAttack(user: User) {
    const difference = user.strength - 1;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + 1;

    return rand;
  }

  // async editMobSpawnById(
  //   user: User,
  //   mobSpawnId: number,
  //   dto: EditBattleDto,
  // ) {
  //   const spawnedMob =
  //     await this.prisma.mobSpawn.findUnique({
  //       where: {
  //         id: mobSpawnId,
  //       },
  //     });

  //   if (spawnedMob.hp < 1) {
  //     await this.prisma.mobSpawn.delete({
  //       where: {
  //         id: mobSpawnId,
  //       },
  //     });
  //   }

  //   return this.prisma.mobSpawn.update({
  //     where: {
  //       id: mobSpawnId,
  //     },
  //     data: {
  //       hp:
  //         spawnedMob.hp -
  //         this.generateAttack(user),
  //     },
  //   });
  // }
}
