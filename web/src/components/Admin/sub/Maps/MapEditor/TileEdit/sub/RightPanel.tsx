import { Avatar, Group, Text } from "@mantine/core";
import { forwardRef } from "react";
import { Tile } from "/types";
import { assets_url } from "config";
import MobSpawn from "./MobSpawn";

type Props = {
  editTile?: Tile;
  refetchTiles: () => void;
  multiSelect: boolean;
  multiSelectTiles: number[];
  setMultiSelectTiles: (tiles: number[]) => void;
};

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const RightPanel = ({
  editTile,
  refetchTiles,
  multiSelect,
  multiSelectTiles,
  setMultiSelectTiles,
}: Props) => {
  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={`${assets_url}/${image}`} />
          <div>
            <Text size="sm">{label}</Text>
          </div>
        </Group>
      </div>
    )
  );

  return (
    <>
      <div className="settings">
        <div className="settings__panel">
          <label className="admin__main-label">Mob Spawn</label>
          <MobSpawn
            SelectItem={SelectItem}
            tileId={editTile?.id}
            multiSelectTiles={multiSelectTiles}
            setMultiSelectTiles={setMultiSelectTiles}
            refetchTiles={refetchTiles}
          />
        </div>
      </div>
    </>
  );
};

export default RightPanel;
