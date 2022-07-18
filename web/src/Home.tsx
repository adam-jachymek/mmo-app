import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser } from "./api/endpoints";
import { createItem, getItems, deleteItem } from "./api/endpoints";
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

const Home = () => {
  const {
    isFetching,
    data: user,
    refetch: refetchUser,
  } = useQuery("currentUser", getUser);

  const { data: itemsData, refetch: refetchItems } = useQuery(
    "getITems",
    getItems
  );

  const { mutate: deleteThis } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

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
            <p className="player__stats-text">Level: {user?.level}</p>
            <p className="player__stats-text">HP: {user?.hp}</p>
            <p className="player__stats-text">Stamina: {user?.stamina}</p>
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
          <ul className="player__items-list">
            {itemsData?.map((item: Item) => (
              <li className="player__item">
                <div>
                  <GiDrippingSword className="player__item-icon" />
                </div>
                {item.item.name}
                {item.stat && <p>Attack: {item.stat}</p>}
                <div>
                  <button
                    className="player__delete-item"
                    onClick={() => deleteThis(item.id)}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
