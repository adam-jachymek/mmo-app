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

const CharacterProfile = ({ user, itemsData, openItemModal }: Props) => {
  const equippedItems = useMemo(() => {
    const allEquippedItems = itemsData?.filter(
      (item: Item) => item?.equip === true
    );

    console.log("allEquippedItems", allEquippedItems);

    const head = allEquippedItems?.find(
      (item: Item) => item?.armorType === "HEAD"
    );
    const chest = allEquippedItems?.find(
      (item: Item) => item?.armorType === "CHEST"
    );
    const weapon = allEquippedItems?.find(
      (item: Item) => item?.mainType === "WEAPON"
    );
    const offhand = allEquippedItems?.find(
      (item: Item) => item?.armorType === "OFFHAND"
    );
    const legs = allEquippedItems?.find(
      (item: Item) => item?.armorType === "LEGS"
    );

    return {
      head,
      weapon,
      chest,
      offhand,
      legs,
    };
  }, [itemsData]);

  console.log("itemsData", itemsData);

  return (
    <div className="profile">
      <div className="profile__wrapper">
        <div className="profile__eq-slots">
          <EquippedItemSlot
            equippedItem={equippedItems.head}
            openItemModal={openItemModal}
          />
          <EquippedItemSlot
            equippedItem={equippedItems.chest}
            openItemModal={openItemModal}
          />
          <EquippedItemSlot
            equippedItem={equippedItems.legs}
            openItemModal={openItemModal}
          />
        </div>
        <div className="profile__center">
          <div className="profile__info">
            <img
              alt="profile-avatar"
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
            equippedItem={equippedItems.offhand}
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
            {user?.exp} / {user?.maxExp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
