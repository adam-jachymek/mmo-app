import {
  Avatar,
  Button,
  Group,
  Modal,
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
import { editTileById, getMap, getMobs } from "api/endpoints";
import { Mob } from "/types";

type Props = {
  editTile: {
    blocked: boolean;
    id: number;
    sprite: string;
    text: string;
    action_name?: string;
    x: number;
    y: number;
    action?: {
      teleport?: { mapId: string; newMapX: number; newMapY: number };
      mobSpawn?: { mobId: string; procent: number };
    };
  };
  openEditModal: boolean;
  setOpenEditModal: (open: boolean) => void;
  refetchTiles: () => void;
};

const sprites = [
  {
    image: "",
    label: "Empty",
    value: "",
  },
  {
    image: "/media/maps/grass.svg",
    label: "Grass",
    value: "/media/maps/grass.svg",
  },
  {
    image: "/media/maps/grass+flowers.svg",
    label: "Grass + Flowers",
    value: "/media/maps/grass+flowers.svg",
  },
  {
    image: "/media/maps/grass+flowers+trees.svg",
    label: "Grass + Flowers + Trees",
    value: "/media/maps/grass+flowers+trees.svg",
  },
  {
    image: "/media/maps/tree.png",
    label: "Tree v01",
    value: "/media/maps/tree.png",
  },
  {
    image: "/media/maps/cave-left.svg",
    label: "Cave-left",
    value: "/media/maps/cave-left.svg",
  },
  {
    image: "/media/maps/cave-right.svg",
    label: "Cave-right",
    value: "/media/maps/cave-right.svg",
  },
  {
    image: "/media/maps/cave.svg",
    label: "Cave",
    value: "/media/maps/cave.svg",
  },
  {
    image: "/media/maps/road_horizontal.svg",
    label: "road horizontal",
    value: "/media/maps/road_horizontal.svg",
  },
  {
    image: "/media/maps/road_left-down.svg",
    label: "road left-down",
    value: "/media/maps/road_left-down.svg",
  },
  {
    image: "/media/maps/road_right-down.svg",
    label: "road right-down",
    value: "/media/maps/road_right-down.svg",
  },
  {
    image: "/media/maps/road_up-right.svg",
    label: "road up-right",
    value: "/media/maps/road_up-right.svg",
  },
  {
    image: "/media/maps/road_left-up.svg",
    label: "road_left-up",
    value: "/media/maps/road_left-up.svg",
  },
  {
    image: "/media/maps/road.svg",
    label: "road",
    value: "/media/maps/road.svg",
  },
  {
    image: "/media/maps/road-horizontal-down.svg",
    label: "road-horizontal-down",
    value: "/media/maps/road-horizontal-down.svg",
  },
  {
    image: "/media/maps/road-horizontal-up.svg",
    label: "road-horizontal-up",
    value: "/media/maps/road-horizontal-up.svg",
  },
  {
    image: "/media/maps/road-left.svg",
    label: "road-left",
    value: "/media/maps/road-left.svg",
  },
  {
    image: "/media/maps/road-right.svg",
    label: "road-right",
    value: "/media/maps/road-right.svg",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const TileEditModal = ({
  editTile,
  openEditModal,
  setOpenEditModal,
  refetchTiles,
}: Props) => {
  const { mutate: postEdit } = useMutation(editTileById, {
    onSuccess: (response) => {
      setOpenEditModal(false);
      refetchTiles();
    },
  });

  console.log("editTile", editTile);

  const { data: mobsData, isFetching: fetchingMobs } = useQuery(
    "getMobs",
    getMobs
  );

  const { data: mapData, isFetching: fetchingMaps } = useQuery(
    "getMap",
    getMap
  );

  const mobsSelect = useMemo(() => {
    return mobsData?.map((mob: Mob) => ({
      image: `/media/mobs/${mob?.sprite}.png`,
      label: `${mob?.name}, lvl: ${mob?.minLevel} - ${mob?.maxLevel}`,
      value: mob?.id,
    }));
  }, [mobsData]);

  const mapsSelect = useMemo(() => {
    return mapData?.map((map: any) => ({
      value: map?.id,
      label: map?.name,
    }));
  }, [mapData]);

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={image} />
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
      text: editTile?.text,
      blocked: editTile?.blocked,
      action_name: editTile?.action_name,
      action: {
        teleport: editTile.action?.teleport,
        mobSpawn: editTile.action?.mobSpawn,
      },
    },
    onSubmit: (values, { resetForm }) => {
      postEdit(values);
      resetForm();
    },
    enableReinitialize: true,
  });

  if (fetchingMobs || fetchingMaps) {
    return <Loader />;
  }

  return (
    <Modal
      classNames={{ modal: "modal" }}
      centered
      withCloseButton={false}
      opened={openEditModal}
      overlayOpacity={0.55}
      overlayBlur={3}
      onClose={() => {
        setOpenEditModal(false);
      }}
    >
      <form className="admin__form-items" onSubmit={tileForm.handleSubmit}>
        <p>id: {editTile.id}</p>
        <p>
          x: {editTile.x} y: {editTile.y}
        </p>
        <label className="admin__main-label">Sprite</label>
        <img
          style={{ height: 100, marginBottom: 10 }}
          src={tileForm.values.sprite}
        />
        <Select
          placeholder="Pick one"
          name="sprite"
          itemComponent={SelectItem}
          data={sprites}
          onChange={(value) => tileForm.setFieldValue("sprite", value)}
          value={tileForm.values.sprite}
          searchable
          maxDropdownHeight={400}
          nothingFound="No sprites available"
        />
        <Switch
          label="Blocked"
          style={{ marginTop: 10 }}
          checked={tileForm.values.blocked}
          onChange={(event) =>
            tileForm.setFieldValue("blocked", event.currentTarget.checked)
          }
        />
        {!tileForm.values.blocked && (
          <>
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
              onChange={(value) => tileForm.setFieldValue("action_name", value)}
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
          </>
        )}
        <Button m="30px" type="submit" color="green" size="md">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default TileEditModal;
