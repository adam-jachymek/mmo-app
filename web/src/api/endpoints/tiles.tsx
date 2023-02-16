import api from "../axios";

export const createTiles = async (values: { mapId: number }) => {
  const response = await api.post("/map_tiles/", values);

  return response.data;
};

export const editTileById = async (values: {
  tileId?: number;
  sprite?: string;
  blocked?: boolean;
  action_name?: string;
  action?: {
    teleport?: { mapId: string; newMapX: number; newMapY: number };
    mobSpawn?: { mobId: string; procent: number };
  };
}) => {
  const response = await api.patch(`/map_tiles/${values.tileId}`, values);

  return response.data;
};

export const updateManyTiles = async (data: {
  ids: number[];
  values: {
    tileId?: number;
    sprite?: string;
    blocked?: boolean;
    action_name?: string;
    action?: {
      teleport?: { mapId: string; newMapX: number; newMapY: number };
      mobSpawn?: { mobId: string; procent: number };
    };
  };
}) => {
  delete data.values.tileId;

  const response = await api.post(`/map_tiles/many`, data);

  return response.data;
};
