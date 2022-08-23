import { useMemo } from "react";
import { Item } from "types";

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
    <div className="player__eq-wrapper">
      <div
        className={`player__eq player__eq-head ${
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
              className="player__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`player__eq player__eq-chest ${
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
              className="player__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`player__eq player__eq-weapon ${
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
              className="player__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`player__eq player__eq-offhand ${
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
              className="player__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`player__eq player__eq-legs ${
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
              className="player__item-icon"
            />
          </div>
        )}
      </div>

      <div
        className={`player__eq player__eq-boots ${
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
              className="player__item-icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterEq;
