import { Progress } from "@mantine/core";

type Props = {
  user: any;
};

const BattleUsers = ({ user }: Props) => {
  return (
    <div className="fight__player">
      <div className="fight__players-avatars">
        <img
          className="fight__player-img"
          src={`/media/avatars/${user.avatar}.png`}
        />
        <img
          className="fight__players-img"
          src={`/media/avatars/${user.avatar}.png`}
        />
        <img
          className="fight__players-img"
          src={`/media/avatars/${user.avatar}.png`}
        />
      </div>
      <div className="fight__player-info">
        <div className="fight__player-info-display">
          <h2 className="fight__player-info-text">{user?.username}</h2>
          <h3 className="fight__player-info-text">Level: {user?.level}</h3>
          <p className="fight__player-info-text">
            HP: {user?.hp < 1 ? 0 : user?.hp} / {user?.maxHp}
          </p>
          <Progress
            classNames={{ root: "fight__player-hp" }}
            color="red"
            value={(user.hp / user.maxHp) * 100}
          />
          <Progress
            classNames={{ root: "fight__player-hp" }}
            color="indigo"
            value={(user.exp / user.maxExp) * 100}
          />

          <p className="fight__player-exp">
            EXP: {user?.exp} / {user?.maxExp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BattleUsers;
