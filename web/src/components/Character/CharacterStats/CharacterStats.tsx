import { useMutation } from "react-query";
import { addLevelPoint } from "api/endpoints";

import "./styles.sass";

type Props = {
  currentUser: any;
  refetchUser: () => void;
};

const CharacterStats = ({ currentUser, refetchUser }: Props) => {
  const { mutate: addPoint } = useMutation(addLevelPoint, {
    onSuccess: (response) => {
      refetchUser();
    },
  });

  return (
    <div className="stats">
      <div className="stats__wrapper">
        <p className="stats__text stats__text-points">
          <span>Skill Points:</span>
          <span>{currentUser?.points}</span>
        </p>
        <p className="stats__text">
          <span>Stamina:</span>
          <span className="stats__count">
            {currentUser?.stamina} ({currentUser?.eqStamina})
            {currentUser?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ stamina: currentUser?.stamina + 1 });
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
            {currentUser?.strength}
            {currentUser?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ strength: currentUser?.strength + 1 });
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
            {currentUser?.defence} ({currentUser?.eqDefence})
            {currentUser?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ defence: currentUser?.defence + 1 });
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
            {currentUser?.dexterity}
            {currentUser?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ dexterity: currentUser?.dexterity + 1 });
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
            {currentUser?.intelligence}
            {currentUser?.points > 0 && (
              <button
                className="stats__add-button"
                onClick={() => {
                  addPoint({ intelligence: currentUser?.intelligence + 1 });
                }}
              >
                +
              </button>
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CharacterStats;
