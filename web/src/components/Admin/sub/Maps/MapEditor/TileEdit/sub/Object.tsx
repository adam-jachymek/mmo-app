import { Button, Collapse, Select } from "@mantine/core";
import { useMemo, useState } from "react";
import { assets_url } from "config";

type Props = {
  tileForm: any;
  SelectItem: any;
  allSprites: any;
};

const Object = ({ tileForm, SelectItem, allSprites }: Props) => {
  const [collapse, setCollapse] = useState(true);

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
        Above player
      </Button>
      <Collapse in={collapse}>
        <div className="settings__collapse">
          <label className="admin__main-label">Layer 1</label>
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
          <label className="admin__main-label">Layer 2</label>
          {tileForm.values.layer3 && (
            <img
              style={{ height: 100, marginBottom: 10, marginTop: 10 }}
              src={`${assets_url}/${tileForm.values.layer3}`}
            />
          )}
          <Select
            placeholder="Pick one"
            name="layer3"
            itemComponent={SelectItem}
            style={{ margin: 10 }}
            clearable
            data={objectSelect}
            onChange={(value) => tileForm.setFieldValue("layer3", value)}
            value={tileForm.values.layer3}
            searchable
            maxDropdownHeight={400}
            nothingFound="No objects available"
          />
        </div>
      </Collapse>
    </>
  );
};

export default Object;
