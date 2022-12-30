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
  const [activeItem, setActiveItem] = useState<EquipItem>();
  const [showStats, setShowStats] = useState(false);

  const {
    data: itemsData,
    refetch: refetchItems,
    isFetching,
  } = useQuery(["getItems", currentUser?.id], getItems);

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
                itemsData={itemsData} //userItems
                // handleItemModalOpen
                openItemModal={setActiveItem}
              />
              <CharacterInventory
                itemsData={itemsData}
                openItemModal={setActiveItem}
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
            itemsData={itemsData}
            openItemModal={setActiveItem}
          />
          <CharacterMenu showStats={showStats} setShowStats={setShowStats} />
          {!showStats ? (
            <CharacterInventory
              itemsData={itemsData}
              openItemModal={setActiveItem}
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
        item={activeItem}
        isVisible={Boolean(activeItem)}
        handleCloseModal={() => setActiveItem(undefined)}
        refetchItems={refetchItems}
      />
    </>
  );
};

export default Character;
