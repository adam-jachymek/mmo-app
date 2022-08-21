import { Progress } from "@mantine/core";
import { Mob } from "/types";

type Props = {
  mob: Mob;
};

const BattleMobs = ({ mob }: Props) => {
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
        <img
          className="fight__mob-img"
          src={`/media/mobs/${mob?.sprite}.png`}
        />
        <div>
          {" "}
          <img
            className="fight__mobs-img"
            src={`/media/mobs/${mob?.sprite}.png`}
          />
          <span>
            <Progress color="red" value={(mob.hp / mob.maxHp) * 100} />
          </span>
        </div>

        <div>
          <img
            className="fight__mobs-img"
            src={`/media/mobs/${mob?.sprite}.png`}
          />
          <span>
            <Progress color="red" value={(mob.hp / mob.maxHp) * 100} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BattleMobs;
