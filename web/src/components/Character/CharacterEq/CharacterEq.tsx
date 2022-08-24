import { useMemo } from "react";
import { Item } from "types";

import "./styles.sass";

type Props = {
  itemsData: Array<Item>;
  openItemModal: (item: any) => void;
};

const CharacterEq = ({ itemsData, openItemModal }: Props) => {
  const equippedItems = useMemo(() => {
    const head = itemsData.find(
      (item: Item) => item.type === "HEAD" && item.equip === true
    );
    const chest = itemsData.find(
      (item: Item) => item.type === "CHEST" && item.equip === true
    );
    const weapon = itemsData.find(
      (item: Item) => item.type === "WEAPON" && item.equip === true
    );
    const offhand = itemsData.find(
      (item: Item) => item.type === "OFFHAND" && item.equip === true
    );

    const legs = itemsData.find(
      (item: Item) => item.type === "LEGS" && item.equip === true
    );

    return {
      head: head,
      weapon: weapon,
      chest: chest,
      offhand: offhand,
      legs: legs,
    };
  }, [itemsData]);

  return <div className="eq"></div>;
};

export default CharacterEq;
