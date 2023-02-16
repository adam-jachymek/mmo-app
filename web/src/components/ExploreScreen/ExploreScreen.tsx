import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getMapById } from "api/endpoints";
import classNames from "classnames";
import ExploreButtons from "./ExploreButtons";
import TileEdit from "./TileEdit";
import { Button, Loader, Switch } from "@mantine/core";
import { Tile, User } from "/types";

import "./styles.sass";

type Props = {
  user: User;
};

const ExploreScreen = ({ user }: Props) => {
  const [activeTile, setActiveTile] = useState({
    text: "",
    sprite: "",
    id: 0,
    x: 0,
    y: 0,
    blocked: false,
  });
  const [clickedTile, setClickedTile] = useState<Tile>();
  const [multiSelect, setMultiSelect] = useState(false);
  const [multiSelectTiles, setMultiSelectTiles] = useState<number[]>([]);

  const mapId = user.mapId;

  const {
    data: mapData,
    refetch: refetchTiles,
    isFetching,
  } = useQuery(["getMapById", mapId], () => getMapById(mapId.toString()));

  useEffect(() => {
    setActiveTile(
      mapData?.tiles?.find(
        (tile: any) => tile.x === user.x && tile.y === user.y
      )
    );
  }, [user.x, user.y]);

  useEffect(() => {
    setMultiSelectTiles([]);
    setClickedTile(undefined);
  }, [multiSelect]);

  const renderMap = useMemo(() => {
    let tiles = [];
    for (let i = 0; i < mapData?.tiles?.length; i++) {
      const tile = mapData?.tiles[i];
      tiles.push(
        <li
          key={tile.id}
          style={{
            backgroundImage: `url(${tile.sprite})`,
            backgroundSize: "cover",
          }}
          className={classNames("explore__tile", {
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
          {tile.text.length > 2 && (
            <div className="explore__icon">
              <img
                style={{ height: 35 }}
                src="/media/explore/beka-pytajnik.svg"
              />
            </div>
          )}
          {tile.blocked && (
            <div className="explore__icon">
              <img style={{ height: 20 }} src="/media/explore/lock.png" />
            </div>
          )}
          {tile.x === user.x && tile.y === user.y && (
            <div>
              <div className="explore__username">{user.username}</div>
              <img
                className="explore__avatar"
                src={`/media/avatars/${user?.avatar}.png`}
              />
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
      <div className="explore" tabIndex={0}>
        <div className="explore__wrapper">
          <div className="explore__top-bar">
            <Switch
              label="Multi Select"
              style={{ marginTop: 10 }}
              checked={multiSelect}
              onChange={(event) => setMultiSelect(event.currentTarget.checked)}
            />
            {multiSelect && (
              <Button compact onClick={() => setMultiSelectTiles([])}>
                Clear
              </Button>
            )}
          </div>
          <ul className="explore__tiles">
            {renderMap}
            {activeTile?.text?.length > 2 && (
              <div className="explore__text">
                <h2>{activeTile?.text}</h2>
              </div>
            )}
          </ul>
          <ExploreButtons user={user} />
        </div>
        <TileEdit
          editTile={clickedTile}
          refetchTiles={refetchTiles}
          multiSelect={multiSelect}
          multiSelectTiles={multiSelectTiles}
        />
      </div>
    </>
  );
};

export default ExploreScreen;
