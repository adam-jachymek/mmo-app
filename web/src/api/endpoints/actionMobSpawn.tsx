import api from "../axios";

export const getActionMobSpawn = async (tileId?: number) => {
  const response = await api.get(`action_mob_spawn/${tileId?.toString()}`);

  return response.data;
};

export const createActionMobSpawn = async (data: {
  values: {
    mobId?: string;
    spawnRate?: number;
    minLevel?: number;
    maxLevel?: number;
  };
  tileId?: number;
}) => {
  const response = await api.post(
    `action_mob_spawn/${data.tileId?.toString()}`,
    data.values
  );

  return response.data;
};

export const updateActionMobSpawn = async (data: {
  values: {
    id?: string;
    mobId?: string;
    spawnRate?: number;
    minLevel?: number;
    maxLevel?: number;
  };
  tileId?: number;
}) => {
  const response = await api.patch(
    `action_mob_spawn/${data.tileId?.toString()}/${data.values.id}/`,
    data.values
  );

  return response.data;
};

export const deleteActionMobSpawn = async (actionMobId?: number) => {
  const response = await api.delete(
    `action_mob_spawn/${actionMobId?.toString()}`
  );

  return response.data;
};
