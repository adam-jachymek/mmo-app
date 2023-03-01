import { Select } from "@mantine/core";
import { assets_url } from "config";
import { useMemo, useState } from "react";

type Props = {
  allSprites: any;
  tileForm: any;
  SelectItem: any;
};

const Sprite = ({ allSprites, tileForm, SelectItem }: Props) => {
  const categories = [
    { value: "", label: "All" },
    { value: "Forest", label: "Forest" },
    { value: "Cave", label: "Cave" },
  ];
  const [filterCategory, setFilterCategory] = useState<string>("");

  const filteredSprites = allSprites?.filter((sprite: any) =>
    filterCategory !== "" ? sprite.category === filterCategory : sprite
  );

  const allSpritesSelect = useMemo(
    () =>
      filteredSprites?.map((sprite: any) => ({
        image: sprite?.sprite,
        label: sprite?.name,
        value: sprite?.sprite,
        group: sprite.category,
      })),
    [filteredSprites]
  );

  return (
    <>
      <label className="admin__main-label">Sprite</label>
      {tileForm.values.sprite && (
        <img
          style={{ height: 100, marginTop: 10, marginBottom: 10 }}
          src={`${assets_url}/${tileForm.values.sprite}`}
        />
      )}
      <Select
        placeholder="Pick one"
        name="Category"
        label="Category"
        data={categories}
        style={{ marginBottom: 10 }}
        onChange={(value) => {
          setFilterCategory(value || "");
        }}
        value={filterCategory}
        searchable
        maxDropdownHeight={400}
        nothingFound="No sprites available"
      />
      <Select
        placeholder="Pick one"
        name="sprite"
        itemComponent={SelectItem}
        style={{ marginBottom: 10 }}
        data={allSpritesSelect}
        onChange={(value) => tileForm.setFieldValue("sprite", value)}
        value={tileForm.values.sprite}
        searchable
        maxDropdownHeight={400}
        nothingFound="No sprites available"
      />
    </>
  );
};

export default Sprite;
