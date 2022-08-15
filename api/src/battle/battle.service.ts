import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MobSpawn, User } from '@prisma/client';
import { Mob } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MobSpawnService } from 'src/mobSpawn/mobSpawn.service';
import {
  CreateBattleDto,
  EditBattleDto,
} from './dto';
import { UserService } from 'src/user/user.service';
import { Server, Socket } from 'socket.io';

@Injectable()
export class BattleService {
  constructor(
    private prisma: PrismaService,
    private readonly mobSpawnService: MobSpawnService,
    private readonly userService: UserService,
  ) {}

  async createBattle(
    user: User,
    dto: CreateBattleDto,
  ) {
    const mobSpawned =
      await this.mobSpawnService.createMobSpawn({
        mobId: dto.mobId,
      });

    const battle =
      await this.prisma.battle.create({
        data: {
          userId: user.id,
          mobSpawnId: mobSpawned.id,
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

  async turn(user: User, battleId: number) {
    const battle =
      await this.prisma.battle.findUnique({
        where: {
          id: battleId,
        },
        include: {
          mobSpawn: true,
        },
      });

    if (battle.mobSpawn.hp < 1) {
      await this.userService.giveExp(
        user,
        battle.mobSpawn.giveExp,
      );
    }

    this.attackMob(user, battle.mobSpawn);
    this.userService.attackUser(
      user.id,
      battle.mobSpawn,
    );
  }

  async attackMob(
    user: User,
    mobSpawn: MobSpawn,
  ) {
    await this.prisma.mobSpawn.update({
      where: {
        id: mobSpawn.id,
      },
      data: {
        hp:
          mobSpawn.hp - this.generateAttack(user),
      },
    });

    const mobAfterAttack =
      await this.prisma.mobSpawn.findUnique({
        where: {
          id: mobSpawn.id,
        },
      });

    if (mobAfterAttack.hp < 1) {
      await this.userService.giveExp(
        user,
        mobSpawn.giveExp,
      );

      await this.prisma.mobSpawn.update({
        where: {
          id: mobSpawn.id,
        },
        data: {
          hp: 0,
        },
      });

      return mobAfterAttack;

      // await this.prisma.mobSpawn.delete({
      //   where: {
      //     id: mobSpawnId,
      //   },
      // });
    }
  }

  async getBattleById(battleId: number) {
    return await this.prisma.battle.findUnique({
      where: {
        id: battleId,
      },
      include: {
        mobSpawn: {
          include: {
            mob: true,
          },
        },
      },
    });
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
