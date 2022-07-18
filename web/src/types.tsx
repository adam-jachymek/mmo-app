export type User = {
  username: string;
};

export type ItemPrototype = {
  id: number;
  name: string;
  description: string;
  type: string;
  icon: string;
  minStat: number;
  maxStat: number;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  stat: number;
  userId: number;
  item: ItemPrototype;
  user: User;
};
