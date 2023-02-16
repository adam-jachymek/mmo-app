import {
  Avatar,
  Button,
  Group,
  Select,
  Text,
  Slider,
  Textarea,
  Switch,
  Input,
  Loader,
} from "@mantine/core";
import { useFormik } from "formik";
import { forwardRef, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getMap, getMobs } from "api/endpoints";
import { editTileById, updateManyTiles } from "api/endpoints/tiles";
import { Mob, Tile } from "/types";
import { getAllSprites } from "api/endpoints/sprites";
import { assets_url } from "config";

type Props = {
  editTile?: Tile;
  refetchTiles: () => void;
  multiSelect: boolean;
  multiSelectTiles: number[];
};

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const TileEdit = ({
  editTile,
  refetchTiles,
  multiSelect,
  multiSelectTiles,
}: Props) => {
  const [categories, setCategories] = useState([
    { value: "", label: "All" },
    { value: "Forest", label: "Forest" },
    { value: "Cave", label: "Cave" },
  ]);
  const [filterCategory, setFilterCategory] = useState<string | null>("");

  const { mutate: postEdit } = useMutation(editTileById, {
    onSuccess: (response) => {
      refetchTiles();
    },
  });

  const { mutate: updateMany } = useMutation(updateManyTiles, {
    onSuccess: (response) => {
      refetchTiles();
    },
  });

  const {
    data: allSprites,
    refetch: refetchSprites,
    isFetching: fetchingSprites,
  } = useQuery("getAllSprites", getAllSprites);

  const { data: mobsData, isFetching: fetchingMobs } = useQuery(
    "getMobs",
    getMobs
  );

  const { data: mapData, isFetching: fetchingMaps } = useQuery(
    "getMap",
    getMap
  );

  const filteredSprites = allSprites?.filter((sprite: any) =>
    filterCategory !== "" ? sprite.category === filterCategory : sprite
  );

  const allSpritesSelect = useMemo(
    () =>
      filteredSprites?.map((sprite: any) => ({
        image: sprite?.sprite,
        label: sprite?.name,
        value: sprite?.sprite,
        group: sprite.category,
      })),
    [filteredSprites]
  );

  const objectSelect = useMemo(
    () =>
      allSprites
        ?.filter((sprite: any) => sprite.category === "Objects")
        .map((sprite: any) => ({
          image: sprite?.sprite,
          label: sprite?.name,
          value: sprite?.sprite,
        })),
    [allSprites]
  );

  const mobsSelect = useMemo(
    () =>
      mobsData?.map((mob: Mob) => ({
        image: `/media/mobs/${mob?.sprite}.png`,
        label: `${mob?.name}, lvl: ${mob?.minLevel} - ${mob?.maxLevel}`,
        value: mob?.id,
      })),
    [mobsData]
  );

  const mapsSelect = useMemo(
    () =>
      mapData?.map((map: any) => ({
        value: map?.id,
        label: map?.name,
      })),
    [mapData]
  );

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={`${assets_url}/${image}`} />
          <div>
            <Text size="sm">{label}</Text>
          </div>
        </Group>
      </div>
    )
  );

  const tileForm = useFormik({
    initialValues: {
      tileId: editTile?.id,
      sprite: editTile?.sprite,
      object: editTile?.object,
      text: editTile?.text,
      blocked: editTile?.blocked,
      action_name: editTile?.action_name,
      action: {
        teleport: editTile?.action?.teleport,
        mobSpawn: editTile?.action?.mobSpawn,
      },
    },
    onSubmit: (values, { resetForm }) => {
      const deleteEmptyValues = (values: any) => {
        for (const propName in values) {
          if (values[propName] === undefined) {
            delete values[propName];
          }
          if (values.action_name === undefined) {
            delete values.action;
          }
        }
        return values;
      };

      const nonEmptyValues = deleteEmptyValues(values);

      if (multiSelect) {
        updateMany({
          ids: multiSelectTiles,
          values: nonEmptyValues,
        });
        return;
      }

      postEdit(values);
      resetForm();
    },
    enableReinitialize: true,
  });

  if (fetchingMobs || fetchingMaps || fetchingSprites) {
    return <Loader />;
  }

  return (
    <div className="settings">
      <form
        style={{ width: "300px" }}
        className="admin__form-items"
        onSubmit={tileForm.handleSubmit}
      >
        <p>id: {editTile?.id}</p>
        <p>
          x: {editTile?.x} y: {editTile?.y}
        </p>
        <div className="settings__form">
          <div className="settings__panel">
            <label className="admin__main-label">Sprite</label>
            <Select
              placeholder="Pick one"
              name="Category"
              label="Category"
              data={categories}
              style={{ marginBottom: 10 }}
              onChange={(value) => {
                setFilterCategory(value);
              }}
              value={filterCategory}
              searchable
              maxDropdownHeight={400}
              nothingFound="No sprites available"
            />
            <Select
              placeholder="Pick one"
              name="sprite"
              itemComponent={SelectItem}
              style={{ marginBottom: 10 }}
              data={allSpritesSelect}
              onChange={(value) => tileForm.setFieldValue("sprite", value)}
              value={tileForm.values.sprite}
              searchable
              maxDropdownHeight={400}
              nothingFound="No sprites available"
            />
            {tileForm.values.sprite && (
              <img
                style={{ height: 100, marginBottom: 10 }}
                src={`${assets_url}/${tileForm.values.sprite}`}
              />
            )}
            <label className="admin__main-label">Object</label>

            <Select
              placeholder="Pick one"
              name="object"
              itemComponent={SelectItem}
              style={{ margin: 10 }}
              clearable
              data={objectSelect}
              onChange={(value) => tileForm.setFieldValue("object", value)}
              value={tileForm.values.object}
              searchable
              maxDropdownHeight={400}
              nothingFound="No objects available"
            />
            {tileForm.values.object && (
              <img
                style={{ height: 100, marginBottom: 10 }}
                src={`${assets_url}/${tileForm.values.object}`}
              />
            )}
            <Switch
              label="Blocked"
              style={{ marginTop: 10 }}
              checked={tileForm.values.blocked}
              onChange={(event) =>
                tileForm.setFieldValue("blocked", event.currentTarget.checked)
              }
            />
          </div>
          {!tileForm.values.blocked && (
            <div className="settings__panel">
              <label className="admin__main-label">Text</label>
              <Textarea
                className="admin__main-input"
                name="text"
                onChange={tileForm.handleChange}
                value={tileForm.values.text}
              />
              <Select
                label="Action"
                placeholder="Pick one"
                style={{ marginTop: 20 }}
                clearable
                data={[
                  { value: "TELEPORT", label: "Teleport" },
                  { value: "MOB", label: "Mob Spawn" },
                ]}
                value={tileForm.values.action_name}
                onChange={(value) =>
                  tileForm.setFieldValue("action_name", value)
                }
              />
              {tileForm.values.action_name === "TELEPORT" && (
                <>
                  <Select
                    label="Map"
                    placeholder="Pick one"
                    clearable
                    data={mapsSelect}
                    style={{ marginTop: 20 }}
                    value={tileForm.values.action.teleport?.mapId}
                    onChange={(value) => {
                      tileForm.setFieldValue("action.teleport.mapId", value);
                    }}
                  />
                  x:{" "}
                  <Input
                    value={tileForm.values.action.teleport?.newMapX}
                    type="number"
                    onChange={(e: any) =>
                      tileForm.setFieldValue(
                        "action.teleport.newMapX",
                        e.target.value
                      )
                    }
                  />
                  y:{" "}
                  <Input
                    value={tileForm.values.action.teleport?.newMapY}
                    type="number"
                    onChange={(e: any) =>
                      tileForm.setFieldValue(
                        "action.teleport.newMapY",
                        e.target.value
                      )
                    }
                  />
                </>
              )}
              {tileForm.values.action_name === "MOB" && (
                <div>
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
                    styles={{ root: { width: "100%", marginTop: 40 } }}
                    marks={[
                      { value: 20, label: "20%" },
                      { value: 50, label: "50%" },
                      { value: 80, label: "80%" },
                    ]}
                    value={tileForm.values.action.mobSpawn?.procent}
                    onChange={(value) =>
                      tileForm.setFieldValue("action.mobSpawn.procent", value)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <Button m="30px" type="submit" color="green" size="md">
          Save
        </Button>
      </form>
    </div>
  );
};

export default TileEdit;
