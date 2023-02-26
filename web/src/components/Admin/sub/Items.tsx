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
import { Switch, Select, TextInput, Textarea } from "@mantine/core";
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
      sprite: "",
      description: "",
      minStat: 5,
      maxStat: 10,
      isEquipment: true,
      type: "",
      quality: "RANDOM",
      actionAmount: 0,
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
        <TextInput
          label="name"
          required
          className="admin__main-input"
          name="name"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.name}
        />
        <TextInput
          label="sprite"
          className="admin__main-input"
          name="sprite"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.sprite}
        />
        <Textarea
          label="description"
          className="admin__main-input admin__main-desc"
          name="description"
          onChange={itemsForm.handleChange}
          value={itemsForm.values.description}
        />

        <Switch
          label="isEquipment"
          size="md"
          className="admin__switch"
          onChange={(event: any) => {
            itemsForm.setFieldValue(
              "isEquipment",
              event?.currentTarget.checked
            );
          }}
          checked={itemsForm.values.isEquipment}
        />
        {itemsForm.values.isEquipment ? (
          <div>
            <div className="admin__main-input-flex">
              <TextInput
                label="minStat"
                className="admin__main-input"
                name="minStat"
                type="number"
                onChange={itemsForm.handleChange}
                value={itemsForm.values.minStat}
              />
              <TextInput
                label="maxStat"
                className="admin__main-input"
                name="maxStat"
                type="number"
                onChange={itemsForm.handleChange}
                value={itemsForm.values.maxStat}
              />
            </div>
            <div className="admin__main-input-flex">
              <Select
                classNames={{
                  root: "admin__input-select",
                  label: "admin__input-select-label",
                }}
                label="type"
                searchable
                size="sm"
                clearable
                placeholder="Pick one"
                name="type"
                data={[
                  { value: "HEAD", label: "HEAD" },
                  { value: "CHEST", label: "CHEST" },
                  { value: "WEAPON", label: "WEAPON" },
                  { value: "OFFHAND", label: "OFFHAND" },
                  { value: "LEGS", label: "LEGS" },
                ]}
                onChange={(value) => itemsForm.setFieldValue("type", value)}
                value={itemsForm.values.type}
              />
              <Select
                classNames={{
                  root: "admin__input-select",
                  label: "admin__input-select-label",
                }}
                label="quality"
                searchable
                clearable
                size="sm"
                placeholder="Pick one"
                name="type"
                data={[
                  { value: "RANDOM", label: "RANDOM" },
                  { value: "COMMON", label: "COMMON" },
                  { value: "UNCOMMON", label: "UNCOMMON" },
                  { value: "RARE", label: "RARE" },
                  { value: "EPIC", label: "EPIC" },
                  { value: "LEGENDARY", label: "LEGENDARY" },
                ]}
                onChange={(value) => itemsForm.setFieldValue("quality", value)}
                value={itemsForm.values.quality}
              />
            </div>
          </div>
        ) : (
          <div className="admin__main-input-flex">
            <Select
              classNames={{
                root: "admin__input-select",
                label: "admin__input-select-label",
              }}
              label="type"
              searchable
              size="sm"
              clearable
              placeholder="Pick one"
              name="type"
              data={[
                { value: "POTION", label: "POTION" },
                { value: "BAG", label: "BAG" },
                { value: "MATERIAL", label: "MATERIAL" },
                { value: "FOOD", label: "FOOD" },
                { value: "OTHER", label: "OTHER" },
                { value: "QUEST ITEM", label: "QUEST ITEM" },
              ]}
              onChange={(value) => itemsForm.setFieldValue("type", value)}
              value={itemsForm.values.type}
            />
            <TextInput
              label="actionAmount"
              className="admin__main-input"
              name="actionAmount"
              type="number"
              onChange={itemsForm.handleChange}
              value={itemsForm.values.actionAmount}
            />
          </div>
        )}
        <Button
          className="admin__main-submit"
          type="submit"
          color="green"
          size="md"
        >
          Add Item
        </Button>
      </form>
      <table className="admin__item-list">
        <tr className="admin__item-list-tr">
          <th>Name</th>
          <th>Min Stat</th>
          <th>Max Stat</th>
          <th>Eq</th>
          <th>Type</th>
          <th>Quality</th>
          <th>Sprite</th>
          <th>Action</th>
        </tr>
        {itemsPrototypeData?.map((prototype: ItemPrototype) => (
          <tr key={prototype.id} className="admin__item">
            <td>{prototype.name}</td>
            <td>{prototype.minStat}</td>
            <td>{prototype.maxStat}</td>
            <td>{prototype.isEquipment?.toString()}</td>
            <td>{prototype.type}</td>
            <td>{prototype.quality}</td>
            <td className="admin__item-icon">
              <span>{prototype.sprite}</span>
              {prototype.sprite && (
                <img
                  className="admin__item-img"
                  src={`/media/items/${prototype.sprite}.png`}
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
          <th>Min Attack</th>
          <th>Max Attack</th>
          <th>Stamina</th>
          <th>Defence</th>
          <th>Quality</th>
          <th>Level</th>
          <th>User</th>
          <th>Action</th>
        </tr>
        {itemsData?.map((item: Item) => (
          <tr key={item.id} className="admin__item">
            <td>{item.item.name}</td>
            <td>{item.minAttack}</td>
            <td>{item.maxAttack}</td>
            <td>{item.stamina}</td>
            <td>{item.defence}</td>
            <td>{item.quality}</td>
            <td>{item.level}</td>
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
