import { Input, Select } from "@mantine/core";
import { useMemo } from "react";

type Props = {
  tileForm: any;
  mapData: any;
};

const Teleport = ({ tileForm, mapData }: Props) => {
  const mapsSelect = useMemo(
    () =>
      mapData?.map((map: any) => ({
        value: map?.id,
        label: map?.name,
      })),
    [mapData]
  );

  return (
    <>
      <Select
        label="Map"
        placeholder="Pick one"
        clearable
        data={mapsSelect}
        style={{ marginTop: 20 }}
        disabled={tileForm.values.blocked}
        value={tileForm.values.action.teleport?.mapId}
        onChange={(value) => {
          tileForm.setFieldValue("action.teleport.mapId", value);
        }}
      />
      <div className="settings__inputs">
        <Input.Wrapper label="x">
          <Input
            value={tileForm.values.action.teleport?.newMapX}
            type="number"
            size="xs"
            onChange={(e: any) =>
              tileForm.setFieldValue("action.teleport.newMapX", e.target.value)
            }
          />
        </Input.Wrapper>
        <Input.Wrapper label="y">
          <Input
            value={tileForm.values.action.teleport?.newMapY}
            type="number"
            size="xs"
            onChange={(e: any) =>
              tileForm.setFieldValue("action.teleport.newMapY", e.target.value)
            }
          />
        </Input.Wrapper>
      </div>
    </>
  );
};

export default Teleport;
