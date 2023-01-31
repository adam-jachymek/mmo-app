import { Item } from "/types";

type Props = {
  equippedItem: Item;
  openItemModal: (equippedItem: Item) => void;
};

const EquippedItemSlot = ({ equippedItem, openItemModal }: Props) => {
  return (
    <div
      className={`profile__slot ${
        equippedItem && equippedItem.quality?.toLowerCase()
      }`}
    >
      {equippedItem && (
        <div
          onClick={() => {
            openItemModal(equippedItem);
          }}
        >
          <img
            src={`/media/items/${equippedItem.sprite}.png`}
            className="profile__item-icon"
          />
        </div>
      )}
    </div>
  );
};

export default EquippedItemSlot;
