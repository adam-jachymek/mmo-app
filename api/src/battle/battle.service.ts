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
import { BattleSocketGateway } from 'src/battleSocket/battleSocket.gateway';
import { connect } from 'http2';

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
          usersInBattle: {
            create: [
              {
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            ],
          },
          mobsInBattle: {
            create: [
              {
                mob: {
                  connect: {
                    id: mobSpawned.id,
                  },
                },
              },
            ],
          },
        },
      });

    return battle;
  }

  async getBattle(battleId: number) {
    const getBattle =
      await this.prisma.battle.findUnique({
        where: {
          id: battleId,
        },
        include: {
          usersInBattle: {
            select: {
              user: true,
            },
          },
          mobsInBattle: {
            select: {
              mob: true,
            },
          },
        },
      });

    const battle = {
      id: getBattle.id,
      users: getBattle.usersInBattle.map(
        (user) => ({
          id: user.user.id,
          avatar: user.user.avatar,
          username: user.user.username,
          level: user.user.level,
          exp: user.user.exp,
          maxExp: user.user.maxExp,
          hp: user.user.hp,
          maxHp: user.user.maxExp,
        }),
      ),
      mobs: getBattle.mobsInBattle.map((mob) => ({
        id: mob.mob.id,
        name: mob.mob.name,
        level: mob.mob.level,
        hp: mob.mob.hp,
        maxHp: mob.mob.maxHp,
        sprite: mob.mob.sprite,
      })),
    };

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
      await this.prisma.battle.findFirst({
        where: {
          id: battleId,
        },
        include: {
          usersInBattle: true,
          mobsInBattle: {
            select: {
              mob: true,
            },
          },
        },
      });

    if (battle.mobsInBattle[0].mob.hp < 1) {
      await this.userService.giveExp(
        user,
        battle.mobsInBattle[0].mob.giveExp,
      );
    }

    this.attackMob(
      user,
      battle.mobsInBattle[0].mob,
    );
    this.userService.attackUser(
      user.id,
      battle.mobsInBattle[0].mob,
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
    const battle =
      await this.prisma.battle.findFirst({
        where: {
          id: battleId,
        },
        include: {
          usersInBattle: true,
          mobsInBattle: true,
        },
      });

    return battle;
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
