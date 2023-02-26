import { useMutation } from "react-query";
import { addLevelPoint } from "api/endpoints";
import { User } from "types";
import { socket } from "api/socket";

import "./styles.sass";

type Props = {
  user: User;
  refetchUser: () => void;
};

const CharacterStats = ({ user, refetchUser }: Props) => {
  const { mutate: addPoint } = useMutation(addLevelPoint, {
    onSuccess: (response) => {
      socket.emit("updateUser", { userId: user.id });
    },
  });

  return (
    <div className="stats">
      <div className="stats__wrapper">
        <p className="stats__text stats__text-points">
          <span>Skill Points:</span>
          <span>{user?.points}</span>
        </p>
        <p className="stats__text">
          <span>Stamina:</span>
          <span className="stats__count">
            {user?.stamina}
            {user?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ stamina: 1 });
                }}
              >
                +
              </button>
            )}
          </span>
        </p>
        <p className="stats__text">
          <span>Strength:</span>
          <span className="stats__count">
            {user?.strength}
            {user?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ strength: 1 });
                }}
              >
                +
              </button>
            )}
          </span>
        </p>
        <p className="stats__text">
          <span>Defence:</span>
          <span className="stats__count">
            {user?.defence}
            {user?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ defence: user?.defence + 1 });
                }}
              >
                +
              </button>
            )}
          </span>
        </p>
        <p className="stats__text">
          <span>Dexterity:</span>
          <span className="stats__count">
            {user?.dexterity}
            {user?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ dexterity: user?.dexterity + 1 });
                }}
              >
                +
              </button>
            )}
          </span>
        </p>
        <p className="stats__text">
          <span> Intelligence: </span>
          <span className="stats__count">
            {user?.intelligence}
            {user?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ intelligence: user?.intelligence + 1 });
                }}
              >
                +
              </button>
            )}
          </span>
        </p>
        <p className="stats__text"></p>
        <p className="stats__text">
          Attack:{" "}
          <span className="stats__count">
            {user.minAttack} - {user.maxAttack}
          </span>
        </p>
        <p className="stats__text">
          Armor: <span className="stats__count">{user.defence}</span>
        </p>
      </div>
    </div>
  );
};

export default CharacterStats;
