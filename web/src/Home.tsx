import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser } from "./api/endpoints";
import { createItem, getItems, deleteItem } from "./api/endpoints";
import { GiDrippingSword } from "react-icons/gi";
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
    <div className="player">
      <div>
        <p>{user?.username}</p>
        <button className="player__logout" onClick={LogOut}>
          Log Out
        </button>
      </div>
      <div className="player__avatar">
        <img className="avatar" src={avatar} alt="" />
        <div className="player__stats">
          <p className="marginonly">Level: {user?.level}</p>
          <p>Stamina: {user?.stamina}</p>
          <p>Strength: {user?.strength}</p>
          <p>Defence: {user?.defence}</p>
          <p>Attack Speed: {user?.speed}</p>
          <p>Intelligence: {user?.intelligence}</p>
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
      <div>
        <h3 className="invtext">Inventory</h3>
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
  );
};

export default Home;
