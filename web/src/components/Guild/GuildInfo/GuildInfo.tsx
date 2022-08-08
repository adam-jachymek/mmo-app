import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { getGuildById } from "api/endpoints";
import { User } from "/types";

import { Button, Group, Modal, TextInput } from "@mantine/core";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const GuildInfo = ({ currentUser, refetchUser }: Props) => {
  const { id } = useParams();

  const userGuildId = currentUser?.guildId;

  const { data: guild, refetch: refetchGuild } = useQuery(
    ["getGuildById,", id],
    () => getGuildById(id)
  );

  const isAdmin = useMemo(
    () =>
      id == currentUser?.guildId.toString() &&
      currentUser?.guildRole === "ADMIN",
    [id, currentUser]
  );

  const isMod = useMemo(
    () =>
      id == currentUser?.guildId.toString() && currentUser?.guildRole === "MOD",
    [id, currentUser]
  );

  const isMember = useMemo(
    () =>
      id == currentUser?.guildId.toString() &&
      currentUser?.guildRole === "MEMBER",
    [id, currentUser]
  );

  return (
    <div>
      <div>
        <Group position="right">
          {isMod || (isAdmin && <Button color="green">Invite Player</Button>)}
          {isMod || (isMember && <Button>Leave Guild</Button>)}
          {isAdmin && <Button color="red">Delete Guild</Button>}
        </Group>
      </div>
      <div>
        {isMod || (isAdmin && <Button>Edit</Button>)}
        <h3>Name: {guild?.name}</h3>
        <p>Description: {guild?.description}</p>
      </div>
      <div>
        {isMod ||
          (isAdmin && (
            <div>
              <h2>Pending Players</h2>
              <div className="players">
                <table className="players__info">
                  <tr className="players__info-tr">
                    <th>Name</th>
                    <th>LVL</th>
                    <th>Online</th>
                    <th>Action</th>
                  </tr>
                  {guild?.users?.map((user: any) => (
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
            </div>
          ))}

        <h2>Guild Members</h2>
        <div className="players">
          <table className="players__info">
            <tr className="players__info-tr">
              <th>Name</th>
              <th>LVL</th>
              <th>Online</th>
              <th>Action</th>
            </tr>
            {guild?.users?.map((user: any) => (
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
      </div>
    </div>
  );
};

export default GuildInfo;
