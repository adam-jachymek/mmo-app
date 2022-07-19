import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ItemPrototype } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  getItems(userId: number) {
    return this.prisma.item.findMany({
      include: {
        item: true,
        user: true,
      },
    });
  }

  getItemsAdmin() {
    return this.prisma.item.findMany({
      include: {
        item: true,
        user: true,
      },
    });
  }

  getItemById(itemsId: number) {
    return this.prisma.item.findFirst({
      where: {
        id: itemsId,
      },
      include: {
        item: true,
        user: true,
      },
    });
  }

  async createItem(
    level: number,
    userId: number,
    dto: CreateItemDto,
  ) {
    const itemPrototype =
      await this.prisma.itemPrototype.findFirst({
        where: {
          id: dto.itemPrototypeId,
        },
      });

    const item = await this.prisma.item.create({
      data: {
        stat: this.generateItemStat(
          itemPrototype,
        ),
        itemPrototypeId: dto.itemPrototypeId,
        userId,
        ...dto,
      },
    });

    return item;
  }

  generateItemStat(itemPrototype: ItemPrototype) {
    const difference =
      itemPrototype.maxStat -
      itemPrototype.minStat;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + itemPrototype.minStat;

    return rand;
  }

  async editItemById(
    userId: number,
    itemsId: number,
    dto: EditItemDto,
  ) {
    // get the item by id
    const item =
      await this.prisma.item.findUnique({
        where: {
          id: itemsId,
        },
      });

    // check if user owns the items
    if (!item || item.id !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.item.update({
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
      await this.prisma.item.findUnique({
        where: {
          id: itemsId,
        },
      });

    await this.prisma.item.delete({
      where: {
        id: itemsId,
      },
    });
  }
}
