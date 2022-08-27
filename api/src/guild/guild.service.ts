import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGuildDto,
  EditGuildDto,
} from './dto';
import { GuildRole, User } from '@prisma/client';
import { GuildModel } from "./guild.model";

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService, private guild: GuildModel) {}

  isUserInGuild(user, guildId): boolean {
    return user.guildId === guildId
  }

  isUserModOrAdmin(user): boolean {
    return (user.guildRole === GuildRole.ADMIN ||
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
    const withPending = this.isUserInGuild(user, guildId) && this.isUserModOrAdmin(user);
    return await this.guild.getById({ id: guildId, withPending })
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

  async editGuild(
    guildId: number,
    user: User,
    dto: EditGuildDto,
  ) {
    if (!this.isUserModOrAdmin(user) || !this.isUserInGuild(user, guildId)) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    return this.guild.edit({id: guildId, data: dto})
  }

  async leaveGuild(guildId: number, user: User) {
    if (!this.isUserInGuild(user, guildId)) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        guildRole: null,
      },
    });

    await this.guild.removeUser({ id: guildId, userId: user.id })
  }

  async createRequest(guildId: number, user: User) {
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
    guildId: number,
    playerId: number,
    user: User,
  ) {
    if (!this.isUserInGuild(user, guildId) || !this.isUserModOrAdmin(user)) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    const player =
      await this.prisma.user.findUnique({
        where: {
          id: playerId,
        },
      });

    if (
      player.guildRole === GuildRole.PENDING && player.guildId === guildId
    ) {
      return await this.prisma.user.update({
        where: {
          id: playerId,
        },
        data: {
          guildRole: GuildRole.MEMBER,
        },
      });
    }
  }

  async kickGuildPlayer(
    guildId: number,
    playerId: number,
    user: User,
  ) {
    if (!this.isUserInGuild(user, guildId) || user.guildRole !== GuildRole.ADMIN) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }
    if (user.id === playerId) {
      throw new ForbiddenException(
        'You cannot kick yourself from the guild',
      );
    }

    await this.guild.removeUser({id: guildId, userId: playerId})
  }

  async deleteGuildById(guildId: number, user: User) {
    if (!this.isUserInGuild(user, guildId) || user.guildRole !== GuildRole.ADMIN) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    await this.guild.delete({ id: guildId })
  }
}
