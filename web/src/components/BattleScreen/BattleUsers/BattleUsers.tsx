import { useEffect } from "react";
import { Progress } from "@mantine/core";
import BattleAnimations from "../BattleAnimations";
import useSound from "use-sound";
import damage from "./audio/damage.mp3";
import monsterBite from "./audio/monster-bite.mp3";
import bite from "./audio/bite.mp3";
import { motion } from "framer-motion";

type Props = {
  battle: any;
  user: any;
  activeAnimation: string;
  mobDamage: number;
};

const BattleUsers = ({ battle, user, activeAnimation, mobDamage }: Props) => {
  const [playDamage] = useSound(bite);

  const userAnimation = () => {
    if (battle.userDamage) {
      return { y: [0, -10, 0] };
    }
    if (activeAnimation) {
      return { x: [0, 10, 0], opacity: [1, 0.5, 1] };
    }
    if (battle.youLost) {
      return { opacity: [1, 0] };
    }
    return {};
  };

  return (
    <motion.div
      animate={{
        y: [100, 0],
        scale: 1,
        rotate: 0,
      }}
      transition={{
        ease: "linear",
        duration: 1,
      }}
      className="fight__player"
    >
      <div className="fight__players-avatars">
        {activeAnimation && (
          <BattleAnimations activeAnimation={activeAnimation} />
        )}
        <motion.img
          animate={userAnimation()}
          transition={{
            ease: "linear",
            duration: 0.2,
            opacity: { duration: 1 },
          }}
          className="fight__player-img"
          src={`/media/avatars/${user.avatar}.png`}
        />
      </div>
      <div className="fight__player-info">
        <div className="fight__mob-damage">{mobDamage}</div>
        <div className="fight__player-info-display">
          <h2 className="fight__player-info-text">{user?.username}</h2>
          <h3 className="fight__player-info-text">Level: {user?.level}</h3>
          <p className="fight__player-info-hp">
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
    </motion.div>
  );
};

export default BattleUsers;
