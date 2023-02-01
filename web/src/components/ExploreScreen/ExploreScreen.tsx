import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getMapById } from "api/endpoints";
import ExploreButtons from "./ExploreButtons";
import TileEditModal from "./TileEditModal";
import { Loader } from "@mantine/core";

import "./styles.sass";
import { User } from "/types";

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
  const [clickedTile, setClickedTile] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);

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
          className="explore__tile"
          onClick={() => {
            setClickedTile(tile);
            setOpenEditModal(!openEditModal);
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
  }, [mapData, user.x, user.y]);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="explore" tabIndex={0}>
        <div className="explore__wrapper">
          <ul className="explore__tiles">
            {renderMap}
            {activeTile?.text?.length > 2 && (
              <div className="explore__text">
                <h2>{activeTile?.text}</h2>
              </div>
            )}
          </ul>
        </div>
        <ExploreButtons user={user} />
      </div>
      {clickedTile && (
        <TileEditModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          editTile={clickedTile}
          refetchTiles={refetchTiles}
        />
      )}
    </>
  );
};

export default ExploreScreen;
