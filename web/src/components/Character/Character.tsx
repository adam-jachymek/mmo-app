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
import { Modal, Button, Loader } from "@mantine/core";

import "./styles.sass";
import classNames from "classnames";

const Character = () => {
  const [openItem, setOpenItem] = useState(false);
  const [equiped, setEqupied] = useState([]);
  const [item, setItem] = useState({
    id: 0,
    name: "",
    minAttack: 0,
    maxAttack: 0,
    isEquipment: false,
    type: "",
    level: 0,
    quality: "",
    stamina: 0,
    defence: 0,
    equip: false,
    sprite: "",
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

  const inventory = itemsData?.filter((item: any) => !item.equip);

  const numberOfSlots = 39;

  const renderSlots = () => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      if (!inventory[i]?.equip) {
        items.push(
          <li
            onClick={() => {
              inventory[i] && openItemModal(inventory[i]);
            }}
            className={classNames(
              "player__item",
              { uncommon: inventory[i]?.quality === "UNCOMMON" },
              {
                epic: inventory[i]?.quality === "EPIC",
              },
              { rare: inventory[i]?.quality === "RARE" },
              { legendary: inventory[i]?.quality === "LEGENDARY" }
            )}
          >
            {inventory[i] && (
              <img
                src={`/media/items/${inventory[i].item.sprite}.png`}
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
          src={`/media/items/${item.sprite}.png`}
          className="player__modal-icon"
        />
        <h3>{item.name}</h3>
        <h4>{item.level} lvl</h4>
        <h4
          className={classNames(
            {
              uncommon: item.quality === "UNCOMMON",
            },
            {
              rare: item.quality === "RARE",
            },
            {
              epic: item.quality === "EPIC",
            },
            {
              legendary: item.quality === "LEGENDARY",
            }
          )}
        >
          {item.quality}
        </h4>
        {item.type === "WEAPON" && (
          <p>
            Attack: {item.minAttack} - {item.maxAttack}
          </p>
        )}
        {item.type === "HEAD" && (
          <div>
            <p>Stamina: {item.stamina}</p>
            <p>Defence: {item.defence}</p>
          </div>
        )}
        <div className="player__modal-buttons">
          {item.isEquipment && (
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
    return <Loader />;
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
              {itemsData?.map(
                (item: any) =>
                  item.equip &&
                  item.type === "HEAD" && (
                    <div
                      onClick={() => {
                        openItemModal(item);
                      }}
                    >
                      <img
                        src={`/media/items/${item.item.sprite}.png`}
                        className={classNames(
                          "player__item-icon",
                          {
                            uncommon: item.quality === "UNCOMMON",
                          },
                          {
                            rare: item.quality === "RARE",
                          },
                          {
                            epic: item.quality === "EPIC",
                          },
                          {
                            legendary: item.quality === "LEGENDARY",
                          }
                        )}
                      />
                    </div>
                  )
              )}
            </span>
            <span className="player__eq-leftarm">
              <GiBorderedShield className="player__eq-icon" />
            </span>
            <span className="player__eq-rightarm">
              {itemsData?.map(
                (item: any) =>
                  item.equip &&
                  item.type === "WEAPON" && (
                    <div
                      onClick={() => {
                        openItemModal(item);
                      }}
                    >
                      <img
                        src={`/media/items/${item.item.sprite}.png`}
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
