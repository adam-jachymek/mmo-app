import { useState } from "react";
import { useQuery } from "react-query";
import { getItems } from "api/endpoints";
import { Button, Loader } from "@mantine/core";
import { EquipItem, User } from "/types";
import ItemModal from "../ItemModal";
import CharacterStats from "./CharacterStats";
import CharacterInventory from "./CharacterInventory";
import CharacterProfile from "./CharacterProfile";
import classNames from "classnames";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const Character = ({ currentUser, refetchUser }: Props) => {
  const [openItem, setOpenItem] = useState(false);
  const [item, setItem] = useState<EquipItem>();
  const [showStats, setShowStats] = useState(false);

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
        <CharacterProfile
          currentUser={currentUser}
          itemsData={itemsData}
          openItemModal={openItemModal}
        />
        <div className="character__menu">
          <Button
            className={classNames("character__button", { active: !showStats })}
            onClick={() => {
              setShowStats(false);
            }}
            variant="outline"
            color="gray"
          >
            Inventory
          </Button>
          <Button
            className={classNames("character__button", { active: showStats })}
            onClick={() => {
              setShowStats(true);
            }}
            variant="outline"
            color="gray"
          >
            Stats
          </Button>
        </div>
        {!showStats ? (
          <CharacterInventory
            itemsData={itemsData}
            openItemModal={openItemModal}
          />
        ) : (
          <CharacterStats currentUser={currentUser} refetchUser={refetchUser} />
        )}
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
