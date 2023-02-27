import { ItemQuality } from '@prisma/client';

export const ItemQualityBonus = {
  [ItemQuality.COMMON]: {
    statAdd: 0,
    statProcentMultiplier: 0,
  },
  [ItemQuality.UNCOMMON]: {
    statAdd: 1,
    statProcentMultiplier: 5,
  },
  [ItemQuality.RARE]: {
    statAdd: 2,
    statProcentMultiplier: 10,
  },
  [ItemQuality.EPIC]: {
    statAdd: 3,
    statProcentMultiplier: 15,
  },
  [ItemQuality.LEGENDARY]: {
    statAdd: 4,
    statProcentMultiplier: 20,
  },
};
