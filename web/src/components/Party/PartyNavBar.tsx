import { Progress } from "@mantine/core";
import "./styles.sass";

const PartyNavBar = () => {
  const party = [
    { name: "Macray", level: 5, hp: 120, maxHp: 200, leader: false },
    { name: "Detro", level: 8, hp: 180, maxHp: 600, leader: true },
  ];

  return (
    <div className="party">
      <div className="party__display">
        <ul className="party__players-list">
          {party.map((player: any) => (
            <li className="party__player">
              <img
                className="party__players-avatar"
                src="/media/users/avatar1.png"
                alt=""
              />
              <div className="party__players-info">
                <div className="party__players-name">
                  <div>{player.name}</div>
                  {player.leader && (
                    <img
                      className="party__players-leader-img"
                      src="/media/users/CrownIcon.png"
                      alt=""
                    />
                  )}
                </div>
                <div>
                  {player.level}
                  <span className="party__players-level"> LVL</span>
                </div>
                <div>
                  <span className="party__players-hp">
                    HP {player.hp} / {player.maxHp}
                  </span>
                  <Progress
                    classNames={{
                      root: "party__progress-hp",
                    }}
                    color="red"
                    value={(player.hp / player.maxHp) * 100}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PartyNavBar;
