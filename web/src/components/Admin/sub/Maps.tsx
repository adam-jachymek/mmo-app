import { useMutation, useQuery } from "react-query";
import { getMap, createMap, deleteMap } from "api/endpoints";
import { useFormik } from "formik";

const Maps = () => {
  const { data: mapData, refetch: refetchMaps } = useQuery("getMap", getMap);

  const { mutate: addMap } = useMutation(createMap, {
    onSuccess: (response) => {
      refetchMaps();
    },
  });

  const { mutate: deleteThisMap } = useMutation(deleteMap, {
    onSuccess: (response) => {
      refetchMaps();
    },
  });

  const mapForm = useFormik({
    initialValues: {
      name: "",
      minLevel: 1,
      maxLevel: 10,
    },
    onSubmit: (values, { resetForm }) => {
      addMap(values);
      resetForm();
    },
  });

  return (
    <div className="admin__section">
      <h2>Maps</h2>
      <form onSubmit={mapForm.handleSubmit}>
        <label className="main__label">Name</label>
        <input
          className="main__input"
          name="name"
          onChange={mapForm.handleChange}
          value={mapForm.values.name}
        />
        <label className="main__label">Min Level</label>
        <input
          className="main__input"
          name="minLevel"
          type="number"
          onChange={mapForm.handleChange}
          value={mapForm.values.minLevel}
        />
        <label className="main__label">Max Level</label>
        <input
          className="main__input"
          name="maxLevel"
          type="number"
          onChange={mapForm.handleChange}
          value={mapForm.values.maxLevel}
        />
        <button type="submit">Add Map</button>
      </form>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>Action</th>
        </tr>
        {mapData?.map((map: any) => (
          <tr key={map.id} className="admin__item">
            <td>{map.name}</td>
            <td>{map.minLevel}</td>
            <td>{map.maxLevel}</td>
            <td>
              <button
                onClick={() => {
                  deleteThisMap(map.id);
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

export default Maps;
