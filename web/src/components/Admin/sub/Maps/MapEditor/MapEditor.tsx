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
  const [clickedTile, setClickedTile] = useState<Tile>();
  const [multiSelect, setMultiSelect] = useState(false);
  const [multiSelectTiles, setMultiSelectTiles] = useState<number[]>([]);

  const { id: mapId } = useParams();

  const {
    data: mapData,
    refetch: refetchTiles,
    isFetching,
  } = useQuery(["getMapById", mapId], () => getMapById(mapId?.toString()));

  useEffect(() => {
    setClickedTile(
      mapData?.tiles?.find((tile: Tile) => tile.id === clickedTile?.id)
    );
  }, [mapData?.tiles]);

  useEffect(() => {
    setMultiSelectTiles([]);
    setClickedTile(undefined);
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
              tile.id === clickedTile?.id || multiSelectTiles.includes(tile.id),
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
            setClickedTile(tile);
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
          {tile.action_name === "MOB" && (
            <div className="map-editor__icon">
              <img
                style={{ width: 20, height: 20 }}
                src="/media/explore/mob_attack.png"
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
        </li>
      );
    }
    return tiles;
  }, [mapData, user.x, user.y, clickedTile, multiSelectTiles, multiSelect]);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="map-editor">
        <div className="map-editor__wrapper">
          <div className="map-editor__top-bar">
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
          editTile={clickedTile}
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
