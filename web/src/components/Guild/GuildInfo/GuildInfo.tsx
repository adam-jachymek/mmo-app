import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {getGuildById, kickGuildPlayer} from "api/Guild/Guilds";
import GuildHeader from "./GuildHeader";
import { User } from "/types";
import GuildPendingTable from "./GuildPendingTable";
import GuildMember from "./GuildMember";

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

  const { mutate: kickPlayerGuild } = useMutation(kickGuildPlayer, {
    onSuccess: (response) => {
      refetchGuild();
      refetchUser();
    },
  });

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
        isAdmin={isAdmin}
        isMod={isMod}
        onRemovePlayer={kickPlayerGuild}
        refetchGuild={refetchGuild}
      />
      <GuildMember
        currentUser={currentUser}
        guild={guild}
        isAdmin={isAdmin}
        isMod={isMod}
        onRemovePlayer={kickGuildPlayer}
      />
    </div>
  );
};

export default GuildInfo;
