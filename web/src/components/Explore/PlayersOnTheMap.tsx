import Player from "./Player";
import { PlayerOnTheMap, User } from "/types";

type Props = {
  tileX: number;
  tileY: number;
  players?: PlayerOnTheMap[];
  user: User;
};

const PlayersOnTheMap = ({ tileX, tileY, players, user }: Props) => {
  if (!players) {
    return null;
  }

  return (
    <>
      {players?.map((player: PlayerOnTheMap) => (
        <Player
          key={player.id}
          player={player}
          userId={user.id}
          tileX={tileX}
          tileY={tileY}
        />
      ))}
    </>
  );
};

export default PlayersOnTheMap;
