import { Avatar, Button, Group, Text, Switch, Loader } from "@mantine/core";
import { useFormik } from "formik";
import { forwardRef, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { editTileById, updateManyTiles } from "api/endpoints/tiles";
import { Tile } from "/types";
import { getAllSprites } from "api/endpoints/sprites";
import { assets_url } from "config";
import Sprite from "./sub/Sprite";
import Object from "./sub/Object";

type Props = {
  editTile?: Tile;
  refetchTiles: () => void;
  multiSelect: boolean;
  setMultiSelect: (arg: boolean) => void;
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
  setMultiSelect,
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
      layer2: editTile?.layer2,
      layer3: editTile?.layer3,
      text: editTile?.text,
      blocked: editTile?.blocked,
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
        setMultiSelect(false);
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

  if (fetchingSprites) {
    return <Loader />;
  }

  return (
    <div className="settings">
      <form className="admin__form-items" onSubmit={tileForm.handleSubmit}>
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
              style={{ marginTop: 30 }}
              checked={tileForm.values.blocked}
              onChange={(event) =>
                tileForm.setFieldValue("blocked", event.currentTarget.checked)
              }
            />
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
