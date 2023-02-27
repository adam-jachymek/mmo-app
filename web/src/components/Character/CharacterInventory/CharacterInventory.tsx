import classNames from "classnames";
import { useMemo } from "react";
import { Item } from "/types";
import { assets_url } from "config";

import "./styles.sass";

const NUMBER_OF_BAG_SLOTS = 5;
const DEFAULT_NUMBER_OF_SLOTS = 10;

type Props = {
  itemsData: Item[];
  openItemModal: (item: Item) => void;
};

const CharacterInventory = ({ itemsData, openItemModal }: Props) => {
  const inventory = itemsData?.filter((item: Item) => !item.equip);

  const bags = itemsData?.filter(
    (item: Item) => item.type === "BAG" && item.equip
  );

  const numberOfExtraSlots = bags.reduce(
    (n: number, item: Item) => n + item.item.actionAmount,
    0
  );

  // migrate to component
  const renderBags = useMemo(() => {
    let items = [];
    for (let i = 0; i < NUMBER_OF_BAG_SLOTS; i++) {
      const bag = bags[i];
      items.push(
        <li
          onClick={() => {
            bag && openItemModal(bag);
          }}
          className={classNames("inventory__bag", bag?.quality?.toLowerCase())}
        >
          {bag && (
            <img
              src={`${assets_url}/${bag.sprite}`}
              className="inventory__bag-icon"
            />
          )}
        </li>
      );
    }
    return items;
  }, [inventory]);

  const numberOfSlots = DEFAULT_NUMBER_OF_SLOTS + numberOfExtraSlots;

  // migrate to component
  const renderSlots = useMemo(() => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      const inventoryItem = inventory[i];
      items.push(
        <li
          onClick={() => {
            inventoryItem && openItemModal(inventoryItem);
          }}
          className={classNames(
            "inventory__item",
            inventoryItem?.quality?.toLowerCase()
          )}
        >
          {inventoryItem && (
            <img
              src={`${assets_url}/${inventoryItem.sprite}`}
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
