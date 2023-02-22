import api from "../axios";
import qs from "qs";

export const getActionMobSpawn = async (tileId?: number) => {
  const response = await api.get(`action_mob_spawn/${tileId?.toString()}`);

  return response.data;
};

export const getManyActionMobSpawn = async (multiSelectTiles?: number[]) => {
  const response = await api.get(`action_mob_spawn/many`, {
    params: {
      query: multiSelectTiles,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });

  return response.data;
};

export const createActionMobSpawn = async (data: {
  values: {
    mobId?: string;
    spawnRate?: number;
    minLevel?: number;
    maxLevel?: number;
  };
  tilesIds?: number[];
}) => {
  const response = await api.post(`action_mob_spawn`, data.values, {
    params: {
      query: data.tilesIds,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });

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
  tilesIds?: number[];
}) => {
  const response = await api.patch(
    `action_mob_spawn/${data.values.id}`,
    data.values,
    {
      params: {
        query: data.tilesIds,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );

  return response.data;
};

export const addTilesToActionMobSpawn = async (data: {
  mobSpawnId?: number;
  tilesIds?: number[];
}) => {
  const response = await api.patch(
    `action_mob_spawn/addtiles/${data.mobSpawnId}`,
    data,
    {
      params: {
        query: data.tilesIds,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );

  return response.data;
};

export const deleteTilesToActionMobSpawn = async (data: {
  mobSpawnId?: number;
  tilesIds?: number[];
}) => {
  const response = await api.patch(
    `action_mob_spawn/deletetiles/${data.mobSpawnId}`,
    data,
    {
      params: {
        query: data.tilesIds,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );

  return response.data;
};

export const deleteActionMobSpawn = async (actionMobId?: number) => {
  const response = await api.delete(
    `action_mob_spawn/${actionMobId?.toString()}`
  );

  return response.data;
};
