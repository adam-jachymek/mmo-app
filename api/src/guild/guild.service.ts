import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGuildDto,
  EditGuildDto,
  KickGuildDto,
} from './dto';
import { GuildRole } from '@prisma/client';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  getGuilds() {
    return this.prisma.guild.findMany({
      include: { users: true },
    });
  }

  async getGuildById(
    userId: number,
    guildId: number,
  ) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

    if (user.guildId === guildId) {
      if (
        user.guildRole === GuildRole.ADMIN ||
        user.guildRole === GuildRole.MOD
      ) {
        const adminGuild =
          await this.prisma.guild.findFirst({
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
      await this.prisma.guild.findFirst({
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
    userId: number,
    dto: CreateGuildDto,
  ) {
    const guild = await this.prisma.guild.create({
      data: {
        ...dto,
      },
    });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        guildRole: GuildRole.ADMIN,
      },
    });

    return guild;
  }

  async editGuildById(
    userId: number,
    dto: EditGuildDto,
  ) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

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

  async leaveGuild(userId: number) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

    const leavedGuild =
      await this.prisma.guild.update({
        where: {
          id: user.guildId,
        },
        data: {
          users: {
            disconnect: [{ id: userId }],
          },
        },
      });

    return leavedGuild;
  }

  async userRequest(
    userId: number,
    guildId: number,
  ) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

    if (user.guildId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        guildId: guildId,
        guildRole: GuildRole.PENDING,
      },
    });
  }

  async acceptGuildPlayer(
    userId: number,
    dto: KickGuildDto,
  ) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

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
    userId: number,
    dto: KickGuildDto,
  ) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

    if (
      user.guildRole === GuildRole.ADMIN ||
      user.guildRole === GuildRole.MOD
    ) {
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

  async deleteGuildById(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

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
