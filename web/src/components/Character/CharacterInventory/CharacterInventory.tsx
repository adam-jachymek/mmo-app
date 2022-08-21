import classNames from "classnames";
import { useMemo } from "react";

type Props = {
  itemsData: any;
  openItemModal: (item: any) => void;
};

const CharacterInventory = ({ itemsData, openItemModal }: Props) => {
  const inventory = itemsData?.filter((item: any) => !item.equip);

  const numberOfSlots = 39;

  const renderSlots = useMemo(() => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      if (!inventory[i]?.equip) {
        items.push(
          <li
            onClick={() => {
              inventory[i] && openItemModal(inventory[i]);
            }}
            className={classNames(
              "player__item",
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
                className="player__item-icon"
              />
            )}
          </li>
        );
      }
    }

    return items;
  }, [inventory]);

  return (
    <div>
      <h3 className="player__inventory-text">Inventory</h3>
      <div className="player__items">
        <ul className="player__items-list">{renderSlots}</ul>
      </div>
    </div>
  );
};

export default CharacterInventory;
