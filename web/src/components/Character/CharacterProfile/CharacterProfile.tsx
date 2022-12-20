import { useMemo } from "react";
import { Progress } from "@mantine/core";
import { Item, User } from "/types";

import "./styles.sass";

type Props = {
  user: User;
  currentUser: User;
  itemsData: any;
  openItemModal: (item: Item) => void;
};

const CharacterProfile = ({
  user,
  currentUser,
  itemsData,
  openItemModal,
}: Props) => {
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
    <div className="profile">
      <div className="profile__wrapper">
        <div className="profile__eq-slots">
          <div
            className={`profile__slot ${
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
                  className="profile__item-icon"
                />
              </div>
            )}
          </div>
          <div
            className={`profile__slot ${
              equippedItems?.offhand &&
              equippedItems.offhand.quality.toLowerCase()
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
                  className="profile__item-icon"
                />
              </div>
            )}
          </div>
          <div
            className={`profile__slot ${
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
        <div className="profile__center">
          <div className="profile__info">
            <span className="profile__guild">Avengers</span>
            <img
              className="profile__avatar"
              src={`/media/avatars/${currentUser?.avatar}.png`}
            />
            <span>{currentUser?.username}</span>
            <span>
              {currentUser?.level}
              <span className="profile__lvl"> LVL</span>
            </span>
          </div>
        </div>
        <div className="profile__eq-slots">
          <div
            className={`profile__slot ${
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
                  className="profile__item-icon"
                />
              </div>
            )}
          </div>
          <div
            className={`profile__slot ${
              equippedItems?.weapon &&
              equippedItems.weapon.quality.toLowerCase()
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
                  className="profile__item-icon"
                />
              </div>
            )}
          </div>
          <div
            className={`profile__slot ${
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
                  className="profile__item-icon"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="profile__bars">
        <div className="profile__progress">
          <Progress
            classNames={{ root: "profile__bar", bar: "profile__bar-bar" }}
            color="#851010"
            value={(user?.hp / user?.maxHp) * 100}
          />
          <span className="profile__progress-amount">
            {user?.hp} / {user?.maxHp}
          </span>
        </div>
        <div className="profile__progress">
          <Progress
            classNames={{ root: "profile__bar", bar: "profile__bar-bar" }}
            color="#121085"
            value={(user?.exp / user?.maxExp) * 100}
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
