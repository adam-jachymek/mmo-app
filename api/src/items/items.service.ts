import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  getItems(userId: number) {
    return this.prisma.items.findMany({
      where: {
        userId,
      },
    });
  }

  getItemById(itemsId: number) {
    return this.prisma.items.findFirst({
      where: {
        id: itemsId,
      },
    });
  }

  async createItem(
    userId: number,
    dto: CreateItemDto,
  ) {
    const items = await this.prisma.items.create({
      data: {
        userId,
        ...dto,
      },
    });

    return items;
  }

  async editItemById(
    userId: number,
    itemsId: number,
    dto: EditItemDto,
  ) {
    // get the items by id
    const items =
      await this.prisma.items.findUnique({
        where: {
          id: itemsId,
        },
      });

    // check if user owns the items
    if (!items || items.id !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.items.update({
      where: {
        id: itemsId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteItemById(
    userId: number,
    itemsId: number,
  ) {
    const items =
      await this.prisma.items.findUnique({
        where: {
          id: itemsId,
        },
      });

    // check if user owns the items
    if (!items || items.id !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.items.delete({
      where: {
        id: itemsId,
      },
    });
  }
}
