import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { getMapById } from "api/endpoints";
import ExploreButtons from "./ExploreButtons";
import { Loader, Progress, RingProgress } from "@mantine/core";
import { User } from "/types";
import { assets_url } from "config";
import {
  calculateFirstVisibleTile,
  NUMBER_OF_TILES_IN_AXIS,
  NUMBER_OF_VISIBLE_TILES,
} from "./utils";

import "./styles.sass";

type Props = {
  user: User;
};

const Explore = ({ user }: Props) => {
  const mapId = user.mapId;

  const { data: mapData, isFetching } = useQuery(["getMapById", mapId], () =>
    getMapById(mapId.toString())
  );

  const ringHp = (user.hp / user.maxHp) * 100;

  console.log("ringHp", ringHp);

  const renderMap = useMemo(() => {
    let tiles = [];
    if (user.x === undefined || user.y === undefined || !mapData) {
      return null;
    }
    for (let i = 0; i < NUMBER_OF_VISIBLE_TILES; i++) {
      for (let y = 0; y < NUMBER_OF_VISIBLE_TILES; y++) {
        const tile =
          mapData?.tiles[
            calculateFirstVisibleTile(user) + y + i * NUMBER_OF_TILES_IN_AXIS
          ];
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
              <div className="explore__player">
                <div className="explore__username">{user.username}</div>
                <div className="explore__avatar-wrapper">
                  <RingProgress
                    sections={[
                      { value: (user.hp / user.maxHp) * 100, color: "red" },
                    ]}
                    rootColor="#373A40"
                    roundCaps={false}
                    style={{ position: "absolute", top: -4, left: -4 }}
                    size={58}
                    thickness={2}
                  />
                  <img
                    className="explore__avatar"
                    src={`/media/avatars/${user?.avatar}.png`}
                  />
                </div>
              </div>
            )}
          </li>
        );
      }
    }
    return tiles;
  }, [mapData, user]);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <div className="explore">
        <div className="explore__screen">
          <ul className="explore__tiles">
            {/* <div className="explore__protection"></div> */}
            {renderMap}
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
