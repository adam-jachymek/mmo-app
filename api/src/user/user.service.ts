import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { MobSpawn } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(
    userId: number,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }

  async healUser(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hp: user.maxHp,
      },
    });
  }

  async giveExp(
    userId: number,
    amountOfExp: number,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        exp: user.exp + amountOfExp,
      },
    });

    const userAfterExp =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (userAfterExp.exp >= userAfterExp.maxExp) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          level: user.level + 1,
          exp:
            userAfterExp.exp -
            userAfterExp.maxExp,
          maxExp: userAfterExp.maxExp * 2,
          maxHp: userAfterExp.maxHp * 2,
        },
      });
    }
  }

  async attackUser(
    userId: number,
    spawnedMob: MobSpawn,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (user.hp < 1) {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hp: 0,
        },
      });
    } else {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hp:
            user.hp -
            this.generateAttack(spawnedMob),
        },
      });
    }
  }

  generateAttack(MobSpawn: MobSpawn) {
    const difference = MobSpawn.attack - 1;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + 1;

    return rand;
  }
}
