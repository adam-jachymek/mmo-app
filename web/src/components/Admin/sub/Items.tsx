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
import { Button } from "@mantine/core";

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
      <h2 className="admin__title-items">Items Prototype</h2>
      <form className="admin__form-items" onSubmit={itemsForm.handleSubmit}>
        <label className="admin__main-label">Name</label>
        <input
          className="admin__main-input"
          name="name"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.name}
        />
        <label className="admin__main-label">Description</label>
        <input
          className="admin__main-input"
          name="description"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.description}
        />
        <label className="admin__main-label">Min Stat</label>
        <input
          className="admin__main-input"
          name="minStat"
          type="number"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.minStat}
        />
        <label className="admin__main-label">Max Stat</label>
        <input
          className="admin__main-input"
          name="maxStat"
          type="number"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.maxStat}
        />
        <label className="admin__main-label">Icon</label>
        <input
          className="admin__main-input"
          name="icon"
          type="string"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.icon}
        />
        <Switch
          label="isEq?"
          size="md"
          className="admin__switch"
          onChange={(event: any) => {
            itemsForm.setFieldValue("isEq", event?.currentTarget.checked);
          }}
          checked={itemsForm.values.isEq}
        />
        <Select
          classNames={{ root: "admin__input-select" }}
          label="Type"
          size="sm"
          required
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
        <Button type="submit" color="green" size="md">
          Add Item
        </Button>
      </form>
      <table className="admin__item-list">
        <tr className="admin__item-list-tr">
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
            <td>
              {prototype.icon}
              {prototype.icon && (
                <img
                  className="admin__item-img"
                  src={`/media/items/${prototype.icon}.png`}
                />
              )}
            </td>
            <td className="admin__item-list-button">
              <Button
                color="green"
                size="xs"
                onClick={() => {
                  generate({ itemPrototypeId: prototype.id });
                }}
              >
                Generate Item
              </Button>
              <Button
                color="red"
                size="xs"
                onClick={() => {
                  deletePrototype(prototype.id);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </table>
      <h2 className="admin__title-items admin__title-generated">
        Generated Items
      </h2>
      <table className="admin__item-list">
        <tr className="admin__item-list-tr">
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
              <Button
                m="5px"
                color="red"
                size="xs"
                onClick={() => {
                  deleteUserItem(item.id);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Items;
