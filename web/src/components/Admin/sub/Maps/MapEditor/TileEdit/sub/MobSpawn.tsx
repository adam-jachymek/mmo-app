import { Button, Input, Loader, Modal, Select, Slider } from "@mantine/core";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getMobs } from "api/endpoints";
import { Mob } from "types";
import MobDrop from "./MobDrop";
import { useFormik } from "formik";
import {
  createActionMobSpawn,
  deleteActionMobSpawn,
  getActionMobSpawn,
  updateActionMobSpawn,
} from "api/endpoints/actionMobSpawn";

type Props = {
  tileForm: any;
  SelectItem: any;
  tileId?: number;
};

const MobSpawn = ({ tileForm, SelectItem, tileId }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [mobIndex, setMobIndex] = useState(0);
  const [dropData, setDropData] = useState();

  const { data: mobsData, isFetching: fetchingMobs } = useQuery(
    "getMobs",
    getMobs
  );

  const {
    data: spawnMobs,
    isFetching: fetchingSpawnMobs,
    refetch: refetchSpawnMobs,
  } = useQuery(["getActionMobSpawn", tileId], () => getActionMobSpawn(tileId));

  const { mutate: createMobSpawn } = useMutation(createActionMobSpawn, {
    onSuccess: () => {
      refetchSpawnMobs();
    },
  });

  const { mutate: updateMobSpawn } = useMutation(updateActionMobSpawn, {
    onSuccess: () => {
      refetchSpawnMobs();
    },
  });

  const { mutate: deleteMobSpawn } = useMutation(deleteActionMobSpawn, {
    onSuccess: () => {
      refetchSpawnMobs();
    },
  });

  const mobsSelect = useMemo(
    () =>
      mobsData?.map((mob: Mob) => ({
        image: `/media/mobs/${mob?.sprite}.png`,
        label: mob?.name,
        value: mob?.id,
      })),
    [mobsData]
  );

  const mobForm = useFormik({
    initialValues: {
      id: undefined,
      mobId: undefined,
      spawnRate: undefined,
      minLevel: undefined,
      maxLevel: undefined,
    },
    onSubmit: (values, { resetForm }) => {
      setOpenModal(false);
      resetForm();
      if (values.id) {
        updateMobSpawn({ values, tileId });
        return;
      }
      createMobSpawn({ values, tileId });
    },
  });

  const isEdit = Boolean(mobForm.values.id);

  const mobList = useMemo(() => {
    return spawnMobs?.map((mobSpawn: any) => ({
      ...mobsData?.find((mob: any) => mobSpawn?.mobId === mob?.id),
      ...mobSpawn,
    }));
  }, [mobsData, spawnMobs]);

  const openMob = (mob: any) => {
    mobForm.setValues(mob);
    setOpenModal(true);
  };

  const handleDeleteItemDrop = () => {
    deleteMobSpawn(mobForm.values.id);
    setOpenModal(false);
    mobForm.resetForm();
  };

  if (fetchingMobs || fetchingSpawnMobs) {
    return <Loader />;
  }

  return (
    <>
      <ul>
        {mobList?.map((mob: any, index: number) => (
          <li style={{ marginTop: 10, marginBottom: 10, cursor: "pointer" }}>
            <div
              onClick={() => {
                openMob(mob);
              }}
            >
              {mob.name}, {mob.spawnRate}%
            </div>
            <MobDrop
              tileForm={tileForm}
              SelectItem={SelectItem}
              actionMobId={mob.id}
              dropData={dropData}
              setDropData={setDropData}
            />
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Add mob
      </Button>
      {openModal && (
        <Modal
          opened={openModal}
          centered
          onClose={() => {
            setOpenModal(false);
            mobForm.resetForm();
          }}
          title={isEdit ? "Edit mob spawn" : "Add mob spawn"}
        >
          <form onSubmit={mobForm.handleSubmit}>
            <Select
              placeholder="Pick one"
              name="mob"
              label="Mob"
              required
              style={{ marginTop: 20, marginBottom: 20 }}
              itemComponent={SelectItem}
              data={mobsSelect}
              value={mobForm.values.mobId}
              onChange={(value) => mobForm.setFieldValue("mobId", value)}
              searchable
              maxDropdownHeight={400}
              nothingFound="No mobs available"
            />
            <Input.Wrapper label="Spawn rate (%)" required>
              <Input
                value={mobForm.values.spawnRate}
                type="number"
                size="xs"
                onChange={(e: any) =>
                  mobForm.setFieldValue("spawnRate", Number(e.target.value))
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
              value={mobForm.values.spawnRate}
              onChange={(value: any) =>
                mobForm.setFieldValue("spawnRate", value)
              }
            />
            <div className="settings__inputs">
              <Input.Wrapper label="Min level" required>
                <Input
                  value={mobForm.values.minLevel}
                  type="number"
                  size="xs"
                  onChange={(e: any) =>
                    mobForm.setFieldValue("minLevel", Number(e.target.value))
                  }
                />
              </Input.Wrapper>
              <Input.Wrapper label="Max level" required>
                <Input
                  value={mobForm.values.maxLevel}
                  type="number"
                  size="xs"
                  onChange={(e: any) =>
                    mobForm.setFieldValue("maxLevel", Number(e.target.value))
                  }
                />
              </Input.Wrapper>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button color="green" type="submit">
                {isEdit ? "Update" : "Add"}
              </Button>
              {isEdit && (
                <Button color="red" onClick={handleDeleteItemDrop}>
                  Delete
                </Button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default MobSpawn;
