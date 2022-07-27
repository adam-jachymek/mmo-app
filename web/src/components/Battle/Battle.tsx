import { useMutation, useQuery } from "react-query";
import { getMobs, spawnMob } from "api/endpoints";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User } from "/types";

type Props = {
  currentUser: User;
};

const Battle = ({ currentUser }: Props) => {
  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);

  let navigate = useNavigate();

  const { mutate: generateMob } = useMutation(spawnMob, {
    onSuccess: (response, variables) => {
      navigate(`/battle/${response.id}`, { replace: true });
    },
  });

  return (
    <div>
      <h2>Battle</h2>
      <table className="admin__item-list">
        <tr>
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>Map</th>
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="admin__item">
            <td>{mob.name}</td>
            <td>{mob.minLevel}</td>
            <td>{mob.maxLevel}</td>
            <td>{mob.map.name}</td>
            <td>
              <button
                disabled={currentUser.hp < 1}
                onClick={() => {
                  generateMob({ mobId: mob.id });
                }}
              >
                Fight
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Battle;
