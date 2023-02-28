import { UserService } from 'src/user/user.service';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  ItemQuality,
  ItemType,
  MainType,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateItemDto,
  EditItemDto,
} from './dto';
import { ItemQualityBonus } from './constants';

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

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

    const baseItem = {
      itemPrototypeId: dto.itemPrototypeId,
      name: itemPrototype.name,
      description: itemPrototype.description,
      sprite: itemPrototype.sprite,
      userId: user.id,
      mainType: itemPrototype.mainType,
    };

    if (
      itemPrototype.mainType === MainType.ARMOR
    ) {
      const generatedLevel =
        this.generateItemLevel(
          itemPrototype.quality,
          dto.maxLevel,
        );

      const generatedQuality =
        this.generateQuality();

      return await this.prisma.item.create({
        data: {
          ...baseItem,
          level: generatedLevel,
          stamina: this.generateItemStat(
            itemPrototype.stamina,
            generatedQuality,
          ),
          defence: this.generateItemStat(
            itemPrototype.defence,
            generatedQuality,
          ),
          strenght: this.generateItemStat(
            itemPrototype.strenght,
            generatedQuality,
          ),
          dexterity: this.generateItemStat(
            itemPrototype.dexterity,
            generatedQuality,
          ),
          intelligence: this.generateItemStat(
            itemPrototype.intelligence,
            generatedQuality,
          ),
          quality: generatedQuality,
          armorType: itemPrototype.armorType,
        },
      });
    }

    if (
      itemPrototype.mainType === MainType.WEAPON
    ) {
      const generatedLevel =
        this.generateItemLevel(
          itemPrototype.quality,
          dto.maxLevel,
        );

      const generatedQuality =
        this.generateQuality();

      return await this.prisma.item.create({
        data: {
          ...baseItem,
          level: generatedLevel,
          minAttack: this.generateItemStat(
            itemPrototype.minAttack,
            generatedQuality,
          ),
          maxAttack: this.generateItemStat(
            itemPrototype.maxAttack,
            generatedQuality,
          ),
          stamina: this.generateItemStat(
            itemPrototype.stamina,
            generatedQuality,
          ),
          defence: this.generateItemStat(
            itemPrototype.defence,
            generatedQuality,
          ),
          strenght: this.generateItemStat(
            itemPrototype.strenght,
            generatedQuality,
          ),
          dexterity: this.generateItemStat(
            itemPrototype.dexterity,
            generatedQuality,
          ),
          intelligence: this.generateItemStat(
            itemPrototype.intelligence,
            generatedQuality,
          ),
          quality: generatedQuality,
          weaponType: itemPrototype.weaponType,
        },
      });
    }

    return await this.prisma.item.create({
      data: {
        ...baseItem,
        mainType: itemPrototype.mainType,
        itemType: itemPrototype.itemType,
        actionAmount: itemPrototype.actionAmount,
      },
    });
  }

  generateQuality = () => {
    const random = Math.floor(
      Math.random() * 100,
    );

    if (random <= 0.1) {
      return ItemQuality.LEGENDARY;
    }
    if (random <= 1) {
      return ItemQuality.EPIC;
    }
    if (random <= 5) {
      return ItemQuality.RARE;
    }
    if (random <= 30) {
      return ItemQuality.UNCOMMON;
    }
    if (random <= 100) {
      return ItemQuality.COMMON;
    }
  };

  generateItemStat(
    stat: number,
    quality: ItemQuality,
  ) {
    if (!stat) {
      return;
    }

    return Math.floor(
      stat *
        (1 +
          ItemQualityBonus[quality]
            .statProcentMultiplier /
            100) +
        ItemQualityBonus[quality].statAdd,
    );
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
          mainType: item.mainType,
          weaponType: item.weaponType,
          armorType: item.armorType,
        },
        include: {
          item: true,
        },
      });

    if (equipedItem !== null) {
      if (
        item.mainType === MainType.WEAPON ||
        item.mainType === MainType.ARMOR
      ) {
        await this.prisma.item.update({
          where: {
            id: equipedItem.id,
          },
          data: {
            equip: false,
          },
        });
        await this.userService.updateUserAttack(
          userId,
        );
        await this.userService.updateUserArmor(
          userId,
        );
      }
    }

    if (
      item.mainType === MainType.WEAPON ||
      item.mainType === MainType.ARMOR ||
      item.itemType === ItemType.BAG
    ) {
      await this.prisma.item.update({
        where: {
          id: itemId,
        },
        data: {
          equip: !item.equip,
        },
      });

      await this.userService.updateUserAttack(
        userId,
      );
      await this.userService.updateUserArmor(
        userId,
      );
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

  generateItemLevel(
    quality: ItemQuality,
    maxLevel: number,
  ) {
    const calculateMinLevel = () => {
      if (quality === ItemQuality.COMMON) {
        return 1;
      }

      if (quality === ItemQuality.UNCOMMON) {
        const minLevel = maxLevel - 30;
        if (minLevel < 1) {
          return 1;
        }
        return minLevel;
      }

      if (quality === ItemQuality.RARE) {
        const minLevel = maxLevel - 20;
        if (minLevel < 1) {
          return 1;
        }
        return minLevel;
      }

      if (quality === ItemQuality.EPIC) {
        const minLevel = maxLevel - 10;
        if (minLevel < 1) {
          return 1;
        }
        return minLevel;
      }

      if (quality === ItemQuality.LEGENDARY) {
        return maxLevel;
      }
      return 1;
    };

    const difference = maxLevel - 1;

    let rand = Math.random();

    rand = Math.floor(rand * difference);

    rand = rand + 1;

    return rand;
  }
}
