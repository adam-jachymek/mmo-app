import { Button } from "@mantine/core";
import classNames from "classnames";
import { useMemo } from "react";

import "./styles.sass";

type Props = {
  itemsData: any;
  openItemModal: (item: any) => void;
};

const CharacterInventory = ({ itemsData, openItemModal }: Props) => {
  const inventory = itemsData?.filter((item: any) => !item.equip);

  const bags = itemsData?.filter(
    (item: any) => item.type === "BAG" && item.equip
  );

  const addSlots = bags.reduce(
    (n: number, item: any) => n + item.item.actionAmount,
    0
  );

  const renderBags = useMemo(() => {
    let items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        <li
          onClick={() => {
            bags[i] && openItemModal(bags[i]);
          }}
          className={classNames(
            "inventory__bag",
            { uncommon: bags[i]?.quality === "UNCOMMON" },
            {
              epic: bags[i]?.quality === "EPIC",
            },
            { rare: bags[i]?.quality === "RARE" },
            { legendary: bags[i]?.quality === "LEGENDARY" }
          )}
        >
          {bags[i] && (
            <img
              src={`/media/items/${bags[i].item.sprite}.png`}
              className="inventory__bag-icon"
            />
          )}
        </li>
      );
    }
    return items;
  }, [inventory]);

  const numberOfSlots = 10 + addSlots;

  const renderSlots = useMemo(() => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      items.push(
        <li
          onClick={() => {
            inventory[i] && openItemModal(inventory[i]);
          }}
          className={classNames(
            "inventory__item",
            { uncommon: inventory[i]?.quality === "UNCOMMON" },
            {
              epic: inventory[i]?.quality === "EPIC",
            },
            { rare: inventory[i]?.quality === "RARE" },
            { legendary: inventory[i]?.quality === "LEGENDARY" }
          )}
        >
          {inventory[i] && (
            <img
              src={`/media/items/${inventory[i].item.sprite}.png`}
              className="inventory__item-icon"
            />
          )}
        </li>
      );
    }

    return items;
  }, [inventory]);

  return (
    <>
      <div className="inventory__wrapper-list">
        <ul className="inventory__bag-list">{renderBags}</ul>
        <ul className="inventory__items-list">{renderSlots}</ul>
      </div>
    </>
  );
};

export default CharacterInventory;
