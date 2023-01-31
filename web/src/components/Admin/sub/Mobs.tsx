import { useMutation, useQuery } from "react-query";
import { getMobs, deleteMob, createMob, getMap } from "api/endpoints";
import { useFormik } from "formik";

import { Button, Select } from "@mantine/core";
import { useMemo } from "react";

const Mobs = () => {
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
      minLevel: 1,
      maxLevel: 10,
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

  return (
    <div className="admin__section">
      <h2 className="admin__title-items">Mobs</h2>
      <form className="admin__form-items" onSubmit={mobsForm.handleSubmit}>
        <label className="admin__main-label">Name</label>
        <input
          className="admin__main-input"
          name="name"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.name}
        />
        <label className="admin__main-label">Min Level</label>
        <input
          className="admin__main-input"
          name="minLevel"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.minLevel}
        />
        <label className="admin__main-label">Max Level</label>
        <input
          className="admin__main-input"
          name="maxLevel"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.maxLevel}
        />
        <label className="admin__main-label">HP</label>
        <input
          className="admin__main-input"
          name="hp"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.hp}
        />
        <label className="admin__main-label">Attack</label>
        <input
          className="admin__main-input"
          name="attack"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.attack}
        />
        <label className="admin__main-label">Defence</label>
        <input
          className="admin__main-input"
          name="defence"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.defence}
        />
        <label className="admin__main-label">Give Exp</label>
        <input
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
          <th>Min Level</th>
          <th>Max Level</th>
          <th>HP</th>
          <th>Attack</th>
          <th>Defence</th>
          <th>Exp</th>
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="admin__item">
            <td>{mob.name}</td>
            <td>{mob.minLevel}</td>
            <td>{mob.maxLevel}</td>
            <td>{mob.hp}</td>
            <td>{mob.attack}</td>
            <td>{mob.defence}</td>
            <td>{mob.giveExp}</td>
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
  );
};

export default Mobs;
