import { useEffect } from "react";
import { Progress } from "@mantine/core";
import BattleAnimations from "../BattleAnimations";
import useSound from "use-sound";
import damage from "./audio/damage.mp3";
import monsterBite from "./audio/monster-bite.mp3";
import bite from "./audio/bite.mp3";

type Props = {
  user: any;
  activeAnimation: string;
};

const BattleUsers = ({ user, activeAnimation }: Props) => {
  const [playDamage] = useSound(bite);

  // useEffect(() => {
  //   if (activeAnimation) {
  //     playDamage();
  //   }
  // }, [activeAnimation]);

  return (
    <div className="fight__player">
      <div className="fight__players-avatars">
        {activeAnimation && (
          <BattleAnimations activeAnimation={activeAnimation} />
        )}
        <img
          className="fight__player-img"
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
            classNames={{ root: "fight__player-bars" }}
            color="red"
            value={(user.hp / user.maxHp) * 100}
          />
          <Progress
            classNames={{ root: "fight__player-bars" }}
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
