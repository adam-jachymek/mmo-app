import React from "react";
import { getUsers } from "api/endpoints";
import "./styles.sass";
import { useQuery } from "react-query";
import { Button } from "@mantine/core";

const Players = () => {
  const { data: usersData, refetch: refetchUser } = useQuery(
    "getUsers",
    getUsers
  );
  console.log(usersData);
  return (
    <div className="players">
      <table className="players__info">
        <tr className="players__info-tr">
          <th>Name</th>
          <th>LVL</th>
          <th>Online</th>
          <th>Action</th>
        </tr>
        {usersData?.map((user: any) => (
          <tr className="">
            <td>{user.username}</td>
            <td>{user.level}</td>
            <td>TAK/NIE</td>
            <td>
              <Button
                className="players__action-button"
                color="green"
                size="xs"
              >
                Add Friend
              </Button>
              <Button
                className="players__action-button"
                color="yellow"
                size="xs"
              >
                Add to Party
              </Button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Players;
