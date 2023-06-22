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
  layer2?: string;
  layer3?: string;
  text?: string;
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
};

export type NPC = {
  id: number;
  name: string;
  avatar: string;
  dialog: Dialog[];
};

export type Dialog = {
  id: number;
  isEnd: boolean;
  isStart: boolean;
  name: string;
  npcId: number;
  text: string[];
  options: DialogOption[];
  next: Dialog;
};

export type DialogOption = {
  id: number;
  text: string;
  dialogId: number;
  nextDialog: Dialog;
  nextDialogId?: number;
};

export type PlayerOnTheMap = {
  id: number;
  username: string;
  level: number;
  avatar: string;
  hp: number;
  maxHp: number;
  battleId: number | null;
  x: number;
  y: number;
};

export type BattleMob = {
  id: number;
  level: number;
  name: string;
  sprite: string;
  hp: number;
  maxHp: number;
  giveExp: number;
};

export type BattleUser = {
  id: number;
  username: string;
  hp: number;
  maxHp: number;
  level: number;
  exp: number;
  maxExp: number;
  avatar: string;
};

export type Battle = {
  id: number;
  activeUser: number;
  activeMob: number;
  battleEnded: boolean;
  itemDropIds: number[];
  mobDamage: number | null;
  mobs: BattleMob[];
  userDamage: number | null;
  userTurn: boolean;
  users: BattleUser[];
  youLost: boolean | null;
  youWin: boolean | null;
  mobAnimation: string;
  playerAnimation: string;
};
