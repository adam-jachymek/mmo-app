import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { getGuildById } from "api/endpoints";
import GuildHeader from "./GuildHeader";
import { User } from "/types";
import { Button } from "@mantine/core";
import GuildPendingTable from "./GuildPendingTable";
import GuildMember from "./GuildMember";

import Players from "/components/Players";

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
      <GuildMember
        currentUser={currentUser}
        refetchUser={refetchUser}
        refetchGuild={refetchGuild}
        guild={guild}
        isAdmin={isAdmin}
        isMod={isMod}
      />
    </div>
  );
};

export default GuildInfo;
