import { useMutation, useQuery } from "react-query";
import { getMobs, deleteMob, createMob, getMap } from "api/endpoints";
import { useFormik } from "formik";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";

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

  const mobsForm = useFormik({
    initialValues: {
      name: "",
      minLevel: 1,
      maxLevel: 10,
      hp: 100,
      attack: 5,
      defence: 5,
      giveExp: 20,
      mapId: "0",
    },
    onSubmit: (values, { resetForm }) => {
      addMob(values);
      resetForm();
    },
  });

  return (
    <div className="admin__section">
      <h2>Mobs</h2>
      <form onSubmit={mobsForm.handleSubmit}>
        <label className="main__label">Name</label>
        <input
          className="main__input"
          name="name"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.name}
        />
        <label className="main__label">Min Level</label>
        <input
          className="main__input"
          name="minLevel"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.minLevel}
        />
        <label className="main__label">Max Level</label>
        <input
          className="main__input"
          name="maxLevel"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.maxLevel}
        />
        <label className="main__label">HP</label>
        <input
          className="main__input"
          name="hp"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.hp}
        />
        <label className="main__label">Attack</label>
        <input
          className="main__input"
          name="attack"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.attack}
        />
        <label className="main__label">Defence</label>
        <input
          className="main__input"
          name="defence"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.defence}
        />
        <label className="main__label">Give Exp</label>
        <input
          className="main__input"
          name="giveExp"
          type="number"
          onChange={mobsForm.handleChange}
          value={mobsForm.values.giveExp}
        />
        <label className="main__label">Map</label>
        <Select
          name="mapId"
          className="admin__map-select"
          value={mobsForm.values.mapId}
          label="Age"
          onChange={mobsForm.handleChange}
        >
          {mapData?.map((map: any) => (
            <MenuItem value={map.id}>{map.name}</MenuItem>
          ))}
        </Select>
        <button type="submit">Add Mob</button>
      </form>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>HP</th>
          <th>Attack</th>
          <th>Defence</th>
          <th>Exp</th>
          <th>Map</th>
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
            <td>{mob.map.name}</td>
            <td>
              <button
                onClick={() => {
                  deleteThisMob(mob.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Mobs;
