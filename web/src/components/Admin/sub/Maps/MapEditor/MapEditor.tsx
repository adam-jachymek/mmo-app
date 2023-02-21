import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getMapById } from "api/endpoints";
import classNames from "classnames";
import TileEdit from "./TileEdit";
import { Button, Loader, Switch } from "@mantine/core";
import { Tile, User } from "/types";
import { assets_url } from "config";
import { useParams } from "react-router-dom";

import "./styles.sass";

type Props = {
  user: User;
};

const MapEditor = ({ user }: Props) => {
  const [selectedTile, setSelectedTile] = useState<Tile>();
  const [multiSelect, setMultiSelect] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [multiSelectTiles, setMultiSelectTiles] = useState<number[]>([]);

  const { id: mapId } = useParams();

  const {
    data: mapData,
    refetch: refetchTiles,
    isFetching,
  } = useQuery(["getMapById", mapId], () => getMapById(mapId?.toString()));

  useEffect(() => {
    setSelectedTile(
      mapData?.tiles?.find((tile: Tile) => tile.id === selectedTile?.id)
    );
  }, [mapData?.tiles]);

  useEffect(() => {
    setMultiSelectTiles([]);
    setSelectedTile(undefined);
  }, [multiSelect]);

  const selectAllSprites = () => {
    const allTilesId = mapData?.tiles?.map((tile: Tile) => tile.id);

    setMultiSelectTiles(allTilesId);
  };

  const renderMap = useMemo(() => {
    let tiles = [];
    for (let i = 0; i < mapData?.tiles?.length; i++) {
      const tile = mapData?.tiles[i];
      tiles.push(
        <li
          key={tile.id}
          style={{
            backgroundImage: `url(${assets_url}/${tile.sprite})`,
            backgroundSize: "cover",
          }}
          className={classNames("map-editor__tile", {
            active:
              tile.id === selectedTile?.id ||
              multiSelectTiles.includes(tile.id),
          })}
          onClick={() => {
            if (multiSelect) {
              if (!multiSelectTiles.includes(tile.id)) {
                setMultiSelectTiles([...multiSelectTiles, tile.id]);
                return;
              } else {
                setMultiSelectTiles(
                  multiSelectTiles.filter((item) => item !== tile.id)
                );
                return;
              }
            }
            setSelectedTile(tile);
          }}
        >
          {tile.object && (
            <div className="map-editor__icon">
              <img
                style={{ width: 42, height: 42 }}
                src={`${assets_url}/${tile.object}`}
              />
            </div>
          )}
          {showIcons && (
            <>
              {tile.action_name === "MOB" && (
                <div className="map-editor__icon">
                  <img
                    style={{ width: 20, height: 20 }}
                    src="/media/explore/mob_attack.png"
                  />
                </div>
              )}
              {tile?.action?.mobSpawn?.drop?.length > 0 && (
                <div className="map-editor__icon">
                  <img
                    style={{ width: 12, height: 12, position: "absolute" }}
                    src="/media/explore/item_icon.png"
                  />
                </div>
              )}
              {tile.text.length > 2 && (
                <div className="map-editor__icon">
                  <img
                    style={{ height: 15 }}
                    src="/media/explore/beka-pytajnik.svg"
                  />
                </div>
              )}
              {tile.blocked && (
                <div className="map-editor__icon">
                  <img style={{ height: 10 }} src="/media/explore/lock.png" />
                </div>
              )}
            </>
          )}
        </li>
      );
    }
    return tiles;
  }, [
    mapData,
    user.x,
    user.y,
    selectedTile,
    multiSelectTiles,
    multiSelect,
    showIcons,
  ]);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="map-editor">
        <div className="map-editor__wrapper">
          <div className="map-editor__top-bar">
            <Switch
              label="Show Icons"
              style={{ marginTop: 10, marginLeft: 10 }}
              checked={showIcons}
              onChange={(event) => setShowIcons(event.currentTarget.checked)}
            />
            <Switch
              label="Multi Select"
              style={{ marginTop: 10 }}
              checked={multiSelect}
              onChange={(event) => setMultiSelect(event.currentTarget.checked)}
            />
            {multiSelect && (
              <>
                <Button compact onClick={() => selectAllSprites()}>
                  Select All
                </Button>
                <Button
                  color="green"
                  compact
                  onClick={() => setMultiSelectTiles([])}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
          <ul className="map-editor__tiles">{renderMap}</ul>
        </div>
        <TileEdit
          editTile={selectedTile}
          refetchTiles={refetchTiles}
          multiSelect={multiSelect}
          multiSelectTiles={multiSelectTiles}
          setMultiSelectTiles={setMultiSelectTiles}
        />
      </div>
    </>
  );
};

export default MapEditor;
