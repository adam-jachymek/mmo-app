import { useMutation, useQuery } from "react-query";
import {
  createItem,
  getItems,
  getItemsAdmin,
  generateItem,
  deleteItem,
  deletePrototypeItem,
  getMobs,
} from "api/endpoints";
import { Item, ItemPrototype } from "/types";
import { useFormik } from "formik";

import "./styles.sass";

const Admin = () => {
  const { data: itemsPrototypeData, refetch: refetchItemsPrototype } = useQuery(
    "getItemsAdmin",
    getItemsAdmin
  );

  const { data: itemsData, refetch: refetchItems } = useQuery(
    "getItems",
    getItems
  );

  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);

  const { mutate: addItem } = useMutation(createItem, {
    onSuccess: (response) => {
      refetchItemsPrototype();
    },
  });

  const { mutate: deletePrototype } = useMutation(deletePrototypeItem, {
    onSuccess: (response) => {
      refetchItemsPrototype();
    },
  });

  const { mutate: generate } = useMutation(generateItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const { mutate: deleteUserItem } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const itemsForm = useFormik({
    initialValues: {
      name: "",
      description: "",
      minStat: "",
      maxStat: "",
    },
    onSubmit: (values, { resetForm }) => {
      addItem(values);
      resetForm();
    },
  });

  console.log(itemsData);

  return (
    <div className="admin">
      <h2>Items Prototype</h2>
      <form onSubmit={itemsForm.handleSubmit}>
        <label className="main__label">Name</label>
        <input
          className="main__input"
          name="name"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.name}
        />
        <label className="main__label">Description</label>
        <input
          className="main__input"
          name="description"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.description}
        />
        <label className="main__label">Min Stat</label>
        <input
          className="main__input"
          name="minStat"
          type="number"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.minStat}
        />
        <label className="main__label">Max Stat</label>
        <input
          className="main__input"
          name="maxStat"
          type="number"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.maxStat}
        />
        <button type="submit">Add Item</button>
      </form>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Stat</th>
          <th>Max Stat</th>
          <th>Action</th>
        </tr>
        {itemsPrototypeData?.map((prototype: ItemPrototype) => (
          <tr key={prototype.id} className="admin__item">
            <td>{prototype.name}</td>
            <td>{prototype.minStat}</td>
            <td>{prototype.maxStat}</td>
            <td>
              <button
                onClick={() => {
                  generate({ itemPrototypeId: prototype.id });
                }}
              >
                Generate Item
              </button>
              <button
                onClick={() => {
                  deletePrototype(prototype.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
      <h2>Items</h2>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Stat</th>
          <th>User</th>
          <th>Action</th>
        </tr>
        {itemsData?.map((item: Item) => (
          <tr key={item.id} className="admin__item">
            <td>{item.item.name}</td>
            <td>{item.stat}</td>
            <td>{item.user.username}</td>
            <td>
              <button
                onClick={() => {
                  deleteUserItem(item.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
      <h2>Mobs</h2>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>Map</th>
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="admin__item">
            <td>{mob.name}</td>
            <td>{mob.minLevel}</td>
            <td>{mob.maxLevel}</td>
            <td>{mob.map.name}</td>
            <td>
              <button
                onClick={() => {
                  deleteUserItem(mob.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Admin;
