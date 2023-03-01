import { Button, Collapse, Input, Modal, Select, Slider } from "@mantine/core";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getItemsAdmin } from "api/endpoints";
import { useFormik } from "formik";
import {
  createActionItemDrop,
  deleteActionItemDrop,
  getActionDropItem,
  updateActionItemDrop,
} from "api/endpoints/actionItemDrop";
import { getSelectData } from "../utils";
import { assets_url } from "config";

type Props = {
  SelectItem: any;
  actionMobId: number;
};

const MobDrop = ({ SelectItem, actionMobId }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [showLootList, setShowLootList] = useState(false);

  const { data: itemsPrototypeData, refetch: refetchItemsPrototype } = useQuery(
    "getItemsAdmin",
    getItemsAdmin
  );

  const {
    data: dropItems,
    isFetching: fetchingDropItems,
    refetch: refetchDropItems,
  } = useQuery(["getActionDropItem", actionMobId], () =>
    getActionDropItem(actionMobId)
  );

  const { mutate: createItemDrop } = useMutation(createActionItemDrop, {
    onSuccess: () => {
      refetchDropItems();
    },
  });

  const { mutate: updateItemDrop } = useMutation(updateActionItemDrop, {
    onSuccess: () => {
      refetchDropItems();
    },
  });

  const { mutate: deleteItemDrop } = useMutation(deleteActionItemDrop, {
    onSuccess: () => {
      refetchDropItems();
    },
  });

  const dropList = useMemo(() => {
    return dropItems?.map((dropItem: any) => ({
      ...itemsPrototypeData?.find((item: any) => item?.id === dropItem?.itemId),
      ...dropItem,
    }));
  }, [itemsPrototypeData, dropItems]);

  const dropForm = useFormik({
    initialValues: {
      id: undefined,
      itemId: "",
      dropRate: undefined,
      quantityMin: 1,
      quantityMax: 1,
    },
    onSubmit: (values, { resetForm }) => {
      setOpenModal(false);
      resetForm();
      if (values.id) {
        updateItemDrop({ values, actionMobId });
        return;
      }
      createItemDrop({ values, actionMobId });
    },
  });

  const isEdit = Boolean(dropForm.values.id);

  const openItem = (item: any) => {
    dropForm.setValues(item);
    setOpenModal(true);
  };

  const handleDeleteItem = () => {
    deleteItemDrop(dropForm.values.id);
    setOpenModal(false);
    dropForm.resetForm();
  };

  return (
    <div className="mob-drop">
      <Button
        onClick={() => setShowLootList(!showLootList)}
        style={{ marginTop: 10, width: "100%" }}
        compact
      >
        show loot: {dropList?.length}
      </Button>
      <Collapse in={showLootList}>
        <ul>
          {dropList?.map((item: any, index: number) => (
            <li
              className="mob-drop__item"
              onClick={() => {
                openItem(item);
              }}
            >
              <div className="mob-drop__item-info">
                <p className="mob-drop__item-info-item">
                  <label className="mob-drop__item-info-label">item: </label>
                  {item.name}
                </p>
                <p className="mob-drop__item-info-item">
                  <label className="mob-drop__item-info-label">
                    drop rate:{" "}
                  </label>
                  {item.dropRate}%
                </p>
                <p className="mob-drop__item-info-item">
                  <label className="mob-drop__item-info-label">
                    quantity:{" "}
                  </label>
                  {item.quantityMin} - {item.quantityMax}
                </p>
              </div>
              <img
                className="mob-drop__item-info-sprite"
                src={`${assets_url}/${item.sprite}`}
              />
            </li>
          ))}
        </ul>
      </Collapse>
      <Button
        className="mob-drop__add-button"
        compact
        color="green"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Add drop item
      </Button>
      {openModal && (
        <Modal
          opened={openModal}
          centered
          onClose={() => {
            dropForm.resetForm();
            setOpenModal(false);
          }}
          title={isEdit ? "Edit drop item" : "Add drop item"}
        >
          <form onSubmit={dropForm.handleSubmit}>
            <Select
              placeholder="Pick one"
              name="item"
              label="Item"
              allowDeselect
              clearable
              style={{ marginBottom: 20 }}
              itemComponent={SelectItem}
              data={getSelectData(itemsPrototypeData) as any}
              value={dropForm.values.itemId}
              onChange={(value) => dropForm.setFieldValue("itemId", value)}
              searchable
              maxDropdownHeight={400}
              nothingFound="No items available"
            />
            <Input.Wrapper label="Drop rate (%)" required>
              <Input
                value={dropForm.values.dropRate}
                type="number"
                size="xs"
                onChange={(e: any) =>
                  dropForm.setFieldValue("dropRate", Number(e.target.value))
                }
              />
            </Input.Wrapper>
            <Slider
              labelAlwaysOn
              radius="xs"
              styles={{
                root: { width: "100%", marginTop: 50, marginBottom: 40 },
              }}
              marks={[
                { value: 20, label: "20%" },
                { value: 50, label: "50%" },
                { value: 80, label: "80%" },
              ]}
              value={dropForm.values.dropRate}
              onChange={(value) => dropForm.setFieldValue("dropRate", value)}
            />
            <div className="settings__inputs">
              <Input.Wrapper label="Min Quantity" required>
                <Input
                  value={dropForm.values.quantityMin}
                  type="number"
                  size="xs"
                  onChange={(e: any) =>
                    dropForm.setFieldValue(
                      "quantityMin",
                      Number(e.target.value)
                    )
                  }
                />
              </Input.Wrapper>
              <Input.Wrapper label="Max Quantity" required>
                <Input
                  value={dropForm.values.quantityMax}
                  type="number"
                  size="xs"
                  onChange={(e: any) =>
                    dropForm.setFieldValue(
                      "quantityMax",
                      Number(e.target.value)
                    )
                  }
                />
              </Input.Wrapper>
            </div>
            <div className="mob-drop__buttons-wrapper">
              <Button color="green" type="submit">
                {isEdit ? "Update" : "Add"}
              </Button>
              {isEdit && (
                <Button color="red" onClick={handleDeleteItem}>
                  Delete
                </Button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MobDrop;
