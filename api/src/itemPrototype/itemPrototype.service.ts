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
export class ItemPrototypeService {
  constructor(private prisma: PrismaService) {}

  getItems(userId: number) {
    return this.prisma.itemPrototype.findMany({
      // where: {
      //   userId,
      // },
    });
  }

  getItemsAdmin() {
    return this.prisma.itemPrototype.findMany({});
  }

  getItemById(itemsId: number) {
    return this.prisma.itemPrototype.findFirst({
      where: {
        id: itemsId,
      },
    });
  }

  async createItem(
    userId: number,
    dto: CreateItemDto,
  ) {
    const items =
      await this.prisma.itemPrototype.create({
        data: {
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
    // get the item by id
    const item =
      await this.prisma.itemPrototype.findUnique({
        where: {
          id: itemsId,
        },
      });

    // check if user owns the items
    if (!item || item.id !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.itemPrototype.update({
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
      await this.prisma.itemPrototype.findUnique({
        where: {
          id: itemsId,
        },
      });

    // check if user owns the items
    // if (!items || item.id !== userId)
    //   throw new ForbiddenException(
    //     'Access to resources denied',
    //   );

    await this.prisma.itemPrototype.delete({
      where: {
        id: itemsId,
      },
    });
  }
}
