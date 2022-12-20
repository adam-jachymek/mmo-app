import { Avatar, Button, Group, Modal, Select, Text } from "@mantine/core";
import { useFormik } from "formik";
import { forwardRef, useState } from "react";
import { useMutation } from "react-query";
import { editTileById } from "api/endpoints";

type Props = {
  editTile: {
    blocked: boolean;
    id: number;
    sprite: string;
    text: string;
    x: number;
    y: number;
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
    },
    onSubmit: (values, { resetForm }) => {
      postEdit(values);
      resetForm();
    },
    enableReinitialize: true,
  });

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
        {editTile.id}
        <label className="admin__main-label">Sprite</label>
        <img style={{ height: 100 }} src={tileForm.values.sprite} />
        <Select
          placeholder="Pick one"
          name="sprite"
          itemComponent={SelectItem}
          data={sprites}
          onChange={(value) => tileForm.setFieldValue("sprite", value)}
          value={tileForm.values.sprite}
          searchable
          maxDropdownHeight={400}
          nothingFound="Nobody here"
        />
        <label className="admin__main-label">Text</label>
        <textarea
          className="admin__main-input"
          name="text"
          onChange={tileForm.handleChange}
          value={tileForm.values.text}
        />
        <Button m="30px" type="submit" color="green" size="md">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default TileEditModal;
