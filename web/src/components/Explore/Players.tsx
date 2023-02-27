import { RingProgress } from "@mantine/core";
import Player from "./Player";
import { User } from "/types";

type Props = {
  tileX: number;
  tileY: number;
  players?: [
    {
      id: number;
      username: string;
      avatar: string;
      level: number;
      hp: number;
      maxHp: number;
      battleId: number | null;
      x: number;
      y: number;
    }
  ];
  user: User;
};

const Players = ({ tileX, tileY, players, user }: Props) => {
  if (!players) {
    return null;
  }

  return (
    <>
      {players?.map((player) => (
        <Player player={player} userId={user.id} tileX={tileX} tileY={tileY} />
      ))}
    </>
  );
};

export default Players;
