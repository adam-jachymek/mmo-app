import { Progress, RingProgress } from "@mantine/core";

type Props = {
  player: {
    id: number;
    username: string;
    avatar: string;
    level: number;
    hp: number;
    maxHp: number;
    battleId: number | null;
    x: number;
    y: number;
  };
  userId: number;
  tileX: number;
  tileY: number;
};

const Player = ({ player, userId, tileX, tileY }: Props) => {
  if (player.id !== userId) {
    if (tileX === player?.x && tileY === player?.y) {
      return (
        <div key={player.id} className="explore__player">
          <div className="explore__username">{player?.username}</div>
          <Progress
            classNames={{ root: "explore__player-hp" }}
            color="red"
            animate
            radius="xs"
            size="sm"
            value={(player.hp / player.maxHp) * 100}
          />
          <div className="player__avatar-wrapper">
            {player.battleId && (
              <img
                style={{
                  width: 30,
                  height: 30,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
                src="/media/explore/mob_attack.png"
              />
            )}
            <img
              className="explore__avatar"
              src={`/media/avatars/${player?.avatar}.png`}
            />
            <div className="explore__level-player">{player?.level}</div>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default Player;
