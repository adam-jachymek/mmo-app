import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  ItemPrototype,
  ItemQuality,
  ItemType,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  getItems(user: User) {
    return this.prisma.item.findMany({
      where: {
        userId: user.id,
      },
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
    user: User,
    dto: CreateItemDto,
  ) {
    const itemPrototype =
      await this.prisma.itemPrototype.findUnique({
        where: {
          id: dto.itemPrototypeId,
        },
      });

    if (
      itemPrototype.type === ItemType.HEAD ||
      itemPrototype.type === ItemType.CHEST ||
      itemPrototype.type === ItemType.LEGS
    ) {
      const generatedLevel =
        this.generateItemLevel(
          itemPrototype.quality,
          user.level,
        );

      const generatedStat = Math.round(
        (this.generateItemStat(
          itemPrototype.minStat,
          itemPrototype.maxStat,
        ) +
          generatedLevel) *
          (1 +
            this.addQualityBonus(
              itemPrototype.quality,
            )),
      );

      return await this.prisma.item.create({
        data: {
          name: itemPrototype.name,
          sprite: itemPrototype.sprite,
          level: generatedLevel,
          stamina: Math.round(
            (this.generateItemStat(
              itemPrototype.minStat,
              itemPrototype.maxStat,
            ) +
              generatedLevel) *
              (1 +
                this.addQualityBonus(
                  itemPrototype.quality,
                )),
          ),
          defence: Math.round(
            (this.generateItemStat(
              itemPrototype.minStat,
              itemPrototype.maxStat,
            ) +
              generatedLevel) *
              (1 +
                this.addQualityBonus(
                  itemPrototype.quality,
                )),
          ),
          isEquipment: true,
          quality: itemPrototype.quality,
          itemPrototypeId: dto.itemPrototypeId,
          userId: user.id,
          type: itemPrototype.type,
        },
      });
    }

    if (itemPrototype.type === ItemType.WEAPON) {
      const generatedLevel =
        this.generateItemLevel(
          itemPrototype.quality,
          user.level,
        );

      return await this.prisma.item.create({
        data: {
          name: itemPrototype.name,
          sprite: itemPrototype.sprite,
          level: generatedLevel,
          minAttack: Math.round(
            (itemPrototype.minStat +
              generatedLevel) *
              (1 +
                this.addQualityBonus(
                  itemPrototype.quality,
                )),
          ),
          maxAttack: Math.round(
            (itemPrototype.maxStat +
              generatedLevel) *
              (1 +
                this.addQualityBonus(
                  itemPrototype.quality,
                )),
          ),
          itemPrototypeId: dto.itemPrototypeId,
          isEquipment: true,
          quality: itemPrototype.quality,
          userId: user.id,
          type: itemPrototype.type,
        },
      });
    }

    return await this.prisma.item.create({
      data: {
        name: itemPrototype.name,
        sprite: itemPrototype.sprite,
        itemPrototypeId: dto.itemPrototypeId,
        userId: user.id,
        type: itemPrototype.type,
        actionName: itemPrototype.actionName,
        actionAmount: itemPrototype.actionAmount,
      },
    });
  }

  addQualityBonus(quality: ItemQuality) {
    if (quality === ItemQuality.COMMON) {
      return 0;
    }

    if (quality === ItemQuality.UNCOMMON) {
      return 0.05;
    }

    if (quality === ItemQuality.RARE) {
      return 0.1;
    }

    if (quality === ItemQuality.EPIC) {
      return 0.15;
    }

    if (quality === ItemQuality.LEGENDARY) {
      return 0.2;
    }
  }

  generateItemLevel(
    quality: ItemQuality,
    userLevel: number,
  ) {
    const calculateMinLevel = () => {
      if (quality === ItemQuality.COMMON) {
        return 1;
      }

      if (quality === ItemQuality.UNCOMMON) {
        const minLevel = userLevel - 30;
        if (minLevel < 1) {
          return 1;
        }
        return minLevel;
      }

      if (quality === ItemQuality.RARE) {
        const minLevel = userLevel - 20;
        if (minLevel < 1) {
          return 1;
        }
        return minLevel;
      }

      if (quality === ItemQuality.EPIC) {
        const minLevel = userLevel - 10;
        if (minLevel < 1) {
          return 1;
        }
        return minLevel;
      }

      if (quality === ItemQuality.LEGENDARY) {
        return userLevel;
      }
    };

    const difference =
      userLevel - calculateMinLevel();

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + calculateMinLevel();

    return rand;
  }

  generateItemStat(min: number, max: number) {
    const difference = max - min;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + min;

    return rand;
  }

  async equipItem(
    userId: number,
    itemId: number,
  ) {
    const item =
      await this.prisma.item.findUnique({
        where: {
          id: itemId,
        },
        include: {
          item: true,
        },
      });

    if (item.userId !== userId)
      throw new ForbiddenException(
        'This is not your item',
      );

    const equipedItem =
      await this.prisma.item.findFirst({
        where: {
          equip: true,
          type: item.type,
        },
        include: {
          item: true,
        },
      });

    if (equipedItem !== null) {
      await this.prisma.item.update({
        where: {
          id: equipedItem.id,
        },
        data: {
          equip: false,
        },
      });
    }

    if (item.isEquipment) {
      await this.prisma.item.update({
        where: {
          id: itemId,
        },
        data: {
          equip: !item.equip,
        },
      });
    }
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
