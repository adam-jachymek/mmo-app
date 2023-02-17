import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { getMapById } from "api/endpoints";
import ExploreButtons from "./ExploreButtons";
import { Loader } from "@mantine/core";
import { User } from "/types";
import { assets_url } from "config";

import "./styles.sass";

type Props = {
  user: User;
};

const Explore = ({ user }: Props) => {
  const [activeTile, setActiveTile] = useState({
    text: "",
    sprite: "",
    id: 0,
    x: 0,
    y: 0,
    blocked: false,
  });

  const mapId = user.mapId;

  const { data: mapData, isFetching } = useQuery(["getMapById", mapId], () =>
    getMapById(mapId.toString())
  );

  const numberOfVisibleRows = 7;
  const numberOfVisibleColumns = 7;

  const renderMap = useMemo(() => {
    const calculateFirstVisibleTile = () => {
      const tileX = user.x - 3 < 0 ? 0 : user.x - 3;
      const tileY = user.y - 3 < 0 ? 0 : user.y - 3;
      const tileIndex = tileY * 20 + tileX;
      return tileIndex;
    };
    let tiles = [];
    if (user.x === undefined || user.y === undefined || !mapData) {
      return null;
    }
    for (let i = 0; i < numberOfVisibleColumns; i++) {
      for (let y = 0; y < numberOfVisibleRows; y++) {
        const tile = mapData?.tiles[calculateFirstVisibleTile() + y + i * 20];
        tiles.push(
          <li
            key={tile.id}
            style={{
              backgroundImage: `url(${assets_url}/${tile.sprite})`,
              backgroundSize: "cover",
            }}
            className="explore__tile"
          >
            {tile.object && (
              <div className="explore__icon">
                <img
                  style={{ width: 64, height: 64 }}
                  src={`${assets_url}/${tile.object}`}
                />
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
    }
    return tiles;
  }, [mapData, user.x, user.y]);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="explore">
        <div className="explore__screen">
          <ul className="explore__tiles">
            <div className="explore__protection"></div>
            {renderMap}
            {activeTile?.text?.length > 2 && (
              <div className="explore__text">
                <h2>{activeTile?.text}</h2>
              </div>
            )}
          </ul>
        </div>
        <div className="explore__body">
          <ExploreButtons user={user} />
        </div>
      </div>
    </>
  );
};

export default Explore;
