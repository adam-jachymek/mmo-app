import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        guild: true,
        inBattle: true,
      },
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      include: {
        guild: true,
      },
    });
  }

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

  async addPoints(
    userId: number,
    dto: EditUserDto,
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
        ...dto,
        points: user.points - 1,
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
        id: user.id,
      },
      data: {
        hp: user.maxHp,
      },
    });
  }

  async giveExp(user: User, amountOfExp: number) {
    let userExp = user.exp + amountOfExp;
    let nextLevelExpLimit = user.maxExp;
    let level_count = 0;

    if (userExp >= nextLevelExpLimit) {
      while (userExp >= nextLevelExpLimit) {
        userExp = userExp - nextLevelExpLimit;
        nextLevelExpLimit = nextLevelExpLimit * 2;

        level_count++;
      }

      return await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          level: user.level + level_count,
          points: 5 * level_count + user.points,
          exp: userExp,
          maxExp: nextLevelExpLimit,
          maxHp: 20 * level_count + user.maxHp,
        },
      });
    }

    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        exp: user.exp + amountOfExp,
      },
    });
  }
}
