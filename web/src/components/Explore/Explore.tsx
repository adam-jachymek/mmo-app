import { useState, useMemo, useEffect } from "react";
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
import { socket } from "api/socket";

import "./styles.sass";
import { isEmpty } from "lodash";
import Player from "./Players";
import Players from "./Players";

type Props = {
  user: User;
};

const Explore = ({ user }: Props) => {
  const [players, setPlayers] = useState<
    [
      {
        id: number;
        username: string;
        avatar: string;
        hp: number;
        maxHp: number;
        battleId: number | null;
        x: number;
        y: number;
      }
    ]
  >();

  const mapId = user.mapId;

  const { data: mapData, isFetching } = useQuery(["getMapById", mapId], () =>
    getMapById(mapId.toString())
  );

  useEffect(() => {
    mapId &&
      socket.emit("connectExplore", {
        mapId: mapId.toString(),
        userId: user.id,
      });
  }, [mapId, user.id]);

  useEffect(() => {
    mapId &&
      socket.on(`map-${mapId}`, (response: any) => {
        setPlayers(response);
      });
  }, [mapId, socket]);

  const player = (tileX: number, tileY: number) => {
    players?.map((player) => {
      if (player.id !== user.id) {
        if (tileX === player?.x && tileY === player?.y) {
          console.log("render", player);
          return (
            <div className="explore__player">
              <div className="explore__username">{player?.username}</div>
              <div className="player__avatar-wrapper">
                <RingProgress
                  sections={[
                    {
                      value: (player?.hp / player?.maxHp) * 100,
                      color: "red",
                    },
                  ]}
                  rootColor="#373A40"
                  roundCaps={false}
                  style={{ position: "absolute", top: -4, left: -4 }}
                  size={58}
                  thickness={2}
                />
                <img
                  className="explore__avatar"
                  src={`/media/avatars/${player?.avatar}.png`}
                />
              </div>
            </div>
          );
        }
      }
    });
  };

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
            <Players
              tileX={tile.x}
              tileY={tile.y}
              players={players}
              user={user}
            />
            {tile.x === user.x && tile.y === user.y && (
              <div className="explore__player">
                <div className="explore__username">{user.username}</div>
                <div className="explore__avatar-wrapper">
                  <Progress
                    classNames={{ root: "explore__player-hp" }}
                    color="red"
                    animate
                    radius="xs"
                    size="sm"
                    value={(user.hp / user.maxHp) * 100}
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
  }, [mapData, user, players, player]);

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
          </ul>
        </div>
        <div className="explore__body">
          <ExploreButtons user={user} mapId={mapId} />
        </div>
      </div>
    </>
  );
};

export default Explore;
