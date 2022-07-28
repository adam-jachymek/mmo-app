import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getSpawnMobById, attackMob, createBattle } from "api/endpoints";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { User } from "/types";
import Modal from "@mui/material/Modal";

import { Box, Typography } from "@mui/material";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: any;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BattleScreen = ({ currentUser, refetchUser }: Props) => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [lostModal, setLostModal] = useState(false);
  const [battle, setBattle] = useState(false);
  let navigate = useNavigate();

  const { data: mob, refetch: refetchMob } = useQuery(
    ["getSpawnedMob", id],
    () => getSpawnMobById(id)
  );

  const { mutate: startBattle } = useMutation(createBattle, {
    onSuccess: (response) => {},
  });

  const { mutate: attack } = useMutation(attackMob, {
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
    return (mob?.hp / mob?.maxHp) * 100;
  };

  const playerHpProgress = () => {
    return (currentUser?.hp / currentUser?.maxHp) * 100;
  };

  const playerExpProgress = () => {
    return (currentUser?.exp / currentUser?.maxExp) * 100;
  };

  const fightHandle = () => {
    startBattle(mob?.id);
    setBattle(true);
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
        <div className="fight__mob">
          <div className="fight__mob-info">
            <h2>{mob?.mob?.name}</h2>
            <h3>Level: {mob?.level}</h3>
            <LinearProgress
              variant="determinate"
              value={mobHpProgress()}
              color="primary"
              className="fight__mob-hp"
            />
            <p>HP: {mob?.hp}</p>
          </div>
          <div className="fight__mob-sprite">
            <img
              className="fight__mob-img"
              src={`/media/mobs/${mob?.mob.sprite}.png`}
            />
          </div>
        </div>
        <div className="fight__player">
          <div className="fight__player-sprite">
            <img className="fight__player-img" src="/media/player/player.png" />
          </div>
          <div className="fight__player-info">
            <h2>{currentUser?.username}</h2>
            <h3>Level: {currentUser?.level}</h3>
            <LinearProgress
              variant="determinate"
              value={playerHpProgress()}
              color="primary"
              className="fight__player-hp"
            />
            <p>HP: {currentUser?.hp}</p>
            <LinearProgress
              variant="determinate"
              value={playerExpProgress()}
              color="secondary"
              className="fight__player-hp"
            />
            <p>
              {currentUser.exp} / {currentUser.maxExp}
            </p>
          </div>
        </div>
        {!battle && (
          <div className="fight__menu">
            <button
              className="fight__button fight__attack"
              onClick={fightHandle}
            >
              FIGHT
            </button>
            <button
              className="fight__button fight__attack"
              onClick={() => {
                navigate(-1);
              }}
            >
              RUN
            </button>
          </div>
        )}
        {battle && (
          <div className="fight__menu">
            <button
              className="fight__button fight__attack"
              onClick={() => {
                attack(id);
                refetchUser();
              }}
            >
              ATTACK
            </button>
          </div>
        )}
      </div>
      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You Win!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You got: {mob?.giveExp} EXP
          </Typography>
          <button onClick={closeModal}>CLOSE</button>
        </Box>
      </Modal>
      <Modal
        open={lostModal}
        onClose={closeLostModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You Lost!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You are dead
          </Typography>
          <button onClick={closeModal}>CLOSE</button>
        </Box>
      </Modal>
    </>
  );
};

export default BattleScreen;
