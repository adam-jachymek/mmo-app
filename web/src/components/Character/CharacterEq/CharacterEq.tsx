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

  return (
    <div className="eq">
      <div
        className={`eq__slot eq__head ${
          equippedItems?.head && equippedItems.head.quality.toLowerCase()
        }`}
      >
        {equippedItems.head && (
          <div
            onClick={() => {
              openItemModal(equippedItems.head);
            }}
          >
            <img
              src={`/media/items/${equippedItems.head.sprite}.png`}
              className="eq__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`eq__slot eq__chest ${
          equippedItems?.chest && equippedItems.chest.quality.toLowerCase()
        }`}
      >
        {equippedItems.chest && (
          <div
            onClick={() => {
              openItemModal(equippedItems.chest);
            }}
          >
            <img
              src={`/media/items/${equippedItems.chest.sprite}.png`}
              className="eq__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`eq__slot eq__weapon ${
          equippedItems?.weapon && equippedItems.weapon.quality.toLowerCase()
        }`}
      >
        {equippedItems.weapon && (
          <div
            onClick={() => {
              openItemModal(equippedItems.weapon);
            }}
          >
            <img
              src={`/media/items/${equippedItems.weapon.sprite}.png`}
              className="eq__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`eq__slot eq__offhand ${
          equippedItems?.offhand && equippedItems.offhand.quality.toLowerCase()
        }`}
      >
        {equippedItems.offhand && (
          <div
            onClick={() => {
              openItemModal(equippedItems.offhand);
            }}
          >
            <img
              src={`/media/items/${equippedItems.offhand.sprite}.png`}
              className="eq__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`eq__slot eq__legs ${
          equippedItems?.legs && equippedItems.legs.quality.toLowerCase()
        }`}
      >
        {equippedItems.legs && (
          <div
            onClick={() => {
              openItemModal(equippedItems.legs);
            }}
          >
            <img
              src={`/media/items/${equippedItems.legs.sprite}.png`}
              className="eq__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`eq__slot eq__boots ${
          equippedItems?.legs && equippedItems.legs.quality.toLowerCase()
        }`}
      >
        {equippedItems.legs && (
          <div
            onClick={() => {
              openItemModal(equippedItems.legs);
            }}
          >
            <img
              src={`/media/items/${equippedItems.legs.sprite}.png`}
              className="eq__item-icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterEq;
