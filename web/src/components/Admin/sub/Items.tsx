import { useMutation, useQuery } from "react-query";
import {
  createItem,
  deleteItem,
  getItemsAdmin,
  generateItem,
  deletePrototypeItem,
  createItemSprite,
  getAllGeneratedItems,
} from "api/endpoints";
import { Item, ItemPrototype } from "/types";
import { useFormik } from "formik";
import {
  Select,
  TextInput,
  Textarea,
  FileInput,
  Modal,
  Input,
} from "@mantine/core";
import { Button } from "@mantine/core";
import { useState } from "react";
import { assets_url } from "config";

const Items = () => {
  const [maxLevel, setMaxLevel] = useState<number>(1);
  const [editModal, setEditModal] = useState({
    visible: false,
    itemId: 0,
    name: "",
    type: "",
    sprite: "",
  });
  const { data: itemsPrototypeData, refetch: refetchItemsPrototype } = useQuery(
    "getItemsAdmin",
    getItemsAdmin
  );

  const { data: itemsData, refetch: refetchItems } = useQuery(
    "getItems",
    getAllGeneratedItems
  );

  const { mutate: addItem } = useMutation(createItem, {
    onSuccess: (response) => {
      refetchItemsPrototype();
    },
  });

  const { mutate: addSprite } = useMutation(createItemSprite, {
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
      description: undefined,
      minAttack: undefined,
      maxAttack: undefined,
      mainType: "WEAPON",
      weaponType: undefined,
      armorType: undefined,
      itemType: undefined,
      stamina: undefined,
      defence: undefined,
      strength: undefined,
      dexterity: undefined,
      intelligence: undefined,
      actionAmount: 0,
    },
    onSubmit: (values, { resetForm }) => {
      addItem(values);
      resetForm();
    },
  });

  const handleSaveSprite = () => {
    addSprite({
      itemId: editModal.itemId,
      name: editModal.name,
      type: editModal.type,
      sprite: editModal.sprite,
    });
    setEditModal({ ...editModal, visible: false });
  };

  return (
    <>
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
          <Textarea
            label="description"
            className="admin__main-input admin__main-desc"
            name="description"
            onChange={itemsForm.handleChange}
            value={itemsForm.values.description}
          />
          <div>
            <div className="admin__main-input-flex">
              <Select
                classNames={{
                  root: "admin__input-select",
                  label: "admin__input-select-label",
                }}
                label="main type"
                searchable
                size="sm"
                placeholder="Pick one"
                name="type"
                data={[
                  { value: "WEAPON", label: "WEAPON" },
                  { value: "ARMOR", label: "ARMOR" },
                  { value: "ITEM", label: "ITEM" },
                ]}
                onChange={(value) => itemsForm.setFieldValue("mainType", value)}
                value={itemsForm.values.mainType}
              />
            </div>
            {itemsForm.values.mainType === "WEAPON" && (
              <>
                <div className="admin__main-input-flex">
                  <Select
                    classNames={{
                      root: "admin__input-select",
                      label: "admin__input-select-label",
                    }}
                    label="weapon type"
                    searchable
                    size="sm"
                    clearable
                    placeholder="Pick one"
                    name="weaponType"
                    data={[
                      { value: "MELEE", label: "MELEE" },
                      { value: "MAGIC", label: "MAGIC" },
                      { value: "RANGE", label: "RANGE" },
                    ]}
                    onChange={(value) =>
                      itemsForm.setFieldValue("weaponType", value)
                    }
                    value={itemsForm.values.weaponType}
                  />
                </div>
                <div className="admin__main-input-flex">
                  <TextInput
                    label="min attack"
                    className="admin__main-input"
                    name="minAttack"
                    type="number"
                    onChange={itemsForm.handleChange}
                    value={itemsForm.values.minAttack}
                  />
                  <TextInput
                    label="max attack"
                    className="admin__main-input"
                    name="maxAttack"
                    type="number"
                    onChange={itemsForm.handleChange}
                    value={itemsForm.values.maxAttack}
                  />
                </div>
              </>
            )}

            {itemsForm.values.mainType === "ARMOR" && (
              <>
                <div className="admin__main-input-flex">
                  <Select
                    classNames={{
                      root: "admin__input-select",
                      label: "admin__input-select-label",
                    }}
                    label="armor type"
                    searchable
                    size="sm"
                    clearable
                    placeholder="Pick one"
                    name="armorType"
                    data={[
                      { value: "HEAD", label: "HEAD" },
                      { value: "CHEST", label: "CHEST" },
                      { value: "OFFHAND", label: "OFFHAND" },
                      { value: "LEGS", label: "LEGS" },
                    ]}
                    onChange={(value) =>
                      itemsForm.setFieldValue("armorType", value)
                    }
                    value={itemsForm.values.armorType}
                  />
                </div>
              </>
            )}
            {itemsForm.values.mainType !== "ITEM" && (
              <div className="admin__main-input-flex">
                <TextInput
                  label="stamina"
                  className="admin__main-input"
                  name="stamina"
                  type="number"
                  onChange={itemsForm.handleChange}
                  value={itemsForm.values.stamina}
                />
                <TextInput
                  label="defence"
                  className="admin__main-input"
                  name="defence"
                  type="number"
                  onChange={itemsForm.handleChange}
                  value={itemsForm.values.defence}
                />
                <TextInput
                  label="strength"
                  className="admin__main-input"
                  name="strength"
                  type="number"
                  onChange={itemsForm.handleChange}
                  value={itemsForm.values.strength}
                />
                <TextInput
                  label="dexterity"
                  className="admin__main-input"
                  name="dexterity"
                  type="number"
                  onChange={itemsForm.handleChange}
                  value={itemsForm.values.dexterity}
                />
                <TextInput
                  label="intelligence"
                  className="admin__main-input"
                  name="intelligence"
                  type="number"
                  onChange={itemsForm.handleChange}
                  value={itemsForm.values.intelligence}
                />
              </div>
            )}
          </div>
          {itemsForm.values.mainType === "ITEM" && (
            <div className="admin__main-input-flex">
              <Select
                classNames={{
                  root: "admin__input-select",
                  label: "admin__input-select-label",
                }}
                label="item type"
                searchable
                size="sm"
                clearable
                placeholder="Pick one"
                name="itemType"
                data={[
                  { value: "POTION", label: "POTION" },
                  { value: "GOLD", label: "GOLD" },
                  { value: "BAG", label: "BAG" },
                  { value: "MATERIAL", label: "MATERIAL" },
                  { value: "FOOD", label: "FOOD" },
                  { value: "OTHER", label: "OTHER" },
                  { value: "QUEST ITEM", label: "QUEST ITEM" },
                ]}
                onChange={(value) => itemsForm.setFieldValue("itemType", value)}
                value={itemsForm.values.itemType}
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
            <th>Min Attack</th>
            <th>Max Attack</th>
            <th>Type</th>
            <th>Sprite</th>
            <th>Action</th>
          </tr>
          {itemsPrototypeData?.map((prototype: ItemPrototype) => (
            <tr key={prototype.id} className="admin__item">
              <td>{prototype.name}</td>
              <td>{prototype.minAttack}</td>
              <td>{prototype.maxAttack}</td>
              <td>{prototype.mainType}</td>
              <td>
                <div className="admin__item-icon">
                  {prototype.sprite && (
                    <img
                      alt="item-sprite"
                      className="admin__item-img"
                      src={`${assets_url}/${prototype.sprite}`}
                    />
                  )}
                  <Button
                    compact
                    onClick={() =>
                      setEditModal({
                        ...editModal,
                        itemId: prototype.id,
                        name: prototype.name,
                        type: prototype.mainType,
                        visible: true,
                      })
                    }
                  >
                    {prototype.sprite ? "Edit" : "Add"}
                  </Button>
                </div>
              </td>
              <td>
                <div className="admin__item-list-button">
                  <Input
                    placeholder="max level"
                    type="number"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(Number(e.target.value))}
                  />
                  <Button
                    color="green"
                    size="xs"
                    onClick={() => {
                      generate({
                        itemPrototypeId: prototype.id,
                        maxLevel: maxLevel,
                      });
                    }}
                  >
                    Generate Item
                  </Button>
                </div>
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
      <Modal
        centered
        opened={editModal.visible}
        onClose={() => setEditModal({ ...editModal, visible: false })}
        title="Sprite"
      >
        <div>
          <FileInput
            placeholder="Upload sprite"
            onChange={(file: any) => {
              setEditModal({ ...editModal, sprite: file });
            }}
          />
          <Button
            color="green"
            style={{ marginTop: 20, width: "100%" }}
            onClick={handleSaveSprite}
          >
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Items;
