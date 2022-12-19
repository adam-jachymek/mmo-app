import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getExplore } from "api/endpoints";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { isEqual } from "lodash";

import "./styles.sass";

const ExploreScreen = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Detro",
    avatar: "/media/avatars/male.png",
    position: { x: 1, y: 1 },
  });

  const [text, setText] = useState("");

  console.log("user", user);

  // const { data: exploreData, refetch: refetchExplore } = useQuery(
  //   ["getExplore", id],
  //   () => getExplore(id)
  // );

  // useEffect(() => {
  //   if (exploreData?.mobId) {
  //     navigate(`/battle/${exploreData.id}`);
  //   }
  // }, [exploreData]);

  const map = {
    numeberofTiles: 60,
    tiles: [
      {
        id: 1,
        name: "house",
        sprite: "/media/maps/grass.jpg",
        blocked: false,
        position: { x: 1, y: 1 },
        boss: "sdad",
      },
      {
        id: 2,
        name: "road",
        sprite: "/media/maps/grass.jpg",
        blocked: false,
        position: { x: 2, y: 1 },
      },
      {
        id: 3,
        name: "road",
        sprite: "/media/maps/grass.jpg",
        blocked: false,
        position: { x: 3, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 4, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 5, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 6, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 7, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 8, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 9, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 10, y: 1 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 1, y: 2 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 2, y: 2 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 3, y: 2 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 4, y: 2 },
      },
      {
        id: 3,
        name: "road",
        blocked: false,
        position: { x: 5, y: 2 },
      },
    ],
  };

  const renderMap = () => {
    let items = [];
    for (let i = 0; i < map.numeberofTiles; i++) {
      items.push(
        <li
          style={{
            backgroundImage: `url(${map.tiles[i]?.sprite})`,
            backgroundSize: "cover",
          }}
          className="explore__tile"
        >
          {isEqual(map.tiles[i]?.position, user.position) && (
            <img className="explore__avatar" src={user.avatar} />
          )}
        </li>
      );
    }
    return items;
  };

  return (
    <div className="explore">
      <div className="explore__wrapper">
        <ul className="explore__tiles">{renderMap()}</ul>
      </div>
      <button
        onClick={() => {
          setUser({
            ...user,
            position: { x: user.position.x - 1, y: user.position.y },
          });
        }}
      >
        left
      </button>
      <button
        onClick={() => {
          setUser({
            ...user,
            position: { x: user.position.x + 1, y: user.position.y },
          });
        }}
      >
        right
      </button>
      <button
        onClick={() => {
          setUser({
            ...user,
            position: { x: user.position.x, y: user.position.y + 1 },
          });
        }}
      >
        down
      </button>
      <button
        onClick={() => {
          setUser({
            ...user,
            position: { x: user.position.x, y: user.position.y - 1 },
          });
        }}
      >
        up
      </button>
    </div>
  );
};

export default ExploreScreen;
