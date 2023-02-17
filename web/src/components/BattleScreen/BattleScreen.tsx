import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "/types";
import { Modal, Button } from "@mantine/core";
import { socket } from "api/socket";
import BattleMobs from "./BattleMobs";
import BattleUsers from "./BattleUsers";
import BattleMenu from "./BattleMenu";
import useSound from "use-sound";
import battleMusic from "./audio/battlemusic.mp3";
import youwin from "./audio/youwin.mp3";
import wasted from "./audio/wasted.mp3";
import useSounds from "../../hooks/useSounds";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: () => void;
  propsBattleId?: number;
};

const BattleScreen = ({ currentUser, refetchUser, propsBattleId }: Props) => {
  let navigate = useNavigate();
  const { id: paramsBattleId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [battle, setBattle] = useState<any>({});
  const [music, { stop: stopMusic }] = useSound(battleMusic);
  const [playWin] = useSound(youwin);
  const [playWasted] = useSound(wasted);

  useEffect(() => {
    music();
    return () => stopMusic();
  }, [music]);

  const battleId = Number(paramsBattleId) || propsBattleId;

  useEffect(() => {
    battleId && socket.emit("joinBattle", battleId.toString());
  }, [battleId]);

  useEffect(() => {
    battleId &&
      socket.on(battleId.toString(), (response) => {
        setBattle(response);
      });
  }, [battleId, socket]);

  useEffect(() => {
    if (battle?.youWin) {
      setOpenModal(true);
      playWin();
      socket.emit("updateUser", { userId: currentUser.id });
    }

    if (battle?.youLost) {
      setLostModal(true);
      playWasted();
      socket.emit("updateUser", { userId: currentUser.id });
    }
  }, [battle?.battleEnded, battle?.youLost, navigate, setOpenModal]);

  const closeModal = () => {
    socket.emit("endBattle", { battleId: battleId, userId: currentUser.id });
  };

  useSounds(battle.mobAnimation || battle.playerAnimation);

  return (
    <>
      <div className="fight">
        {battle?.mobs?.map((mob: any) => (
          <BattleMobs mob={mob} activeAnimation={battle.mobAnimation} />
        ))}
        {battle?.users?.map((user: any) => (
          <BattleUsers user={user} activeAnimation={battle.playerAnimation} />
        ))}
        <div className="fight__menu-display">
          <BattleMenu
            battle={battle}
            socket={socket}
            battleId={battleId}
            currentUser={currentUser}
          />
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
              color="green"
              size="md"
              style={{ marginTop: 10 }}
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
        onClose={closeModal}
      >
        <div className="fight__modal">
          <h3 className="fight__modal-title">You Lost!</h3>
          <p>You are dead</p>
          <Button
            style={{ marginTop: 10 }}
            onClick={closeModal}
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
