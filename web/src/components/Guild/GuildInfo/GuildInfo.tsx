import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getGuildById } from "api/endpoints";
import GuildHeader from "./GuildHeader";
import { User } from "/types";
import { Button } from "@mantine/core";
import GuildPendingTable from "./GuildPendingTable";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

const GuildInfo = ({ currentUser, refetchUser }: Props) => {
  const { id } = useParams();

  const { data: guild, refetch: refetchGuild } = useQuery(
    ["getGuildById,", id],
    () => getGuildById(id)
  );

  const isAdmin = useMemo(
    () =>
      Number(id) === currentUser?.guildId && currentUser?.guildRole === "ADMIN",
    [id, currentUser]
  );

  const isMod = useMemo(
    () =>
      Number(id) === currentUser?.guildId && currentUser?.guildRole === "MOD",
    [id, currentUser]
  );

  const isMember = useMemo(
    () =>
      Number(id) === currentUser?.guildId &&
      currentUser?.guildRole === "MEMBER",
    [id, currentUser]
  );

  const notPendingPlayers = guild?.users.filter(
    (user: User) => user.guildRole !== "PENDING"
  );

  return (
    <div className="guild__info">
      <GuildHeader
        currentUser={currentUser}
        refetchUser={refetchUser}
        refetchGuild={refetchGuild}
        guild={guild}
        isAdmin={isAdmin}
        isMod={isMod}
        isMember={isMember}
      />
      <GuildPendingTable
        guild={guild}
        refetchGuild={refetchGuild}
        isAdmin={isAdmin}
        isMod={isMod}
      />
      <h2>Guild Members</h2>
      <div className="players">
        <table className="players__info">
          <tr className="players__info-tr">
            <th>Name</th>
            <th>LVL</th>
            <th>Online</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
          {notPendingPlayers?.map((user: any) => (
            <tr className="">
              <td>{user.username}</td>
              <td>{user.level}</td>
              <td>TAK/NIE</td>
              <td>{user.guildRole}</td>
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
  );
};

export default GuildInfo;
