import { Button, Input, Loader, Modal, Select, Slider } from "@mantine/core";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getMobs } from "api/endpoints";
import MobDrop from "./MobDrop";
import { useFormik } from "formik";
import {
  addTilesToActionMobSpawn,
  createActionMobSpawn,
  deleteActionMobSpawn,
  deleteTilesToActionMobSpawn,
  getActionMobSpawn,
  getManyActionMobSpawn,
  updateActionMobSpawn,
} from "api/endpoints/actionMobSpawn";
import { isEmpty } from "lodash";
import { getSelectData } from "../utils";
import { assets_url } from "config";

type Props = {
  SelectItem: any;
  tileId?: number;
  multiSelectTiles: number[];
  setMultiSelect: (arg: boolean) => void;
  setMultiSelectTiles: any;
  refetchTiles: any;
};

const MobSpawn = ({
  SelectItem,
  tileId,
  multiSelectTiles,
  setMultiSelect,
  setMultiSelectTiles,
  refetchTiles,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [maxSpawnRateForSelectedMob, setMaxSpawnRateForSelectedMob] =
    useState(100);

  const { data: mobsData, isFetching: fetchingMobs } = useQuery(
    "getMobs",
    getMobs
  );

  const {
    data: spawnMobs,
    isFetching: fetchingSpawnMobs,
    refetch: refetchSpawnMobs,
  } = useQuery(["getActionMobSpawn", tileId], () => getActionMobSpawn(tileId), {
    enabled: Boolean(tileId),
  });

  const { data: spawnManyMobs, isFetching: fetchingManySpawnMobs } = useQuery(
    ["getManyActionMobSpawn", multiSelectTiles],
    () => getManyActionMobSpawn(multiSelectTiles),
    {
      enabled: !isEmpty(multiSelectTiles),
    }
  );

  const spawnMobsToMap = isEmpty(multiSelectTiles) ? spawnMobs : spawnManyMobs;

  const { mutate: createMobSpawn } = useMutation(createActionMobSpawn, {
    onSuccess: () => {
      refetchTiles();
      refetchSpawnMobs();
      setMultiSelectTiles([]);
    },
  });

  const { mutate: updateMobSpawn } = useMutation(updateActionMobSpawn, {
    onSuccess: () => {
      refetchSpawnMobs();
    },
  });

  const { mutate: addTilesToMobSpawn } = useMutation(addTilesToActionMobSpawn, {
    onSuccess: () => {
      refetchTiles();
      refetchSpawnMobs();
      setMultiSelectTiles([]);
    },
  });

  const { mutate: deleteTilesFromMobSpawn } = useMutation(
    deleteTilesToActionMobSpawn,
    {
      onSuccess: () => {
        refetchTiles();
        refetchSpawnMobs();
        setMultiSelectTiles([]);
      },
    }
  );

  const { mutate: deleteMobSpawn } = useMutation(deleteActionMobSpawn, {
    onSuccess: () => {
      refetchTiles();
      refetchSpawnMobs();
    },
  });

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
        if (tileId) {
          updateMobSpawn({ values, tilesIds: [tileId] });
          return;
        }
      }
      if (tileId) {
        createMobSpawn({ values, tilesIds: [tileId] });
        return;
      }
      if (multiSelectTiles) {
        createMobSpawn({ values, tilesIds: multiSelectTiles });
        setMultiSelect(false);
        return;
      }
    },
  });

  const isEdit = Boolean(mobForm.values.id);

  const mobList = useMemo(() => {
    return spawnMobsToMap?.map((mobSpawn: any) => ({
      ...mobsData?.find((mob: any) => mobSpawn?.mobId === mob?.id),
      ...mobSpawn,
    }));
  }, [mobsData, spawnMobsToMap]);

  const calculateMaxSpawnRate = useMemo(() => {
    const spawnRateSum = mobList?.reduce(
      (sum: number, obj: any) => sum + obj.spawnRate,
      0
    );

    const availableSpawnRate = 100 - spawnRateSum;

    return {
      spawnRateSum: spawnRateSum,
      availableSpawnRate: availableSpawnRate,
    };
  }, [mobList]);

  if (fetchingMobs || fetchingSpawnMobs || fetchingManySpawnMobs) {
    return <Loader />;
  }

  const handleCreateMob = () => {
    setMaxSpawnRateForSelectedMob(calculateMaxSpawnRate.availableSpawnRate);
    setOpenModal(true);
  };

  const handleOpenMob = (mob: any) => {
    mobForm.setValues(mob);
    setMaxSpawnRateForSelectedMob(
      calculateMaxSpawnRate.availableSpawnRate + mob.spawnRate
    );
    setOpenModal(true);
  };

  const handleDeleteMob = () => {
    deleteMobSpawn(mobForm.values.id);
    setOpenModal(false);
    mobForm.resetForm();
  };

  return (
    <div className="mob-spawn">
      {calculateMaxSpawnRate.spawnRateSum > 0 && (
        <p className="mob-spawn__spawn-rate">
          <label className="mob-spawn__mob-info-label">spawn rate: </label>
          {calculateMaxSpawnRate.spawnRateSum}%
        </p>
      )}
      <ul className="mob-spawn__list">
        {mobList?.map((mob: any) => (
          <li className="mob-spawn__mob" key={mob.id}>
            <div
              className="mob-spawn__mob-info"
              onClick={() => {
                handleOpenMob(mob);
              }}
            >
              <p className="mob-spawn__mob-info-item">
                <label className="mob-spawn__mob-info-label">mob: </label>
                {mob.name}
              </p>
              <p className="mob-spawn__mob-info-item">
                <label className="mob-spawn__mob-info-label">
                  spawn rate:{" "}
                </label>
                {mob.spawnRate}%
              </p>
              <p className="mob-spawn__mob-info-item">
                <label className="mob-spawn__mob-info-label">level: </label>
                {mob.minLevel} - {mob.maxLevel}
              </p>
              <p className="mob-spawn__mob-info-item">
                <label className="mob-spawn__mob-info-label">on tiles: </label>
                {mob.mapTiles.length}
                <Button
                  compact
                  style={{ marginLeft: "10px" }}
                  type="button"
                  onClick={() => {
                    setMultiSelectTiles(
                      mob.mapTiles.map((mapTile: any) => mapTile.mapTileId)
                    );
                  }}
                >
                  Select
                </Button>
              </p>
            </div>
            <img
              alt="sprite"
              className="mob-drop__item-info-sprite"
              src={`${assets_url}/${mob.sprite}`}
            />
            <MobDrop SelectItem={SelectItem} actionMobId={mob.id} />
          </li>
        ))}
      </ul>
      <Button
        className="mob-spawn__add-button"
        color="green"
        onClick={handleCreateMob}
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
          {!isEmpty(multiSelectTiles) && (
            <>
              <Button
                compact
                style={{ marginLeft: "10px", marginBottom: "10px" }}
                type="button"
                color="green"
                onClick={() => {
                  addTilesToMobSpawn({
                    mobSpawnId: mobForm.values.id,
                    tilesIds: multiSelectTiles,
                  });
                }}
              >
                Add to selected tiles
              </Button>
              <Button
                compact
                style={{ marginLeft: "10px" }}
                type="button"
                color="red"
                onClick={() => {
                  deleteTilesFromMobSpawn({
                    mobSpawnId: mobForm.values.id,
                    tilesIds: multiSelectTiles,
                  });
                }}
              >
                Delete from selected tiles
              </Button>
            </>
          )}
          <form onSubmit={mobForm.handleSubmit}>
            <Select
              placeholder="Pick one"
              name="mob"
              label="Mob"
              required
              style={{ marginTop: 20, marginBottom: 20 }}
              itemComponent={SelectItem}
              data={getSelectData(mobsData) as any}
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
                max={maxSpawnRateForSelectedMob}
                size="xs"
                onChange={(e: any) =>
                  mobForm.setFieldValue("spawnRate", Number(e.target.value))
                }
              />
            </Input.Wrapper>
            <Slider
              labelAlwaysOn
              radius="xs"
              max={maxSpawnRateForSelectedMob}
              styles={{
                root: { width: "100%", marginTop: 50, marginBottom: 40 },
              }}
              marks={[
                { value: 0, label: "0%" },
                {
                  value: maxSpawnRateForSelectedMob / 2,
                  label: `${maxSpawnRateForSelectedMob / 2}%`,
                },
                {
                  value: maxSpawnRateForSelectedMob,
                  label: `${maxSpawnRateForSelectedMob}%`,
                },
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
            <div className="mob-spawn__buttons-wrapper">
              <Button color="green" type="submit">
                {isEdit ? "Update" : "Add"}
              </Button>
              {isEdit && (
                <Button color="red" onClick={handleDeleteMob}>
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

export default MobSpawn;
