import { Progress } from "@mantine/core";
import { Mob } from "/types";
import BattleAnimations from "../BattleAnimations";
import { assets_url } from "config";

type Props = {
  mob: Mob;
  activeAnimation: string;
  userDamage: number;
};

const BattleMobs = ({ mob, activeAnimation, userDamage }: Props) => {
  return (
    <div className="fight__mob">
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
        <img className="fight__mob-img" src={`${assets_url}/${mob?.sprite}`} />
      </div>
    </div>
  );
};

export default BattleMobs;
