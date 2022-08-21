import { useState } from "react";
import { useQuery } from "react-query";
import { getItems } from "api/endpoints";
import { Loader } from "@mantine/core";
import { EquipItem, User } from "/types";
import ItemModal from "../ItemModal";
import CharacterEq from "./CharacterEq";
import CharacterStats from "./CharacterStats";
import CharacterInventory from "./CharacterInventory";

import "./styles.sass";

type Props = {
  currentUser: any;
  refetchUser: () => void;
};

const Character = ({ currentUser, refetchUser }: Props) => {
  const [openItem, setOpenItem] = useState(false);
  const [item, setItem] = useState<EquipItem>();

  const {
    data: itemsData,
    refetch: refetchItems,
    isFetching,
  } = useQuery("getItems", getItems);

  const openItemModal = (item: any) => {
    setOpenItem(true);
    setItem({
      id: item.id,
      name: item.name,
      minAttack: item.minAttack,
      maxAttack: item.maxAttack,
      quality: item.quality,
      level: item.level,
      isEquipment: item.isEquipment,
      type: item.type,
      equip: item.equip,
      stamina: item.stamina,
      defence: item.defence,
      sprite: item.sprite,
    });
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="player">
        <div className="player__info">
          <img
            className="player__avatar-img"
            src={`/media/users/${currentUser.avatar}.png`}
          />
          <CharacterEq itemsData={itemsData} openItemModal={openItemModal} />
          <CharacterStats currentUser={currentUser} refetchUser={refetchUser} />
        </div>
        <CharacterInventory
          itemsData={itemsData}
          openItemModal={openItemModal}
        />
      </div>
      <ItemModal
        item={item}
        openItem={openItem}
        setOpenItem={setOpenItem}
        refetchItems={refetchItems}
      />
    </>
  );
};

export default Character;
