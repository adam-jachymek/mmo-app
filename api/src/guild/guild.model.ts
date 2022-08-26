import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GuildRole } from "@prisma/client";
import { CreateGuildDto } from "./dto";

@Injectable()
export class GuildModel {

  constructor(private prisma: PrismaService) {}

  async getAllWithUsers() {
    return await this.prisma.guild.findMany({
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
  }

  async getById({id, withPending}) {
    const usersQuery = withPending ? true : {
      where: {
        NOT: {
          guildRole: GuildRole.PENDING,
        },
      },
    };

    return await this.prisma.guild.findUnique({
      where: {
        id: id,
      },
      include: {
        users: usersQuery
      },
    });
  }

  async create(dto: CreateGuildDto) {
    return await this.prisma.guild.create({
      data: {
        ...dto,
      },
    });
  }

}
