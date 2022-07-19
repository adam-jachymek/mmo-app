import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getSpawnMobById } from "api/endpoints";

const BattleScreen = () => {
  const { id } = useParams();

  const { data: mob, refetch: refetchMobs } = useQuery(["getMobs", id], () =>
    getSpawnMobById(id)
  );

  console.log("spawned", mob);

  return (
    <div>
      <h2>{mob?.mob.name}</h2>
      <h2>Level: {mob?.level}</h2>
      <p>HP: {mob?.hp}</p>
    </div>
  );
};

export default BattleScreen;
