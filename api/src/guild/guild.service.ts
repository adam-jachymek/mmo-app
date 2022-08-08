import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGuildDto,
  EditGuildDto,
} from './dto';

@Injectable()
export class GuildService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  getGuilds() {
    return this.prisma.guild.findMany({
      include: { users: true },
    });
  }

  getGuildById(guildId: number) {
    return this.prisma.guild.findFirst({
      where: {
        id: guildId,
      },
      include: {
        users: true,
      },
    });
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
        guildId: guild.id,
      },
    });

    return guild;
  }

  async editGuildById(
    userId: number,
    guildId: number,
    dto: EditGuildDto,
  ) {
    const guild =
      await this.prisma.guild.findUnique({
        where: {
          id: guildId,
        },
      });

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (user.guildId !== guild.id)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.guild.update({
      where: {
        id: guild.id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteGuildById(
    userId: number,
    guildId: number,
  ) {
    const guild =
      await this.prisma.guild.findUnique({
        where: {
          id: guildId,
        },
      });

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (user.guildId !== guild.id)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.guild.delete({
      where: {
        id: guildId,
      },
    });
  }
}
