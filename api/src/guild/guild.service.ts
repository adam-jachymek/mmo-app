import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGuildDto,
  EditGuildDto,
  PlayerIdDto,
} from './dto';
import { GuildRole, User } from '@prisma/client';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async getGuilds() {
    const guilds =
      await this.prisma.guild.findMany({
        include: {
          users: {
            select: { id: true },
            where: {
              NOT: {
                guildRole: GuildRole.PENDING,
              },
            },
          },
        },
      });

    return guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      description: guild.description,
      usersCount: guild.users.length,
    }));
  }

  countGuildMembers(userGuildId: number) {
    return this.prisma.user.count({
      where: {
        guildId: userGuildId,
        NOT: {
          guildRole: GuildRole.PENDING,
        },
      },
    });
  }

  async getGuildById(
    user: User,
    guildId: number,
  ) {
    if (user.guildId === guildId) {
      if (
        user.guildRole === GuildRole.ADMIN ||
        user.guildRole === GuildRole.MOD
      ) {
        const adminGuild =
          await this.prisma.guild.findUnique({
            where: {
              id: guildId,
            },
            include: {
              users: true,
            },
          });

        return adminGuild;
      }
    }

    const guild =
      await this.prisma.guild.findUnique({
        where: {
          id: guildId,
        },
        include: {
          users: {
            where: {
              NOT: {
                guildRole: GuildRole.PENDING,
              },
            },
          },
        },
      });

    return guild;
  }

  async createGuild(
    user: User,
    dto: CreateGuildDto,
  ) {
    if (!user.guildId) {
      const guild =
        await this.prisma.guild.create({
          data: {
            ...dto,
          },
        });

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          guildId: guild.id,
          guildRole: GuildRole.ADMIN,
        },
      });

      return guild;
    }
    throw new ForbiddenException(
      'You are already in the guild',
    );
  }

  async editGuildById(
    user: User,
    dto: EditGuildDto,
  ) {
    if (
      user.guildRole === GuildRole.ADMIN ||
      user.guildRole === GuildRole.MOD
    ) {
      const guild =
        await this.prisma.guild.findUnique({
          where: {
            id: user.guildId,
          },
        });

      return this.prisma.guild.update({
        where: {
          id: guild.id,
        },
        data: {
          ...dto,
        },
      });
    }
    throw new ForbiddenException(
      'Access to resources denied',
    );
  }

  async leaveGuild(user: User) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        guildRole: null,
      },
    });

    const leavedGuild =
      await this.prisma.guild.update({
        where: {
          id: user.guildId,
        },
        data: {
          users: {
            disconnect: [{ id: user.id }],
          },
        },
      });

    return leavedGuild;
  }

  async userRequest(user: User, guildId: number) {
    if (user.guildId) {
      throw new ForbiddenException(
        'You are already in the guild',
      );
    }

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        guildId: guildId,
        guildRole: GuildRole.PENDING,
      },
    });
  }

  async acceptGuildPlayer(
    user: User,
    dto: PlayerIdDto,
  ) {
    if (
      user.guildRole === GuildRole.ADMIN ||
      user.guildRole === GuildRole.MOD
    ) {
      const player =
        await this.prisma.user.findUnique({
          where: {
            id: dto.playerId,
          },
        });

      if (
        player.guildRole === GuildRole.PENDING
      ) {
        return await this.prisma.user.update({
          where: {
            id: dto.playerId,
          },
          data: {
            guildRole: GuildRole.MEMBER,
          },
        });
      }
    }
  }

  async kickGuildPlayer(
    user: User,
    dto: PlayerIdDto,
  ) {
    if (user.guildRole === GuildRole.ADMIN) {
      if (dto.playerId === user.id) {
        throw new ForbiddenException(
          'You cannot kick yourself from the guild',
        );
      }

      const guild =
        await this.prisma.guild.findFirst({
          where: {
            id: user.guildId,
          },
        });

      await this.prisma.guild.update({
        where: {
          id: guild.id,
        },
        data: {
          users: {
            disconnect: [{ id: dto.playerId }],
          },
        },
      });
    }
    throw new ForbiddenException(
      'Access to resources denied',
    );
  }

  async deleteGuildById(user: User) {
    const guild =
      await this.prisma.guild.findUnique({
        where: {
          id: user.guildId,
        },
      });

    if (user.guildId === guild.id) {
      if (user.guildRole === GuildRole.ADMIN) {
        await this.prisma.guild.delete({
          where: {
            id: user.guildId,
          },
        });
      }
    }

    throw new ForbiddenException(
      'Access to resources denied',
    );
  }
}
