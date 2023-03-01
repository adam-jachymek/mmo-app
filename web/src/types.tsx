export type GuildRoles = "ADMIN" | "MOD" | "PENDING" | "MEMBER";

export type User = {
  id: number;
  guild: any;
  username: string;
  hp: number;
  maxHp: number;
  level: number;
  exp: number;
  maxExp: number;
  guildId: number;
  guildRole: GuildRoles;
  avatar: string;
  battleId?: number;
  mapId: number;
  points: number;
  gold: number;
  stamina: number;
  strength: number;
  defence: number;
  dexterity: number;
  intelligence: number;
  totalDefence: number;
  totalStamina: number;
  x: number;
  y: number;
  minAttack: number;
  maxAttack: number;
};

export type ItemPrototype = {
  id: number;
  name: string;
  description: string;
  mainType: string;
  sprite: string;
  minAttack: number;
  maxAttack: number;
  quality: string;
  actionAmount: number;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  minAttack: number;
  maxAttack: number;
  userId: number;
  item: ItemPrototype;
  user: User;
  quality: string;
  level: number;
  stamina: number;
  strength: number;
  defence: number;
  dexterity: number;
  intelligence: number;
  mainType: string;
  weaponType: string;
  armorType: string;
  itemType: string;
  type: string;
  equip: boolean;
  actionAmount: number;
  sprite: string;
};

export type Mob = {
  attack: number;
  createdAt: string;
  defence: number;
  giveExp: number;
  level: number;
  hp: number;
  maxHp: number;
  id: number;
  maxLevel: number;
  minLevel: number;
  name: string;
  sprite: string;
  updatedAt: string;
};

export type Map = {
  createdAt: string;
  id: number;
  maxLevel: number;
  minLevel: number;
  name: string;
  sprite?: string;
  updateAt: string;
  tiles: any;
};

export type Guild = {
  id: number;
  name: string;
  description: string;
  usersCount: number;
};

export type EquipItem = {
  id?: number;
  name?: string;
  minAttack?: number;
  maxAttack?: number;
  type?: string;
  level?: number;
  quality?: string;
  stamina?: number;
  defence?: number;
  equip?: boolean;
  sprite?: string;
};

export type Tile = {
  tileId?: string;
  blocked?: boolean;
  id?: number;
  sprite?: string;
  object?: string;
  text?: string;
  action_name?: string;
  x?: number;
  y?: number;
  actionMobSpawn?: [
    {
      mobId: string;
      minLevel: number;
      maxLevel: number;
      spawnRate: number;
      drop: [
        {
          itemId: number;
          dropRate: number;
        }
      ];
    }
  ];
  action?: {
    teleport?: { mapId: string; newMapX: number; newMapY: number };
    mobSpawn?: [
      {
        mobId: string;
        minLevel: number;
        maxLevel: number;
        spawnRate: number;
        drop: [
          {
            itemId: number;
            dropRate: number;
          }
        ];
      }
    ];
  };
};
