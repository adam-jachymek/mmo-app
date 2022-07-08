import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser } from "./api/endpoints";
import { createItem, getItems } from "./api/endpoints";
import { GiDrippingSword } from "react-icons/gi";

import "./home.sass";

const Home = () => {
  const {
    isFetching,
    data: user,
    refetch: refetchUser,
  } = useQuery("currentUser", getUser);

  const { data: itemsData, refetch: refetchBookmarks } = useQuery(
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
      refetchBookmarks();
    },
  });

  const bookmarkForm = useFormik({
    initialValues: {
      name: "",
      description: "",
      link: "",
    },
    onSubmit: (values) => {
      addItem(values);
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
                  <GiDrippingSword
                    style={{ width: "80px", height: "80px", color: "red" }}
                  />
                </div>
                {item.name}
                {item.attack && <p>Attack: {item.attack}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: "500px" }}>
        <form onSubmit={bookmarkForm.handleSubmit}>
          <label className="main__label">Name</label>
          <input
            className="main__input"
            name="name"
            onChange={bookmarkForm.handleChange}
            value={bookmarkForm.values.name}
          />
          <label className="main__label">Description</label>
          <input
            className="main__input"
            type="text"
            name="description"
            onChange={bookmarkForm.handleChange}
            value={bookmarkForm.values.description}
          />
          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
