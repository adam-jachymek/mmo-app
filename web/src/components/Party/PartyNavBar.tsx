import { Progress } from "@mantine/core";
import "./styles.sass";

const PartyNavBar = () => {
  const party = [
    { name: "Macray", level: 5, hp: 120, maxHp: 200, leader: false },
    { name: "Detro", level: 8, hp: 180, maxHp: 600, leader: true },
  ];

  return (
    <div className="Party">
      <div className="Party__display">
        {party.map((player) => (
          <div className="Party__players-info">
            <div>
              <img
                className="Party__players-avatar"
                src="/media/users/avatar1.png"
                alt=""
              />
            </div>
            <ul className="Party__players-list">
              <li>
                {player.leader ? (
                  <div className="Party__players-leader">
                    <p>You are Leader</p>
                    <img src="/media/users/CrownIcon.png" alt="" />
                  </div>
                ) : null}
              </li>
              <li>{player.name}</li>
              <li>Level {player.level}</li>
              <li>
                HP {player.hp} / {player.maxHp}
                <span>
                  {" "}
                  <Progress
                    classNames={{
                      root: "Party__progress-hp",
                    }}
                    color="red"
                    value={(player.hp / player.maxHp) * 100}
                  />
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyNavBar;
