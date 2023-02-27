import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

import { getItems } from "api/endpoints";
import { useQuery } from "react-query";
import { assets_url } from "config";

import { isEmpty } from "lodash";
import ItemModal from "../ItemModal";

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
  const [itemModal, setItemModal] = useState({ isVisible: false, item: {} });
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

  const { data: itemsData, refetch: refetchItems } = useQuery(
    ["getItemsToDrop", battle?.itemDropIds],
    getItems
  );

  const dropItems = useMemo(() => {
    return battle?.itemDropIds?.map((id: number) =>
      itemsData?.find((item: any) => item.id === id)
    );
  }, [battle?.itemDropIds, itemsData]);

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

  const handleCloseItemModal = () => {
    setItemModal({ ...itemModal, isVisible: false });
  };

  return (
    <>
      <div className="fight">
        {battle?.mobs?.map((mob: any) => (
          <BattleMobs
            mob={mob}
            activeAnimation={battle.mobAnimation}
            userDamage={battle.userDamage}
          />
        ))}
        {battle?.users?.map((user: any) => (
          <BattleUsers
            user={user}
            activeAnimation={battle.playerAnimation}
            mobDamage={battle.mobDamage}
          />
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
            <p style={{ marginTop: 10 }}>You got: {mob?.giveExp} EXP</p>
            {!isEmpty(dropItems) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                {dropItems?.map((item: any) => (
                  <div
                    onClick={() =>
                      setItemModal({ isVisible: true, item: item })
                    }
                  >
                    <img
                      src={`${assets_url}/${item?.item?.sprite}`}
                      className="inventory__bag-icon"
                      style={{ height: 64, width: 64 }}
                    />
                  </div>
                ))}
              </div>
            )}
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
      {itemModal.isVisible && (
        <ItemModal
          handleCloseModal={handleCloseItemModal}
          isVisible={itemModal.isVisible}
          item={itemModal.item}
          refetchItems={refetchItems}
        />
      )}
    </>
  );
};

export default BattleScreen;
