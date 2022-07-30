import { useMutation, useQuery } from "react-query";
import {
  createItem,
  getItems,
  deleteItem,
  getItemsAdmin,
  generateItem,
  deletePrototypeItem,
} from "api/endpoints";
import { Item, ItemPrototype } from "/types";
import { useFormik } from "formik";
import { Switch, Select } from "@mantine/core";

const Items = () => {
  const { data: itemsPrototypeData, refetch: refetchItemsPrototype } = useQuery(
    "getItemsAdmin",
    getItemsAdmin
  );

  const { data: itemsData, refetch: refetchItems } = useQuery(
    "getItems",
    getItems
  );

  const { mutate: addItem } = useMutation(createItem, {
    onSuccess: (response) => {
      refetchItemsPrototype();
    },
  });

  const { mutate: deleteUserItem } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
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

  const itemsForm = useFormik({
    initialValues: {
      name: "",
      description: "",
      minStat: 5,
      maxStat: 10,
      type: "",
      isEq: true,
      icon: "",
    },
    onSubmit: (values, { resetForm }) => {
      addItem(values);
      resetForm();
    },
  });

  return (
    <div className="admin__section">
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
        <label className="main__label">Icon</label>
        <input
          className="main__input"
          name="icon"
          type="string"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.icon}
        />
        <Switch
          label="isEq"
          className="admin__switch"
          onChange={(event: any) => {
            itemsForm.setFieldValue("isEq", event?.currentTarget.checked);
          }}
          checked={itemsForm.values.isEq}
        />
        <Select
          classNames={{ root: "admin__input-select" }}
          label="Type"
          placeholder="Pick one"
          name="type"
          data={[
            { value: "weapon", label: "weapon" },
            { value: "leftArm", label: "leftArm" },
            { value: "head", label: "head" },
            { value: "chest", label: "chest" },
            { value: "legs", label: "legs" },
            { value: "boots", label: "boots" },
          ]}
          onChange={(value) => itemsForm.setFieldValue("type", value)}
          value={itemsForm.values.type}
        />
        <button type="submit">Add Item</button>
      </form>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Stat</th>
          <th>Max Stat</th>
          <th>Is Eq</th>
          <th>Type</th>
          <th>Icon</th>
          <th>Action</th>
        </tr>
        {itemsPrototypeData?.map((prototype: ItemPrototype) => (
          <tr key={prototype.id} className="admin__item">
            <td>{prototype.name}</td>
            <td>{prototype.minStat}</td>
            <td>{prototype.maxStat}</td>
            <td>{prototype.isEq?.toString()}</td>
            <td>{prototype.type}</td>
            <td>{prototype.icon}</td>

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
      <h2>Generated Items</h2>
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
    </div>
  );
};

export default Items;
