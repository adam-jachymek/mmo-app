import { useMutation, useQuery } from "react-query";
import { getMobs, spawnMob } from "api/endpoints";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User } from "/types";
import "./styles.sass";
import { Button } from "@mantine/core";

type Props = {
  currentUser: User;
};

const Battle = ({ currentUser }: Props) => {
  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);

  let navigate = useNavigate();

  const { mutate: generateMob } = useMutation(spawnMob, {
    onSuccess: (response, variables) => {
      navigate(`/battle/${response.id}`);
    },
  });

  return (
    <div className="battle">
      <h2 className="battle__title">Battle</h2>
      <table className="battle__item-list">
        <tr>
          <th>Name</th>
          <th>Min Level</th>
          <th>Max Level</th>
          <th>Map</th>
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="battle__item">
            <td>{mob.name}</td>
            <td>{mob.minLevel}</td>
            <td>{mob.maxLevel}</td>
            <td>{mob.map.name}</td>
            <td>
              <Button
                color="red"
                size="xs"
                disabled={currentUser?.hp < 1}
                onClick={() => {
                  generateMob({ mobId: mob.id });
                }}
              >
                Fight
              </Button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Battle;
