import { useMutation, useQuery } from "react-query";
import { getMap, createMap, deleteMap, createTiles } from "api/endpoints";
import { useFormik } from "formik";
import { Button, NumberInputProps } from "@mantine/core";
import { Map } from "/types";
import { isEmpty } from "lodash";

const Maps = () => {
  const { data: mapData, refetch: refetchMaps } = useQuery("getMap", getMap);

  console.log("mapData", mapData);

  const { mutate: addMap } = useMutation(createMap, {
    onSuccess: (response) => {
      refetchMaps();
    },
  });

  const { mutate: addTiles } = useMutation(createTiles, {
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
      <h2 className="admin__title-items">Maps</h2>
      <form className="admin__form-items" onSubmit={mapForm.handleSubmit}>
        <label className="admin__main-label">Name</label>
        <input
          className="admin__main-input"
          name="name"
          onChange={mapForm.handleChange}
          value={mapForm.values.name}
        />
        <label className="admin__main-label">Min Level</label>
        <input
          className="admin__main-input"
          name="minLevel"
          type="number"
          onChange={mapForm.handleChange}
          value={mapForm.values.minLevel}
        />
        <label className="admin__main-label">Max Level</label>
        <input
          className="admin__main-input"
          name="maxLevel"
          type="number"
          onChange={mapForm.handleChange}
          value={mapForm.values.maxLevel}
        />
        <Button m="30px" type="submit" color="green" size="md">
          Add Map
        </Button>
      </form>
      <table className="admin__item-list">
        <tr className="admin__item-list-tr">
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>Action</th>
        </tr>
        {mapData?.map((map: Map) => (
          <tr key={map.id} className="admin__item">
            <td>{map.name}</td>
            <td>{map.minLevel}</td>
            <td>{map.maxLevel}</td>
            <td>
              {isEmpty(map?.tiles) && (
                <Button
                  m="5px"
                  color="green"
                  size="xs"
                  onClick={() => {
                    addTiles({ mapId: map.id });
                  }}
                >
                  Create Tiles
                </Button>
              )}
              <Button
                m="5px"
                color="red"
                size="xs"
                onClick={() => {
                  deleteThisMap(map.id);
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

export default Maps;
