import { useMutation } from "react-query";
import { addLevelPoint } from "api/endpoints";

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
    <div className="player__stats">
      <p className="player__stats-text player__stats-text-points">
        <span>Skill Points:</span>
        <span>{currentUser?.points}</span>
      </p>
      <p className="player__stats-text">
        <span>Stamina:</span>
        <span className="player__stats_count">
          {currentUser?.stamina} ({currentUser?.eqStamina})
          {currentUser?.points > 0 && (
            <button
              onClick={() => {
                addPoint({ stamina: currentUser?.stamina + 1 });
              }}
            >
              +
            </button>
          )}
        </span>
      </p>
      <p className="player__stats-text">
        <span>Strength:</span>
        <span className="player__stats_count">
          {currentUser?.strength}
          {currentUser?.points > 0 && (
            <button
              onClick={() => {
                addPoint({ strength: currentUser?.strength + 1 });
              }}
            >
              +
            </button>
          )}
        </span>
      </p>
      <p className="player__stats-text">
        <span>Defence:</span>
        <span className="player__stats_count">
          {currentUser?.defence} ({currentUser?.eqDefence})
          {currentUser?.points > 0 && (
            <button
              onClick={() => {
                addPoint({ defence: currentUser?.defence + 1 });
              }}
            >
              +
            </button>
          )}
        </span>
      </p>
      <p className="player__stats-text">
        <span>Dexterity:</span>
        <span className="player__stats_count">
          {currentUser?.dexterity}
          {currentUser?.points > 0 && (
            <button
              onClick={() => {
                addPoint({ dexterity: currentUser?.dexterity + 1 });
              }}
            >
              +
            </button>
          )}
        </span>
      </p>
      <p className="player__stats-text">
        <span> Intelligence: </span>
        <span className="player__stats_count">
          {currentUser?.intelligence}
          {currentUser?.points > 0 && (
            <button
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
  );
};

export default CharacterStats;
