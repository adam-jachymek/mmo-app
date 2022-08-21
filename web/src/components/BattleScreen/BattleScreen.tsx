import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "/types";
import { Modal, Button } from "@mantine/core";
import { socket } from "api/socket";
import BattleMobs from "./BattleMobs";
import BattleUsers from "./BattleUsers";
import BattleMenu from "./BattleMenu";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: any;
};

const BattleScreen = ({ currentUser, refetchUser }: Props) => {
  const { id: battleId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
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
          <BattleMobs mob={mob} />
        ))}
        {battle?.users?.map((user: any) => (
          <BattleUsers user={user} />
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
