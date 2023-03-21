import { Progress } from "@mantine/core";
import { Mob } from "/types";
import BattleAnimations from "../BattleAnimations";
import { assets_url } from "config";
import { motion } from "framer-motion";

type Props = {
  battle: any;
  mob: Mob;
  activeAnimation: string;
  userDamage: number;
};

const BattleMobs = ({ battle, mob, activeAnimation, userDamage }: Props) => {
  const mobAnimation = () => {
    if (battle.mobDamage) {
      return { rotate: [0, 10, 0] };
    }
    if (activeAnimation) {
      return { x: [0, 10, 0], opacity: [1, 0.5, 1] };
    }
    if (battle.youWin) {
      return { opacity: [1, 0] };
    }
    return {};
  };

  return (
    <motion.div
      animate={{
        y: [-100, 0],
      }}
      transition={{
        ease: "linear",
        duration: 1,
      }}
      className="fight__mob"
    >
      <div className="fight__mob-info">
        <div className="fight__user-damage">{userDamage}</div>
        <div className="fight__mob-info-text-display">
          <h2 className="fight__mob-info-text">{mob?.name}</h2>
          <h3 className="fight__mob-info-text">Level: {mob?.level}</h3>
          <p className="fight__mob-info-text-hp">
            HP: {mob?.hp < 1 ? 0 : mob?.hp} / {mob?.maxHp}
          </p>
          <Progress
            classNames={{
              root: "fight__mob-hp",
            }}
            color="red"
            value={(mob.hp / mob.maxHp) * 100}
          />
        </div>
      </div>

      <div className="fight__mob-sprite">
        {activeAnimation && (
          <BattleAnimations activeAnimation={activeAnimation} />
        )}
        <motion.img
          animate={mobAnimation()}
          transition={{
            ease: "linear",
            duration: 0.2,
            opacity: { duration: 1 },
          }}
          className="fight__mob-img"
          src={`${assets_url}/${mob?.sprite}`}
        />
      </div>
    </motion.div>
  );
};

export default BattleMobs;
