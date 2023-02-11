import { useMutation, useQuery } from "react-query";
import { getMobs, spawnMob, createBattle } from "api/endpoints";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User } from "/types";
import "./styles.sass";
import { Button } from "@mantine/core";
import { socket } from "api/socket";

type Props = {
  currentUser: User;
};

const Battle = ({ currentUser }: Props) => {
  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);

  let navigate = useNavigate();

  const { mutate: generateMob } = useMutation(spawnMob, {
    onSuccess: (response, variables) => {
      // navigate(`/battle`);
    },
  });

  const { mutate: createNewBattle } = useMutation(createBattle, {
    onSuccess: (response, variables) => {
      socket.emit("startBattle", { userId: currentUser?.id });
      // navigate(`/battle`);
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
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="battle__item">
            <td>{mob.name}</td>
            <td>{mob.minLevel}</td>
            <td>{mob.maxLevel}</td>
            <td>
              <Button
                color="red"
                size="xs"
                disabled={currentUser?.hp < 1}
                onClick={() => {
                  createNewBattle({ mobId: mob.id });
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
