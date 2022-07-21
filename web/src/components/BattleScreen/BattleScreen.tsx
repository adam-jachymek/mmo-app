import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getSpawnMobById, attackMob } from "api/endpoints";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./styles.sass";
import { User } from "/types";

type Props = {
  currentUser: User;
};

const BattleScreen = ({ currentUser }: Props) => {
  const { id } = useParams();
  let navigate = useNavigate();

  const { data: mob, refetch: refetchMob } = useQuery(
    ["getSpawnedMob", id],
    () => getSpawnMobById(id)
  );

  const { mutate: attack } = useMutation(attackMob, {
    onSuccess: (response) => {
      refetchMob();
    },
  });

  useEffect(() => {
    if (mob?.hp < 1) {
      navigate(`/battle/`, { replace: true });
    }
  }, [mob?.hp, navigate]);

  return (
    <div className="fight">
      <div className="fight__mob">
        <h2>{mob?.mob.name}</h2>
        <h3>Level: {mob?.level}</h3>
        <p>HP: {mob?.hp}</p>
      </div>
      <div className="fight__player">
        <h2>{currentUser?.username}</h2>
        <h3>Level: {currentUser?.level}</h3>
        <p>HP: {currentUser?.hp}</p>
      </div>
      <div className="fight__menu">
        <button
          className="fight__button fight__attack"
          onClick={() => {
            attack(id);
          }}
        >
          ATTACK
        </button>
        <button
          className="fight__button fight__attack"
          onClick={() => {
            navigate(`/battle/`, { replace: true });
          }}
        >
          RUN
        </button>
      </div>
    </div>
  );
};

export default BattleScreen;
