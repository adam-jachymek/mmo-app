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
import CharacterProfile from "./CharacterProfile";

type Props = {
  currentUser: User;
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
    setItem(item);
    setOpenItem(true);
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="character">
        <CharacterProfile currentUser={currentUser} />
        <CharacterEq itemsData={itemsData} openItemModal={openItemModal} />
        <CharacterStats currentUser={currentUser} refetchUser={refetchUser} />
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
