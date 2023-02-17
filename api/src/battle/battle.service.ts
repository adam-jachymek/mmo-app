import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MobSpawnService } from 'src/mobSpawn/mobSpawn.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BattleService {
  constructor(
    private prisma: PrismaService,
    private readonly mobSpawnService: MobSpawnService,
    private readonly userService: UserService,
  ) {}

  async createBattle(
    userId: number,
    values: {
      mobId: number;
      mobMinLevel: number;
      mobMaxLevel: number;
    },
  ) {
    const mobSpawned =
      await this.mobSpawnService.createMobSpawn({
        mobId: values.mobId,
        minLevel: values.mobMinLevel,
        maxLevel: values.mobMaxLevel,
      });

    const battle =
      await this.prisma.battle.create({
        data: {
          userTurn: true,
          battleEnded: false,
          usersInBattle: {
            create: [
              {
                user: {
                  connect: {
                    id: userId,
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

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        battleId: battle.id,
      },
    });

    return battle;
  }

  async returnBattle(
    battleId: number,
    mobAnimation?: string,
    playerAnimation?: string,
  ) {
    const getBattle =
      await this.prisma.battle.findUnique({
        where: {
          id: battleId,
        },
        include: {
          activeUser: true,
          activeMob: true,
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

    const users = getBattle.usersInBattle.map(
      (user) => ({
        id: user.user.id,
        avatar: user.user.avatar,
        username: user.user.username,
        level: user.user.level,
        exp: user.user.exp,
        maxExp: user.user.maxExp,
        hp: user.user.hp,
        maxHp: user.user.maxHp,
      }),
    );

    const mobs = getBattle.mobsInBattle.map(
      (mob) => ({
        id: mob.mob.id,
        name: mob.mob.name,
        level: mob.mob.level,
        hp: mob.mob.hp,
        maxHp: mob.mob.maxHp,
        sprite: mob.mob.sprite,
        giveExp: mob.mob.giveExp,
      }),
    );

    return {
      id: getBattle.id,
      userTurn: getBattle.userTurn,
      activeUser: getBattle.activeUserId,
      activeMob: getBattle.activeMobId,
      battleEnded: getBattle.battleEnded,
      youWin: getBattle.youWin,
      youLost: getBattle.youLost,
      users: users,
      mobs: mobs,
      mobAnimation: mobAnimation,
      playerAnimation: playerAnimation,
    };
  }

  async getBattle(battleId: number) {
    const getBattle =
      await this.prisma.battle.findUnique({
        where: {
          id: battleId,
        },
        include: {
          activeUser: true,
          activeMob: true,
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
      userTurn: getBattle.userTurn,
      battleEnded: getBattle.battleEnded,
      activeUser: getBattle.activeUser,
      activeMob: getBattle.activeMob,
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

  async startBattle(battleId: number) {
    const battle = this.getBattle(battleId);
    const usersInBattle = (await battle).users;
    const mobsInBattle = (await battle).mobs;

    const getRandomUser = () => {
      const randomUser =
        usersInBattle[
          Math.floor(
            Math.random() * usersInBattle.length,
          )
        ];

      return randomUser.id;
    };

    const getRandomMob = () => {
      const randomMob =
        mobsInBattle[
          Math.floor(
            Math.random() * mobsInBattle.length,
          )
        ];

      return randomMob.id;
    };

    await this.prisma.battle.update({
      where: {
        id: battleId,
      },
      data: {
        activeUserId: getRandomUser(),
        activeMobId: getRandomMob(),
      },
    });
  }

  generateRandomDamage = (
    maximum: number,
    minimum: number,
  ) => {
    const min = Math.ceil(minimum);
    const max = Math.floor(maximum);
    return (
      Math.floor(
        Math.random() * (max - min + 1),
      ) + min
    );
  };

  async userAttack(
    battleId: number,
    userId: number,
  ) {
    const battle = this.getBattle(battleId);
    const usersInBattle = (await battle).users;
    const mobsInBattle = (await battle).mobs;

    const activeUser = (await battle).activeUser;
    const activeMob = (await battle).activeMob;

    if (userId === activeUser.id) {
      if (activeMob.hp > 0) {
        const damage = this.generateRandomDamage(
          1,
          activeUser.strength,
        );

        return await this.prisma.mobSpawn.update({
          where: {
            id: activeMob.id,
          },
          data: {
            hp: activeMob.hp - damage,
          },
        });
      }

      return activeMob;
    }
  }

  async userTurnChanger(
    battleId: number,
    userTurn: boolean,
  ) {
    await this.prisma.battle.update({
      where: {
        id: battleId,
      },
      data: {
        userTurn: userTurn,
      },
    });
  }

  async youWin(battleId: number) {
    const battle = this.getBattle(battleId);
    const usersInBattle = (await battle).users;
    const mobsInBattle = (await battle).mobs;

    const activeUser = (await battle).activeUser;
    const activeMob = (await battle).activeMob;

    await this.userService.giveExp(
      activeUser,
      activeMob.giveExp,
    );

    await this.prisma.mobSpawn.update({
      where: {
        id: activeMob.id,
      },
      data: {
        hp: 0,
      },
    });

    await this.prisma.battle.update({
      where: {
        id: battleId,
      },
      data: {
        battleEnded: true,
        youWin: true,
      },
    });
  }

  async attackUser(
    battleId: number,
    userId: number,
  ) {
    const battle = this.getBattle(battleId);
    const usersInBattle = (await battle).users;
    const mobsInBattle = (await battle).mobs;

    const activeUser = (await battle).activeUser;
    const activeMob = (await battle).activeMob;

    if (userId === activeUser.id) {
      if (activeUser.hp > 0) {
        return this.prisma.user.update({
          where: {
            id: activeUser.id,
          },
          data: {
            hp:
              activeUser.hp -
              this.generateRandomDamage(
                1,
                activeMob.attack,
              ),
          },
        });
      }
    }
  }

  async youLost(battleId: number) {
    const battle = this.getBattle(battleId);
    const usersInBattle = (await battle).users;
    const mobsInBattle = (await battle).mobs;

    const activeUser = (await battle).activeUser;
    const activeMob = (await battle).activeMob;

    await this.prisma.user.update({
      where: {
        id: activeUser.id,
      },
      data: {
        hp: 0,
      },
    });

    await this.prisma.battle.update({
      where: {
        id: battleId,
      },
      data: {
        battleEnded: true,
        youLost: true,
      },
    });
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

  async endBattle(
    battleId: number,
    userId: number,
  ) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        battleId: null,
      },
    });

    await this.prisma.battle.delete({
      where: { id: battleId },
    });
  }
}
