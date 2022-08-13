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
};

export type ItemPrototype = {
  id: number;
  name: string;
  description: string;
  type: string;
  sprite: string;
  minStat: number;
  maxStat: number;
  isEquipment: string;
  quality: string;
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
  defence: number;
};

export type Mob = {
  attack: number;
  createdAt: string;
  defence: number;
  giveExp: number;
  hp: number;
  id: number;
  mapId: number;
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
  mobs: Mob;
  name: string;
  sprite?: string;
  updateAt: string;
};

export type Guild = {
  id: number;
  name: string;
  description: string;
  usersCount: number;
};
