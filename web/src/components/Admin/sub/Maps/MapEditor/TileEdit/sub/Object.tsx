import { Select } from "@mantine/core";
import { useMemo } from "react";
import { assets_url } from "config";

type Props = {
  tileForm: any;
  SelectItem: any;
  allSprites: any;
};

const Object = ({ tileForm, SelectItem, allSprites }: Props) => {
  const objectSelect = useMemo(
    () =>
      allSprites
        ?.filter((sprite: any) => sprite.category === "Objects")
        .map((sprite: any) => ({
          image: sprite?.sprite,
          label: sprite?.name,
          value: sprite?.sprite,
        })),
    [allSprites]
  );

  return (
    <>
      <label className="admin__main-label">Layer 1</label>
      {tileForm.values.object && (
        <img
          style={{ height: 100, marginBottom: 10, marginTop: 10 }}
          src={`${assets_url}/${tileForm.values.object}`}
        />
      )}
      <Select
        placeholder="Pick one"
        name="object"
        itemComponent={SelectItem}
        style={{ margin: 10 }}
        clearable
        data={objectSelect}
        onChange={(value) => tileForm.setFieldValue("object", value)}
        value={tileForm.values.object}
        searchable
        maxDropdownHeight={400}
        nothingFound="No objects available"
      />
      <label className="admin__main-label">Layer 2</label>
      {tileForm.values.layer2 && (
        <img
          style={{ height: 100, marginBottom: 10, marginTop: 10 }}
          src={`${assets_url}/${tileForm.values.layer2}`}
        />
      )}
      <Select
        placeholder="Pick one"
        name="layer2"
        itemComponent={SelectItem}
        style={{ margin: 10 }}
        clearable
        data={objectSelect}
        onChange={(value) => tileForm.setFieldValue("layer2", value)}
        value={tileForm.values.layer2}
        searchable
        maxDropdownHeight={400}
        nothingFound="No objects available"
      />
    </>
  );
};

export default Object;
