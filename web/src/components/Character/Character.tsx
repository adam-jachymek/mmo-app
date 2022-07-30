import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getUser } from "api/endpoints";
import { getItems, deleteItem, addLevelPoint, equipItem } from "api/endpoints";
import {
  GiDrippingSword,
  GiAbdominalArmor,
  GiShardSword,
  GiVikingHead,
  GiBorderedShield,
  GiBoots,
  GiArmoredPants,
} from "react-icons/gi";
import { Modal, Button } from "@mantine/core";

import "./styles.sass";

const Character = () => {
  const [openItem, setOpenItem] = useState(false);
  const [equiped, setEqupied] = useState([]);
  const [item, setItem] = useState({
    id: 0,
    name: "",
    stat: "",
    isEq: false,
    type: "",
    equip: false,
    icon: "",
  });
  const { data: user, refetch: refetchUser } = useQuery("currentUser", getUser);

  const {
    data: itemsData,
    refetch: refetchItems,
    isFetching,
  } = useQuery("getItems", getItems);

  const { mutate: deleteThis } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const { mutate: addPoint } = useMutation(addLevelPoint, {
    onSuccess: (response) => {
      refetchUser();
    },
  });

  const { mutate: equipThisItem } = useMutation(equipItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const openItemModal = (item: any) => {
    setOpenItem(true);
    setItem({
      id: item.id,
      name: item.item.name,
      stat: item.stat,
      isEq: item.item.isEq,
      type: item.item.type,
      equip: item.equip,
      icon: item.item.icon,
    });
  };

  console.log("items", itemsData);

  const numberOfSlots = 40;

  const renderSlots = () => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      if (!itemsData[i]?.equip) {
        items.push(
          <li
            onClick={() => {
              itemsData[i] && openItemModal(itemsData[i]);
            }}
            className="player__item"
          >
            {itemsData[i] && (
              <img
                src={`/media/items/${itemsData[i].item.icon}.png`}
                className="player__item-icon"
              />
            )}
          </li>
        );
      }
    }

    return items;
  };

  const handleCloseModal = () => {
    setOpenItem(false);
  };

  const itemModal = () => {
    return (
      <Modal
        classNames={{ root: "player__modal" }}
        centered
        withCloseButton={false}
        opened={openItem}
        onClose={handleCloseModal}
      >
        <img
          src={`/media/items/${item.icon}.png`}
          className="player__modal-icon"
        />
        <h3>{item.name}</h3>
        Stat: {item.stat}
        <div className="player__modal-buttons">
          {item.isEq && (
            <Button
              variant="outline"
              color="lime"
              onClick={() => {
                equipThisItem(item.id);
                handleCloseModal();
              }}
            >
              {item.equip ? "UNEQUIP" : "EQUIP"}
            </Button>
          )}
          {item.type === "potion" && (
            <Button
              variant="outline"
              color="lime"
              onClick={() => {
                handleCloseModal();
              }}
            >
              USE
            </Button>
          )}
          <Button
            onClick={() => deleteThis(item.id)}
            variant="outline"
            color="red"
            uppercase
          >
            Remove
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="outline"
            color="gray"
            uppercase
          >
            Close
          </Button>
        </div>
      </Modal>
    );
  };

  if (isFetching) {
    return <h1>"Loading..."</h1>;
  }

  return (
    <div>
      <div className="player">
        <div className="player__info">
          <img
            className="player__avatar-img"
            src="/media/player/player.png"
            alt=""
          />
          <div className="player__eq">
            <span className="player__eq-armor">
              <GiAbdominalArmor className="player__eq-icon" />
            </span>
            <span className="player__eq-head">
              {itemsData.map(
                (item: any) =>
                  item.equip &&
                  item.item.type === "head" && (
                    <div
                      onClick={() => {
                        openItemModal(item);
                      }}
                    >
                      <img
                        src={`/media/items/${item.item.icon}.png`}
                        className="player__item-icon"
                      />
                    </div>
                  )
              )}
            </span>
            <span className="player__eq-leftarm">
              <GiBorderedShield className="player__eq-icon" />
            </span>
            <span className="player__eq-rightarm">
              {itemsData.map(
                (item: any) =>
                  item.equip &&
                  item.item.type === "weapon" && (
                    <div
                      onClick={() => {
                        openItemModal(item);
                      }}
                    >
                      <img
                        src={`/media/items/${item.item.icon}.png`}
                        className="player__item-icon"
                      />
                    </div>
                  )
              )}
            </span>
            <span className="player__eq-legs">
              <GiArmoredPants className="player__eq-icon" />
            </span>
            <span className="player__eq-boots">
              <GiBoots className="player__eq-icon" />
            </span>
          </div>
          <div className="player__stats">
            <p className="player__stats-text player__stats-text-points">
              <span>Skill Points:</span>
              <span>{user?.points}</span>
            </p>
            <p className="player__stats-text">
              <span>Stamina:</span>
              <span className="player__stats_count">
                {user?.stamina}
                {user?.points > 0 && (
                  <button
                    onClick={() => {
                      addPoint({ stamina: user?.stamina + 1 });
                    }}
                  >
                    +
                  </button>
                )}
              </span>
            </p>
            <p className="player__stats-text">
              <span>Strength:</span>
              <span className="player__stats_count">
                {user?.strength} ({user?.eqStrength})
                {user?.points > 0 && (
                  <button
                    onClick={() => {
                      addPoint({ strength: user?.strength + 1 });
                    }}
                  >
                    +
                  </button>
                )}
              </span>
            </p>
            <p className="player__stats-text">
              <span>Defence:</span>
              <span className="player__stats_count">
                {user?.defence}
                {user?.points > 0 && (
                  <button
                    onClick={() => {
                      addPoint({ defence: user?.defence + 1 });
                    }}
                  >
                    +
                  </button>
                )}
              </span>
            </p>
            <p className="player__stats-text">
              <span>Attack Speed:</span>
              <span className="player__stats_count">
                {user?.speed}
                {user?.points > 0 && (
                  <button
                    onClick={() => {
                      addPoint({ speed: user?.speed + 1 });
                    }}
                  >
                    +
                  </button>
                )}
              </span>
            </p>
            <p className="player__stats-text">
              <span> Intelligence: </span>
              <span className="player__stats_count">
                {user?.intelligence}
                {user?.points > 0 && (
                  <button
                    onClick={() => {
                      addPoint({ intelligence: user?.intelligence + 1 });
                    }}
                  >
                    +
                  </button>
                )}
              </span>
            </p>
          </div>
        </div>
        <h3 className="player__inventory-text">Inventory</h3>
        <div className="player__items">
          <ul className="player__items-list">{renderSlots()}</ul>
        </div>
      </div>
      {itemModal()}
    </div>
  );
};

export default Character;
