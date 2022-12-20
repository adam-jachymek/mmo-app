import { useState } from "react";
import { useQuery } from "react-query";
import { getItems } from "api/endpoints";
import { Loader } from "@mantine/core";
import { EquipItem, User, Item } from "/types";
import ItemModal from "../ItemModal";
import CharacterStats from "./CharacterStats";
import CharacterInventory from "./CharacterInventory";
import CharacterProfile from "./CharacterProfile";
import { Mobile, Default } from "../../utils/mediaQuery";
import CharacterMenu from "./CharacterMenu";

import "./styles.sass";

type Props = {
  user: User;
  currentUser: User;
  refetchUser: () => void;
};

const Character = ({ user, currentUser, refetchUser }: Props) => {
  const [openItem, setOpenItem] = useState(false);
  const [item, setItem] = useState<EquipItem>();
  const [showStats, setShowStats] = useState(false);

  const {
    data: itemsData,
    refetch: refetchItems,
    isFetching,
  } = useQuery(["getItems", currentUser?.id], getItems);

  const openItemModal = (item: Item) => {
    setItem(item);
    setOpenItem(true);
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="character">
        <Default>
          <div className="character__desktop-side-by-side">
            <div className="character__desktop-character-wrapper">
              <CharacterProfile
                user={user}
                currentUser={currentUser}
                itemsData={itemsData}
                openItemModal={openItemModal}
              />
              <CharacterInventory
                itemsData={itemsData}
                openItemModal={openItemModal}
              />
            </div>
            <CharacterStats
              currentUser={currentUser}
              refetchUser={refetchUser}
            />
          </div>
        </Default>

        <Mobile>
          <CharacterProfile
            user={user}
            currentUser={currentUser}
            itemsData={itemsData}
            openItemModal={openItemModal}
          />
          <CharacterMenu showStats={showStats} setShowStats={setShowStats} />
          {!showStats ? (
            <CharacterInventory
              itemsData={itemsData}
              openItemModal={openItemModal}
            />
          ) : (
            <CharacterStats
              currentUser={currentUser}
              refetchUser={refetchUser}
            />
          )}
        </Mobile>
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
