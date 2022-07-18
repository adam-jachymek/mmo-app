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
import TopNav from "./components/topnavbar";
import SideNavBar from "./components/sidenavbar";
import avatar from "./knight.png";

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

  const LogOut = () => {
    localStorage.removeItem("userToken");
    refetchUser();
  };

  const { mutate: addItem } = useMutation(createItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const { mutate: deleteThis } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const itemsForm = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (values, { resetForm }) => {
      addItem(values);
      resetForm();
    },
  });

  return (
    <div>
      <div className="player">
        <TopNav />
        <SideNavBar />
        <div className="player__logout">
          <p>{user?.username}</p>
          <button className="player__logout-button" onClick={LogOut}>
            Log Out
          </button>
        </div>
        <div className="player__info">
          <img className="player__avatar-img" src={avatar} alt="" />
          <div className="player__eq">
            {/* <img className="player__eq-armor" src={armor} alt="armor" /> */}
            {/* <img className="player__eq-head" src={armor} alt="head" />
          <img className="player__eq-leftarm" src={armor} alt="leftarm" />
          <img className="player__eq-rightarm" src={armor} alt="rightarm" />
          <img className="player__eq-legs" src={armor} alt="legs" />
          <img className="player__eq-boots" src={armor} alt="boots" /> */}
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
            <p className="player__stats-text">Stamina: {user?.stamina}</p>
            <p className="player__stats-text">Strength: {user?.strength}</p>
            <p className="player__stats-text">Defence: {user?.defence}</p>
            <p className="player__stats-text">Attack Speed: {user?.speed}</p>
            <p className="player__stats-text">
              Intelligence: {user?.intelligence}
            </p>
          </div>
        </div>
        <div>
          <form onSubmit={itemsForm.handleSubmit}>
            <label className="main__label">Name</label>
            <input
              className="main__input"
              name="name"
              onChange={itemsForm.handleChange}
              value={itemsForm.values.name}
            />
            {/* <label className="main__label">Description</label>
          <input
            className="main__input"
            type="text"
            name="description"
            onChange={itemsForm.handleChange}
            value={itemsForm.values.description}
          /> */}
            <button type="submit">Add Item</button>
          </form>
        </div>
        <span className="player__inentory-text">Inventory</span>
        <div className="player__items">
          <ul className="player__items-list">
            {itemsData?.map((item: any) => (
              <li className="player__item">
                <div>
                  <GiDrippingSword className="player__item-icon" />
                </div>
                {item.name}
                {item.attack && <p>Attack: {item.attack}</p>}
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
