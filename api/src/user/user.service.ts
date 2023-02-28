import { StatsUserDto } from './dto/stats.dto';
import { Injectable } from '@nestjs/common';
import {
  ItemType,
  MainType,
  User,
} from '@prisma/client';
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
    dto: StatsUserDto,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (user.points > 0) {
      /// STAMINA
      if (dto.stamina > 0) {
        const newMaxHp = Math.floor(
          user.maxHp + (1.5 * user.maxHp) / 100,
        );

        return await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            stamina: user.stamina + 1,
            maxHp: newMaxHp,
            hp: newMaxHp,
            points: user.points - 1,
          },
        });
      }

      /// STRENGHT
      if (dto.strength > 0) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            strength: user.strength + 1,
            points: user.points - 1,
          },
        });
        await this.updateUserAttack(userId);
      }

      /// DEFENCE
      if (dto.defence > 0) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            defence: user.defence + 1,
            points: user.points - 1,
          },
        });
      }
      await this.updateUserArmor(userId);
    }

    delete user.hash;

    return user;
  }

  async updateUserArmor(userId: number) {
    const equipedArmors =
      await this.prisma.item.findMany({
        where: {
          userId: userId,
          equip: true,
          mainType: MainType.ARMOR,
        },
        include: {
          item: true,
        },
      });

    let totalDefence = 0;

    for (
      let i = 0;
      i < equipedArmors.length;
      i++
    ) {
      totalDefence += equipedArmors[i].defence;
    }

    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
      });

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalDefence: user.defence + totalDefence,
      },
    });
  }

  async updateUserAttack(userId: number) {
    const equipedWeapon =
      await this.prisma.item.findFirst({
        where: {
          userId: userId,
          equip: true,
          mainType: MainType.WEAPON,
        },
        include: {
          item: true,
        },
      });

    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
      });

    const equipedWeaponMinAttack =
      equipedWeapon?.minAttack || 0;

    const equipedWeaponMaxAttack =
      equipedWeapon?.maxAttack || 0;

    const minBaseAttack =
      user.strength + equipedWeaponMinAttack;
    const maxBaseAttack =
      user.strength + equipedWeaponMaxAttack;

    const minAttack = Math.floor(
      (minBaseAttack * user.strength) / 2 / 100 +
        minBaseAttack,
    );

    const maxAttack = Math.floor(
      (maxBaseAttack * user.strength) / 100 +
        maxBaseAttack,
    );

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        minAttack: minAttack,
        maxAttack: maxAttack,
      },
    });
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
