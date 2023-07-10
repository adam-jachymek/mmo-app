import classNames from "classnames";
import { assets_url } from "config";
import { Item } from "/types";
import Items from "/components/Admin/sub/Items";

const DEFAULT_NUMBER_OF_SLOTS = 10;

type Props = {
  itemsData: Item[];
  inventory: Item[];
  multiSelect: boolean;
  multiItemsIds: number[];
  setMultiItemsIds: (itemsIds: number[]) => void;
  openItemModal: (item: Item) => void;
};

const ItemsSlots = ({
  itemsData,
  inventory,
  multiSelect,
  multiItemsIds,
  setMultiItemsIds,
  openItemModal,
}: Props) => {
  const bags = itemsData?.filter(
    (item: Item) => item.itemType === "BAG" && item.equip
  );

  const numberOfExtraSlots = bags.reduce(
    (n: number, item: Item) => n + item.item.actionAmount,
    0
  );

  const numberOfSlots = DEFAULT_NUMBER_OF_SLOTS + numberOfExtraSlots;

  let items = [];
  for (let i = 0; i < numberOfSlots; i++) {
    items.push(inventory[i] || { id: i });
  }

  return (
    <ul className="inventory__items-list">
      {items.map((inventoryItem) => (
        <li
          key={inventoryItem.id}
          onClick={() => {
            if (multiSelect && inventoryItem.name) {
              if (!multiItemsIds.includes(inventoryItem?.id)) {
                setMultiItemsIds([...multiItemsIds, inventoryItem?.id]);
                return;
              } else {
                setMultiItemsIds(
                  multiItemsIds.filter((item) => item !== inventoryItem?.id)
                );
                return;
              }
            }
            inventoryItem.name && openItemModal(inventoryItem);
          }}
          className={classNames(
            "inventory__item",
            inventoryItem?.quality?.toLowerCase(),
            {
              "inventory__item-selected": multiItemsIds.includes(
                inventoryItem.id
              ),
            }
          )}
        >
          {inventoryItem?.sprite && (
            <img
              alt="item-icon"
              src={`${assets_url}/${inventoryItem.sprite}`}
              className="inventory__item-icon"
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ItemsSlots;
