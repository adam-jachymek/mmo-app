import {
  Avatar,
  Button,
  Group,
  Select,
  Text,
  Textarea,
  Switch,
  Loader,
} from "@mantine/core";
import { useFormik } from "formik";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getMap } from "api/endpoints";
import { editTileById, updateManyTiles } from "api/endpoints/tiles";
import { Tile } from "/types";
import { getAllSprites } from "api/endpoints/sprites";
import { assets_url } from "config";
import MobSpawn from "./sub/MobSpawn";
import Teleport from "./sub/Teleport";
import Sprite from "./sub/Sprite";
import Object from "./sub/Object";

type Props = {
  editTile?: Tile;
  refetchTiles: () => void;
  multiSelect: boolean;
  multiSelectTiles: number[];
  setMultiSelectTiles: (tiles: number[]) => void;
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
  setMultiSelectTiles,
}: Props) => {
  const { mutate: postEdit } = useMutation(editTileById, {
    onSuccess: () => {
      refetchTiles();
    },
  });

  const { mutate: updateMany } = useMutation(updateManyTiles, {
    onSuccess: () => {
      refetchTiles();
    },
  });

  const { data: allSprites, isFetching: fetchingSprites } = useQuery(
    "getAllSprites",
    getAllSprites
  );

  const { data: mapData, isFetching: fetchingMaps } = useQuery(
    "getMap",
    getMap
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
      tileId: editTile?.id?.toString(),
      sprite: editTile?.sprite,
      object: editTile?.object,
      text: editTile?.text,
      blocked: editTile?.blocked,
      action_name: editTile?.action_name,
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
        setMultiSelectTiles([]);
        return;
      }

      postEdit(values);
      resetForm();
    },

    enableReinitialize: true,
  });

  useEffect(() => {
    if (tileForm.values.blocked) {
      tileForm.setFieldValue("action_name", undefined);
    }
  }, [tileForm.values.blocked]);

  if (fetchingMaps || fetchingSprites) {
    return <Loader />;
  }

  return (
    <div className="settings">
      <form
        style={{ width: "480px" }}
        className="admin__form-items"
        onSubmit={tileForm.handleSubmit}
      >
        <p>id: {editTile?.id}</p>
        <p>
          x: {editTile?.x} y: {editTile?.y}
        </p>
        <div className="settings__form">
          <div className="settings__panel">
            <Sprite
              allSprites={allSprites}
              tileForm={tileForm}
              SelectItem={SelectItem}
            />
            <Object
              tileForm={tileForm}
              SelectItem={SelectItem}
              allSprites={allSprites}
            />
            <Switch
              label="Blocked"
              style={{ marginTop: 10 }}
              checked={tileForm.values.blocked}
              onChange={(event) =>
                tileForm.setFieldValue("blocked", event.currentTarget.checked)
              }
            />
            <label className="admin__main-label">Text</label>
            <Textarea
              className="admin__main-input"
              name="text"
              disabled={tileForm.values.blocked}
              onChange={tileForm.handleChange}
              value={tileForm.values.text}
            />
          </div>

          <div className="settings__panel">
            <label className="admin__main-label">Action</label>
            <Select
              placeholder="Pick one"
              style={{ marginTop: 25 }}
              clearable
              data={[
                { value: "TELEPORT", label: "Teleport" },
                { value: "MOB", label: "Mob Spawn" },
              ]}
              disabled={tileForm.values.blocked}
              value={tileForm.values.action_name}
              onChange={(value) => tileForm.setFieldValue("action_name", value)}
            />
            {tileForm.values.action_name === "TELEPORT" && (
              <Teleport tileForm={tileForm} mapData={mapData} />
            )}
            {tileForm.values.action_name === "MOB" && (
              <MobSpawn
                tileForm={tileForm}
                SelectItem={SelectItem}
                tileId={editTile?.id}
              />
            )}
          </div>
        </div>
        <Button m="30px" type="submit" color="green" size="md">
          Save
        </Button>
      </form>
    </div>
  );
};

export default TileEdit;
