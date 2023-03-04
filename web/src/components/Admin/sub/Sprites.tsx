import { Button, FileInput, Input, Loader, Select } from "@mantine/core";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createSprite,
  deleteMapSprite,
  getAllSprites,
  getCategories,
} from "api/endpoints/sprites";
import { assets_url } from "config";

const Spirtes = () => {
  const [categories, setCategories] = useState([
    { value: "Forest", label: "Forest" },
    { value: "Cave", label: "Cave" },
    { value: "Objects", label: "Objects" },
  ]);

  const [filterCategory, setFilterCategory] = useState<string | null>("");

  const {
    data: allSprites,
    refetch: refetchSprites,
    isFetching: spritesFetching,
  } = useQuery("getAllSprites", getAllSprites);

  const {
    data: getAllCategories,
    refetch: refetchCategories,
    isFetching: categoryFetching,
  } = useQuery("getCategories", getCategories);

  const { mutate: addSprite } = useMutation(createSprite, {
    onSuccess: (response) => {
      refetchSprites();
      refetchCategories();
    },
  });

  const { mutate: deleteSprite } = useMutation(deleteMapSprite, {
    onSuccess: (response) => {
      refetchSprites();
    },
  });

  const categoriesSelect = useMemo(
    () =>
      getAllCategories?.map((category: any) => ({
        label: category.category,
        value: category.category,
      })),
    [getAllCategories]
  );

  const spritesForm = useFormik({
    initialValues: {
      name: "",
      category: "",
      sprite: "",
    },
    onSubmit: (values, { resetForm }) => {
      addSprite({
        values: {
          name: values.name,
          category: values.category,
        },
        file: values.sprite,
      });
    },
  });

  const filteredSprites = allSprites?.filter((sprite: any) =>
    filterCategory !== "" ? sprite.category === filterCategory : sprite
  );

  if (spritesFetching || categoryFetching) {
    return <Loader />;
  }

  return (
    <div className="admin__sprites">
      <form className="admin__form-items" onSubmit={spritesForm.handleSubmit}>
        <label className="admin__main-label">Name</label>
        <Input
          className="admin__main-input"
          name="name"
          onChange={spritesForm.handleChange}
          value={spritesForm.values.name}
        />

        <label className="admin__main-label">Category</label>
        <Select
          data={categories}
          placeholder="Select category"
          nothingFound="Nothing found"
          searchable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setCategories((current) => [...current, item]);
            return item;
          }}
          value={spritesForm.values.category}
          onChange={(value) => {
            spritesForm.setFieldValue("category", value);
          }}
        />

        <label className="admin__main-label">Sprite</label>
        <FileInput
          placeholder="Upload sprite"
          name="sprite"
          onChange={(file: any) => {
            spritesForm.setFieldValue("sprite", file);
          }}
        />

        <Button m="30px" type="submit" color="green" size="md">
          Add Sprite
        </Button>
      </form>

      <Select
        data={[{ value: "", label: "All" }, ...categoriesSelect]}
        label="Category"
        placeholder="Select category"
        nothingFound="Nothing found"
        searchable
        style={{ width: 300, margin: "0 auto" }}
        getCreateLabel={(query) => `+ Create ${query}`}
        value={filterCategory}
        onChange={(value) => {
          setFilterCategory(value);
        }}
      />
      <table className="admin__sprites-list">
        <thead>
          <tr className="admin__sprites-list-tr">
            <th>Name</th>
            <th>Category</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSprites?.map((sprite: any) => (
            <tr key={sprite.id} className="admin__sprite">
              <td>{sprite.name}</td>
              <td>{sprite.category}</td>
              <td>
                <img
                  alt="sprite"
                  style={{ width: 64, height: 64 }}
                  src={`${assets_url}/${sprite.sprite}`}
                />
              </td>
              <td>
                <Button
                  color="red"
                  onClick={() => {
                    deleteSprite(sprite.id);
                  }}
                >
                  DELETE
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spirtes;
