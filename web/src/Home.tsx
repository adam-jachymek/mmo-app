import { useMutation, useQuery } from "react-query";
import { getUser } from "./api/endpoints";
import { getItems, deleteItem } from "./api/endpoints";
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

import { Item } from "./types";

import "./home.sass";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";

const Home = () => {
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

  const numberOfSlots = 20;

  const renderSlots = () => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      items.push(
        <li
          onClick={() => {
            setItem({
              id: itemsData[i]?.id,
              name: itemsData[i]?.item?.name,
              stat: itemsData[i]?.stat,
            });
            setOpenItem(true);
          }}
          className="player__item"
        >
          <div>
            {itemsData[i] && <GiDrippingSword className="player__item-icon" />}
          </div>
        </li>
      );
    }

    return items;
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
            <p className="player__stats-text">
              <span>Level:</span>{" "}
              <span>
                <button>+</button>
                {user?.level}
                <button>-</button>
              </span>
            </p>
            <p className="player__stats-text">HP: {user?.hp}</p>
            <p className="player__stats-text">
              <span>Stamina:</span>
              <span className="player__stats-amount">
                <button>+</button>
                {user?.stamina}
                <button>-</button>
              </span>
            </p>
            <p className="player__stats-text">Strength: {user?.strength}</p>
            <p className="player__stats-text">Defence: {user?.defence}</p>
            <p className="player__stats-text">Attack Speed: {user?.speed}</p>
            <p className="player__stats-text">
              Intelligence: {user?.intelligence}
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

export default Home;
