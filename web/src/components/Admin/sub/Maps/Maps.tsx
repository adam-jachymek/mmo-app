import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getMap, createMap, deleteMap } from "api/endpoints";
import { createTiles } from "api/endpoints/tiles";
import ConfirmModal from "components/ConfirmModal";
import { useFormik } from "formik";
import { Button, Input, NumberInputProps } from "@mantine/core";
import { Map } from "/types";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

const Maps = () => {
  const [deleteModal, setDeleteModal] = useState({ visible: false, mapId: 0 });
  const { data: mapData, refetch: refetchMaps } = useQuery("getMap", getMap);

  let navigate = useNavigate();

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
      minLevel: undefined,
      maxLevel: undefined,
    },
    onSubmit: (values, { resetForm }) => {
      addMap(values);
      resetForm();
    },
  });

  const handleDeleteMap = () => {
    deleteThisMap(deleteModal.mapId);
    setDeleteModal({ visible: false, mapId: 0 });
  };

  return (
    <>
      <div className="admin__section">
        <h2 className="admin__title-items">Maps</h2>
        <form className="admin__form-items" onSubmit={mapForm.handleSubmit}>
          <label className="admin__main-label">Name</label>
          <Input
            className="admin__main-input"
            name="name"
            onChange={mapForm.handleChange}
            value={mapForm.values.name}
          />
          <label className="admin__main-label">Min Level</label>
          <Input
            className="admin__main-input"
            name="minLevel"
            type="number"
            onChange={mapForm.handleChange}
            value={mapForm.values.minLevel}
          />
          <label className="admin__main-label">Max Level</label>
          <Input
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
                <Button
                  size="xs"
                  onClick={() => {
                    navigate(`editor/${map?.id}`);
                  }}
                >
                  Edit
                </Button>
                {isEmpty(map?.tiles) && (
                  <Button
                    m="5px"
                    color="green"
                    size="xs"
                    onClick={() => {
                      addTiles({ mapId: map.id });
                      refetchMaps();
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
                    setDeleteModal({ visible: true, mapId: map.id });
                    refetchMaps();
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <ConfirmModal
        isVisible={deleteModal.visible}
        title="Are you sure you want to DELETE this map?"
        onConfirmAction={() => {
          handleDeleteMap();
        }}
        onCancelAction={() => {
          setDeleteModal({ visible: false, mapId: 0 });
        }}
      />
    </>
  );
};

export default Maps;
