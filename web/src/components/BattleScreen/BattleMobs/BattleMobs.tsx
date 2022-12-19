import { useEffect } from "react";
import { Progress } from "@mantine/core";
import { Mob } from "/types";
import BattleAnimations from "../BattleAnimations";
import useSound from "use-sound";
import attackMob from "./audio/attack_mob.mp3";
import fireball from "./audio/fireball.mp3";

type Props = {
  mob: Mob;
  activeAnimation: string;
};

const BattleMobs = ({ mob, activeAnimation }: Props) => {
  const [attackSound] = useSound(attackMob);

  // useEffect(() => {
  //   if (activeAnimation) {
  //     attackSound();
  //   }
  // }, [activeAnimation]);

  return (
    <div className="fight__mob">
      <div className="fight__mob-info">
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
        <img
          className="fight__mob-img"
          src={`/media/mobs/${mob?.sprite}.png`}
        />
      </div>
    </div>
  );
};

export default BattleMobs;
