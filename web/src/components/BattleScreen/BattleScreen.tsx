import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  getSpawnMobById,
  attackMob,
  createBattle,
  battleTurn,
  getBattle,
} from "api/endpoints";
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

type Battle = {
  mobId: number;
};

const BattleScreen = ({ currentUser, refetchUser }: Props) => {
  const { id: battleId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [fight, setFight] = useState(false);
  const [battle, setBattle] = useState<any>({});
  let navigate = useNavigate();

  const { data: mob, refetch: refetchMob } = useQuery(
    ["getBattle", battleId],
    () => getBattle(battleId)
  );

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

  const { mutate: startBattle } = useMutation(createBattle, {
    onSuccess: (response) => {},
  });

  const { mutate: attack } = useMutation(battleTurn, {
    onSuccess: (response) => {
      refetchMob();
    },
  });

  useEffect(() => {
    if (mob?.hp < 1) {
      setOpenModal(true);
      refetchUser();
    }

    if (currentUser?.hp < 1) {
      setLostModal(true);
    }
  }, [mob?.hp, navigate, setOpenModal]);

  const mobHpProgress = () => {
    return (battle.mob?.hp / battle.mob?.maxHp) * 100;
  };

  const playerHpProgress = () => {
    return (currentUser?.hp / currentUser?.maxHp) * 100;
  };

  const playerExpProgress = () => {
    return (currentUser?.exp / currentUser?.maxExp) * 100;
  };

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
        {battle.mobId}
        <div className="fight__mob">
          <div className="fight__mob-info">
            <div className="fight__mob-info-text-display">
              <h2 className="fight__mob-info-text">{battle.mob?.mob?.name}</h2>
              <h3 className="fight__mob-info-text">
                Level: {battle.mob?.level}
              </h3>
              <p className="fight__mob-info-text-hp">
                HP: {battle.mob?.hp < 1 ? 0 : battle.mob?.hp} /{" "}
                {battle.mob?.maxHp}
              </p>
              <Progress
                classNames={{
                  root: "fight__mob-hp",
                }}
                color="red"
                size="lg"
                value={mobHpProgress()}
              />
            </div>
          </div>
          <div className="fight__mob-sprite">
            <img
              className="fight__mob-img"
              src={`/media/mobs/${battle.mob?.sprite}.png`}
            />
          </div>
        </div>
        <div className="fight__player">
          <div className="fight__player-sprite">
            <img className="fight__player-img" src="/media/player/player.png" />
          </div>
          <div className="fight__player-info">
            <div className="fight__player-info-display">
              <h2 className="fight__player-info-text">
                {currentUser?.username}
              </h2>
              <h3 className="fight__player-info-text">
                Level: {currentUser?.level}
              </h3>
              <p className="fight__player-info-text">
                HP: {currentUser?.hp < 1 ? 0 : currentUser?.hp} /{" "}
                {currentUser?.maxHp}
              </p>
              <Progress
                classNames={{ root: "fight__player-hp" }}
                color="red"
                value={playerHpProgress()}
              />
              <Progress
                classNames={{ root: "fight__player-hp" }}
                color="indigo"
                value={playerExpProgress()}
              />

              <p className="fight__player-exp">
                EXP: {currentUser?.exp} / {currentUser?.maxExp}
              </p>
            </div>
          </div>
        </div>
        <div className="fight__menu-display">
          {!fight && (
            <div className="fight__menu-1">
              <div className="fight__menu-text">
                <h2>Wild {mob?.mob?.name} appered!</h2>
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
              <button
                className="fight__button fight__attack"
                onClick={() => {
                  attack(Number(battleId));
                  refetchUser();
                  socket.emit("turn", battleId?.toString());
                }}
              >
                ATTACK
              </button>
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
        <div className="fight__modal">
          <h3 className="fight__modal-title">You Win!</h3>
          <p>You got: {mob?.giveExp} EXP</p>
          <Button onClick={closeModal} variant="outline" color="gray" size="md">
            CLOSE
          </Button>
        </div>
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
