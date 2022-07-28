import { useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser } from "api/endpoints";
import { createItem, getItems, deleteItem, addLevelPoint } from "api/endpoints";
import {
  GiDrippingSword,
  GiAbdominalArmor,
  GiCrossedSwords,
  GiCharacter,
  GiShardSword,
  GiVikingHead,
  GiBorderedShield,
  GiBoots,
  GiArmoredPants,
} from "react-icons/gi";
import avatar from "knight.png";

import { Item } from "types";

import "./styles.sass";
import { Box, Modal, Typography } from "@mui/material";

const Character = () => {
  const [openItem, setOpenItem] = useState(false);
  const [item, setItem] = useState({ id: 0, name: "", stat: "" });
  const { data: user, refetch: refetchUser } = useQuery("currentUser", getUser);

  const {
    data: itemsData,
    refetch: refetchItems,
    isFetching,
  } = useQuery("getITems", getItems);

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

  const numberOfSlots = 41;

  const renderSlots = () => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      items.push(
        <li
          onClick={() => {
            setOpenItem(true);
            setItem({
              id: itemsData[i]?.id,
              name: itemsData[i]?.item.name,
              stat: itemsData[i]?.stat,
            });
          }}
          className="player__item"
        >
          <div>
            {itemsData[i] && <GiDrippingSword className="player__item-icon" />}
          </div>
          {itemsData[i]?.item?.name}
          {itemsData[i]?.stat && <p>Attack: {itemsData[i]?.stat}</p>}
        </li>
      );
    }

    return items;
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleCloseModal = () => {
    setOpenItem(false);
  };

  const itemModal = () => {
    return (
      <Modal
        open={openItem}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {item.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Attack +{item.stat}
          </Typography>
          <div>
            <button
              className="player__delete-item"
              onClick={() => deleteThis(item.id)}
            >
              DELETE ITEM
            </button>
          </div>
          <button onClick={handleCloseModal}>CLOSE</button>
        </Box>
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
          <img className="player__avatar-img" src={avatar} alt="" />
          <div className="player__eq">
            <span className="player__eq-armor">
              <GiAbdominalArmor className="player__eq-icon" />
            </span>
            <span className="player__eq-head">
              <GiVikingHead className="player__eq-icon" />
            </span>
            <span className="player__eq-leftarm">
              <GiBorderedShield className="player__eq-icon" />
            </span>
            <span className="player__eq-rightarm">
              <GiShardSword className="player__eq-icon" />
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
                {user?.strength}
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
        <span className="player__inentory-text">Inventory</span>
        <div className="player__items">
          <ul className="player__items-list">{renderSlots()}</ul>
        </div>
      </div>
      {itemModal()}
    </div>
  );
};

export default Character;
