import { ItemPrototype, Mob } from "types";

export const getSelectData = (data: ItemPrototype[] | Mob[]) => {
  return data?.map((item: ItemPrototype | Mob) => ({
    image: item.sprite,
    label: item.name,
    value: item.id,
  }));
};
