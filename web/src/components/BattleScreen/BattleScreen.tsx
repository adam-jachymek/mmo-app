import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "/types";
import { Modal, Button } from "@mantine/core";
import { socket } from "api/socket";

import { Progress } from "@mantine/core";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: any;
};

const BattleScreen = ({ currentUser, refetchUser }: Props) => {
  const { id: battleId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [fight, setFight] = useState(false);
  const [battle, setBattle] = useState<any>({});
  let navigate = useNavigate();

  useEffect(() => {
    battleId && socket.emit("joinBattle", battleId.toString());
  }, []);

  useEffect(() => {
    battleId &&
      socket.on(battleId.toString(), (response) => {
        console.log("Socket", response);
        setBattle(response);
      });
  });

  useEffect(() => {
    if (battle?.youWin) {
      setOpenModal(true);
      refetchUser();
    }

    if (battle?.youLost) {
      setLostModal(true);
      refetchUser();
    }
  }, [battle?.battleEnded, battle?.youLost, navigate, setOpenModal]);

  const fightHandle = () => {
    setFight(true);
  };

  const closeModal = () => {
    navigate(-1);
  };

  const closeLostModal = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="fight">
        {battle?.mobs?.map((mob: any) => (
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
                  size="lg"
                  value={(mob.hp / mob.maxHp) * 100}
                  // value={mobHpProgress()}
                />
              </div>
            </div>
            <div className="fight__mob-sprite">
              <img
                className="fight__mob-img"
                src={`/media/mobs/${mob?.sprite}.png`}
              />
            </div>
          </div>
        ))}
        {battle?.users?.map((user: any) => (
          <div className="fight__player">
            <div className="fight__player-sprite">
              <img
                className="fight__player-img"
                src={`/media/users/${user.avatar}.png`}
              />
            </div>
            <div className="fight__player-info">
              <div className="fight__player-info-display">
                <h2 className="fight__player-info-text">{user?.username}</h2>
                <h3 className="fight__player-info-text">
                  Level: {user?.level}
                </h3>
                <p className="fight__player-info-text">
                  HP: {user?.hp < 1 ? 0 : user?.hp} / {user?.maxHp}
                </p>
                <Progress
                  classNames={{ root: "fight__player-hp" }}
                  color="red"
                  value={(user.hp / user.maxHp) * 100}
                />
                <Progress
                  classNames={{ root: "fight__player-hp" }}
                  color="indigo"
                  value={(user.exp / user.maxExp) * 100}
                />

                <p className="fight__player-exp">
                  EXP: {user?.exp} / {user?.maxExp}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="fight__menu-display">
          {!fight && (
            <div className="fight__menu-1">
              <div className="fight__menu-text">
                {battle?.mobsInBattle?.map((mob: any) => (
                  <h2>Wild {mob?.mob?.name} appered!</h2>
                ))}
              </div>
              <div className="fight__button-chose">
                <button
                  className="fight__button-fight__fight"
                  onClick={fightHandle}
                >
                  FIGHT
                </button>
                <button
                  className="fight__button-fight__run"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  RUN
                </button>
              </div>
            </div>
          )}

          {fight && (
            <div className="fight__menu-2">
              {battle?.userTurn && battle?.activeUser === currentUser?.id && (
                <button
                  className="fight__button fight__attack"
                  onClick={() => {
                    socket.emit("userAttack", {
                      battleId: battleId,
                      userId: currentUser?.id,
                    });
                  }}
                >
                  ATTACK
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        centered
        opened={openModal}
        withCloseButton={false}
        onClose={closeModal}
      >
        {battle?.mobs?.map((mob: any) => (
          <div className="fight__modal">
            <h3 className="fight__modal-title">You Win!</h3>
            <p>You got: {mob?.giveExp} EXP</p>
            <Button
              onClick={closeModal}
              variant="outline"
              color="gray"
              size="md"
            >
              CLOSE
            </Button>
          </div>
        ))}
      </Modal>
      <Modal
        centered
        opened={lostModal}
        withCloseButton={false}
        onClose={closeLostModal}
      >
        <div className="fight__modal">
          <h3 className="fight__modal-title">You Lost!</h3>
          <p>You are dead</p>
          <Button
            onClick={closeLostModal}
            variant="outline"
            color="gray"
            size="md"
          >
            CLOSE
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BattleScreen;
