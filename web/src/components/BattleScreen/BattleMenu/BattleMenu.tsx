import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "/types";

type Props = {
  battle: any;
  socket: any;
  battleId?: number;
  currentUser: User;
};

const BattleMenu = ({ battle, socket, battleId, currentUser }: Props) => {
  const [showFightMenu, setShowFightMenu] = useState(false);
  let navigate = useNavigate();

  const userAttack = (animationName: string) => {
    socket.emit("userAttack", {
      battleId: battleId,
      userId: currentUser?.id,
      mobAnimation: animationName,
    });
  };

  const endBattle = () => {
    socket.emit("endBattle", { battleId: battleId, userId: currentUser.id });
  };

  if (showFightMenu) {
    return (
      <div className="fight__menu-2">
        {battle?.userTurn && battle?.activeUser === currentUser?.id && (
          <>
            <button
              className="fight__button fight__attack"
              onClick={() => {
                userAttack("sword");
              }}
            >
              WEAPON
            </button>

            <button
              className="fight__button fight__attack"
              onClick={() => {
                userAttack("fireball");
              }}
            >
              FIREBALL
            </button>

            <button className="fight__button-fight__run" onClick={endBattle}>
              RUN
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="fight__menu-1">
      <div className="fight__menu-text">
        {battle?.mobsInBattle?.map((mob: any) => (
          <h2>Wild {mob?.mob?.name} appered!</h2>
        ))}
      </div>
      <div className="fight__button-chose">
        <button
          className="fight__button-fight__fight"
          onClick={() => {
            setShowFightMenu(true);
          }}
        >
          FIGHT
        </button>
        <button className="fight__button-fight__run" onClick={endBattle}>
          RUN
        </button>
      </div>
    </div>
  );
};

export default BattleMenu;
