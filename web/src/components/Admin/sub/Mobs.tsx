import { useMutation, useQuery } from "react-query";
import {
  getMobs,
  deleteMob,
  createMob,
  getMap,
  createMobSprite,
} from "api/endpoints";
import { useFormik } from "formik";

import { Button, FileInput, Input, Modal } from "@mantine/core";
import { useMemo, useState } from "react";
import { assets_url } from "config";

const Mobs = () => {
  const [editModal, setEditModal] = useState({
    visible: false,
    mobId: 0,
    name: "",
    sprite: "",
  });

  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);

  const { data: mapData, refetch: refetchMaps } = useQuery("getMap", getMap);

  const { mutate: addMob } = useMutation(createMob, {
    onSuccess: (response) => {
      refetchMobs();
    },
  });

  const { mutate: deleteThisMob } = useMutation(deleteMob, {
    onSuccess: (response) => {
      refetchMobs();
    },
  });

  const { mutate: addSprite } = useMutation(createMobSprite, {
    onSuccess: (response) => {
      refetchMobs();
    },
  });

  const maps = useMemo(() => {
    const maps = mapData?.map((map: any) => ({
      value: map.id.toString(),
      label: map.name,
    }));

    return maps;
  }, [mapData]);

  const mobsForm = useFormik({
    initialValues: {
      name: "",
      hp: 100,
      attack: 5,
      defence: 5,
      giveExp: 20,
      mapId: 0,
    },
    onSubmit: (values, { resetForm }) => {
      addMob(values);
      resetForm();
    },
  });

  const handleSaveSprite = () => {
    addSprite({
      mobId: editModal.mobId,
      name: editModal.name,
      sprite: editModal.sprite,
    });
    setEditModal({ ...editModal, visible: false });
  };

  return (
    <>
      <div className="admin__section">
        <h2 className="admin__title-items">Mobs</h2>
        <form className="admin__form-items" onSubmit={mobsForm.handleSubmit}>
          <label className="admin__main-label">Name</label>
          <Input
            className="admin__main-input"
            name="name"
            onChange={mobsForm.handleChange}
            value={mobsForm.values.name}
          />
          <label className="admin__main-label">HP</label>
          <Input
            className="admin__main-input"
            name="hp"
            type="number"
            onChange={mobsForm.handleChange}
            value={mobsForm.values.hp}
          />
          <label className="admin__main-label">Attack</label>
          <Input
            className="admin__main-input"
            name="attack"
            type="number"
            onChange={mobsForm.handleChange}
            value={mobsForm.values.attack}
          />
          <label className="admin__main-label">Defence</label>
          <Input
            className="admin__main-input"
            name="defence"
            type="number"
            onChange={mobsForm.handleChange}
            value={mobsForm.values.defence}
          />
          <label className="admin__main-label">Give Exp</label>
          <Input
            className="admin__main-input"
            name="giveExp"
            type="number"
            onChange={mobsForm.handleChange}
            value={mobsForm.values.giveExp}
          />

          <Button type="submit" color="green" size="md" m="10px">
            Add Mob
          </Button>
        </form>
        <table className="admin__item-list">
          <tr className="admin__item-list-tr">
            <th>Name</th>
            <th>HP</th>
            <th>Attack</th>
            <th>Defence</th>
            <th>Exp</th>
            <th>Sprite</th>
            <th>Action</th>
          </tr>
          {mobsData?.map((mob: any) => (
            <tr key={mob.id} className="admin__item">
              <td>{mob.name}</td>
              <td>{mob.hp}</td>
              <td>{mob.attack}</td>
              <td>{mob.defence}</td>
              <td>{mob.giveExp}</td>
              <td>
                <div className="admin__item-icon">
                  {mob.sprite && (
                    <img
                      className="admin__item-img"
                      src={`${assets_url}/${mob.sprite}`}
                    />
                  )}
                  <Button
                    compact
                    onClick={() =>
                      setEditModal({
                        ...editModal,
                        mobId: mob.id,
                        name: mob.name,
                        visible: true,
                      })
                    }
                  >
                    {mob.sprite ? "Edit" : "Add"}
                  </Button>
                </div>
              </td>
              <td>
                <Button
                  color="red"
                  size="xs"
                  m="5px"
                  onClick={() => {
                    deleteThisMob(mob.id);
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

export default Mobs;
