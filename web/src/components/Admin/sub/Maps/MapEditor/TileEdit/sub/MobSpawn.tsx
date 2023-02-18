import { Button, Input, Loader, Modal, Select, Slider } from "@mantine/core";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getItemsAdmin, getMobs } from "api/endpoints";
import { Mob } from "types";

type Props = {
  tileForm: any;
  SelectItem: any;
};

const MobSpawn = ({ tileForm, SelectItem }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [dropIndex, setDropIndex] = useState(0);
  const [dropData, setDropData] = useState({ itemId: "", procent: 0 });

  const { data: mobsData, isFetching: fetchingMobs } = useQuery(
    "getMobs",
    getMobs
  );

  const { data: itemsPrototypeData, isFetching: fetchingItems } = useQuery(
    "getItemsAdmin",
    getItemsAdmin
  );

  const itemsSelect = useMemo(
    () =>
      itemsPrototypeData?.map((item: any) => ({
        image: `/media/items/${item?.sprite}.png`,
        label: item?.name,
        value: item?.id,
      })),
    [itemsPrototypeData]
  );

  const mobsSelect = useMemo(
    () =>
      mobsData?.map((mob: Mob) => ({
        image: `/media/mobs/${mob?.sprite}.png`,
        label: mob?.name,
        value: mob?.id,
      })),
    [mobsData]
  );

  const dropList = useMemo(() => {
    if (tileForm?.values?.action?.mobSpawn?.drop?.length > 0) {
      return tileForm?.values?.action?.mobSpawn?.drop?.map((item: any) => ({
        ...itemsPrototypeData?.find((drop: any) =>
          item?.itemId === drop?.id ? drop : undefined
        ),
        procent: item?.procent,
      }));
    }
    return [];
  }, [itemsPrototypeData, tileForm?.values?.action?.mobSpawn?.drop]);

  const createDrop = () => {
    const indexDrop = tileForm?.values?.action?.mobSpawn?.drop?.length;

    if (!indexDrop) {
      setDropIndex(0);
      return;
    }

    setDropIndex(indexDrop);
    setDropData({ itemId: "", procent: 0 });
  };

  const openItem = (index: number) => {
    setDropData(tileForm?.values?.action?.mobSpawn?.drop?.[index]);
    setDropIndex(index);
    setOpenModal(true);
  };

  const handleSave = () => {
    tileForm.setFieldValue(`action.mobSpawn.drop[${dropIndex}]`, dropData);
    setOpenModal(false);
  };

  if (fetchingMobs || fetchingItems) {
    return <Loader />;
  }

  return (
    <>
      <Select
        placeholder="Pick one"
        name="mob"
        allowDeselect
        label="Mob"
        clearable
        style={{ marginTop: 20 }}
        itemComponent={SelectItem}
        data={mobsSelect}
        value={tileForm.values.action.mobSpawn?.mobId}
        onChange={(value) =>
          tileForm.setFieldValue("action.mobSpawn.mobId", value)
        }
        searchable
        maxDropdownHeight={400}
        nothingFound="No mobs available"
      />
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
        value={tileForm.values.action.mobSpawn?.procent}
        onChange={(value: any) =>
          tileForm.setFieldValue("action.mobSpawn.procent", value)
        }
      />
      <div className="settings__inputs">
        <Input.Wrapper label="min level">
          <Input
            value={tileForm.values.action.mobSpawn?.minLevel}
            type="number"
            size="xs"
            onChange={(e: any) =>
              tileForm.setFieldValue("action.mobSpawn.minLevel", e.target.value)
            }
          />
        </Input.Wrapper>
        <Input.Wrapper label="max level">
          <Input
            value={tileForm.values.action.mobSpawn?.maxLevel}
            type="number"
            size="xs"
            onChange={(e: any) =>
              tileForm.setFieldValue("action.mobSpawn.maxLevel", e.target.value)
            }
          />
        </Input.Wrapper>
      </div>
      <label className="admin__main-label">Drop</label>
      <ul>
        {dropList?.map((item: any, index: number) => (
          <li
            onClick={() => {
              openItem(index);
            }}
            style={{ marginTop: 10, marginBottom: 10, cursor: "pointer" }}
          >
            {item.name}, {item.procent}%
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          createDrop();
          setOpenModal(true);
        }}
      >
        Add drop item
      </Button>
      {openModal && (
        <Modal
          opened={openModal}
          centered
          onClose={() => setOpenModal(false)}
          title="Add drop item"
        >
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
            value={dropData?.procent}
            onChange={(value: any) =>
              setDropData({ ...dropData, procent: value })
            }
          />
          <Select
            placeholder="Pick one"
            name="item"
            label="Item"
            allowDeselect
            clearable
            style={{ marginBottom: 20 }}
            itemComponent={SelectItem}
            data={itemsSelect}
            value={dropData?.itemId}
            onChange={(value: any) =>
              setDropData({ ...dropData, itemId: value })
            }
            searchable
            maxDropdownHeight={400}
            nothingFound="No items available"
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              color="green"
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
            <Button
              color="red"
              onClick={() => {
                tileForm.setFieldValue(
                  `action.mobSpawn.drop`,
                  tileForm.values.action.mobSpawn?.drop?.filter(
                    (drop: any, index: number) => index !== dropIndex
                  )
                );
                setOpenModal(false);
              }}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MobSpawn;
