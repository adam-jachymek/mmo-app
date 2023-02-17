import { useMutation, useQuery } from "react-query";
import { getMobs, spawnMob, createBattle } from "api/endpoints";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User } from "/types";
import { Button, Input } from "@mantine/core";
import { socket } from "api/socket";

import "./styles.sass";
import { useState } from "react";

type Props = {
  currentUser: User;
};

const Battle = ({ currentUser }: Props) => {
  const { data: mobsData, refetch: refetchMobs } = useQuery("getMobs", getMobs);
  const [level, setLevel] = useState({ min: 1, max: 5 });

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
      <div className="battle__level-input">
        <Input.Wrapper label="min level">
          <Input
            value={level.min}
            type="number"
            onChange={(e: any) => {
              setLevel({ ...level, min: e.target.value });
            }}
            size="xs"
            placeholder="min level"
          />
        </Input.Wrapper>
        <Input.Wrapper label="max level">
          <Input
            value={level.max}
            type="number"
            onChange={(e: any) => {
              setLevel({ ...level, max: e.target.value });
            }}
            size="xs"
            placeholder="max level"
          />
        </Input.Wrapper>
      </div>
      <table className="battle__item-list">
        <tr>
          <th>Name</th>
          <th>Action</th>
        </tr>
        {mobsData?.map((mob: any) => (
          <tr key={mob.id} className="battle__item">
            <td>{mob.name}</td>
            <td>
              <Button
                color="red"
                size="xs"
                disabled={currentUser?.hp < 1}
                onClick={() => {
                  createNewBattle({
                    mobId: mob.id,
                    mobMinLevel: level.min,
                    mobMaxLevel: level.max,
                  });
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
