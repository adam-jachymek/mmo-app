import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { getMapById } from "api/endpoints";
import { Loader, Progress } from "@mantine/core";
import { PlayerOnTheMap, User } from "/types";
import { assets_url } from "config";
import {
  calculateFirstVisibleTile,
  NUMBER_OF_TILES_IN_AXIS,
  NUMBER_OF_VISIBLE_TILES,
} from "./utils";
import { socket } from "api/socket";
import ExploreButtons from "./ExploreButtons";
import PlayersOnTheMap from "./PlayersOnTheMap";
import TextDisplay from "./TextDisplay";

import "./styles.sass";

type Props = {
  user: User;
};

const Explore = ({ user }: Props) => {
  const [players, setPlayers] = useState<PlayerOnTheMap[]>();
  const [showText, setShowText] = useState(false);

  const mapId = user.mapId;

  const { data: mapData, isFetching } = useQuery(
    ["getMapById", mapId],
    () => getMapById(mapId.toString()),
    {
      enabled: Boolean(mapId),
    }
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
      socket.on(`map-${mapId}`, (playersOnTheMap: PlayerOnTheMap[]) => {
        setPlayers(playersOnTheMap);
      });
  }, [mapId, socket]);

  const npc = {
    name: "John",
    avatar: `/media/avatars/npc.jpg`,
    text: [
      "Hi! I'm John.",
      "I'm first test NPC in the game.",
      "Nice to meet you!",
    ],
  };

  const showJonhText = () => {
    if ((user.x === 7 && user.y === 3) || (user.x === 6 && user.y === 2)) {
      setShowText(true);
    }
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
                  alt="icon"
                  style={{ width: 80, height: 80 }}
                  src={`${assets_url}/${tile.object}`}
                />
              </div>
            )}
            <PlayersOnTheMap
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
                    radius="xs"
                    size="sm"
                    value={(user.hp / user.maxHp) * 100}
                  />
                  <img
                    alt="avatar"
                    className="explore__avatar"
                    src={`/media/avatars/${user?.avatar}.png`}
                  />
                  <div className="explore__level">{user?.level}</div>
                </div>
              </div>
            )}
            {tile.x === 7 && tile.y === 2 && (
              <div className="explore__player">
                <div className="explore__username">{npc.name}</div>
                <div className="explore__avatar-wrapper">
                  <img
                    className="explore__avatar"
                    src={npc.avatar}
                    alt="avatar"
                  />
                </div>
              </div>
            )}
            {tile.layer2 && (
              <div className="explore__icon">
                <img
                  alt="icon"
                  style={{ width: 80, height: 80 }}
                  src={`${assets_url}/${tile.layer2}`}
                />
              </div>
            )}
            {tile.layer3 && (
              <div className="explore__icon">
                <img
                  alt="icon"
                  style={{ width: 80, height: 80 }}
                  src={`${assets_url}/${tile.layer3}`}
                />
              </div>
            )}
          </li>
        );
      }
    }
    return tiles;
  }, [user, mapData, players, npc.name, npc.avatar]);

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className="explore">
      <div className="explore__screen">
        <ul className="explore__tiles">
          <div className="explore__protection"></div>
          {renderMap}
        </ul>
      </div>
      {showText ? (
        <TextDisplay text={npc.text} delay={30} setShowText={setShowText} />
      ) : (
        <div className="explore__body">
          <ExploreButtons user={user} showJonhText={showJonhText} />
        </div>
      )}
    </div>
  );
};

export default Explore;
