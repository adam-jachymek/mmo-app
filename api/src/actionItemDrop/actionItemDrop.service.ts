import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActionItemDropDto } from './dto/ActionItemDrop.dto';

@Injectable()
export class ActionItemDropService {
  constructor(private prisma: PrismaService) {}

  async getActionDrop(actionMobSpawnId: number) {
    return await this.prisma.actionItemDrop.findMany(
      {
        where: {
          actionMobSpawnId: actionMobSpawnId,
        },
      },
    );
  }

  async createOrUpdateActionDrop(
    actionMobSpawnId: number,
    dto: ActionItemDropDto,
    actionItemDropId?: number,
  ) {
    return await this.prisma.actionItemDrop.upsert(
      {
        where: { id: actionItemDropId || 0 },
        update: {
          ...dto,
        },
        create: {
          actionMobSpawnId: actionMobSpawnId,
          ...dto,
        },
      },
    );
  }

  async deleteActionDrop(
    actionItemDropId: number,
  ) {
    return this.prisma.actionItemDrop.delete({
      where: {
        id: actionItemDropId,
      },
    });
  }
}
