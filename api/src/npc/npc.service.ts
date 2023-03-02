import { NpcDto } from './dto/npc.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NpcService {
  constructor(private prisma: PrismaService) {}

  getAllNpcs() {
    return this.prisma.npc.findMany({
      include: {
        dialog: true,
      },
    });
  }

  getOneNpc(npcId: number) {
    return this.prisma.npc.findUnique({
      where: {
        id: npcId,
      },
      include: {
        dialog: true,
      },
    });
  }

  async createNpc(
    dto: NpcDto,
    file: Express.Multer.File,
  ) {
    return await this.prisma.npc.create({
      data: {
        ...dto,
        avatar: file.path,
      },
    });
  }

  async editNpcById(npcId: number, dto: NpcDto) {
    return this.prisma.npc.update({
      where: {
        id: npcId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteNpcById(npcId: number) {
    await this.prisma.map.delete({
      where: {
        id: npcId,
      },
    });
  }
}
