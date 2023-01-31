import { useMemo } from "react";
import { Progress } from "@mantine/core";
import { Item, User } from "/types";
import EquippedItemSlot from "./EquippedItemSlot";
import calculateProgress from "utils/calculateProgress";

import "./styles.sass";

type Props = {
  user: User;
  itemsData: any;
  openItemModal: (item: Item) => void;
};

const findEquipedItem = (itemsData: any, itemType: string) => {
  console.log("itemsData", itemsData);

  return itemsData.find(
    (item: Item) => item.equip === true && item.type === itemType
  );
};

const CharacterProfile = ({ user, itemsData, openItemModal }: Props) => {
  const equippedItems = useMemo(() => {
    const head = findEquipedItem(itemsData, "HEAD");
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
      head,
      weapon,
      chest,
      offhand,
      legs,
    };
  }, [itemsData]);

  return (
    <div className="profile">
      <div className="profile__wrapper">
        <div className="profile__eq-slots">
          <EquippedItemSlot
            equippedItem={equippedItems.head}
            openItemModal={openItemModal}
          />
          <EquippedItemSlot
            equippedItem={equippedItems.offhand}
            openItemModal={openItemModal}
          />
          <EquippedItemSlot
            equippedItem={equippedItems.legs}
            openItemModal={openItemModal}
          />
        </div>
        <div className="profile__center">
          <div className="profile__info">
            <span className="profile__guild">Avengers</span>
            <img
              className="profile__avatar"
              src={`/media/avatars/${user?.avatar}.png`}
            />
            <span>{user?.username}</span>
            <span>
              {user?.level}
              <span className="profile__lvl"> LVL</span>
            </span>
          </div>
        </div>
        <div className="profile__eq-slots">
          <EquippedItemSlot
            equippedItem={equippedItems.chest}
            openItemModal={openItemModal}
          />
          <EquippedItemSlot
            equippedItem={equippedItems.weapon}
            openItemModal={openItemModal}
          />
          <EquippedItemSlot
            equippedItem={equippedItems.legs}
            openItemModal={openItemModal}
          />
        </div>
      </div>
      <div className="profile__bars">
        <div className="profile__progress">
          <Progress
            classNames={{ root: "profile__bar", bar: "profile__bar-bar" }}
            color="#851010"
            value={calculateProgress(user?.hp, user?.maxHp)}
          />
          <span className="profile__progress-amount">
            {user?.hp} / {user?.maxHp}
          </span>
        </div>
        <div className="profile__progress">
          <Progress
            classNames={{ root: "profile__bar", bar: "profile__bar-bar" }}
            color="#121085"
            value={calculateProgress(user?.exp, user?.maxExp)}
          />
          <span className="profile__progress-amount">
            {calculateProgress(user?.exp, user?.maxExp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
