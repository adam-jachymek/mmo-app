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
import { GuildModel } from "./guild.model";

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService, private guild: GuildModel) {}

  isUserModOrAdmin(user, guildId) {
    return user.guildId === guildId &&
        (user.guildRole === GuildRole.ADMIN ||
        user.guildRole === GuildRole.MOD)
  }

  async getGuilds() {
    const guilds =
      await this.guild.getAllWithUsers();

    return guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      description: guild.description,
      usersCount: guild.users.length,
    }));
  }

  async getGuildById(
    user: User,
    guildId: number,
  ) {
    const withPending = this.isUserModOrAdmin(user, guildId);
    return await this.guild.getById({id: guildId, withPending})
  }

  async createGuild(
    user: User,
    dto: CreateGuildDto,
  ) {
    if (user.guildId) {
      throw new ForbiddenException('You are already in the guild');
    }

    const guild = await this.guild.create(dto);

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

  async editGuildById(
    user: User,
    dto: EditGuildDto,
  ) {
    // TODO implement guildID
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

    // TODO do we need to return the guild?
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
