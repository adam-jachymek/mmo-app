import { useMutation } from "react-query";
import { addLevelPoint } from "api/endpoints";
import { User } from "/types";

import "./styles.sass";

type Props = {
  user: User;
  refetchUser: () => void;
};

const CharacterStats = ({ user, refetchUser }: Props) => {
  const { mutate: addPoint } = useMutation(addLevelPoint, {
    onSuccess: (response) => {
      refetchUser();
    },
  });

  const attack = () => {
    const weapon = { min: 7, max: 17 };

    const strength = 60;

    const halfbaseAttack = 60 + weapon.min;
    const baseAttack = 120 + weapon.max;

    return {
      min: Math.floor((halfbaseAttack * strength) / 100 + halfbaseAttack),
      max: Math.floor((baseAttack * strength) / 100 + baseAttack),
    };
  };

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
                  addPoint({ stamina: user?.stamina + 1 });
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
                  addPoint({ strength: user?.strength + 1 });
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
            {attack().min} - {attack().max}
          </span>
        </p>
        <p className="stats__text">
          Armor:{" "}
          <span className="stats__count">
            {Math.floor(120 + (120 * user.defence) / 100 / 2)} -{" "}
            {Math.floor(120 + (120 * user.defence) / 100)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CharacterStats;
