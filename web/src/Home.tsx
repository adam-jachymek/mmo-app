import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser } from "./api/endpoints";
import { createItem, getItems, deleteItem } from "./api/endpoints";
import { GiDrippingSword } from "react-icons/gi";

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

  console.log(user);

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
        <button onClick={LogOut}>Log Out</button>
      </div>
      <div>
        <p>Level: {user?.level}</p>
        <p>Stamina: {user?.stamina}</p>
        <p>Strength: {user?.strength}</p>
        <p>Defence: {user?.defence}</p>
        <p>Attack Speed: {user?.speed}</p>
        <p>Intelligence: {user?.intelligence}</p>
        <div>
          <h3>Items</h3>
          <ul className="player__items-list">
            {itemsData?.map((item: any) => (
              <li className="player__item">
                <div>
                  <GiDrippingSword className="player__item-icon" />
                </div>
                {item.name}
                {item.attack && <p>Attack: {item.attack}</p>}
                <button
                  onClick={() => deleteThis(item.id)}
                  className="player__delete-item"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: "300px" }}>
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
    </div>
  );
};

export default Home;
