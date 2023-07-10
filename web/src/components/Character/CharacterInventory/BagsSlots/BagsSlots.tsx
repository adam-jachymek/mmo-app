import classNames from "classnames";
import { assets_url } from "config";
import { Item } from "types";

import "../styles.sass";

const NUMBER_OF_BAG_SLOTS = 5;

type Props = {
  openItemModal: (item: Item) => void;
  itemsData: Item[];
};

const BagsSlots = ({ openItemModal, itemsData }: Props) => {
  const bags = itemsData?.filter(
    (item: Item) => item.itemType === "BAG" && item.equip
  );

  let items = [];
  for (let i = 0; i < NUMBER_OF_BAG_SLOTS; i++) {
    const bag = bags[i];
    items.push(
      <li
        key={bag?.id}
        onClick={() => {
          bag && openItemModal(bag);
        }}
        className={classNames("inventory__bag", bag?.quality?.toLowerCase())}
      >
        {bag && (
          <img
            alt="bag-sprite"
            src={`${assets_url}/${bag.sprite}`}
            className="inventory__bag-icon"
          />
        )}
      </li>
    );
  }
  return <ul className="inventory__bag-list">{items}</ul>;
};

export default BagsSlots;
