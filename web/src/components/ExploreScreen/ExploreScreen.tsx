import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { editTileById, getExplore, getMapById } from "api/endpoints";
import { useNavigate } from "react-router-dom";
import { AiOutlineQuestion } from "react-icons/ai";
import ExploreButtons from "./ExploreButtons";
import { useState, useEffect, useMemo } from "react";
import TileEditModal from "./TileEditModal";

import "./styles.sass";

const ExploreScreen = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [activeTile, setActiveTile] = useState({
    text: "",
    sprite: "",
    id: 0,
    x: 0,
    y: 0,
  });
  const [clickedTile, setClickedTile] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);

  const [user, setUser] = useState({
    name: "Detro",
    avatar: "/media/avatars/male.png",
    mapId: 1,
    x: 0,
    y: 0,
  });

  const mapId = 1;

  const { data: mapData, refetch: refetchTiles } = useQuery(
    ["getMapById", mapId],
    () => getMapById(mapId.toString())
  );

  useEffect(() => {
    setActiveTile(
      mapData?.tiles?.find(
        (tile: any) => tile.x === user.x && tile.y === user.y
      )
    );
  }, [user]);

  const renderMap = useMemo(() => {
    let tiles = [];
    for (let i = 0; i < mapData?.tiles?.length; i++) {
      tiles.push(
        <li
          style={{
            backgroundImage: `url(${mapData?.tiles[i]?.sprite})`,
            backgroundSize: "cover",
          }}
          className="explore__tile"
          onClick={() => {
            setClickedTile(mapData?.tiles[i]);
            setOpenEditModal(!openEditModal);
          }}
        >
          {mapData?.tiles[i].x === user.x && mapData?.tiles[i].y === user.y && (
            <img className="explore__avatar" src={user.avatar} />
          )}
          {mapData?.tiles[i].text.length > 2 && (
            <div className="explore__icon">
              <img
                style={{ height: 35 }}
                src="/media/explore/beka-pytajnik.svg"
              />
            </div>
          )}
        </li>
      );
    }
    return tiles;
  }, [mapData, user]);

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "ArrowUp") {
      setUser({
        ...user,
        y: user.y - 1,
      });
    }

    if (event.code === "ArrowDown") {
      setUser({
        ...user,
        y: user.y + 1,
      });
    }

    if (event.code === "ArrowLeft") {
      setUser({
        ...user,
        x: user.x - 1,
      });
    }

    if (event.code === "ArrowRight") {
      setUser({
        ...user,
        x: user.x + 1,
      });
    }
  };

  return (
    <>
      <div className="explore" tabIndex={0} onKeyDown={keyDownHandler}>
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
        <ExploreButtons user={user} setUser={setUser} />
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
