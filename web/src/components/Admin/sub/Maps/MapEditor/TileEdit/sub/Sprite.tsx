import { Button, Collapse, Select } from "@mantine/core";
import { assets_url } from "config";
import { useMemo, useState } from "react";

type Props = {
  allSprites: any;
  tileForm: any;
  SelectItem: any;
};

const Sprite = ({ allSprites, tileForm, SelectItem }: Props) => {
  const [collapse, setCollapse] = useState(true);

  const allSpritesSelect = useMemo(
    () =>
      allSprites
        ?.filter((sprite: any) => sprite.category !== "Objects")
        .map((sprite: any) => ({
          image: sprite?.sprite,
          label: sprite?.name,
          value: sprite?.sprite,
          group: sprite.category,
        })),
    [allSprites]
  );

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
      <Button
        variant="subtle"
        onClick={() => {
          setCollapse(!collapse);
        }}
        className="admin__main-label"
      >
        Ground
      </Button>
      <Collapse in={collapse}>
        <div className="settings__collapse">
          {tileForm.values.sprite && (
            <img
              style={{ height: 100, marginTop: 10, marginBottom: 20 }}
              src={`${assets_url}/${tileForm.values.sprite}`}
            />
          )}
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
          <label className="admin__main-label">Ground Layer</label>
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
        </div>
      </Collapse>
    </>
  );
};

export default Sprite;
