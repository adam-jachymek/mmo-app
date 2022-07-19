import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getSpawnMobById, attackMob } from "api/endpoints";

const BattleScreen = () => {
  const { id } = useParams();

  const { data: mob, refetch: refetchMob } = useQuery(
    ["getSpawnedMob", id],
    () => getSpawnMobById(id)
  );

  const { mutate: attack } = useMutation(attackMob, {
    onSuccess: (response) => {
      refetchMob();
    },
  });

  console.log("spawned", mob);

  return (
    <div>
      <div>
        <h2>{mob?.mob.name}</h2>
        <h2>Level: {mob?.level}</h2>
        <p>HP: {mob?.hp}</p>
      </div>
      <div>
        <button
          onClick={() => {
            attack(id);
          }}
        >
          ATTACK
        </button>
      </div>
    </div>
  );
};

export default BattleScreen;
