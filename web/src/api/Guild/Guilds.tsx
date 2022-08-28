import api from "api/axios";
import { GuildPlayerParam } from "api/Guild/GuildTypes";

export const getGuilds = async () => {
  const response = await api.get("/guild");

  return response.data;
};

export const createGuild = async (values: {
  name?: string;
  description?: string;
}) => {
  const response = await api.post("/guild", values);

  return response.data;
};

export const getGuildById = async (guildId?: string) => {
  const response = await api.get(`/guild/${guildId}`);

  return response.data;
};

export const editGuildById = async (data: {
  guildId: number;
  values: {
    name?: string;
    description?: string;
  };
}) => {
  const response = await api.patch(`/guild/${data.guildId}`, data.values);

  return response.data;
};

export const deleteGuildById = async (guildId: number) => {
  const response = await api.delete(`/guild/${guildId}`);

  return response.data;
};

export const userRequest = async (guildId: number) => {
  const response = await api.get(`guild/${guildId}/request`);

  return response.data;
};

export const userGuildAccept = async ({
  guildId,
  playerId,
}: GuildPlayerParam) => {
  const response = await api.get(`guild/${guildId}/users/${playerId}/accept`);

  return response.data;
};

export const leaveGuild = async (guildId: number) => {
  const response = await api.get(`guild/${guildId}/leave/`);

  return response.data;
};

export const kickGuildPlayer = async ({
  guildId,
  playerId,
}: GuildPlayerParam) => {
  const response = await api.get(`guild/${guildId}/users/${playerId}/kick/`);

  return response.data;
};
