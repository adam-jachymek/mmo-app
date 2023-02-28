import { ItemQuality } from '@prisma/client';

export const ItemQualityBonus = {
  [ItemQuality.COMMON]: {
    statAdd: 0,
    statProcentMultiplier: 0,
  },
  [ItemQuality.UNCOMMON]: {
    statAdd: 2,
    statProcentMultiplier: 5,
  },
  [ItemQuality.RARE]: {
    statAdd: 4,
    statProcentMultiplier: 10,
  },
  [ItemQuality.EPIC]: {
    statAdd: 6,
    statProcentMultiplier: 15,
  },
  [ItemQuality.LEGENDARY]: {
    statAdd: 8,
    statProcentMultiplier: 20,
  },
};
